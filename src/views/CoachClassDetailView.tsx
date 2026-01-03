import React, { useState } from 'react';
import { ClassAttendeesModal } from '../components/ClassAttendeesModal';
import { AttendanceView } from './AttendanceView';
import { ExerciseLibraryView } from './ExerciseLibraryView';
import { WODReportView } from './WODReportView';

interface CoachClassDetailViewProps {
    classData: any;
    onBack: () => void;
}

export const CoachClassDetailView: React.FC<CoachClassDetailViewProps> = ({ classData, onBack }) => {
    // Default values if data is missing
    const enrolledCount = classData.enrolled ?? 8;
    const capacity = classData.capacity ?? 10;

    // Logic: If more enrolled than capacity, difference is waitlist
    const enrolled = Math.min(enrolledCount, capacity);
    const waitlist = Math.max(0, enrolledCount - capacity);

    const isFull = enrolledCount >= capacity;

    // In Coach View, we don't check "isBooked" because the coach manages the class
    const [showAttendees, setShowAttendees] = useState(false);
    const [showAttendanceList, setShowAttendanceList] = useState(false);
    const [showExerciseLibrary, setShowExerciseLibrary] = useState(false);
    const [showWODReport, setShowWODReport] = useState(false);
    const [wodExercises, setWodExercises] = useState<any[]>([]);

    const handleAddExercise = (exercise: any) => {
        if (!wodExercises.find(e => e.id === exercise.id)) {
            setWodExercises([...wodExercises, { ...exercise, series: '', reps: '' }]);
        }
        setShowExerciseLibrary(false);
    };

    const updatePrescription = (id: number, field: 'series' | 'reps', value: string) => {
        setWodExercises(wodExercises.map(ex =>
            ex.id === id ? { ...ex, [field]: value } : ex
        ));
    };

    const handleRemoveExercise = (id: number) => {
        setWodExercises(wodExercises.filter(e => e.id !== id));
    };

    // Persistence logic for the mock app
    const storageKey = `wod_${classData.title}_${classData.date}`;

    React.useEffect(() => {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            setWodExercises(JSON.parse(saved));
        }
    }, [storageKey]);

    const handleSaveWOD = () => {
        localStorage.setItem(storageKey, JSON.stringify(wodExercises));
        alert('Planificación guardada con éxito. Ahora es visible para los usuarios.');
    };

    if (showWODReport) {
        return <WODReportView
            classData={classData}
            wodExercises={wodExercises}
            onBack={() => setShowWODReport(false)}
        />;
    }

    if (showAttendanceList) {
        return <AttendanceView classData={classData} onBack={() => setShowAttendanceList(false)} />;
    }

    if (showExerciseLibrary) {
        return <ExerciseLibraryView
            onBack={() => setShowExerciseLibrary(false)}
            onSelect={handleAddExercise}
        />;
    }

    return (
        <div style={{
            height: '100dvh',
            backgroundColor: 'var(--color-bg)',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '480px',
            zIndex: 2000,
            overflowY: 'auto',
            color: 'var(--color-text-main)',
            boxShadow: '0 0 20px rgba(0,0,0,0.5)'
        }}>
            {/* Header */}
            <header style={{
                position: 'fixed',
                top: 0,
                width: '100%',
                maxWidth: '480px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 2010,
                backgroundColor: 'rgba(var(--color-surface-rgb), 0.9)',
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
                <h1 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text-main)' }}>Gestionar Clase</h1>
                <div style={{ width: '2.5rem' }}></div>
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

                    {/* Coach Card - Highlighting "You are the coach" */}
                    <div style={{
                        backgroundColor: 'rgba(59, 130, 246, 0.1)', // Blue hint
                        padding: '1rem',
                        borderRadius: '0.75rem',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
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
                            border: '2px solid #3b82f6',
                        }}>
                            {/* Use coach image from props or context ideally, but reusing classData.image as fallback layout */}
                            <img src={classData.coachImage || "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=150"} alt="Coach" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: '#3b82f6', letterSpacing: '0.05em' }}>Tú eres el Coach</p>
                        <p style={{ fontWeight: 600, color: 'var(--color-text-main)', marginTop: '0.25rem' }}>{classData.coach}</p>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Gestionar</p>
                    </div>
                </div>

                {/* Management Actions */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <button
                        onClick={() => setShowAttendanceList(true)}
                        style={{
                            backgroundColor: 'var(--color-primary)',
                            color: 'white',
                            padding: '1rem',
                            borderRadius: '0.75rem',
                            border: 'none',
                            fontWeight: 700,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(211, 0, 31, 0.3)'
                        }}
                    >
                        <span className="material-icons-round" style={{ fontSize: '2rem' }}>checklist</span>
                        <span>Pasar Lista</span>
                    </button>

                    <button
                        onClick={() => alert('Próximamente: Editar Clase')}
                        style={{
                            backgroundColor: 'var(--color-surface)',
                            color: 'var(--color-text-main)',
                            padding: '1rem',
                            borderRadius: '0.75rem',
                            border: '1px solid var(--color-border)',
                            fontWeight: 700,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer',
                        }}
                    >
                        <span className="material-icons-round" style={{ fontSize: '2rem', color: 'var(--color-text-muted)' }}>edit</span>
                        <span>Editar Clase</span>
                    </button>
                </div>


                {/* Availability - Read Only */}
                <div
                    onClick={() => setShowAttendees(true)}
                    style={{
                        backgroundColor: 'var(--color-surface)',
                        padding: '1.25rem',
                        borderRadius: '0.75rem',
                        border: '1px solid var(--color-border)',
                        cursor: 'pointer'
                    }}
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
                                Ocupación
                            </h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>Estado del aforo</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>{enrolled}</span>
                            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>/ {capacity}</span>
                        </div>
                    </div>
                    <div style={{ width: '100%', backgroundColor: 'var(--color-bg)', borderRadius: '9999px', height: '0.75rem', overflow: 'hidden', marginBottom: '1rem' }}>
                        <div style={{ width: `${(enrolled / capacity) * 100}%`, backgroundColor: isFull ? '#f97316' : 'var(--color-primary)', height: '100%', borderRadius: '9999px' }}></div>
                    </div>
                    {waitlist > 0 && (
                        <div style={{ fontSize: '0.75rem', color: '#f97316', fontWeight: 600, marginBottom: '0.5rem' }}>
                            +{waitlist} en lista de espera
                        </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', color: 'var(--color-primary)', fontWeight: 600 }}>Ver asistentes</span>
                        <span className="material-icons-round" style={{ fontSize: '1rem', color: 'var(--color-primary)' }}>arrow_forward</span>
                    </div>
                </div>

                {/* About */}
                <div style={{ backgroundColor: 'var(--color-surface)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0, color: 'var(--color-text-main)' }}>Planificación (WOD)</h3>
                        {wodExercises.length > 0 && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 600 }}>{wodExercises.length} ejercicios</span>
                        )}
                    </div>

                    {wodExercises.length === 0 ? (
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '1rem' }}>
                            <strong>Warm-up:</strong> 5' Joint mobility + 5' Skipping<br />
                            <strong>Skill:</strong> Snatch technique (15')<br />
                            <strong>WOD:</strong> Aún no se han añadido ejercicios personalizados.
                        </p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                            {wodExercises.map(ex => (
                                <div key={ex.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    backgroundColor: 'var(--color-bg)',
                                    padding: '0.75rem',
                                    borderRadius: '0.75rem',
                                    border: '1px solid var(--color-border)'
                                }}>
                                    <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem', overflow: 'hidden', flexShrink: 0 }}>
                                        {ex.image ? (
                                            <img src={ex.image} alt={ex.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <span className="material-icons-round" style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)' }}>fitness_center</span>
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: '0.875rem', fontWeight: 700, margin: 0 }}>{ex.name}</p>
                                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <input
                                                    type="text"
                                                    placeholder="S"
                                                    value={ex.series}
                                                    onChange={(e) => updatePrescription(ex.id, 'series', e.target.value)}
                                                    style={{ width: '1.75rem', fontSize: '0.75rem', padding: '0.125rem', textAlign: 'center', border: '1px solid var(--color-border)', borderRadius: '0.25rem', backgroundColor: 'var(--color-surface)' }}
                                                />
                                                <span style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)' }}>ser.</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <input
                                                    type="text"
                                                    placeholder="R"
                                                    value={ex.reps}
                                                    onChange={(e) => updatePrescription(ex.id, 'reps', e.target.value)}
                                                    style={{ width: '2.5rem', fontSize: '0.75rem', padding: '0.125rem', textAlign: 'center', border: '1px solid var(--color-border)', borderRadius: '0.25rem', backgroundColor: 'var(--color-surface)' }}
                                                />
                                                <span style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)' }}>reps</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveExercise(ex.id)}
                                        style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '0.25rem' }}
                                    >
                                        <span className="material-icons-round" style={{ fontSize: '1.25rem' }}>close</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {wodExercises.length > 0 && (
                        <button
                            onClick={() => setShowWODReport(true)}
                            style={{
                                width: '100%',
                                backgroundColor: 'var(--color-text-main)',
                                color: 'var(--color-bg)',
                                border: 'none',
                                borderRadius: '0.75rem',
                                padding: '0.75rem',
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                cursor: 'pointer',
                                marginBottom: '1rem',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                        >
                            <span className="material-icons-round" style={{ fontSize: '1.25rem' }}>description</span>
                            <span>Generar Informe WOD</span>
                        </button>
                    )}

                    {wodExercises.length > 0 && (
                        <button
                            onClick={handleSaveWOD}
                            style={{
                                width: '100%',
                                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                                color: '#22c55e',
                                border: '1px solid #22c55e',
                                borderRadius: '0.75rem',
                                padding: '0.75rem',
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                cursor: 'pointer',
                                marginBottom: '1rem'
                            }}
                        >
                            <span className="material-icons-round" style={{ fontSize: '1.25rem' }}>save</span>
                            <span>Guardar Planificación</span>
                        </button>
                    )}

                    <button
                        onClick={() => setShowExerciseLibrary(true)}
                        className="premium-add-button"
                        style={{
                            width: '100%',
                            backgroundColor: 'rgba(var(--color-primary-rgb), 0.03)',
                            color: 'var(--color-primary)',
                            border: '2px dashed rgba(var(--color-primary-rgb), 0.3)',
                            borderRadius: '1.25rem',
                            padding: '1.25rem',
                            fontWeight: 800,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            cursor: 'pointer',
                            marginTop: '1.5rem',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{
                            width: '3rem',
                            height: '3rem',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-primary)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 16px rgba(var(--color-primary-rgb), 0.3)',
                            marginBottom: '0.25rem'
                        }}>
                            <span className="material-icons-round" style={{ fontSize: '1.75rem' }}>add</span>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <span style={{ display: 'block', fontSize: '1rem', letterSpacing: '-0.01em' }}>Personalizar WOD</span>
                            <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 500, opacity: 0.7, marginTop: '2px' }}>Añadir movimientos de la biblioteca</span>
                        </div>
                    </button>
                </div>

            </main>

            {showAttendees && (
                <ClassAttendeesModal
                    onClose={() => setShowAttendees(false)}
                    enrolled={enrolled}
                    capacity={capacity}
                    waitlistCount={waitlist}
                    userStatus={'none'} // Coach view doesn't imply user status
                />
            )}
        </div>
    );
};
