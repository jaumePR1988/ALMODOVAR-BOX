import React from 'react';

interface ClassDetailViewProps {
    classData: any; // Replace with proper type later
    onBack: () => void;
}

export const ClassDetailView: React.FC<ClassDetailViewProps> = ({ classData, onBack }) => {
    return (
        <div style={{
            height: '100dvh', // Changed from minHeight to height for scroll
            backgroundColor: '#111827',
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
            color: '#F9FAFB',
            boxShadow: '0 0 20px rgba(0,0,0,0.5)' // Shadow to separate from background on large screens
        }}>
            {/* Header */}
            <header style={{
                position: 'fixed',
                top: 0,
                width: '100%',
                maxWidth: '480px', // Constraint
                left: '50%', // Center
                transform: 'translateX(-50%)', // Center
                zIndex: 2010,
                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid #374151',
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
                    <span className="material-icons-round" style={{ fontSize: '1.5rem', color: '#F9FAFB' }}>arrow_back_ios_new</span>
                </button>
                <h1 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#F9FAFB' }}>Detalles de Clase</h1>
                <div style={{ width: '2.5rem' }}></div> {/* Spacer */}
            </header>

            {/* Main Content */}
            <main style={{
                flexGrow: 1,
                padding: '5rem 1rem 6rem 1rem',
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
                        backgroundColor: '#1F2937',
                        padding: '1rem',
                        borderRadius: '0.75rem',
                        border: '1px solid #374151',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <span className="material-icons-round" style={{ fontSize: '1.875rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>calendar_today</span>
                        <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.05em' }}>Fecha</p>
                        <p style={{ fontWeight: 600, color: '#F9FAFB', marginTop: '0.25rem', fontSize: '1.1rem' }}>{classData.date}</p>
                        <p style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>{classData.time}</p>
                    </div>

                    {/* Coach Card */}
                    <div style={{
                        backgroundColor: '#1F2937',
                        padding: '1rem',
                        borderRadius: '0.75rem',
                        border: '1px solid #374151',
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
                        <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.05em' }}>Coach</p>
                        <p style={{ fontWeight: 600, color: '#F9FAFB', marginTop: '0.25rem' }}>{classData.coach}</p>
                        <p style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>Head Coach</p>
                    </div>
                </div>

                {/* Availability */}
                <div style={{ backgroundColor: '#1F2937', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #374151' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
                        <div>
                            <h3 style={{ fontWeight: 700, color: '#F9FAFB', margin: 0 }}>Disponibilidad</h3>
                            <p style={{ fontSize: '0.875rem', color: '#9CA3AF', margin: 0 }}>Plazas limitadas por sesión</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>8</span>
                            <span style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>/ 10</span>
                        </div>
                    </div>
                    <div style={{ width: '100%', backgroundColor: '#374151', borderRadius: '9999px', height: '0.75rem', overflow: 'hidden' }}>
                        <div style={{ width: '80%', backgroundColor: 'var(--color-primary)', height: '100%', borderRadius: '9999px' }}></div>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#9CA3AF', textAlign: 'right', marginTop: '0.5rem' }}>¡Quedan 2 plazas!</p>

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
                                width: '2rem', height: '2rem', borderRadius: '50%', backgroundColor: '#374151',
                                marginLeft: '-0.5rem', border: '2px solid #1F2937', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#D1D5DB', fontWeight: 600
                            }}>
                                +15
                            </div>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: '#9CA3AF', marginLeft: '1rem' }}>Amigos asistiendo</p>
                    </div>
                </div>

                {/* About */}
                <div style={{ backgroundColor: '#1F2937', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #374151' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', color: '#F9FAFB' }}>Sobre la clase</h3>
                    <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: '1.6', marginBottom: '1rem' }}>
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
                </div>

                {/* Location */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.5rem' }}>
                    <span className="material-icons-round" style={{ color: '#9CA3AF' }}>location_on</span>
                    <div>
                        <h4 style={{ fontWeight: 600, color: '#F9FAFB', margin: 0 }}>Almodovar Group Gym</h4>
                        <p style={{ fontSize: '0.875rem', color: '#9CA3AF', margin: 0 }}>Av. dels Rabassaires, 30, Mollet del Vallès</p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer style={{
                position: 'fixed',
                bottom: 0,
                width: '100%',
                maxWidth: '480px', // Constraint
                left: '50%', // Center
                transform: 'translateX(-50%)', // Center
                backgroundColor: '#1F2937',
                borderTop: '1px solid #374151',
                padding: '1rem',
                paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
                zIndex: 2010,
                boxShadow: '0 -4px 6px -1px rgba(0,0,0,0.2)'
            }}>
                <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Total a pagar</span>
                        <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#F9FAFB' }}>1 Crédito</span>
                    </div>
                    <button style={{
                        flex: 1,
                        backgroundColor: 'var(--color-primary)',
                        color: 'white',
                        fontWeight: 700,
                        padding: '0.875rem 1.5rem',
                        borderRadius: '0.75rem',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(211, 0, 31, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer'
                    }}>
                        <span className="material-icons-round">check_circle</span>
                        Reservar Plaza
                    </button>
                </div>
            </footer>
        </div>
    );
};
