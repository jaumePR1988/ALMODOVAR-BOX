import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MainLayout } from '../components/MainLayout';
import { ConsentModal } from '../components/ConsentModal';
import { BookingSuccessModal } from '../components/BookingSuccessModal';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

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

    // Initial Mock Classes
    const [userClasses, setUserClasses] = useState<any[]>([
        {
            title: 'Fit Boxing WOD',
            time: 'Viernes 18:00',
            date: 'VIE 2',
            coach: 'Coach Alex',
            location: 'Sala Principal',
            image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=600',
            status: 'attended',
            enrolled: 8,
            capacity: 10
        },
        {
            title: 'Open Box',
            time: 'Sabado 10:00',
            date: 'SAB 3',
            coach: 'Coach Alex',
            location: 'Sala Principal',
            image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600',
            status: 'upcoming',
            enrolled: 8,
            capacity: 10
        }
    ]);

    // State for credits
    const [usedSessions, setUsedSessions] = useState(4);
    const monthlyLimit = userData?.membership === 'box' ? 12 : 16;
    const availableMonthly = monthlyLimit - usedSessions;

    const [cancelConfirmation, setCancelConfirmation] = useState<{ show: boolean, isLate: boolean, diffHours: number, classData: any } | null>(null);

    // Helper to sort classes chronologically
    const sortClassesByDate = (classes: any[]) => {
        const dayValue = (d: string) => {
            if (d.includes('VIE')) return 2;
            if (d.includes('SAB')) return 3;
            return 99; // Future
        };

        return [...classes].sort((a, b) => {
            const dayA = dayValue(a.date);
            const dayB = dayValue(b.date);
            if (dayA !== dayB) return dayA - dayB;

            const timeA = parseInt(a.time.replace(':', ''));
            const timeB = parseInt(b.time.replace(':', ''));
            return timeA - timeB;
        });
    };

    // Modified to accept classData argument directly
    const handleBookClass = (classData: any) => {
        if (!classData) return;

        // Validation: Max 2 Active Reservations
        const activeReservations = userClasses.filter(c => c.status === 'upcoming').length;
        if (activeReservations >= 2) {
            setBookingSuccess({ show: true, type: 'error' });
            return;
        }

        // Validation: Max 2 Classes Per Week (Strict Limit)
        const totalWeekly = userClasses.filter(c => c.status === 'attended' || c.status === 'upcoming').length;

        if (totalWeekly >= 2) {
            setBookingSuccess({ show: true, type: 'error' });
            return;
        }

        const isFull = (classData.enrolled ?? 8) >= (classData.capacity ?? 10);
        setBookingSuccess({ show: true, type: isFull ? 'waitlist' : 'booking' });

        if (!isFull) {
            setUserClasses(prev => {
                const newClass = {
                    ...classData,
                    status: 'upcoming',
                    enrolled: (classData.enrolled || 0) + 1
                };

                const combined = [...prev, newClass];
                const sorted = sortClassesByDate(combined);
                return sorted.slice(-3);
            });
            setUsedSessions(prev => prev + 1);
        }
    };

    const handleCancelClass = (classData: any) => {
        if (!classData) return;

        // MOCK TIME: Saturday 3rd, 09:00 AM
        const mockNow = new Date(2026, 0, 3, 9, 0);

        const timeParts = classData.time.split(' ');
        const timeStr = timeParts.length > 1 ? timeParts[timeParts.length - 1] : timeParts[0];
        const [hours, minutes] = timeStr.trim().split(':').map(Number);

        let classDate = new Date(2026, 0, 3, hours || 12, minutes || 0);

        const diffMs = classDate.getTime() - mockNow.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);
        const isLateCancellation = diffHours < 1;

        setCancelConfirmation({ show: true, isLate: isLateCancellation, diffHours, classData });
    };

    const confirmCancellation = () => {
        if (!cancelConfirmation) return;
        const { classData } = cancelConfirmation;

        setUserClasses(prev => prev.map(c =>
            c.title === classData.title && c.time === classData.time
                ? { ...c, status: 'cancelled' }
                : c
        ));

        if (!cancelConfirmation.isLate) {
            setUsedSessions(prev => Math.max(0, prev - 1));
        }

        setCancelConfirmation(null);
    };

    // Weekly Calculation Logic
    const weeklyLimit = 2;
    const totalWeekly = userClasses.filter(c => c.status === 'attended' || c.status === 'upcoming').length;
    const remainingWeekly = Math.max(0, weeklyLimit - totalWeekly);

    const hasConsents = userData?.consents?.terms && userData?.consents?.imageRights;
    const [overrideModal, setOverrideModal] = useState(false);
    const showConsentModal = !hasConsents && !overrideModal;

    // Navigation Helper
    const onSelectClass = (cls: any) => {
        navigate('/dashboard/class-detail', { state: { classData: cls } });
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
                <div className="animate-fade-in-up" style={{ width: '100%', minHeight: '100%' }}>
                    {/* Render Child Routes Here */}
                    <Outlet context={{
                        user,
                        userData,
                        userClasses,
                        availableMonthly,
                        remainingWeekly,
                        handleBookClass,
                        handleCancelClass,
                        onSelectClass
                    } satisfies DashboardContextType} />
                </div>
            </div>
        </MainLayout>
    );
};
