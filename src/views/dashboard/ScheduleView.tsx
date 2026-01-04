import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { DashboardContextType } from '../ClientDashboardView';

export const ScheduleView: React.FC = () => {
    const { userData, userClasses, onSelectClass } = useOutletContext<DashboardContextType>();

    // Default membership if userData is missing (e.g. loading)
    const membership = userData?.membership || 'box';

    const [selectedGroup, setSelectedGroup] = useState<'box' | 'fit'>(membership);

    // Dynamic Date Logic
    const today = new Date();

    // Mock Schedule Data (4 classes as requested)
    // Note: in a real app, this would filter by the selected date
    const getSchedule = (group: 'box' | 'fit') => {
        // ... (existing mock logic)
        const prefix = group === 'box' ? 'WOD' : 'Fit Boxing';
        // Generate date string for mocks (e.g. "SAB 3") to match visual style if needed,
        // but simply using today's formatted short date for consistency or ignoring it as it is daily view.
        const dateStr = today.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }).toUpperCase();

        return [
            {
                time: '09:30', duration: 60, title: `${prefix} Morning`, coach: 'Alex', available: 4, total: 12,
                date: dateStr, location: 'Sala Principal', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600',
                enrolled: 8, capacity: 12
            },
            {
                time: '12:00', duration: 60, title: `${prefix} Power`, coach: 'Sarah', available: 0, total: 12, // FULL
                date: dateStr, location: 'Sala 2', image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&q=80&w=600',
                enrolled: 12, capacity: 12
            },
            {
                time: '17:00', duration: 60, title: `${prefix} Basics`, coach: 'Mike', available: 8, total: 12,
                date: dateStr, location: 'Sala Técnica', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=600',
                enrolled: 4, capacity: 12
            },
            {
                time: '19:00', duration: 60, title: `${prefix} Night`, coach: 'Alex', available: 6, total: 12,
                date: dateStr, location: 'Sala Principal', image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=600',
                enrolled: 6, capacity: 12
            },
        ];
    };

    const schedule = getSchedule(selectedGroup);

    // Mock current time -> Use Real Time for "passed" logic? 
    // User requested "real day", so logic should probably respect real time to be consistent.
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

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
                {/* Compact Calendar Track - Dynamic */}
                <div className="calendar-track hide-scrollbar" style={{ gap: '0.35rem', justifyContent: 'space-between' }}>
                    {Array.from({ length: 7 }, (_, i) => {
                        const d = new Date(today);
                        // Center today (index 3 out of 0-6? Or start today? Let's show Today + 6 days for forward planning, or -2/+4 context)
                        // Standard practice: Today + next 6 days.
                        d.setDate(today.getDate() + i);

                        const dayName = d.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase().replace('.', '');
                        const dayNum = d.getDate();
                        const isToday = i === 0;

                        return (
                            <div key={i} className={`calendar-bubble ${isToday ? 'active' : ''}`} style={{
                                flex: 1, minWidth: 0, height: 'auto', aspectRatio: '3/4', padding: '0.5rem 0.2rem'
                            }}>
                                <span style={{ fontSize: '0.55rem', color: isToday ? 'white' : 'var(--color-text-muted)', fontWeight: 600 }}>{dayName}</span>
                                <span style={{ fontSize: '1rem', fontWeight: isToday ? 800 : 700 }}>{dayNum}</span>
                                {isToday && <span style={{ fontSize: '0.5rem', fontWeight: 600 }}>{d.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase().replace('.', '')}</span>}
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
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)', backgroundColor: 'rgba(211,0,31,0.1)', padding: '0.25rem 0.75rem', borderRadius: '4px', textTransform: 'capitalize' }}>
                        {today.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {schedule.map((session, idx) => {
                        const passed = isPassed(session.time);
                        const full = session.available === 0;
                        const canReserve = !passed && !full;

                        const bookedClass = userClasses.find((c: any) =>
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
                                    {passed ? 'Finalizado' : (isBooked ? 'Reservado' : (full ? 'Completo' : `${session.available} plazas`))}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};
