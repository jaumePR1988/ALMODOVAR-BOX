import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export const RetosView: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const [filter, setFilter] = useState<'activos' | 'completados' | 'nuevos'>('activos');

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--color-bg)' }}>
            {/* Header */}
            <header style={{
                position: 'sticky',
                top: 0,
                zIndex: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.25rem 1.5rem',
                backgroundColor: 'var(--color-surface)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid var(--color-border)',
                maxHeight: '4.5rem' // Match MainLayout height
            }}>
                <div>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.025em', color: 'var(--color-text-main)', margin: 0 }}>Mis Desafíos</h1>
                    <p style={{ fontSize: '10px', color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.125rem', margin: 0 }}>Almodovar Group</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {/* Theme Toggle Button (Requested) */}
                    <button
                        onClick={toggleTheme}
                        style={{
                            width: '2.5rem',
                            height: '2.5rem',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-bg)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--color-text-main)'
                        }}
                    >
                        <span className="material-icons-round" style={{ fontSize: '1.25rem' }}>
                            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                        </span>
                    </button>
                    <button style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-bg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: 'none',
                        cursor: 'pointer'
                    }}>
                        <span className="material-icons-round" style={{ fontSize: '1.5rem', color: 'var(--color-text-main)' }}>filter_list</span>
                    </button>
                </div>
            </header>

            {/* Filter Tabs */}
            <div style={{
                width: '100%',
                overflowX: 'auto',
                padding: '1rem 1.5rem 0.5rem 1.5rem',
                backgroundColor: 'transparent',
                display: 'flex',
                gap: '0.75rem'
            }} className="hide-scrollbar">
                <button
                    onClick={() => setFilter('activos')}
                    style={{
                        height: '2.25rem',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        borderRadius: '4px',
                        backgroundColor: filter === 'activos' ? 'var(--color-primary)' : 'var(--color-surface)',
                        padding: '0 1.25rem',
                        border: filter === 'activos' ? 'none' : '1px solid var(--color-border)',
                        boxShadow: filter === 'activos' ? '0 4px 6px rgba(211,0,31,0.2)' : 'none',
                        transition: 'transform 0.1s',
                        cursor: 'pointer'
                    }}
                >
                    <span style={{ color: filter === 'activos' ? 'white' : 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Activos</span>
                </button>
                <button
                    onClick={() => setFilter('completados')}
                    style={{
                        height: '2.25rem',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        borderRadius: '4px',
                        backgroundColor: filter === 'completados' ? 'var(--color-primary)' : 'var(--color-surface)',
                        padding: '0 1.25rem',
                        border: filter === 'completados' ? 'none' : '1px solid var(--color-border)',
                        color: filter === 'completados' ? 'white' : 'var(--color-text-muted)',
                        cursor: 'pointer'
                    }}
                >
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'inherit' }}>Completados</span>
                </button>
                <button
                    onClick={() => setFilter('nuevos')}
                    style={{
                        height: '2.25rem',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        borderRadius: '4px',
                        backgroundColor: filter === 'nuevos' ? 'var(--color-primary)' : 'var(--color-surface)',
                        padding: '0 1.25rem',
                        border: filter === 'nuevos' ? 'none' : '1px solid var(--color-border)',
                        color: filter === 'nuevos' ? 'white' : 'var(--color-text-muted)',
                        cursor: 'pointer'
                    }}
                >
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'inherit' }}>Nuevos</span>
                </button>
            </div>

            {/* List */}
            <div style={{ flex: 1, padding: '1rem 1.5rem 6rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto' }}>
                {/* Active Challenge Card */}
                {(filter === 'activos' || filter === 'nuevos') && (
                    <article style={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        borderRadius: '0.5rem',
                        backgroundColor: 'var(--color-surface)',
                        padding: '1.25rem',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
                        borderLeft: '4px solid var(--color-primary)',
                        transition: 'transform 0.1s'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                                <div style={{
                                    width: '4rem',
                                    height: '4rem',
                                    flexShrink: 0,
                                    overflow: 'hidden',
                                    borderRadius: '0.375rem',
                                    backgroundImage: "url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=200')",
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)'
                                }}></div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                        <span style={{
                                            borderRadius: '0.125rem',
                                            backgroundColor: 'var(--color-bg)',
                                            padding: '0.125rem 0.5rem',
                                            fontSize: '10px',
                                            fontWeight: 700,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            color: 'var(--color-text-muted)'
                                        }}>Alta Intensidad</span>
                                        <span className="material-icons-round" style={{ fontSize: '1.125rem', color: 'var(--color-text-muted)' }}>more_horiz</span>
                                    </div>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: 800, lineHeight: 1.25, color: 'var(--color-text-main)', textTransform: 'uppercase', margin: 0 }}>Reto de Sentadillas</h3>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-text-muted)', marginTop: '0.25rem', margin: 0 }}>Finaliza: 30 Octubre</p>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', margin: 0 }}>Progreso actual</p>
                                <p style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-text-main)', letterSpacing: '-0.025em', margin: 0 }}>75<span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500, marginLeft: '0.25rem' }}>/ 100</span></p>
                            </div>
                            <div style={{ height: '0.5rem', width: '100%', borderRadius: '9999px', backgroundColor: 'var(--color-bg)', overflow: 'hidden' }}>
                                <div style={{ height: '100%', borderRadius: '9999px', backgroundColor: 'var(--color-primary)', width: '75%', transition: 'width 0.5s ease-out' }}></div>
                            </div>
                            <p style={{ fontSize: '10px', color: 'var(--color-text-muted)', textAlign: 'right', fontWeight: 600, textTransform: 'uppercase', margin: 0 }}>¡Top 10% del ranking!</p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', marginTop: '0.25rem', borderTop: '1px solid var(--color-border)' }}>
                            <div style={{ display: 'flex', marginLeft: '0.5rem' }}>
                                {[1, 2, 3].map(i => (
                                    <div key={i} style={{ width: '2rem', height: '2rem', borderRadius: '50%', border: '2px solid var(--color-surface)', backgroundColor: '#ddd', marginLeft: '-0.5rem', backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 20})`, backgroundSize: 'cover' }}></div>
                                ))}
                                <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', border: '2px solid var(--color-surface)', backgroundColor: 'var(--color-text-main)', marginLeft: '-0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700, color: 'var(--color-surface)' }}>+12</div>
                            </div>
                            <button style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                borderRadius: '0.125rem',
                                backgroundColor: 'var(--color-primary)',
                                padding: '0.5rem 1rem',
                                fontSize: '10px',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                color: 'white',
                                border: 'none',
                                boxShadow: '0 4px 6px rgba(211,0,31,0.2)',
                                cursor: 'pointer'
                            }}>
                                <span className="material-icons-round" style={{ fontSize: '1rem' }}>add</span>
                                Registrar
                            </button>
                        </div>
                    </article>
                )}

                {/* 5k Challenge Card */}
                {(filter === 'activos' || filter === 'completados') && (
                    <article style={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        borderRadius: '0.5rem',
                        backgroundColor: 'var(--color-surface)',
                        padding: '1.25rem',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
                        borderLeft: '4px solid var(--color-text-muted)',
                        transition: 'transform 0.1s'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                                <div style={{
                                    width: '4rem',
                                    height: '4rem',
                                    flexShrink: 0,
                                    overflow: 'hidden',
                                    borderRadius: '0.375rem',
                                    backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200')",
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
                                    filter: 'grayscale(0.3)'
                                }}></div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                        <span style={{
                                            borderRadius: '0.125rem',
                                            backgroundColor: 'var(--color-bg)',
                                            padding: '0.125rem 0.5rem',
                                            fontSize: '10px',
                                            fontWeight: 700,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            color: 'var(--color-text-muted)'
                                        }}>Cardio</span>
                                        <span className="material-icons-round" style={{ fontSize: '1.125rem', color: 'var(--color-text-muted)' }}>more_horiz</span>
                                    </div>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: 800, lineHeight: 1.25, color: 'var(--color-text-main)', textTransform: 'uppercase', margin: 0 }}>5k Diario</h3>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-text-muted)', marginTop: '0.25rem', margin: 0 }}>Finaliza: 15 Noviembre</p>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', margin: 0 }}>Km recorridos</p>
                                <p style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-text-main)', letterSpacing: '-0.025em', margin: 0 }}>1.2<span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500, marginLeft: '0.25rem' }}>/ 5 km</span></p>
                            </div>
                            <div style={{ height: '0.5rem', width: '100%', borderRadius: '9999px', backgroundColor: 'var(--color-bg)', overflow: 'hidden' }}>
                                <div style={{ height: '100%', borderRadius: '9999px', backgroundColor: 'var(--color-text-muted)', width: '24%', transition: 'width 0.5s ease-out' }}></div>
                            </div>
                            <p style={{ fontSize: '10px', color: 'var(--color-text-muted)', textAlign: 'right', fontWeight: 600, textTransform: 'uppercase', margin: 0 }}>¡Tú puedes!</p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', marginTop: '0.25rem', borderTop: '1px solid var(--color-border)' }}>
                            <p style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: 500, fontStyle: 'italic', margin: 0 }}>Actualizado hace 2h</p>
                            <button style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                borderRadius: '0.125rem',
                                backgroundColor: 'var(--color-bg)',
                                padding: '0.5rem 1rem',
                                fontSize: '10px',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                color: 'var(--color-text-main)',
                                border: '1px solid var(--color-border)',
                                cursor: 'pointer'
                            }}>
                                Ver Detalles
                            </button>
                        </div>
                    </article>
                )}

                {/* Dark New Challenge Card */}
                {(filter === 'nuevos' || filter === 'activos') && (
                    <article style={{
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: '0.5rem',
                        backgroundColor: '#111',
                        padding: '1.5rem',
                        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                        color: 'white',
                        border: '1px solid #333'
                    }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '0.25rem', height: '100%', backgroundColor: 'var(--color-primary)' }}></div>
                        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-primary)' }}>Nuevo Reto</span>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.025em', margin: 0 }}>Yoga al Amanecer</h3>
                                </div>
                                <div style={{ height: '2.5rem', width: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }}>
                                    <span className="material-icons-round">self_improvement</span>
                                </div>
                            </div>
                            <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.6, fontWeight: 500, margin: 0 }}>
                                Únete a 30 días de mindfulness y flexibilidad. Perfecto para comenzar tus mañanas con energía positiva.
                            </p>
                            <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ display: 'flex', marginLeft: '0.5rem' }}>
                                        {[1, 2].map(i => (
                                            <div key={i} style={{ width: '1.5rem', height: '1.5rem', borderRadius: '50%', border: '1px solid black', backgroundColor: '#555', marginLeft: '-0.5rem', backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 40})`, backgroundSize: 'cover' }}></div>
                                        ))}
                                    </div>
                                    <span style={{ fontSize: '10px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>+45 Participantes</span>
                                </div>
                                <button style={{
                                    borderRadius: '0.125rem',
                                    backgroundColor: 'white',
                                    padding: '0.5rem 1.25rem',
                                    fontSize: '10px',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    color: 'black',
                                    border: 'none',
                                    cursor: 'pointer',
                                    boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)'
                                }}>
                                    Unirse
                                </button>
                            </div>
                        </div>
                    </article>
                )}
            </div>
        </div>
    );
};
