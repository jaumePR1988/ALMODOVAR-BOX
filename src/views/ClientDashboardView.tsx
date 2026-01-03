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

    const handleBookClass = () => {
        if (!selectedClass) return;
        const isFull = (selectedClass.enrolled ?? 8) >= (selectedClass.capacity ?? 10);
        setBookingSuccess({ show: true, type: isFull ? 'waitlist' : 'booking' });

        // Sync with Inicio (Mock)
        if (!isFull) {
            setUserClasses(prev => [
                {
                    ...selectedClass,
                    status: 'upcoming',
                    enrolled: (selectedClass.enrolled || 0) + 1 // Optimistic update
                },
                ...prev
            ]);
        }
    };

    const renderContent = () => {
        if (selectedClass) {
            return (
                <>
                    <ClassDetailView
                        classData={selectedClass}
                        onBack={() => setSelectedClass(null)}
                        onBook={handleBookClass}
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
                />;
            case 'retos':
                return <RetosView />;
            case 'reservas':
                return <ReservasSection membership={userData?.membership || 'fit'} onSelectClass={setSelectedClass} />;
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
            hideNav={activeTab === 'ajustes'}
            hideHeader={activeTab === 'retos'}
        >
            {showConsentModal && <ConsentModal onComplete={() => setOverrideModal(true)} />}
            <div className={`scroll-container hide-scrollbar ${showConsentModal ? 'blur-sm pointer-events-none' : ''}`}>
                {renderContent()}
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
    userClasses: any[]
}> = ({ membership, user, userData, onSelectClass, startRatingFlow, setStartRatingFlow, lastClassRated, setLastClassRated, userClasses }) => {

    // Monthly Calculation Logic (Mocked)
    const monthlyLimit = membership === 'box' ? 12 : 16;
    const usedSessions = 4;
    const coachAssists = 1;
    const lateCancellations = 0; // Cancelled < 1 hour before
    const availableMonthly = monthlyLimit - (usedSessions + coachAssists + lateCancellations);

    // Weekly Calculation Logic (Mocked)
    const weeklyLimit = membership === 'box' ? 2 : 3;
    const attendedThisWeek = 1;
    const remainingWeekly = weeklyLimit - attendedThisWeek;

    const classToRate = userClasses.find(c => c.status === 'attended' && !lastClassRated);

    return (
        <div style={{ paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
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
            <section className="section-padding" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
            <section className="section-padding">
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
                    <section className="section-padding" style={{ marginBottom: '2rem' }}>
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

const ReservasSection: React.FC<{ membership?: 'box' | 'fit', onSelectClass: (cls: any) => void }> = ({ membership, onSelectClass }) => {
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
    const currentHour = 10; // 10:30 AM (Morning class passed)
    const currentMinute = 30;

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

                        return (
                            <div
                                key={idx}
                                className="session-item"
                                onClick={() => onSelectClass(session)}
                                style={{
                                    borderLeftColor: selectedGroup === 'box' ? 'var(--color-text-main)' : 'var(--color-primary)',
                                    opacity: passed ? 0.6 : 1,
                                    cursor: 'pointer',
                                    transition: 'transform 0.1s',
                                    transform: 'scale(1)',
                                    ':active': { transform: 'scale(0.98)' }
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
                                            {full && <span className="material-icons-round" style={{ fontSize: '1rem', color: '#f97316' }}>hourglass_empty</span>}
                                        </div>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>{session.duration} min • {session.coach}</p>
                                        {!passed && (
                                            <span className="session-badge" style={{
                                                backgroundColor: full ? 'rgba(249, 115, 22, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                                                color: full ? '#f97316' : '#4ade80',
                                                marginTop: '0.25rem',
                                                display: 'inline-block'
                                            }}>
                                                {full ? 'Lista de Espera' : `${session.available} plazas`}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSelectClass(session);
                                    }}
                                    disabled={passed}
                                    style={{
                                        backgroundColor: canReserve ? (selectedGroup === 'box' ? 'var(--color-surface)' : 'var(--color-primary)') : 'transparent',
                                        color: canReserve ? (selectedGroup === 'box' ? 'var(--color-text-main)' : 'white') : (full ? '#f97316' : 'var(--color-text-muted)'),
                                        border: canReserve ? (selectedGroup === 'box' ? '1px solid var(--color-border)' : 'none') : (full ? '1px solid #f97316' : 'none'),
                                        padding: '0.5rem 0.75rem',
                                        borderRadius: '8px',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        cursor: passed ? 'not-allowed' : 'pointer',
                                        minWidth: '85px',
                                        boxShadow: canReserve && selectedGroup === 'fit' ? '0 4px 12px rgba(211,0,31,0.3)' : 'none'
                                    }}
                                >
                                    {passed ? 'Finalizado' : (full ? 'Completo' : 'Reservar')}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};
