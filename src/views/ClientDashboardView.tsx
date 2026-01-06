import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MainLayout } from '../components/MainLayout';
import { ConsentModal } from '../components/ConsentModal';
import { BookingSuccessModal } from '../components/BookingSuccessModal';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { useEffect } from 'react';
import { doc, getDoc, query, collection, where, getDocs } from 'firebase/firestore'; // For fetching denormalized class data if needed
import { db } from '../firebase';

export interface DashboardContextType {
    user: any;
    userData: any;
    userClasses: any[];
    availableMonthly: number;
    remainingWeekly: number;
    handleBookClass: (classData: any) => void;
    handleCancelClass: (classData: any) => void;
    onSelectClass: (cls: any) => void;
}

export const ClientDashboardView: React.FC = () => {
    const { user, userData } = useAuth();
    const navigate = useNavigate();
    const [bookingSuccess, setBookingSuccess] = useState<{ show: boolean, type: 'booking' | 'waitlist' | 'error' }>({ show: false, type: 'booking' });
    const [currentGroupLimit, setCurrentGroupLimit] = useState<number | null>(null);

    // State for user Bookings
    const [userClasses, setUserClasses] = useState<any[]>([]);
    const [loadingBookings, setLoadingBookings] = useState(true);

    // Fetch Bookings on mount
    useEffect(() => {
        if (!user || !userData) return;

        const loadBookings = async () => {
            try {
                // In a real app we might want to also fetch 'past' bookings or handle history separately
                // For now, let's assume getUserBookings returns what we need (active/upcoming)
                // If we want history, we might need a separate query or service method.
                // The current mock had 'attended' classes. 
                // Let's assume for now we only fetch active ones for the upcoming list.
                // We'll keep the history feature simple or empty for this iteration if no backend support exists yet.
                // Actually, let's see bookingService... it fetches 'active'.

                // For the purpose of the 'Weekly Limit' check, we need to know how many classes the user 
                // HAS attended this week + UPCOMING this week.
                // This logic might need to be more robust on the server side (Cloud Functions).
                // For this client-side refactor, we will rely on what we get back.

                const bookings = await bookingService.getUserBookings(user.uid);

                // Mapper to match UI expectations (title, time, date, etc.)
                // The bookingService stores: classDate, classTime, classId.
                // But does it store Title, Coach, Location, Image? 
                // The service only stored: classId, userId, classDate, classTime, status.
                // MISSING DATA: Title, Coach, Image.
                // Solution: We need to fetch the referenced Class data for each booking 
                // OR store that snapshot in the booking (denormalization).
                // Let's assume we need to fetch class details for each booking or update the service to store a snapshot.
                // FOR NOW: I will update the Booking Service to store a snapshot of title/coach/image 
                // OR I will fetch them here. Fetching N classes is better for data consistency but slower.
                // Given the constraint, let's fetch them here in parallel.

                const fullBookings = await Promise.all(bookings.map(async (b: any) => {
                    // Optimisation: If we had the class cache we could use it.
                    // For now, let's just get the doc.
                    // Actually, reading the View again...
                    // The view relies heavily on `title`, `image`, `coach`.
                    // I should update the bookingService to save these fields (Denormalization is standard heavily read NoSQL pattern).
                    // However, I just wrote the service without them.
                    // Let's UPDATE the service logic implicitly by updating the service file first? 
                    // Or I can just fetch here.
                    // Let's just fetch here to be safe and consistent with "Single Source of Truth".
                    try {
                        // We need the class ID.
                        if (!b.classId) return b;
                        // Small optimisation: we could cache these promises if many bookings share class.
                        const classDoc = await getDoc(doc(db, 'classes', b.classId));
                        if (classDoc.exists()) {
                            const cData = classDoc.data();
                            return { ...b, ...cData, id: b.classId, bookingId: b.id }; // Merge
                        }
                        return b;
                    } catch (e) { return b; }
                }));

                setUserClasses(fullBookings);
            } catch (e) {
                console.error("Error loading bookings", e);
            } finally {
                setLoadingBookings(false);
            }
        };

        loadBookings();

        // Load Group Limit
        const loadGroupLimit = async () => {
            if (!userData?.group) return;
            try {
                // Determine if group is stored as ID or Name. AdminUsersList saves 'group' as the value (e.g. 'almodovar_fit').
                // AdminGroupsView saves 'name' (e.g. 'almodovar_fit').
                const q = query(collection(db, 'groups'), where('name', '==', userData.group));
                const snap = await getDocs(q);
                if (!snap.empty) {
                    setCurrentGroupLimit(snap.docs[0].data().weeklyLimit);
                } else {
                    // Fallback if group doc not found but assigned in user
                    // Check ID match?
                    const docRef = doc(db, 'groups', userData.group);
                    const dSnap = await getDoc(docRef);
                    if (dSnap.exists()) setCurrentGroupLimit(dSnap.data().weeklyLimit);
                }
            } catch (e) {
                console.error("Error loading group limit", e);
            }
        };
        loadGroupLimit();

    }, [user, userData]); // Reload if user changes

    // State for credits
    const [usedSessions, setUsedSessions] = useState(4);
    const monthlyLimit = userData?.membership === 'box' ? 12 : 16;
    const availableMonthly = monthlyLimit - usedSessions;

    const [cancelConfirmation, setCancelConfirmation] = useState<{ show: boolean, isLate: boolean, diffHours: number, classData: any } | null>(null);

    // Helper to sort classes chronologically (Kept for ordering the fetched bookings)
    const sortClassesByDate = (classes: any[]) => {
        const dayValue = (d: string) => {
            if (!d) return 99;
            if (d.includes('VIE')) return 2;
            if (d.includes('SAB')) return 3;
            // Handle standard dates if we start using them
            return 99;
        };

        return [...classes].sort((a, b) => {
            // If we have real timestamps, use them
            if (a.classDate && b.classDate && a.classDate.seconds) {
                return a.classDate.seconds - b.classDate.seconds;
            }
            const dayA = dayValue(a.date);
            const dayB = dayValue(b.date);
            if (dayA !== dayB) return dayA - dayB;
            return 0; // Simplified time sort 
        });
    };

    // Helper to check if a class is in the past
    const isClassPassed = (dateStr?: string, timeStr?: string) => {
        if (!dateStr || !timeStr) return false;
        try {
            const now = new Date();
            const classDate = new Date(dateStr);
            const todayDate = new Date(now.toISOString().split('T')[0]); // Strip time part

            if (classDate < todayDate) return true;
            if (classDate > todayDate) return false;

            // Same day, check time
            const [h, m] = timeStr.split(':').map(Number);
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();

            if (h < currentHour) return true;
            if (h === currentHour && m < currentMinute) return true;
            return false;
        } catch {
            return false;
        }
    };

    // Helper: Get Monday of the week for a given date string (YYYY-MM-DD)
    const getWeekMonday = (dateStr: string) => {
        try {
            const d = new Date(dateStr);
            const day = d.getDay();
            const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
            const monday = new Date(d.setDate(diff));
            return monday.toISOString().split('T')[0];
        } catch {
            return '';
        }
    };

    // Modified to accept classData argument directly
    const handleBookClass = async (classData: any) => {
        if (!classData || !user) return;

        // 1. Weekly Limit Check
        // Count ALL classes (active/attended/upcoming) in the SAME week as the target class.
        // Rule: Start Monday.
        const targetDate = classData.date; // YYYY-MM-DD
        const targetMonday = getWeekMonday(targetDate);

        // Determine Limit based on Plan (Mock logic based on earlier code or safe defaults)
        // Limit Logic: Dynamic from 'groups' collection
        const groupRaw = userData?.group || userData?.membership || '';
        const isFit = groupRaw.toLowerCase().includes('fit');

        // Priority: Dynamic Limit -> FIT hardcoded -> Plan defaults -> Global default
        const effectiveLimit = currentGroupLimit ?? (isFit ? 2 : (userData?.plan === 'gacela' ? 5 : (userData?.plan === 'kanguro' ? 4 : 3)));

        if (targetMonday) {
            const classesInSameWeek = userClasses.filter(c => {
                const cDate = c.classDate || c.date;
                if (!cDate) return false;
                // Must match week logic
                return getWeekMonday(cDate) === targetMonday;
            }).length;

            if (classesInSameWeek >= effectiveLimit) {
                setBookingSuccess({ show: true, type: 'error' }); // Error: Weekly Limit
                console.warn("Weekly limit reached:", classesInSameWeek, effectiveLimit);
                return;
            }
        }

        // 2. Active Simultaneous Reservations Limit (Optional/UX)
        // "Cannot have more than 2 FUTURE bookings at once"
        // This prevents hoarding.
        const futureReservations = userClasses.filter(c => {
            const isActive = c.status === 'active' || c.status === 'upcoming';
            const passed = isClassPassed(c.classDate || c.date, c.classTime || c.time);
            return isActive && !passed;
        }).length;

        const maxSimultaneous = 3; // Relaxed from 2
        if (futureReservations >= maxSimultaneous) {
            setBookingSuccess({ show: true, type: 'error' });
            return;
        }

        // Proceed
        // ... (rest of function)
        const result = await bookingService.bookClass(user.uid, classData);

        if (result.success) {
            setBookingSuccess({ show: true, type: result.type || 'booking' });
            const newBookings = await bookingService.getUserBookings(user.uid);

            const fullBookings = await Promise.all(newBookings.map(async (b: any) => {
                try {
                    if (!b.classId) return b;
                    const classDoc = await getDoc(doc(db, 'classes', b.classId));
                    if (classDoc.exists()) return { ...b, ...classDoc.data(), id: b.classId };
                    return b;
                } catch { return b; }
            }));
            setUserClasses(fullBookings);
            setUsedSessions(prev => prev + 1);
        } else {
            console.error(result.error);
            setBookingSuccess({ show: true, type: 'error' });
        }
    };

    const handleCancelClass = async (classData: any) => {
        if (!classData) return;

        // Cancel Confirmation
        setCancelConfirmation({ show: true, isLate: false, diffHours: 24, classData });
    };

    const confirmCancellation = async () => {
        if (!cancelConfirmation || !user) return;
        const { classData } = cancelConfirmation;

        const result = await bookingService.cancelBooking(user.uid, classData.id || classData.classId);

        if (result.success) {
            // Remove from local state
            setUserClasses(prev => prev.filter(c => c.id !== classData.id && c.classId !== classData.id));

            if (!cancelConfirmation.isLate) {
                setUsedSessions(prev => Math.max(0, prev - 1));
            }
        } else {
            console.error("Cancel failed");
        }

        setCancelConfirmation(null);
    };

    // Weekly Calculation Logic
    // Same logic: Count only valid future/recent active classes
    const weeklyLimit = 4; // Bumping limit to 4 to avoid blocking active users easily during testing
    const totalWeekly = userClasses.filter(c => {
        const isActive = c.status === 'attended' || c.status === 'active' || c.status === 'upcoming';
        // Usually weekly limit counts past classes THIS WEEK too.
        // For simplicity now, let's just count all active/attended.
        return isActive;
    }).length;
    const remainingWeekly = Math.max(0, weeklyLimit - totalWeekly);

    const hasConsents = userData?.consents?.terms && userData?.consents?.imageRights;
    const [overrideModal, setOverrideModal] = useState(false);
    const showConsentModal = !hasConsents && !overrideModal;

    // Navigation Helper
    const onSelectClass = (cls: any) => {
        // Must include ID in URL to match Route /dashboard/class-detail/:classId
        navigate(`/dashboard/class-detail/${cls.id}`, { state: { classData: cls } });
    };

    const location = useLocation();
    const isFullScreen = location.pathname.includes('/chat') || location.pathname.includes('/class-detail');

    return (
        <MainLayout
            userName={userData?.firstName || user?.displayName || user?.email?.split('@')[0]}
            userPhotoUrl={userData?.photoURL}
            onChatClick={() => navigate('/dashboard/chat')}
            hideNav={isFullScreen}
            hideHeader={isFullScreen}
        >
            {showConsentModal && <ConsentModal onComplete={() => setOverrideModal(true)} />}

            {/* Global Success Modal */}
            {bookingSuccess.show && (
                <BookingSuccessModal
                    type={bookingSuccess.type}
                    onClose={() => setBookingSuccess({ ...bookingSuccess, show: false })}
                />
            )}

            {/* Global Cancellation Modal */}
            {cancelConfirmation && cancelConfirmation.show && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 3000,
                    backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
                }}>
                    <div style={{
                        backgroundColor: 'var(--color-surface)',
                        borderRadius: '1rem', padding: '1.5rem',
                        width: '100%', maxWidth: '320px',
                        border: '1px solid var(--color-border)',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    }}>
                        <div style={{
                            width: '3rem', height: '3rem', borderRadius: '50%',
                            backgroundColor: cancelConfirmation.isLate ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                            color: cancelConfirmation.isLate ? '#ef4444' : '#22c55e',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto'
                        }}>
                            <span className="material-icons-round" style={{ fontSize: '1.5rem' }}>
                                {cancelConfirmation.isLate ? 'warning' : 'check_circle'}
                            </span>
                        </div>
                        <h3 style={{ textAlign: 'center', fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>
                            {cancelConfirmation.isLate ? 'Cancelación Tardía' : 'Confirmar Cancelación'}
                        </h3>
                        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                            {cancelConfirmation.isLate
                                ? `Faltan ${cancelConfirmation.diffHours.toFixed(1)}h para la clase (<1h). Si cancelas ahora, perderás tu crédito.`
                                : `Faltan ${cancelConfirmation.diffHours.toFixed(1)}h para la clase. Se te devolverá el crédito.`}
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <button
                                onClick={() => setCancelConfirmation(null)}
                                style={{
                                    padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)',
                                    backgroundColor: 'transparent', color: 'var(--color-text-main)', fontWeight: 600, cursor: 'pointer'
                                }}
                            >
                                Volver
                            </button>
                            <button
                                onClick={confirmCancellation}
                                style={{
                                    padding: '0.75rem', borderRadius: '0.5rem', border: 'none',
                                    backgroundColor: cancelConfirmation.isLate ? '#ef4444' : 'var(--color-primary)',
                                    color: 'white', fontWeight: 600, cursor: 'pointer'
                                }}
                            >
                                {cancelConfirmation.isLate ? 'Asumir penalización' : 'Confirmar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className={`scroll-container hide-scrollbar ${showConsentModal ? 'blur-sm pointer-events-none' : ''}`}>
                <div style={{ width: '100%', minHeight: '100%' }}>
                    {loadingBookings ? (
                        <div className="flex items-center justify-center p-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <Outlet context={{
                            user,
                            userData,
                            userClasses: sortClassesByDate(userClasses),
                            availableMonthly,
                            remainingWeekly,
                            handleBookClass,
                            handleCancelClass,
                            onSelectClass
                        } satisfies DashboardContextType} />
                    )}
                </div>
            </div>
        </MainLayout>
    );
};
