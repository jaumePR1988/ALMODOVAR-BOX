import React from 'react';
import { useAuth } from '../context/AuthContext';

export const PerfilView: React.FC = () => {
    // Cast to any to bypass temporary build error with tsc -b
    const { userData } = useAuth() as any;
    const membership = userData?.membership || 'fit'; // Default to fit

    // Mock Data for Profile
    const stats = {
        totalClasses: 24,
        activeMonths: 5
    };

    const history = [
        { title: 'Open Box', date: '21 Oct • 10:00 AM', status: 'Asistido', color: 'green' },
        { title: 'Fit Boxing Kids (Invitado)', date: '18 Oct • 17:00 PM', status: 'Asistido', color: 'green' },
        { title: 'Fit Boxing WOD', date: '15 Oct • 19:00 PM', status: 'Cancelado', color: 'red' }
    ];

    return (
        <div style={{ paddingBottom: '6rem' }}>
            {/* Header Sticky */}
            <header style={{
                position: 'sticky',
                top: 0,
                zIndex: 40,
                backgroundColor: 'var(--color-bg)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid var(--color-border)',
                padding: '0.75rem 1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h1 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0 }}>Mi Perfil</h1>
                <button style={{
                    padding: '0.5rem',
                    borderRadius: '50%',
                    color: 'var(--color-primary)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <span className="material-icons-round">settings</span>
                </button>
            </header>

            <div className="section-padding" style={{ paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* User Info Card */}
                <section style={{
                    backgroundColor: 'var(--color-surface)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '1.5rem',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid var(--color-border)',
                    textAlign: 'center'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '-2.5rem',
                        right: '-2.5rem',
                        width: '8rem',
                        height: '8rem',
                        backgroundColor: 'rgba(211, 0, 31, 0.1)',
                        borderRadius: '50%',
                        filter: 'blur(40px)'
                    }}></div>

                    <div style={{ position: 'relative', zIndex: 10 }}>
                        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
                            <img
                                src="https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=200"
                                alt="Profile"
                                style={{
                                    width: '6rem',
                                    height: '6rem',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: '4px solid var(--color-bg)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                            />
                            <button style={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                backgroundColor: 'var(--color-primary)',
                                color: 'white',
                                padding: '0.375rem',
                                borderRadius: '50%',
                                border: '2px solid var(--color-bg)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <span className="material-icons-round" style={{ fontSize: '0.875rem' }}>edit</span>
                            </button>
                        </div>

                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.25rem 0' }}>{userData?.firstName || 'Atleta Almodovar'}</h2>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: '0 0 1rem 0' }}>Miembro desde 2024</p>

                        <button style={{
                            width: '100%',
                            padding: '0.5rem 1rem',
                            backgroundColor: 'var(--color-bg)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '0.75rem',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: 'var(--color-text-main)',
                            cursor: 'pointer',
                            maxWidth: '200px'
                        }}>
                            Editar Datos
                        </button>
                    </div>
                </section>

                {/* Membership Card */}
                <section>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="material-icons-round" style={{ color: 'var(--color-primary)' }}>card_membership</span>
                        Membresía
                    </h3>
                    <div style={{
                        background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
                        color: 'white',
                        borderRadius: 'var(--radius-xl)',
                        padding: '1.5rem',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.3)'
                    }}>
                        <div style={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            width: '12rem',
                            height: '12rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '50%',
                            marginRight: '-4rem',
                            marginTop: '-4rem',
                            filter: 'blur(40px)'
                        }}></div>

                        <div style={{ position: 'relative', zIndex: 10 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div>
                                    <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Plan Actual</p>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.25rem 0 0 0', color: 'white' }}>{membership === 'box' ? 'Plan BOX' : 'Plan FIT'}</h2>
                                </div>
                                <span style={{
                                    backgroundColor: 'rgba(34, 197, 94, 0.2)',
                                    color: '#4ade80',
                                    fontSize: '0.75rem',
                                    fontWeight: 800,
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '0.375rem',
                                    border: '1px solid rgba(34, 197, 94, 0.3)'
                                }}>ACTIVO</span>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.375rem' }}>
                                    <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Créditos Restantes</span>
                                    <span style={{ fontWeight: 700 }}>4 / 12</span>
                                </div>
                                <div style={{ width: '100%', height: '0.625rem', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '999px', overflow: 'hidden' }}>
                                    <div style={{ width: '33%', height: '100%', backgroundColor: 'var(--color-primary)', borderRadius: '999px' }}></div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Próxima renovación</span>
                                <span style={{ fontWeight: 500 }}>15 Nov 2024</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* History Section */}
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                            <span className="material-icons-round" style={{ color: 'var(--color-primary)' }}>history</span>
                            Historial
                        </h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {history.map((item, index) => (
                            <div key={index} style={{
                                backgroundColor: 'var(--color-surface)',
                                padding: '1rem',
                                borderRadius: 'var(--radius-xl)',
                                borderLeft: `4px solid ${item.color === 'green' ? '#22c55e' : '#ef4444'}`,
                                border: '1px solid var(--color-border)',
                                borderLeftWidth: '4px', // Override border logic
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                opacity: item.color === 'red' ? 0.8 : 1
                            }}>
                                <div>
                                    <h4 style={{ fontSize: '0.875rem', fontWeight: 700, margin: '0 0 0.125rem 0' }}>{item.title}</h4>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>{item.date}</p>
                                </div>
                                <span style={{
                                    backgroundColor: item.color === 'green' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                    color: item.color === 'green' ? '#16a34a' : '#dc2626',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '0.375rem'
                                }}>
                                    {item.status}
                                </span>
                            </div>
                        ))}
                    </div>

                    <button style={{
                        width: '100%',
                        marginTop: '1rem',
                        padding: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.25rem',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: 'var(--color-text-muted)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'color 0.2s'
                    }}>
                        Ver todo el historial
                        <span className="material-icons-round" style={{ fontSize: '1.25rem' }}>expand_more</span>
                    </button>
                </section>

                {/* Stats Grid */}
                <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{
                        backgroundColor: 'var(--color-surface)',
                        padding: '1rem',
                        borderRadius: 'var(--radius-xl)',
                        border: '1px solid var(--color-border)',
                        textAlign: 'center'
                    }}>
                        <span style={{ display: 'block', fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1, marginBottom: '0.25rem' }}>{stats.totalClasses}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Clases Totales</span>
                    </div>
                    <div style={{
                        backgroundColor: 'var(--color-surface)',
                        padding: '1rem',
                        borderRadius: 'var(--radius-xl)',
                        border: '1px solid var(--color-border)',
                        textAlign: 'center'
                    }}>
                        <span style={{ display: 'block', fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1, marginBottom: '0.25rem' }}>{stats.activeMonths}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Meses Activo</span>
                    </div>
                </section>
            </div>
        </div>
    );
};
