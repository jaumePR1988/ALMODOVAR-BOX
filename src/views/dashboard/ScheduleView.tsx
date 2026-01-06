import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { DashboardContextType } from '../ClientDashboardView';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

export const ScheduleView: React.FC = () => {
    const { userData, userClasses, onSelectClass } = useOutletContext<DashboardContextType>();

    // Dynamic Date Logic
    // We try to normalize the membership string. 'AlmodovarFIT' -> 'fit', 'AlmodovarBOX' -> 'box'.
    // The field in Firestore created by Admin is 'group' (e.g. 'almodovar_fit'). 
    // We check both 'group' and 'membership' properties to be safe.
    const getInitialGroup = (): 'box' | 'fit' => {
        const groupField = userData?.group || userData?.membership || '';
        const normalized = groupField.toLowerCase();

        if (normalized.includes('fit')) return 'fit';
        return 'box';
    };

    const [selectedGroup, setSelectedGroup] = useState<'box' | 'fit'>(getInitialGroup());
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [schedule, setSchedule] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Update selectedGroup if userData loads late
    useEffect(() => {
        if (userData) {
            setSelectedGroup(getInitialGroup());
        }
    }, [userData?.membership, userData?.group]);

    // Fetch Schedule from Firestore
    useEffect(() => {
        const fetchClasses = async () => {
            setLoading(true);
            try {
                // Fetch active classes for the selected group
                // Note: date filtering is tricky with string dates. 
                // For MVP, we fetch all active classes for the group and filter/sort client-side or assume daily view.
                // Ideal: Filter by date range (start/end of today or week).
                // Existing CreateClass saves 'date' as 'YYYY-MM-DD'.

                const q = query(
                    collection(db, 'classes'),
                    where('status', '==', 'active'),
                    where('group', '==', selectedGroup)
                );

                const querySnapshot = await getDocs(q);

                const classes = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    // Map Firestore data to UI expectations
                    return {
                        id: doc.id,
                        ...data,
                        // Ensure required fields exist or have defaults
                        title: data.name,
                        coach: data.coachId === '1' ? 'Ana' : (data.coachId === '2' ? 'Carlos' : 'Coach'), // Simple mapping or fetch coach name
                        available: data.capacity - (data.enrolled || 0),
                        total: data.capacity,
                        image: data.imageUrl || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600',
                        // Handle time logic
                        time: data.startTime,
                        duration: 60, // Default duration if not saved
                        location: 'Sala Principal', // Default
                    };
                });

                // Sort by date then time
                const sorted = classes.sort((a: any, b: any) => {
                    if (a.date !== b.date) return a.date.localeCompare(b.date);
                    return a.startTime.localeCompare(b.startTime);
                });

                setSchedule(sorted);
            } catch (error) {
                console.error("Error fetching classes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchClasses();
    }, [selectedGroup]);


    // Mock current time -> Use Real Time for "passed" logic? 
    // User requested "real day", so logic should probably respect real time to be consistent.
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const isPassed = (timeStr: string, dateStr: string) => {
        // Simple verification: if class date < today, passed.
        // If class date == today, check time.
        // If class date > today, future.
        try {
            const classDate = new Date(dateStr);
            const todayDate = new Date(now.toISOString().split('T')[0]); // Strip time

            if (classDate < todayDate) return true;
            if (classDate > todayDate) return false;

            // Same day
            const [h, m] = timeStr.split(':').map(Number);
            if (h < currentHour) return true;
            if (h === currentHour && m < currentMinute) return true;
            return false;
        } catch {
            // Fallback for non-standard dates
            return false;
        }
    };

    // Filter schedule by Selected Date
    // Date in DB is 'YYYY-MM-DD'
    // selectedDate is a Date object.
    // Need to match them.
    const getFormattedDate = (date: Date) => {
        // Adjust for timezone - simplistic 'split' might fail if strictly UTC. 
        // toLocaleDateString('en-CA') usually gives YYYY-MM-DD.
        // Let's manually construct to be safe locally.
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const selectedDateStr = getFormattedDate(selectedDate);

    // Filtered list
    const filteredSchedule = schedule.filter(s => s.date === selectedDateStr);

    return (
        <div style={{ paddingTop: '1.5rem', paddingBottom: '2rem' }}>
            <section className="section-padding">
                <h2 className="heading-section">Calendario Semanal</h2>
                {/* Compact Calendar Track - Dynamic */}
                <div className="calendar-track hide-scrollbar" style={{ gap: '0.35rem', justifyContent: 'space-between' }}>
                    {Array.from({ length: 7 }, (_, i) => {
                        const d = new Date(); // Start from today
                        d.setDate(now.getDate() + i);

                        const dayName = d.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase().replace('.', '');
                        const dayNum = d.getDate();

                        // Check if this date is the selected one
                        const isSelected = d.getDate() === selectedDate.getDate() && d.getMonth() === selectedDate.getMonth() && d.getFullYear() === selectedDate.getFullYear();

                        return (
                            <div
                                key={i}
                                onClick={() => setSelectedDate(d)}
                                className={`calendar-bubble ${isSelected ? 'active' : ''}`}
                                style={{
                                    flex: 1, minWidth: 0, height: 'auto', aspectRatio: '3/4', padding: '0.5rem 0.2rem',
                                    cursor: 'pointer',
                                    backgroundColor: isSelected ? 'var(--color-primary)' : 'var(--color-surface)',
                                    border: isSelected ? 'none' : '1px solid var(--color-border)'
                                }}
                            >
                                <span style={{ fontSize: '0.55rem', color: isSelected ? 'white' : 'var(--color-text-muted)', fontWeight: 600 }}>{dayName}</span>
                                <span style={{ fontSize: '1rem', fontWeight: isSelected ? 800 : 700, color: isSelected ? 'white' : 'var(--color-text-main)' }}>{dayNum}</span>
                                {isSelected && <span style={{ fontSize: '0.5rem', fontWeight: 600, color: 'white' }}>{d.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase().replace('.', '')}</span>}
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
                    <h2 className="heading-section" style={{ margin: 0 }}>Clases Disponibles</h2>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)', backgroundColor: 'rgba(211,0,31,0.1)', padding: '0.25rem 0.75rem', borderRadius: '4px', textTransform: 'capitalize' }}>
                        {selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {loading ? (
                        <div className="flex justify-center p-8 text-gray-400">Cargando clases...</div>
                    ) : filteredSchedule.length === 0 ? (
                        <div className="text-center p-8 text-gray-400">No hay clases para este día.</div>
                    ) : (
                        filteredSchedule.map((session, idx) => {
                            const passed = isPassed(session.time, session.date);
                            const full = session.available === 0;
                            const canReserve = !passed && !full;

                            const bookedClass = userClasses.find((c: any) =>
                                c.classId === session.id && // Check by ID first for correctness
                                c.status !== 'cancelled'
                            );
                            const isBooked = !!bookedClass;

                            // Display Date only if it changes or just show always?
                            // Let's show a small date badge if it's not today?

                            return (
                                <div
                                    key={session.id || idx}
                                    className="session-item"
                                    onClick={() => {
                                        if (isBooked) {
                                            if (bookedClass) onSelectClass(bookedClass);
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
                                    } as any}
                                >
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div style={{ textAlign: 'center', minWidth: '3.5rem' }}>
                                            <span style={{ display: 'block', fontWeight: 800, fontSize: '1.1rem' }}>{session.time}</span>
                                            <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>{session.date}</span>
                                        </div>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <h4 style={{ fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>{session.title}</h4>
                                                {isBooked && (
                                                    <span className="material-icons-round" style={{ fontSize: '1rem', color: '#4ade80' }}>check_circle</span>
                                                )}
                                                {!isBooked && full && <span className="material-icons-round" style={{ fontSize: '1rem', color: '#f97316' }}>hourglass_empty</span>}
                                            </div>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>60 min • {session.coach}</p>
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
                        })
                    )}
                </div>
            </section>
        </div>
    );
};
