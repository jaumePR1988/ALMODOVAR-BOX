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

export const ClientDashboardView: React.FC = () => {
    const { user, userData } = useAuth();
    const [activeTab, setActiveTab] = useState('inicio');

    const renderContent = () => {
        switch (activeTab) {
            case 'inicio':
                return <InicioSection membership={userData?.membership || 'fit'} user={user} userData={userData} />;
            case 'retos':
                return <div className="section-padding text-center" style={{ marginTop: '2rem' }}>Próximos Retos Almodóvar (Próximamente)</div>;
            case 'reservas':
                return <ReservasSection membership={userData?.membership || 'fit'} />;
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
                return <InicioSection membership={userData?.membership || 'fit'} user={user} userData={userData} />;
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

const InicioSection: React.FC<{ membership?: 'box' | 'fit', user: any, userData: any }> = ({ membership, user, userData }) => {
    const [startRatingFlow, setStartRatingFlow] = useState(false);
    const [lastClassRated, setLastClassRated] = useState(false);
    const [selectedClass, setSelectedClass] = useState<any>(null); // For Detail View

    if (selectedClass) {
        return <ClassDetailView classData={selectedClass} onBack={() => setSelectedClass(null)} />;
    }

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

    const mockClasses = [
        {
            title: 'Fit Boxing WOD',
            time: 'Viernes 18:00',
            date: 'VIE 2',
            coach: 'Coach Alex',
            location: 'Sala Principal',
            image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=600',
            status: 'attended'
        },
        {
            title: 'Open Box',
            time: 'Sabado 10:00',
            date: 'SAB 3',
            coach: 'Coach Alex',
            location: 'Sala Principal',
            image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600',
            status: 'upcoming'
        },
        {
            title: 'Fit Boxing Tech',
            time: 'Lunes 07:00',
            date: 'LUN 5',
            coach: 'Coach Mike',
            location: 'Sala Técnica',
            image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=600',
            status: 'upcoming'
        }
    ];

    const classToRate = mockClasses.find(c => c.status === 'attended' && !lastClassRated);

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
                    {mockClasses.map((cls, idx) => (
                        <div
                            key={idx}
                            className="hero-next-class"
                            style={{ height: '10rem', position: 'relative', cursor: 'pointer' }}
                            onClick={() => setSelectedClass(cls)}
                        >
                            <img src={cls.image} alt={cls.title} style={{ filter: cls.status !== 'upcoming' ? 'grayscale(100%) brightness(0.7)' : 'none' }} />
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

const ReservasSection: React.FC<{ membership?: 'box' | 'fit' }> = ({ membership }) => {
    const [selectedGroup, setSelectedGroup] = useState<'box' | 'fit'>(membership || 'box');

    // Mock Schedule Data Generator
    const getSchedule = (group: 'box' | 'fit') => {
        const baseSchedule = [
            { time: '07:00', duration: 60, title: group === 'box' ? 'WOD' : 'Fit Boxing', coach: 'Alex', available: 0, total: 12 },
            { time: '09:30', duration: 60, title: group === 'box' ? 'Open Box' : 'Hiit', coach: 'Sarah', available: 4, total: 12 },
            { time: '14:00', duration: 60, title: group === 'box' ? 'WOD' : 'Fit Boxing', coach: 'Alex', available: 2, total: 12 },
            { time: '17:00', duration: 60, title: group === 'box' ? 'Open Box' : 'Strength', coach: 'Mike', available: 8, total: 12 },
            { time: '18:00', duration: 60, title: group === 'box' ? 'WOD' : 'Fit Boxing WOD', coach: 'Sarah', available: 0, total: 12 },
            { time: '19:00', duration: 60, title: group === 'box' ? 'WOD' : 'Fit Boxing', coach: 'Alex', available: 6, total: 12 },
        ];
        return baseSchedule;
    };

    const schedule = getSchedule(selectedGroup);

    // Mock current time for "passed" logic (Let's assume it's 17:30)
    const currentHour = 17;
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
                <div className="calendar-track hide-scrollbar">
                    {/* Mon 29 Dec - Sun 4 Jan (Mock) */}
                    {['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM'].map((day, i) => {
                        const dateNum = i < 3 ? 29 + i : i - 2; // 29, 30, 31, 1, 2, 3, 4
                        const isToday = i === 5; // Saturday 3rd
                        return (
                            <div key={day} className={`calendar-bubble ${isToday ? 'active' : ''}`}>
                                <span style={{ fontSize: '0.625rem', color: isToday ? 'white' : 'var(--color-text-muted)', fontWeight: 600 }}>{day}</span>
                                <span style={{ fontSize: '1.25rem', fontWeight: isToday ? 800 : 700 }}>{dateNum}</span>
                                {isToday && <span style={{ fontSize: '0.625rem', fontWeight: 600 }}>ENE</span>}
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Group Selectors (Moving logic here) */}
            <section className="section-padding" style={{ marginTop: '2rem' }}>
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
            <section className="section-padding" style={{ marginTop: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 className="heading-section" style={{ margin: 0 }}>Horario del día</h2>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)' }}>Sábado 3 Enero</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {schedule.map((session, idx) => {
                        const passed = isPassed(session.time);
                        const full = session.available === 0;
                        const canReserve = !passed && !full;

                        return (
                            <div key={idx} className="session-item" style={{
                                borderLeftColor: selectedGroup === 'box' ? 'var(--color-text-main)' : 'var(--color-primary)',
                                opacity: passed ? 0.5 : 1
                            }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ textAlign: 'center', minWidth: '3.5rem' }}>
                                        <span style={{ display: 'block', fontWeight: 800, fontSize: '1.1rem' }}>{session.time}</span>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{parseInt(session.time) < 12 ? 'AM' : 'PM'}</span>
                                    </div>
                                    <div>
                                        <h4 style={{ fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>{session.title}</h4>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>{session.duration} min • {session.coach}</p>
                                        {!passed && !full && (
                                            <span className="session-badge" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#4ade80', marginTop: '0.25rem', display: 'inline-block' }}>{session.available} plazas</span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    disabled={!canReserve}
                                    style={{
                                        backgroundColor: canReserve ? (selectedGroup === 'box' ? 'var(--color-surface)' : 'var(--color-primary)') : 'transparent',
                                        color: canReserve ? (selectedGroup === 'box' ? 'var(--color-text-main)' : 'white') : 'var(--color-text-muted)',
                                        border: canReserve ? (selectedGroup === 'box' ? '1px solid var(--color-border)' : 'none') : 'none',
                                        padding: '0.5rem 0.75rem',
                                        borderRadius: '8px',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        cursor: canReserve ? 'pointer' : 'not-allowed',
                                        minWidth: '80px',
                                        boxShadow: canReserve && selectedGroup === 'fit' ? '0 4px 12px rgba(211,0,31,0.3)' : 'none'
                                    }}
                                >
                                    {passed ? 'Finalizado' : (full ? 'Agotado' : 'Reservar')}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};
