import React from 'react';
import logo from '../assets/logo.png';

interface WODReportViewProps {
    classData: any;
    wodExercises: any[];
    onBack: () => void;
}

export const WODReportView: React.FC<WODReportViewProps> = ({ classData, wodExercises, onBack }) => {
    return (
        <div style={{
            height: '100dvh',
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '480px',
            zIndex: 5000,
            color: '#1a1a1a',
            overflowY: 'auto'
        }}>
            {/* Premium Header */}
            <header style={{
                backgroundColor: '#1a1a1a',
                color: 'white',
                padding: '3rem 1.5rem 2rem 1.5rem',
                position: 'relative',
                textAlign: 'center'
            }}>
                <button
                    onClick={onBack}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        left: '1rem',
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        color: 'white',
                        padding: '0.5rem',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <span className="material-icons-round">close</span>
                </button>

                <div style={{ marginBottom: '1rem' }}>
                    <img src={logo} alt="Almodovar Box Logo" style={{ height: '3.5rem', marginBottom: '1rem', objectFit: 'contain' }} />
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '0.1em', margin: 0, color: 'var(--color-primary)' }}>ALMODOVAR BOX</h1>
                    <p style={{ fontSize: '0.75rem', fontWeight: 500, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.2em', margin: '0.25rem 0 0 0' }}>Training Session Report</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>{classData.title}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '0.5rem', fontSize: '0.875rem', opacity: 0.8 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <span className="material-icons-round" style={{ fontSize: '1rem' }}>calendar_today</span>
                            {classData.date}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <span className="material-icons-round" style={{ fontSize: '1rem' }}>schedule</span>
                            {classData.time}
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <div style={{ width: '1.5rem', height: '1.5rem', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--color-primary)' }}>
                            <img src={classData.coachImage || "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=150"} alt="Coach" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Coach {classData.coach}</span>
                    </div>
                </div>

                {/* Decorative element */}
                <div style={{ position: 'absolute', bottom: '-1px', left: 0, width: '100%', height: '2rem', background: 'white', clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}></div>
            </header>

            {/* WOD Content */}
            <main style={{ padding: '2rem 1.5rem', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <div style={{ height: '2px', backgroundColor: 'var(--color-primary)', flex: 1 }}></div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Programación WOD</h3>
                    <div style={{ height: '2px', backgroundColor: 'var(--color-primary)', flex: 1 }}></div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {wodExercises.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem 0', color: '#999' }}>
                            <span className="material-icons-round" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>fitness_center</span>
                            <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>La planificación para esta sesión aún no ha sido publicada.</p>
                        </div>
                    ) : (
                        wodExercises.map((ex, index) => (
                            <div key={ex.id} style={{ display: 'flex', gap: '1rem', borderBottom: index === wodExercises.length - 1 ? 'none' : '1px solid #f0f0f0', paddingBottom: '1.5rem' }}>
                                <div style={{
                                    width: '3.5rem',
                                    height: '3.5rem',
                                    backgroundColor: '#f8f8f8',
                                    borderRadius: '0.75rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    fontWeight: 900,
                                    fontSize: '1.25rem',
                                    color: '#ddd'
                                }}>
                                    {String(index + 1).padStart(2, '0')}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>{ex.name}</h4>
                                        <span style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-primary)', padding: '0.125rem 0.5rem', backgroundColor: 'rgba(var(--color-primary-rgb), 0.1)', borderRadius: '0.25rem' }}>{ex.category}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: '0.625rem', fontWeight: 600, color: '#999', textTransform: 'uppercase' }}>Series</span>
                                            <span style={{ fontSize: '1.25rem', fontWeight: 900 }}>{ex.series || '-'}</span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: '0.625rem', fontWeight: 600, color: '#999', textTransform: 'uppercase' }}>Repeticiones</span>
                                            <span style={{ fontSize: '1.25rem', fontWeight: 900 }}>{ex.reps || '-'}</span>
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem', fontStyle: 'italic' }}>{ex.description}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer Quote / Branding */}
                <div style={{ marginTop: '3rem', textAlign: 'center', padding: '2rem', backgroundColor: '#fdfdfd', borderRadius: '1rem', border: '1px dashed #eee' }}>
                    <p style={{ fontSize: '0.875rem', color: '#999', margin: 0, fontStyle: 'italic' }}>"No pain, no gain. Let's crush this session!"</p>
                    <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }}></div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em' }}>ALMODOVAR BOX</span>
                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }}></div>
                    </div>
                </div>
            </main>

            {/* Actions */}
            <div style={{ padding: '1.5rem', borderTop: '1px solid #f0f0f0', backgroundColor: 'white', display: 'flex', gap: '1rem' }}>
                <button
                    onClick={() => {
                        alert('Compartiendo informe...');
                        // In a real app, this could use the Web Share API
                    }}
                    style={{
                        flex: 1,
                        backgroundColor: 'var(--color-primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.75rem',
                        padding: '1rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(var(--color-primary-rgb), 0.3)'
                    }}
                >
                    <span className="material-icons-round">share</span>
                    Compartir
                </button>
                <button
                    onClick={onBack}
                    style={{
                        padding: '1rem',
                        backgroundColor: '#f0f0f0',
                        color: '#666',
                        border: 'none',
                        borderRadius: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                    }}
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
};
