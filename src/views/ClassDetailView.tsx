import React, { useState } from 'react';
import { ClassAttendeesModal } from '../components/ClassAttendeesModal';
import { WODReportView } from './WODReportView';

interface ClassDetailViewProps {
    classData: any; // Replace with proper type later
    onBack: () => void;
    onBook: () => void;
    onCancel: () => void;
}

export const ClassDetailView: React.FC<ClassDetailViewProps> = ({ classData, onBack, onBook, onCancel }) => {
    // Default values if data is missing
    const enrolled = classData.enrolled ?? 8;
    const capacity = classData.capacity ?? 10;
    const isFull = enrolled >= capacity;
    const spotsLeft = capacity - enrolled;

    // Check if user is already booked (Status check)
    const isAttended = classData.status === 'attended';

    const [showAttendees, setShowAttendees] = useState(false);
    const [showWODReport, setShowWODReport] = useState(false);
    const [wodExercises, setWodExercises] = useState<any[]>([]);

    const storageKey = `wod_${classData.title}_${classData.date}`;

    React.useEffect(() => {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            setWodExercises(JSON.parse(saved));
        }
    }, [storageKey]);

    if (showWODReport) {
        return <WODReportView
            classData={classData}
            wodExercises={wodExercises}
            onBack={() => setShowWODReport(false)}
        />;
    }

    return (
        <div style={{
            height: '100dvh', // Changed from minHeight to height for scroll
            backgroundColor: 'var(--color-bg)',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            top: 0,
            left: '50%', // Center horizontally
            transform: 'translateX(-50%)', // Center horizontally
            width: '100%',
            maxWidth: '480px', // Mobile constraint
            zIndex: 2000,
            overflowY: 'auto',
            color: 'var(--color-text-main)',
            boxShadow: '0 0 20px rgba(0,0,0,0.5)' // Shadow to separate from background on large screens
        }}>
            {/* ... Header & Main Content ... */}
            {/* Header */}
            <header style={{
                position: 'fixed',
                top: 0,
                width: '100%',
                maxWidth: '480px', // Constraint
                left: '50%', // Center
                transform: 'translateX(-50%)', // Center
                zIndex: 2010,
                backgroundColor: 'var(--color-bg-translucent)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid var(--color-border)',
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 1rem'
            }}>
                <button
                    onClick={onBack}
                    style={{
                        background: 'none',
                        border: 'none',
                        padding: '0.5rem',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer'
                    }}
                >
                    <span className="material-icons-round" style={{ fontSize: '1.5rem', color: 'var(--color-text-main)' }}>arrow_back_ios_new</span>
                </button>
                <h1 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text-main)' }}>Detalles de Clase</h1>
                <div style={{ width: '2.5rem' }}></div> {/* Spacer */}
            </header>

            {/* Main Content */}
            <main style={{
                flexGrow: 1,
                padding: '5rem 1rem 10rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                maxWidth: '480px',
                margin: '0 auto',
                width: '100%'
            }}>
                {/* Hero Image */}
                <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '14rem',
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.3)'
                }}>
                    <img
                        src={classData.image || "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=600"}
                        alt={classData.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)' }}></div>
                    <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '1.25rem' }}>
                        <span style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.75rem',
                            marginBottom: '0.5rem',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: 'white',
                            textTransform: 'uppercase',
                            backgroundColor: 'var(--color-primary)',
                            borderRadius: '9999px',
                            letterSpacing: '0.05em'
                        }}>
                            Alta Intensidad
                        </span>
                        <h2 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'white', lineHeight: 1.1, margin: 0 }}>{classData.title}</h2>
                    </div>
                </div>

                {/* Info Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {/* Date Card */}
                    <div style={{
                        backgroundColor: 'var(--color-surface)',
                        padding: '1rem',
                        borderRadius: '0.75rem',
                        border: '1px solid var(--color-border)',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <span className="material-icons-round" style={{ fontSize: '1.875rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>calendar_today</span>
                        <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>Fecha</p>
                        <p style={{ fontWeight: 600, color: 'var(--color-text-main)', marginTop: '0.25rem', fontSize: '1.1rem' }}>{classData.date}</p>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{classData.time}</p>
                    </div>

                    {/* Coach Card */}
                    <div style={{
                        backgroundColor: 'var(--color-surface)',
                        padding: '1rem',
                        borderRadius: '0.75rem',
                        border: '1px solid var(--color-border)',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <div style={{
                            width: '2.5rem',
                            height: '2.5rem',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            marginBottom: '0.5rem',
                            border: '2px solid #111827',
                            outline: '2px solid var(--color-primary)'
                        }}>
                            <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=100" alt="Coach" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>Coach</p>
                        <p style={{ fontWeight: 600, color: 'var(--color-text-main)', marginTop: '0.25rem' }}>{classData.coach}</p>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Head Coach</p>
                    </div>
                </div>

                {/* Availability - Clickable */}
                <div
                    onClick={() => setShowAttendees(true)}
                    style={{
                        backgroundColor: 'var(--color-surface)',
                        padding: '1.25rem',
                        borderRadius: '0.75rem',
                        border: '1px solid var(--color-border)',
                        cursor: 'pointer',
                        transition: 'transform 0.1s',
                        transform: 'scale(1)',
                        // Hover effect handled in CSS usually, but inline for simple react
                    }}
                    onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => e.currentTarget.style.transform = 'scale(0.98)'}
                    onMouseUp={(e: React.MouseEvent<HTMLDivElement>) => e.currentTarget.style.transform = 'scale(1)'}
                    onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
                        <div>
                            <h3 style={{
                                fontWeight: 800,
                                color: 'var(--color-text-main)',
                                margin: 0,
                                fontSize: '1.25rem',
                                letterSpacing: '-0.025em',
                                textTransform: 'uppercase'
                            }}>
                                Disponibilidad
                            </h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>Plazas limitadas por sesión</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>{enrolled}</span>
                            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>/ {capacity}</span>
                        </div>
                    </div>
                    <div style={{ width: '100%', backgroundColor: 'var(--color-bg)', borderRadius: '9999px', height: '0.75rem', overflow: 'hidden' }}>
                        <div style={{ width: `${(enrolled / capacity) * 100}%`, backgroundColor: isFull ? '#f97316' : 'var(--color-primary)', height: '100%', borderRadius: '9999px' }}></div>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'right', marginTop: '0.5rem' }}>
                        {isFull ? '¡Completo!' : `¡Quedan ${spotsLeft} plazas!`}
                    </p>

                    {/* Friends (Mock) */}
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
                        <div style={{ display: 'flex', paddingLeft: '0.5rem' }}>
                            {[1, 2, 3].map(i => (
                                <div key={i} style={{
                                    width: '2rem', height: '2rem', borderRadius: '50%', backgroundColor: '#ddd',
                                    marginLeft: '-0.5rem', border: '2px solid #1F2937', overflow: 'hidden'
                                }}>
                                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Friend" style={{ width: '100%', height: '100%' }} />
                                </div>
                            ))}
                            <div style={{
                                width: '2rem', height: '2rem', borderRadius: '50%', backgroundColor: 'var(--color-surface)',
                                marginLeft: '-0.5rem', border: '2px solid var(--color-bg)', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600
                            }}>
                                +15
                            </div>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginLeft: '1rem', fontWeight: 600, textDecoration: 'underline' }}>
                            Ver asistentes y Lista de espera
                        </p>
                    </div>
                </div>

                {/* Booking/Cancel Section */}
                <div style={{
                    backgroundColor: 'var(--color-surface)',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{isBooked ? 'Estado' : 'Total a pagar'}</span>
                        <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                            {isBooked ? 'Reservado' : (isFull ? '0 Créditos' : '1 Crédito')}
                        </span>
                    </div>

                    {isBooked ? (
                        <button
                            onClick={onCancel}
                            disabled={isCancelled || isAttended}
                            style={{
                                flex: 1,
                                backgroundColor: isCancelled ? '#ef4444' : 'transparent', // Red if cancelled, transparent if active but cancellable? No, should be destructive button
                                border: '2px solid #ef4444',
                                color: isCancelled ? 'white' : '#ef4444',
                                fontWeight: 700,
                                padding: '0.75rem 1.5rem',
                                borderRadius: '0.75rem',
                                boxShadow: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                cursor: isCancelled ? 'not-allowed' : 'pointer',
                                opacity: (isCancelled || isAttended) ? 0.6 : 1
                            }}>
                            <span className="material-icons-round">
                                {isCancelled ? 'cancel' : 'close'}
                            </span>
                            {isCancelled ? 'Cancelado' : (isAttended ? 'Asistido' : 'Cancelar Reserva')}
                        </button>
                    ) : (
                        <button
                            onClick={onBook}
                            style={{
                                flex: 1,
                                backgroundColor: isFull ? '#f97316' : 'var(--color-primary)',
                                color: 'white',
                                fontWeight: 700,
                                padding: '0.875rem 1.5rem',
                                borderRadius: '0.75rem',
                                border: 'none',
                                boxShadow: isFull ? '0 4px 12px rgba(249, 115, 22, 0.3)' : '0 4px 12px rgba(211, 0, 31, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                cursor: 'pointer'
                            }}>
                            <span className="material-icons-round">
                                {isFull ? 'hourglass_empty' : 'check_circle'}
                            </span>
                            {isFull ? 'Unirse a Lista de Espera' : 'Reservar Plaza'}
                        </button>
                    )}
                </div>

                {/* About */}
                <div style={{ backgroundColor: 'var(--color-surface)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--color-border)' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--color-text-main)' }}>Sobre la clase</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '1rem' }}>
                        Sesión de intervalos de fuerza funcional, golpeos de boxeo, patadas y estiramientos guiados. Un entrenamiento completo para transformar tu cuerpo y mente.
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {['Fuerza', 'Cardio', 'Técnica'].map(tag => (
                            <span key={tag} style={{
                                padding: '0.25rem 0.75rem',
                                borderRadius: '0.5rem',
                                backgroundColor: 'rgba(211, 0, 31, 0.1)',
                                color: 'var(--color-primary)',
                                fontSize: '0.75rem',
                                fontWeight: 600
                            }}>
                                {tag}
                            </span>
                        ))}
                    </div>

                    <button
                        onClick={() => setShowWODReport(true)}
                        style={{
                            width: '100%',
                            marginTop: '1.5rem',
                            padding: '0.75rem',
                            backgroundColor: 'transparent',
                            border: '1px solid var(--color-primary)',
                            borderRadius: '0.5rem',
                            color: 'var(--color-primary)',
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer'
                        }}
                    >
                        <span className="material-icons-round">fitness_center</span>
                        Ver sesión completa
                    </button>
                </div>




                {/* Location */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.5rem' }}>
                    <span className="material-icons-round" style={{ color: 'var(--color-text-muted)' }}>location_on</span>
                    <div>
                        <h4 style={{ fontWeight: 600, color: 'var(--color-text-main)', margin: 0 }}>Almodovar Group Gym</h4>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>Av. dels Rabassaires, 30, Mollet del Vallès</p>
                    </div>
                </div>
            </main>

            {showAttendees && (
                <ClassAttendeesModal
                    onClose={() => setShowAttendees(false)}
                    enrolled={enrolled}
                    capacity={capacity}
                    waitlistCount={isFull ? 2 : 0}
                    userStatus={'none'} // Mocked for now, will be dynamic in future or via props
                />
            )}
        </div>
    );
};
