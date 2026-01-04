import React from 'react';
import { RatingModal } from '../../components/RatingModal';
import { saveClassRating } from '../../services/ratingService';
import { useOutletContext } from 'react-router-dom';
import type { DashboardContextType } from '../ClientDashboardView';

export const HomeView: React.FC = () => {
    const {
        user,
        userData,
        userClasses,
        onSelectClass,
        availableMonthly,
        remainingWeekly
    } = useOutletContext<DashboardContextType>();

    const [startRatingFlow, setStartRatingFlow] = React.useState(false);
    const [lastClassRated, setLastClassRated] = React.useState(false);

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
                    {userClasses.slice(-3).map((cls, idx) => ( // Ensure limit to 3 if styling requires
                        <div
                            key={idx}
                            className="hero-next-class"
                            style={{ height: '10rem', position: 'relative', cursor: 'pointer' }}
                            onClick={() => onSelectClass(cls)}
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
                                    padding: '0.2rem 0.5rem',
                                    borderRadius: '6px',
                                    fontWeight: 900,
                                    fontSize: '0.9rem',
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
