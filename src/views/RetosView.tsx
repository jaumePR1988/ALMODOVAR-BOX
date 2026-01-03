import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface Challenge {
    id: string;
    type: 'activos' | 'completados' | 'nuevos';
    category: 'Alta Intensidad' | 'Cardio' | 'Nuevo Reto' | 'Fuerza';
    title: string;
    endDate?: string;
    description?: string;
    progress?: number;
    total?: number;
    unit?: string; // e.g. 'km' or ''
    participants?: number;
    image: string;
    isDark?: boolean; // For the 'New' card style
}

export const RetosView: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const [filter, setFilter] = useState<'activos' | 'completados' | 'nuevos'>('activos');

    const challenges: Challenge[] = [
        {
            id: '1',
            type: 'activos',
            category: 'Alta Intensidad',
            title: 'Reto de Sentadillas',
            endDate: '30 Octubre',
            progress: 75,
            total: 100,
            unit: '',
            image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=200"
        },
        {
            id: '2',
            type: 'activos',
            category: 'Cardio',
            title: '5k Diario',
            endDate: '15 Noviembre',
            progress: 1.2,
            total: 5,
            unit: 'km',
            image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200"
        },
        {
            id: '3',
            type: 'nuevos',
            category: 'Nuevo Reto',
            title: 'Yoga al Amanecer',
            description: 'Únete a 30 días de mindfulness y flexibilidad. Perfecto para comenzar tus mañanas con energía positiva.',
            participants: 45,
            isDark: true,
            image: ''
        },
        // Adding more mock data to ensure 'Activos' list looks fuller
        {
            id: '4',
            type: 'activos',
            category: 'Fuerza',
            title: 'Push-up Challenge',
            endDate: '20 Noviembre',
            progress: 150,
            total: 500,
            unit: '',
            image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=200"
        }
    ];

    const filteredChallenges = challenges.filter(c => c.type === filter);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', backgroundColor: 'var(--color-bg)' }}>
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
                height: '4.5rem'
            }}>
                <div>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.025em', color: 'var(--color-text-main)', margin: 0 }}>Mis Desafíos</h1>
                    <p style={{ fontSize: '10px', color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.125rem', margin: 0 }}>Almodovar Group</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {/* Theme Toggle Button */}
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
                    {/* Filter Icon Removed */}
                </div>
            </header>

            {/* Filter Tabs */}
            <div style={{
                width: '100%',
                overflowX: 'auto',
                padding: '1rem 1.5rem 0.5rem 1.5rem',
                backgroundColor: 'transparent',
                display: 'flex',
                gap: '0.75rem',
                position: 'sticky',
                top: '4.5rem',
                zIndex: 19,
                background: 'var(--color-bg)' // Solid bg to hide scroll overlap
            }} className="hide-scrollbar">
                {(['activos', 'completados', 'nuevos'] as const).map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            flex: 1, // Equal width
                            height: '2.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            borderRadius: '4px',
                            backgroundColor: filter === f ? 'var(--color-primary)' : 'var(--color-surface)',
                            padding: '0 0.5rem', // Reduced padding slightly for small screens
                            border: filter === f ? '1px solid var(--color-primary)' : '1px solid var(--color-border)', // Constant border width
                            boxShadow: filter === f ? '0 4px 6px rgba(211,0,31,0.2)' : 'none',
                            transition: 'all 0.2s',
                            cursor: 'pointer',
                            color: filter === f ? 'white' : 'var(--color-text-muted)'
                        }}
                    >
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'inherit', width: '100%', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f}</span>
                    </button>
                ))}
            </div>

            {/* List */}
            <div style={{ padding: '1rem 1.5rem 8rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {filteredChallenges.map(challenge => (
                    challenge.isDark ? (
                        // Dark New Challenge Card Style
                        <article key={challenge.id} style={{
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
                                        <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-primary)' }}>{challenge.category}</span>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.025em', margin: 0 }}>{challenge.title}</h3>
                                    </div>
                                    <div style={{ height: '2.5rem', width: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }}>
                                        <span className="material-icons-round">self_improvement</span>
                                    </div>
                                </div>
                                <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.6, fontWeight: 500, margin: 0 }}>
                                    {challenge.description}
                                </p>
                                <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{ display: 'flex', marginLeft: '0.5rem' }}>
                                            {[1, 2].map(i => (
                                                <div key={i} style={{ width: '1.5rem', height: '1.5rem', borderRadius: '50%', border: '1px solid black', backgroundColor: '#555', marginLeft: '-0.5rem', backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 40})`, backgroundSize: 'cover' }}></div>
                                            ))}
                                        </div>
                                        <span style={{ fontSize: '10px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>+{challenge.participants} Participantes</span>
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
                    ) : (
                        // Standard Active/Completed Card Style
                        <article key={challenge.id} style={{
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            borderRadius: '0.5rem',
                            backgroundColor: 'var(--color-surface)',
                            padding: '1.25rem',
                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
                            borderLeft: `4px solid ${challenge.type === 'activos' ? 'var(--color-primary)' : 'var(--color-text-muted)'}`,
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
                                        backgroundImage: `url('${challenge.image}')`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
                                        filter: challenge.type === 'activos' ? 'none' : 'grayscale(100%)'
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
                                            }}>{challenge.category}</span>
                                            <span className="material-icons-round" style={{ fontSize: '1.125rem', color: 'var(--color-text-muted)' }}>more_horiz</span>
                                        </div>
                                        <h3 style={{ fontSize: '1.125rem', fontWeight: 800, lineHeight: 1.25, color: 'var(--color-text-main)', textTransform: 'uppercase', margin: 0 }}>{challenge.title}</h3>
                                        <p style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-text-muted)', marginTop: '0.25rem', margin: 0 }}>Finaliza: {challenge.endDate}</p>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', margin: 0 }}>Progreso actual</p>
                                    <p style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-text-main)', letterSpacing: '-0.025em', margin: 0 }}>{challenge.progress}<span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500, marginLeft: '0.25rem' }}>/ {challenge.total} {challenge.unit}</span></p>
                                </div>
                                <div style={{ height: '0.5rem', width: '100%', borderRadius: '9999px', backgroundColor: 'var(--color-bg)', overflow: 'hidden' }}>
                                    <div style={{
                                        height: '100%',
                                        borderRadius: '9999px',
                                        backgroundColor: challenge.type === 'activos' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                        width: `${((challenge.progress || 0) / (challenge.total || 1)) * 100}%`,
                                        transition: 'width 0.5s ease-out'
                                    }}></div>
                                </div>
                                {challenge.type !== 'completados' && <p style={{ fontSize: '10px', color: 'var(--color-text-muted)', textAlign: 'right', fontWeight: 600, textTransform: 'uppercase', margin: 0 }}>¡Sigue así!</p>}
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
                                    backgroundColor: challenge.type === 'activos' ? 'var(--color-primary)' : 'var(--color-bg)',
                                    padding: '0.5rem 1rem',
                                    fontSize: '10px',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    color: challenge.type === 'activos' ? 'white' : 'var(--color-text-main)',
                                    border: challenge.type === 'activos' ? 'none' : '1px solid var(--color-border)',
                                    boxShadow: challenge.type === 'activos' ? '0 4px 6px rgba(211,0,31,0.2)' : 'none',
                                    cursor: 'pointer'
                                }}>
                                    {challenge.type === 'activos' ? (
                                        <>
                                            <span className="material-icons-round" style={{ fontSize: '1rem' }}>add</span>
                                            Registrar
                                        </>
                                    ) : 'Ver Detalles'}
                                </button>
                            </div>
                        </article>
                    )
                ))}
            </div>
        </div>
    );
};
