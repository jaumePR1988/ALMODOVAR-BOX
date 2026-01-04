import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MainLayout } from '../components/MainLayout';
import { NotificationsView } from './NotificationsView';
import { ConsentModal } from '../components/ConsentModal';
import { PerfilView } from './PerfilView';
import { ProfileSettingsView } from './ProfileSettingsView';
import { NotificationsSettingsView } from './NotificationsSettingsView';
import { TermsView } from './TermsView';
import { NewsView } from './NewsView';
import { RetosView } from './RetosView';
import { CommunityChatView } from './CommunityChatView';

export const ClientDashboardView: React.FC = () => {
    const { user, userData } = useAuth();
    const [activeTab, setActiveTab] = useState('inicio');
    const [selectedClass, setSelectedClass] = useState<any>(null);
    const [bookingSuccess, setBookingSuccess] = useState<{ show: boolean, type: 'booking' | 'waitlist' }>({ show: false, type: 'booking' });

    const [startRatingFlow, setStartRatingFlow] = useState(false);
    const [lastClassRated, setLastClassRated] = useState(false);

    // Initial Mock Classes (Lifted from InicioSection)
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

    // State for credits (lifted from InicioSection)
    const [usedSessions, setUsedSessions] = useState(4);
    const monthlyLimit = userData?.membership === 'box' ? 12 : 16;
    const availableMonthly = monthlyLimit - usedSessions;

    const [cancelConfirmation, setCancelConfirmation] = useState<{ show: boolean, isLate: boolean, diffHours: number } | null>(null);


    // Helper to sort classes chronologically
    const sortClassesByDate = (classes: any[]) => {
        // Mock parsing for sort - mapping day names/numbers to comparable values
        // Assuming format "Day Name Number" like "SAB 3" or simple time if implicitly today
        // For simplicity in this mock, we can prioritize by status (Attended < Upcoming) then by time?
        // Or robustly parse the DAY string. 
        // Let's assume the mock dates are strictly "VIE 2", "SAB 3" and time "HH:mm".

        const dayValue = (d: string) => {
            if (d.includes('VIE')) return 2;
            if (d.includes('SAB')) return 3;
            return 99; // Future
        };

        return [...classes].sort((a, b) => {
            const dayA = dayValue(a.date);
            const dayB = dayValue(b.date);
            if (dayA !== dayB) return dayA - dayB;

            // Same day, sort by time
            const timeA = parseInt(a.time.replace(':', ''));
            const timeB = parseInt(b.time.replace(':', '')); // 18:00 -> 1800
            return timeA - timeB;
        });
    };

    const handleBookClass = () => {
        if (!selectedClass) return;
        const isFull = (selectedClass.enrolled ?? 8) >= (selectedClass.capacity ?? 10);
        setBookingSuccess({ show: true, type: isFull ? 'waitlist' : 'booking' });

        if (!isFull) {
            setUserClasses(prev => {
                const newClass = {
                    ...selectedClass,
                    status: 'upcoming',
                    enrolled: (selectedClass.enrolled || 0) + 1
                };

                // Add new, sort by date/time ascending, take last 3 (dropping oldest/past)
                const combined = [...prev, newClass];
                const sorted = sortClassesByDate(combined);

                // User wants "Max 3". "Replace oldest". 
                // If sorted is [Oldest, Mid, Newest, Future], slice(-3) gives [Mid, Newest, Future].
                return sorted.slice(-3);
            });
            // Deduct credit on booking
            setUsedSessions(prev => prev + 1);
        }
    };

    const handleCancelClass = () => {
        if (!selectedClass) return;

        // MOCK TIME: Saturday 3rd, 09:00 AM
        const mockNow = new Date(2026, 0, 3, 9, 0);

        const timeParts = selectedClass.time.split(' ');
        const timeStr = timeParts.length > 1 ? timeParts[timeParts.length - 1] : timeParts[0];
        const [hours, minutes] = timeStr.trim().split(':').map(Number);

        // Robust mock parsing
        let classDate = new Date(2026, 0, 3, hours || 12, minutes || 0);

        const diffMs = classDate.getTime() - mockNow.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);
        const isLateCancellation = diffHours < 1;

        setCancelConfirmation({ show: true, isLate: isLateCancellation, diffHours });
    };

    const confirmCancellation = () => {
        if (!selectedClass || !cancelConfirmation) return;

        setUserClasses(prev => prev.map(c =>
            c.title === selectedClass.title && c.time === selectedClass.time
                ? { ...c, status: 'cancelled' }
                : c
        ));

        if (!cancelConfirmation.isLate) {
            setUsedSessions(prev => Math.max(0, prev - 1)); // Refund credit
        }

        setCancelConfirmation(null);
        setSelectedClass(null);
    };

    // Weekly Calculation Logic (Lifted)
    const weeklyLimit = userData?.membership === 'box' ? 2 : 3;
    const attendedThisWeek = 1;
    const remainingWeekly = weeklyLimit - attendedThisWeek;

    const renderContent = () => {
        if (selectedClass) {
            return (
                <>
                    <ClassDetailView
                        classData={selectedClass}
                        onBack={() => setSelectedClass(null)}
                        onBook={handleBookClass}
                        onCancel={handleCancelClass}
                    />
                    {bookingSuccess.show && (
                        <BookingSuccessModal
                            type={bookingSuccess.type}
                            onClose={() => {
                                setBookingSuccess({ ...bookingSuccess, show: false });
                                setSelectedClass(null);
                            }}
                        />
                    )}
                </>
            );
        }

        switch (activeTab) {
            case 'inicio':
                return <InicioSection
                    membership={userData?.membership || 'fit'}
                    user={user}
                    userData={userData}
                    onSelectClass={setSelectedClass}
                    startRatingFlow={startRatingFlow}
                    setStartRatingFlow={setStartRatingFlow}
                    lastClassRated={lastClassRated}
                    setLastClassRated={setLastClassRated}
                    userClasses={userClasses}
                    availableMonthly={availableMonthly}
                    remainingWeekly={remainingWeekly}
                />;
            case 'retos':
                return <RetosView />;
            case 'reservas':
                return <ReservasSection
                    membership={userData?.membership || 'fit'}
                    onSelectClass={setSelectedClass}
                    userClasses={userClasses}
                />;
            case 'noticias':
                return <NewsView />;
            case 'perfil':
                return <PerfilView onSettingsClick={() => setActiveTab('ajustes')} />;
            case 'ajustes':
                return <ProfileSettingsView onBack={() => setActiveTab('perfil')} onNavigate={setActiveTab} />;
            case 'ajustes-notificaciones':
                return <NotificationsSettingsView onBack={() => setActiveTab('ajustes')} />;
            case 'legal':
                return <TermsView />;
            case 'notificaciones':
                return <NotificationsView />;
            case 'chat':
                return <CommunityChatView onBack={() => setActiveTab('inicio')} />;
            default:
                return (
                    <InicioSection
                        membership={userData?.membership || 'fit'}
                        user={user}
                        userData={userData}
                        onSelectClass={setSelectedClass}
                        startRatingFlow={startRatingFlow}
                        setStartRatingFlow={setStartRatingFlow}
                        lastClassRated={lastClassRated}
                        setLastClassRated={setLastClassRated}
                        userClasses={userClasses}
                        availableMonthly={availableMonthly}
                        remainingWeekly={remainingWeekly}
                    />
                );
        }
    };

    const hasConsents = userData?.consents?.terms && userData?.consents?.imageRights;
    const [overrideModal, setOverrideModal] = useState(false);
    const showConsentModal = !hasConsents && !overrideModal;

    return (
        <MainLayout
            activeTab={activeTab}
            onTabChange={setActiveTab}
            userName={userData?.firstName || user?.displayName || user?.email?.split('@')[0]}
            userPhotoUrl={userData?.photoURL}
            hideNav={activeTab === 'ajustes' || activeTab === 'chat'} // Hide nav in chat
            hideHeader={activeTab === 'retos' || activeTab === 'chat'} // Hide header in chat (it has its own)
            onChatClick={() => setActiveTab('chat')}
        >
            {showConsentModal && <ConsentModal onComplete={() => setOverrideModal(true)} />}

            {/* Custom Cancellation Modal */}
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
                    {renderContent()}
                </div>
            </div>
        </MainLayout>
    );
};

import { RatingModal } from '../components/RatingModal';
import { saveClassRating } from '../services/ratingService';
import { ClassDetailView } from './ClassDetailView';
import { BookingSuccessModal } from '../components/BookingSuccessModal';

const InicioSection: React.FC<{
    membership?: 'box' | 'fit',
    user: any,
    userData: any,
    onSelectClass: (cls: any) => void,
    startRatingFlow: boolean,
    setStartRatingFlow: (v: boolean) => void,
    lastClassRated: boolean,
    setLastClassRated: (v: boolean) => void,
    userClasses: any[],
    availableMonthly: number,
    remainingWeekly: number
}> = ({ user, userData, onSelectClass, startRatingFlow, setStartRatingFlow, lastClassRated, setLastClassRated, userClasses, availableMonthly, remainingWeekly }) => {

    const classToRate = userClasses.find(c => c.status === 'attended' && !lastClassRated);

    return (
        <div className="section-padding" style={{ paddingTop: '1.5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {startRatingFlow && (
                <RatingModal
                    className={classToRate?.title}
                    classTime={classToRate?.time}
                    onClose={() => setStartRatingFlow(false)}
                    onSubmit={async (ratingData) => {
                        // Optimistic UI update
                        setStartRatingFlow(false);
                        setLastClassRated(true);

                        // Save to backend
                        if (classToRate && userData) {
                            try {
                                await saveClassRating({
                                    userId: user?.uid || 'anonymous',
                                    userName: userData.firstName || user?.displayName || 'Usuario',
                                    classId: classToRate.title + classToRate.date, // Mock ID
                                    className: classToRate.title,
                                    classDate: classToRate.date,
                                    classTime: classToRate.time,
                                    coachName: classToRate.coach,
                                    ratingGeneral: ratingData.general,
                                    ratingCoach: ratingData.coach,
                                    ratingEffort: ratingData.effort,
                                    comment: ''
                                });
                            } catch (error) {
                                console.error("Failed to save rating:", error);
                            }
                        }
                    }}
                />
            )}
            {/* Stats Grid */}
            <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="card-premium">
                    <span className="text-3xl font-bold" style={{ color: 'var(--color-primary)', display: 'block' }}>{availableMonthly}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Clases disponibles al mes</span>
                </div>
                <div className="card-premium">
                    <span className="text-3xl font-bold" style={{ display: 'block', color: 'var(--color-text-main)' }}>{remainingWeekly}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Clases restantes (sem)</span>
                </div>
            </section>

            {/* Upcoming Classes List */}
            <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
                    <h2 className="heading-section" style={{ margin: 0 }}>Tus últimas clases</h2>
                </div>
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {userClasses.map((cls, idx) => (
                        <div
                            key={idx}
                            className="hero-next-class"
                            style={{ height: '10rem', position: 'relative', cursor: 'pointer' }}
                            onClick={() => onSelectClass(cls)}
                        >                            <img src={cls.image} alt={cls.title} style={{ filter: cls.status !== 'upcoming' ? 'grayscale(100%) brightness(0.7)' : 'none' }} />
                            <div className="hero-overlay"></div>

                            {/* Status Stamp - Extra Small */}
                            {cls.status !== 'upcoming' && (
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    right: '1rem',
                                    transform: 'translateY(-50%) rotate(-12deg)',
                                    border: `3px solid ${cls.status === 'attended' ? '#4ade80' : cls.status === 'cancelled' ? '#ef4444' : '#f97316'}`,
                                    color: cls.status === 'attended' ? '#4ade80' : cls.status === 'cancelled' ? '#ef4444' : '#f97316',
                                    padding: '0.2rem 0.5rem', // Reverted to larger padding
                                    borderRadius: '6px',
                                    fontWeight: 900,
                                    fontSize: '0.9rem', // Reverted to larger font
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    zIndex: 10,
                                    opacity: 0.9,
                                    textAlign: 'center',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                    backgroundColor: 'rgba(0,0,0,0.4)',
                                    backdropFilter: 'blur(2px)'
                                }}>
                                    {cls.status === 'attended' ? 'ASISTIDO' : cls.status === 'cancelled' ? 'CANCELADO' : 'NO ASISTIDO'}
                                </div>
                            )}

                            <div className="hero-content">
                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <span style={{ backgroundColor: 'var(--color-primary)', color: 'white', fontSize: '10px', fontWeight: 800, padding: '0.125rem 0.5rem', borderRadius: '4px', textTransform: 'uppercase' }}>{cls.date}</span>
                                    <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', color: 'white', fontSize: '10px', fontWeight: 800, padding: '0.125rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.3)' }}>{cls.time}</span>
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>{cls.title}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: '#E5E7EB', marginTop: '0.25rem' }}>
                                    <span className="material-icons-round" style={{ fontSize: '1rem' }}>location_on</span>
                                    <span>{cls.location}</span>
                                    <span>•</span>
                                    <span>{cls.coach}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section >
            {/* Rating Card */}
            {
                classToRate && (
                    <section style={{ marginBottom: '2rem' }}>
                        <div
                            onClick={() => setStartRatingFlow(true)}
                            style={{
                                background: 'linear-gradient(135deg, #F59E0B 0%, #B45309 100%)', // Golden/Amber gradient
                                borderRadius: 'var(--radius-xl)',
                                padding: '1rem 1.25rem', // Smaller padding
                                position: 'relative',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white', margin: '0 0 0.25rem 0' }}>¡Valora tu clase!</h3>
                                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.9)', margin: 0, fontWeight: 500 }}>
                                    {classToRate.title} • {classToRate.time}
                                </p>
                            </div>
                            <div style={{
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                borderRadius: '50%',
                                width: '2.5rem',
                                height: '2.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backdropFilter: 'blur(4px)'
                            }}>
                                <span className="material-icons-round" style={{ color: 'white', fontSize: '1.5rem' }}>thumb_up</span>
                            </div>
                        </div>
                    </section>
                )
            }
        </div >
    );
};

const ReservasSection: React.FC<{
    membership?: 'box' | 'fit',
    onSelectClass: (cls: any) => void,
    userClasses: any[]
}> = ({ membership, onSelectClass, userClasses }) => {
    const [selectedGroup, setSelectedGroup] = useState<'box' | 'fit'>(membership || 'box');

    // MOCK Schedule Data (4 classes as requested)
    const getSchedule = (group: 'box' | 'fit') => {
        // Title prefix based on group to make it feel real
        const prefix = group === 'box' ? 'WOD' : 'Fit Boxing';

        return [
            {
                time: '09:30', duration: 60, title: `${prefix} Morning`, coach: 'Alex', available: 4, total: 12,
                date: 'SAB 3', location: 'Sala Principal', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600',
                enrolled: 8, capacity: 12
            },
            {
                time: '12:00', duration: 60, title: `${prefix} Power`, coach: 'Sarah', available: 0, total: 12, // FULL
                date: 'SAB 3', location: 'Sala 2', image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&q=80&w=600',
                enrolled: 12, capacity: 12
            },
            {
                time: '17:00', duration: 60, title: `${prefix} Basics`, coach: 'Mike', available: 8, total: 12,
                date: 'SAB 3', location: 'Sala Técnica', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=600',
                enrolled: 4, capacity: 12
            },
            {
                time: '19:00', duration: 60, title: `${prefix} Night`, coach: 'Alex', available: 6, total: 12,
                date: 'SAB 3', location: 'Sala Principal', image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=600',
                enrolled: 6, capacity: 12
            },
        ];
    };

    const schedule = getSchedule(selectedGroup);

    // Mock current time
    const currentHour = 13; // 13:00 PM (Disables 09:30 and 12:00)
    const currentMinute = 0;

    const isPassed = (timeStr: string) => {
        const [h, m] = timeStr.split(':').map(Number);
        if (h < currentHour) return true;
        if (h === currentHour && m < currentMinute) return true;
        return false;
    };

    return (
        <div style={{ paddingTop: '1.5rem', paddingBottom: '2rem' }}>
            <section className="section-padding">
                <h2 className="heading-section">Calendario Semanal</h2>
                {/* Compact Calendar Track */}
                <div className="calendar-track hide-scrollbar" style={{ gap: '0.35rem', justifyContent: 'space-between' }}>
                    {['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM'].map((day, i) => {
                        const dateNum = i < 3 ? 29 + i : i - 2;
                        const isToday = i === 5; // Saturday 3rd
                        return (
                            <div key={day} className={`calendar-bubble ${isToday ? 'active' : ''}`} style={{
                                flex: 1,
                                minWidth: 0,
                                height: 'auto',
                                aspectRatio: '3/4',
                                padding: '0.5rem 0.2rem'
                            }}>
                                <span style={{ fontSize: '0.55rem', color: isToday ? 'white' : 'var(--color-text-muted)', fontWeight: 600 }}>{day}</span>
                                <span style={{ fontSize: '1rem', fontWeight: isToday ? 800 : 700 }}>{dateNum}</span>
                                {isToday && <span style={{ fontSize: '0.5rem', fontWeight: 600 }}>ENE</span>}
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Group Selectors */}
            <section className="section-padding" style={{ marginTop: '1.5rem' }}>
                <div className="box-grid">
                    <button
                        className={`box-card ${selectedGroup === 'fit' ? 'disabled' : ''}`}
                        onClick={() => setSelectedGroup('box')}
                        style={{ border: selectedGroup === 'box' ? '2px solid var(--color-primary)' : 'none' }}
                    >
                        <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400" alt="Box" />
                        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                            <span style={{ color: 'white', fontWeight: 900, fontSize: '1rem', textTransform: 'uppercase', display: 'block' }}>Almodovar</span>
                            <span className="box-label-box" style={{ fontWeight: 900, fontSize: '1.5rem' }}>BOX</span>
                        </div>
                    </button>
                    <button
                        className={`box-card ${selectedGroup === 'box' ? 'disabled' : ''}`}
                        onClick={() => setSelectedGroup('fit')}
                        style={{ border: selectedGroup === 'fit' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)' }}
                    >
                        <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=400" alt="Fit" />
                        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                            <span style={{ color: 'white', fontWeight: 900, fontSize: '1rem', textTransform: 'uppercase', display: 'block' }}>Almodovar</span>
                            <span className="box-label-fit" style={{ fontWeight: 900, fontSize: '1.5rem' }}>FIT</span>
                        </div>
                    </button>
                </div>
            </section>

            {/* Daily Schedule List */}
            <section className="section-padding" style={{ marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 className="heading-section" style={{ margin: 0 }}>Horario del día</h2>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)', backgroundColor: 'rgba(211,0,31,0.1)', padding: '0.25rem 0.75rem', borderRadius: '4px' }}>Sábado 3 Enero</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {schedule.map((session, idx) => {
                        const passed = isPassed(session.time);
                        const full = session.available === 0;
                        const canReserve = !passed && !full;

                        const bookedClass = userClasses.find(c =>
                            c.title === session.title &&
                            c.date === session.date &&
                            c.time === session.time &&
                            c.status !== 'cancelled'
                        );
                        const isBooked = !!bookedClass;

                        return (
                            <div
                                key={idx}
                                className="session-item"
                                onClick={() => {
                                    if (isBooked) {
                                        onSelectClass(bookedClass);
                                    } else if (!passed) {
                                        onSelectClass(session);
                                    }
                                }}
                                style={{
                                    borderLeftColor: selectedGroup === 'box' ? 'var(--color-text-main)' : 'var(--color-primary)',
                                    opacity: passed ? 0.6 : 1,
                                    cursor: passed ? 'default' : 'pointer',
                                    transition: 'transform 0.1s',
                                    transform: 'scale(1)',
                                    backgroundColor: isBooked ? 'var(--color-surface-highlight)' : 'var(--color-surface)',
                                    // ':active': { transform: 'scale(0.98)' } // Only if clickable
                                } as any}
                            >
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ textAlign: 'center', minWidth: '3.5rem' }}>
                                        <span style={{ display: 'block', fontWeight: 800, fontSize: '1.1rem' }}>{session.time}</span>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{parseInt(session.time) < 12 ? 'AM' : 'PM'}</span>
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <h4 style={{ fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>{session.title}</h4>
                                            {isBooked && (
                                                <span className="material-icons-round" style={{ fontSize: '1rem', color: '#4ade80' }}>check_circle</span>
                                            )}
                                            {!isBooked && full && <span className="material-icons-round" style={{ fontSize: '1rem', color: '#f97316' }}>hourglass_empty</span>}
                                        </div>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>{session.duration} min • {session.coach}</p>
                                        {!passed && (
                                            <span className="session-badge" style={{
                                                backgroundColor: isBooked ? 'rgba(74, 222, 128, 0.1)' : (full ? 'rgba(249, 115, 22, 0.1)' : 'rgba(34, 197, 94, 0.1)'),
                                                color: isBooked ? '#4ade80' : (full ? '#f97316' : '#4ade80'),
                                                marginTop: '0.25rem',
                                                display: 'inline-block'
                                            }}>
                                                {isBooked ? 'RESERVADO' : (full ? 'Lista de Espera' : `${session.available} plazas`)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!isBooked && !passed) {
                                            onSelectClass(session);
                                        }
                                    }}
                                    disabled={passed || isBooked}
                                    style={{
                                        backgroundColor: isBooked
                                            ? 'transparent'
                                            : (canReserve ? (selectedGroup === 'box' ? 'var(--color-surface)' : 'var(--color-primary)') : 'transparent'),

                                        color: isBooked
                                            ? '#4ade80'
                                            : (canReserve ? (selectedGroup === 'box' ? 'var(--color-text-main)' : 'white') : (full ? '#f97316' : 'var(--color-text-muted)')),

                                        border: isBooked
                                            ? '1px solid #4ade80'
                                            : (canReserve ? (selectedGroup === 'box' ? '1px solid var(--color-border)' : 'none') : (full ? '1px solid #f97316' : 'none')),

                                        padding: '0.5rem 0.75rem',
                                        borderRadius: '8px',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        cursor: (passed || isBooked) ? 'default' : 'pointer',
                                        minWidth: '85px',
                                        boxShadow: (!isBooked && canReserve && selectedGroup === 'fit') ? '0 4px 12px rgba(211,0,31,0.3)' : 'none'
                                    }}
                                >
                                    {passed ? 'Finalizado' : (isBooked ? 'Reservado' : (full ? 'Completo' : 'Reservar'))}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};
