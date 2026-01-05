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

    // In Coach View, we don't check "isBooked" because the coach manages the class
    const [showAttendees, setShowAttendees] = useState(false);
    const [showAttendanceList, setShowAttendanceList] = useState(false);
    const [showExerciseLibrary, setShowExerciseLibrary] = useState(false);
    const [showWODReport, setShowWODReport] = useState(false);
    const [wodExercises, setWodExercises] = useState<any[]>([]);

    const [activeSection, setActiveSection] = useState<'warmup' | 'wod' | 'cooldown'>('wod');
    const [showSuccess, setShowSuccess] = useState(false);

    const handleOpenLibrary = (section: 'warmup' | 'wod' | 'cooldown') => {
        setActiveSection(section);
        setShowExerciseLibrary(true);
    };

    // Extracted ExerciseCard to manage its own expansion state
    const ExerciseCard = ({ ex, onRemove, onUpdate }: { ex: any, onRemove: (id: number) => void, onUpdate: (id: number, field: string, value: any) => void }) => {
        const [isExpanded, setIsExpanded] = useState(false);

        const allFields = [
            { key: 'series', label: 'Series', icon: 'format_list_numbered' },
            { key: 'reps', label: 'Reps', icon: 'repeat_one' },
            { key: 'rounds', label: 'Vueltas', icon: 'repeat' },
            { key: 'minutes', label: 'Min', icon: 'timer' },
            { key: 'seconds', label: 'Seg', icon: 'timer_off' },
            { key: 'kcal', label: 'Kcal', icon: 'local_fire_department' },
        ];

        // Ensure we check for undefined to know if it's "active"
        const activeFields = allFields.filter(f => ex[f.key] !== undefined);
        const availableFields = allFields.filter(f => ex[f.key] === undefined);

        // Generate a compact summary string for the collapsed state
        const getSummary = () => {
            const parts = [];
            if (ex.series !== undefined) parts.push(`${ex.series || '-'} sets`);
            if (ex.reps !== undefined) parts.push(`${ex.reps || '-'} reps`);
            // Add other metrics if they exist
            if (ex.rounds) parts.push(`${ex.rounds} rnds`);
            if (ex.minutes) parts.push(`${ex.minutes}'`);
            if (ex.kcal) parts.push(`${ex.kcal} cal`);

            if (parts.length === 0) return 'Sin configuración';
            return parts.join(' • ');
        };

        return (
            <div style={{
                backgroundColor: 'var(--color-bg)',
                borderRadius: '0.75rem',
                border: '1px solid var(--color-border)',
                marginBottom: '0.75rem',
                overflow: 'hidden',
                transition: 'all 0.2s ease'
            }}>
                {/* Header (Always Visible) */}
                <div
                    onClick={() => setIsExpanded(!isExpanded)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.75rem',
                        cursor: 'pointer',
                        backgroundColor: isExpanded ? 'rgba(var(--color-primary-rgb), 0.05)' : 'transparent'
                    }}
                >
                    {/* Toggle Icon */}
                    <span className="material-icons-round" style={{
                        fontSize: '1.5rem',
                        color: 'var(--color-text-muted)',
                        transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s'
                    }}>
                        chevron_right
                    </span>

                    <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem', overflow: 'hidden', flexShrink: 0 }}>
                        {ex.image ? (
                            <img
                                src={ex.image}
                                alt={ex.name}
                                loading="lazy"
                                decoding="async"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span className="material-icons-round" style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)' }}>fitness_center</span>
                            </div>
                        )}
                    </div>

                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: 700, margin: 0 }}>{ex.name}</p>
                        {/* Summary when collapsed */}
                        {!isExpanded && (
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-primary)', margin: '2px 0 0 0', fontWeight: 600 }}>
                                {getSummary()}
                            </p>
                        )}
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove(ex.id);
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '0.25rem' }}
                    >
                        <span className="material-icons-round" style={{ fontSize: '1.25rem' }}>close</span>
                    </button>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                    <div style={{ padding: '0 0.75rem 0.75rem 0.75rem', animation: 'fadeIn 0.2s' }}>
                        <div style={{ height: '1px', backgroundColor: 'var(--color-border)', marginBottom: '0.75rem', opacity: 0.5 }}></div>

                        {/* Active Fields Grid */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            {activeFields.length === 0 && (
                                <p style={{ width: '100%', fontSize: '0.75rem', color: 'var(--color-text-muted)', fontStyle: 'italic', textAlign: 'center', margin: '0.5rem 0' }}>
                                    Selecciona métricas para configurar este ejercicio
                                </p>
                            )}

                            {activeFields.map(field => (
                                <div key={field.key} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: 'var(--color-surface)', padding: '0.25rem 0.5rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', flex: '1 1 30%' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', flex: 1 }}>
                                        <label style={{ fontSize: '0.5rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{field.label}</label>
                                        <input
                                            type="text"
                                            autoFocus={!ex[field.key] && ex[field.key] !== ''} // Autofocus if newly added (undefined -> '')
                                            value={ex[field.key] || ''}
                                            onChange={(e) => onUpdate(ex.id, field.key, e.target.value)}
                                            placeholder="-"
                                            style={{
                                                border: 'none', background: 'transparent', width: '100%', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-main)', padding: 0, outline: 'none', textAlign: 'center'
                                            }}
                                        />
                                    </div>
                                    <button
                                        onClick={() => onUpdate(ex.id, field.key, undefined)}
                                        style={{ border: 'none', background: 'none', color: '#ef4444', padding: '0.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                    >
                                        <span className="material-icons-round" style={{ fontSize: '0.875rem' }}>close</span>
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Add Metric Buttons */}
                        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem', scrollbarWidth: 'none' }}>
                            {availableFields.map(field => (
                                <button
                                    key={field.key}
                                    onClick={() => onUpdate(ex.id, field.key, '')}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.25rem',
                                        padding: '0.35rem 0.75rem', borderRadius: '99px',
                                        border: '1px dashed var(--color-border)', background: 'var(--color-surface)',
                                        fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-text-muted)',
                                        cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s'
                                    }}
                                >
                                    <span className="material-icons-round" style={{ fontSize: '0.875rem', color: 'var(--color-primary)' }}>add</span>
                                    {field.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const handleAddExercise = (exercise: any) => {
        // Allow adding same exercise multiple times
        const newEx = {
            ...exercise,
            id: Date.now(),
            section: activeSection,
            // ALL fields undefined by default as requested
            series: undefined, reps: undefined,
            rounds: undefined, minutes: undefined, seconds: undefined, kcal: undefined
        };
        setWodExercises([...wodExercises, newEx]);
        setShowExerciseLibrary(false);
    };

    const updatePrescription = (id: number, field: string, value: any) => {
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
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
    };

    const renderSection = (title: string, sectionKey: 'warmup' | 'wod' | 'cooldown', icon: string, color: string) => {
        const sectionExercises = wodExercises.filter(e => (e.section === sectionKey) || (!e.section && sectionKey === 'wod')); // Fallback for legacy data

        return (
            <div style={{ backgroundColor: 'var(--color-surface)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ padding: '0.4rem', borderRadius: '0.4rem', backgroundColor: `${color}20`, color: color }}>
                            <span className="material-icons-round" style={{ fontSize: '1.25rem' }}>{icon}</span>
                        </div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--color-text-main)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</h3>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{sectionExercises.length}</span>
                </div>

                {sectionExercises.length > 0 ? (
                    <div>
                        {sectionExercises.map(ex => (
                            <ExerciseCard
                                key={ex.id}
                                ex={ex}
                                onRemove={handleRemoveExercise}
                                onUpdate={updatePrescription}
                            />
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem', border: '1px dashed var(--color-border)', borderRadius: '0.5rem' }}>
                        Sin ejercicios
                    </div>
                )}

                <button
                    onClick={() => handleOpenLibrary(sectionKey)}
                    style={{
                        width: '100%', marginTop: '0.75rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                        padding: '0.75rem', borderRadius: '0.5rem',
                        backgroundColor: 'var(--color-bg)', color: 'var(--color-primary)',
                        border: '1px dashed var(--color-primary)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer'
                    }}
                >
                    <span className="material-icons-round" style={{ fontSize: '1.25rem' }}>add</span>
                    Añadir a {title}
                </button>
            </div>
        );
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
                gap: '1rem',
                maxWidth: '480px',
                margin: '0 auto',
                width: '100%'
            }}>
                {/* Hero Image */}
                <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '10rem', // Reduced height slightly
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
                    <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '1rem' }}>
                        <span style={{
                            display: 'inline-block',
                            padding: '0.2rem 0.6rem',
                            marginBottom: '0.25rem',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            color: 'white',
                            textTransform: 'uppercase',
                            backgroundColor: 'var(--color-primary)',
                            borderRadius: '9999px',
                            letterSpacing: '0.05em'
                        }}>
                            Alta Intensidad
                        </span>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', lineHeight: 1.1, margin: 0 }}>{classData.title}</h2>
                    </div>
                </div>

                {/* Info Grid & Attendance Actions */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                    <div style={{ backgroundColor: 'var(--color-surface)', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                        <span className="material-icons-round" style={{ fontSize: '1.25rem', color: 'var(--color-primary)' }}>calendar_today</span>
                        <p style={{ fontWeight: 700, fontSize: '0.8rem', margin: '0.2rem 0' }}>{classData.date}</p>
                    </div>
                    <div style={{ backgroundColor: 'var(--color-surface)', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid var(--color-border)', textAlign: 'center', cursor: 'pointer' }} onClick={() => setShowAttendanceList(true)}>
                        <span className="material-icons-round" style={{ fontSize: '1.25rem', color: 'var(--color-primary)' }}>checklist</span>
                        <p style={{ fontWeight: 700, fontSize: '0.8rem', margin: '0.2rem 0' }}>Lista</p>
                    </div>
                    <div style={{ backgroundColor: 'var(--color-surface)', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid var(--color-border)', textAlign: 'center', cursor: 'pointer' }} onClick={() => alert('Próximamente')}>
                        <span className="material-icons-round" style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)' }}>edit</span>
                        <p style={{ fontWeight: 700, fontSize: '0.8rem', margin: '0.2rem 0', color: 'var(--color-text-muted)' }}>Editar</p>
                    </div>
                </div>

                {/* --- MODULES --- */}

                {renderSection('Calentamiento (Warm Up)', 'warmup', 'local_fire_department', '#f59e0b')}

                {renderSection('Sesión Central (WOD)', 'wod', 'fitness_center', '#ef4444')}

                {renderSection('Vuelta a la calma (Cool Down)', 'cooldown', 'ac_unit', '#3b82f6')}

                {/* ---------------- */}

                {wodExercises.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                        <button
                            onClick={handleSaveWOD}
                            style={{
                                flex: 1, // Symmetric
                                backgroundColor: '#22c55e',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.75rem',
                                padding: '1rem',
                                fontWeight: 800,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)'
                            }}
                        >
                            <span className="material-icons-round" style={{ fontSize: '1.5rem' }}>save</span>
                            <span>Guardar</span>
                        </button>

                        <button
                            onClick={() => setShowWODReport(true)}
                            style={{
                                flex: 1, // Symmetric
                                backgroundColor: '#fff', // White background as requested
                                color: '#111', // Force dark text for visibility on white bg
                                border: '1px solid var(--color-border)',
                                borderRadius: '0.75rem',
                                padding: '1rem',
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                            }}
                        >
                            <span className="material-icons-round" style={{ fontSize: '1.5rem' }}>description</span>
                            <span>Generar Informe sesión</span>
                        </button>
                    </div>
                )}
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
            {showSuccess && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.2s ease-out'
                }}>
                    <div style={{
                        backgroundColor: 'var(--color-surface)', borderRadius: '1.5rem', padding: '2rem',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        transform: 'scale(1)', animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}>
                        <div style={{
                            width: '4rem', height: '4rem', borderRadius: '50%', backgroundColor: '#22c55e', color: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem'
                        }}>
                            <span className="material-icons-round" style={{ fontSize: '2.5rem' }}>check</span>
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>¡WOD Guardado!</h3>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>La clase ha sido actualizada</p>
                    </div>
                </div>
            )}

            <style>{`
                 @keyframes popIn {
                    from { transform: scale(0.8); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
};
