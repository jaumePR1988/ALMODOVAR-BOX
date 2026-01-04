import React, { useState } from 'react';
// import { useAuth } from '../context/AuthContext';

import { useNavigate } from 'react-router-dom';

export const NotificationsSettingsView: React.FC = () => {
    const navigate = useNavigate();
    // const { userData } = useAuth(); // Removed unused variable causing build error
    // Emulated state for toggles (visual only for now as emulated backend)
    const [settings, setSettings] = useState({
        bookingReminders: true,
        challengeReminders: true,
        generalAnnouncements: true,
        promotions: false
    });

    const toggleSetting = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div style={{
            fontFamily: "'Montserrat', sans-serif",
            backgroundColor: 'var(--color-bg)',
            color: 'var(--color-text-main)',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            overflowX: 'hidden'
        }}>
            {/* Header Sticky */}
            <header style={{
                position: 'sticky',
                top: 0,
                zIndex: 50,
                backgroundColor: 'rgba(var(--color-surface-rgb), 0.95)', // approximation if rgb vars existed, using var directly
                background: 'var(--color-bg)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem'
            }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        color: 'var(--color-text-main)',
                        display: 'flex',
                        width: '2.5rem',
                        height: '2.5rem',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '9999px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    <span className="material-icons-round" style={{ fontSize: '24px' }}>arrow_back</span>
                </button>
                <h2 style={{
                    color: 'var(--color-text-main)',
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    lineHeight: 1.25,
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    flex: 1,
                    letterSpacing: '-0.025em'
                }}>Notificaciones</h2>
            </header>

            <main style={{ flex: 1, padding: '1.5rem', paddingBottom: '6rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ paddingLeft: '0.25rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>Personaliza tus alertas</h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: 1.625 }}>Gestiona qué notificaciones push quieres recibir en tu dispositivo para estar al día con tu entrenamiento en Almodovar Group.</p>
                </div>

                {/* Section 1 */}
                <section>
                    <h4 style={{
                        paddingLeft: '0.25rem',
                        marginBottom: '0.75rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--color-text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>Mis Entrenamientos</h4>
                    <div style={{
                        backgroundColor: 'var(--color-surface)',
                        borderRadius: 'var(--radius-xl)',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        {/* Item 1 */}
                        <div style={{
                            padding: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderBottom: '1px solid var(--color-border)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '2.5rem',
                                    height: '2.5rem',
                                    borderRadius: '9999px',
                                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                    color: '#ef4444',
                                    flexShrink: 0
                                }}>
                                    <span className="material-icons-round">calendar_today</span>
                                </div>
                                <div>
                                    <h5 style={{ color: 'var(--color-text-main)', fontWeight: 700, fontSize: '0.875rem', margin: 0 }}>Clases Reservadas</h5>
                                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginTop: '0.125rem' }}>Recordatorios 1h antes</p>
                                </div>
                            </div>
                            <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={settings.bookingReminders}
                                    onChange={() => toggleSetting('bookingReminders')}
                                    style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: 0 }}
                                />
                                <div style={{
                                    width: '2.75rem',
                                    height: '1.5rem',
                                    backgroundColor: settings.bookingReminders ? 'var(--color-primary)' : 'rgba(156, 163, 175, 0.5)',
                                    borderRadius: '9999px',
                                    position: 'relative',
                                    transition: 'background-color 0.2s'
                                }}>
                                    <div style={{
                                        content: '""',
                                        position: 'absolute',
                                        top: '2px',
                                        left: '2px',
                                        backgroundColor: 'white',
                                        borderRadius: '9999px',
                                        height: '1.25rem',
                                        width: '1.25rem',
                                        transition: 'transform 0.2s',
                                        transform: settings.bookingReminders ? 'translateX(1.25rem)' : 'translateX(0)'
                                    }}></div>
                                </div>
                            </label>
                        </div>

                        {/* Item 2 */}
                        <div style={{
                            padding: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '2.5rem',
                                    height: '2.5rem',
                                    borderRadius: '9999px',
                                    backgroundColor: 'rgba(249, 115, 22, 0.1)',
                                    color: '#f97316',
                                    flexShrink: 0
                                }}>
                                    <span className="material-icons-round">emoji_events</span>
                                </div>
                                <div>
                                    <h5 style={{ color: 'var(--color-text-main)', fontWeight: 700, fontSize: '0.875rem', margin: 0 }}>Recordatorios de Retos</h5>
                                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginTop: '0.125rem' }}>Progreso y nuevas medallas</p>
                                </div>
                            </div>
                            <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={settings.challengeReminders}
                                    onChange={() => toggleSetting('challengeReminders')}
                                    style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: 0 }}
                                />
                                <div style={{
                                    width: '2.75rem',
                                    height: '1.5rem',
                                    backgroundColor: settings.challengeReminders ? 'var(--color-primary)' : 'rgba(156, 163, 175, 0.5)',
                                    borderRadius: '9999px',
                                    position: 'relative',
                                    transition: 'background-color 0.2s'
                                }}>
                                    <div style={{
                                        content: '""',
                                        position: 'absolute',
                                        top: '2px',
                                        left: '2px',
                                        backgroundColor: 'white',
                                        borderRadius: '9999px',
                                        height: '1.25rem',
                                        width: '1.25rem',
                                        transition: 'transform 0.2s',
                                        transform: settings.challengeReminders ? 'translateX(1.25rem)' : 'translateX(0)'
                                    }}></div>
                                </div>
                            </label>
                        </div>
                    </div>
                </section>

                {/* Section 2 */}
                <section>
                    <h4 style={{
                        paddingLeft: '0.25rem',
                        marginBottom: '0.75rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--color-text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>Novedades del Centro</h4>
                    <div style={{
                        backgroundColor: 'var(--color-surface)',
                        borderRadius: 'var(--radius-xl)',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        {/* Item 3 */}
                        <div style={{
                            padding: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderBottom: '1px solid var(--color-border)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '2.5rem',
                                    height: '2.5rem',
                                    borderRadius: '9999px',
                                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                                    color: '#2563eb',
                                    flexShrink: 0
                                }}>
                                    <span className="material-icons-round">campaign</span>
                                </div>
                                <div>
                                    <h5 style={{ color: 'var(--color-text-main)', fontWeight: 700, fontSize: '0.875rem', margin: 0 }}>Comunicados Generales</h5>
                                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginTop: '0.125rem' }}>Horarios, festivos y eventos</p>
                                </div>
                            </div>
                            <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={settings.generalAnnouncements}
                                    onChange={() => toggleSetting('generalAnnouncements')}
                                    style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: 0 }}
                                />
                                <div style={{
                                    width: '2.75rem',
                                    height: '1.5rem',
                                    backgroundColor: settings.generalAnnouncements ? 'var(--color-primary)' : 'rgba(156, 163, 175, 0.5)',
                                    borderRadius: '9999px',
                                    position: 'relative',
                                    transition: 'background-color 0.2s'
                                }}>
                                    <div style={{
                                        content: '""',
                                        position: 'absolute',
                                        top: '2px',
                                        left: '2px',
                                        backgroundColor: 'white',
                                        borderRadius: '9999px',
                                        height: '1.25rem',
                                        width: '1.25rem',
                                        transition: 'transform 0.2s',
                                        transform: settings.generalAnnouncements ? 'translateX(1.25rem)' : 'translateX(0)'
                                    }}></div>
                                </div>
                            </label>
                        </div>

                        {/* Item 4 */}
                        <div style={{
                            padding: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '2.5rem',
                                    height: '2.5rem',
                                    borderRadius: '9999px',
                                    backgroundColor: 'rgba(147, 51, 234, 0.1)',
                                    color: '#9333ea',
                                    flexShrink: 0
                                }}>
                                    <span className="material-icons-round">local_offer</span>
                                </div>
                                <div>
                                    <h5 style={{ color: 'var(--color-text-main)', fontWeight: 700, fontSize: '0.875rem', margin: 0 }}>Ofertas y Promociones</h5>
                                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginTop: '0.125rem' }}>Descuentos exclusivos para ti</p>
                                </div>
                            </div>
                            <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={settings.promotions}
                                    onChange={() => toggleSetting('promotions')}
                                    style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: 0 }}
                                />
                                <div style={{
                                    width: '2.75rem',
                                    height: '1.5rem',
                                    backgroundColor: settings.promotions ? 'var(--color-primary)' : 'rgba(156, 163, 175, 0.5)',
                                    borderRadius: '9999px',
                                    position: 'relative',
                                    transition: 'background-color 0.2s'
                                }}>
                                    <div style={{
                                        content: '""',
                                        position: 'absolute',
                                        top: '2px',
                                        left: '2px',
                                        backgroundColor: 'white',
                                        borderRadius: '9999px',
                                        height: '1.25rem',
                                        width: '1.25rem',
                                        transition: 'transform 0.2s',
                                        transform: settings.promotions ? 'translateX(1.25rem)' : 'translateX(0)'
                                    }}></div>
                                </div>
                            </label>
                        </div>
                    </div>
                </section>

                <div style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: 'var(--color-surface)',
                    borderRadius: 'var(--radius-default)',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem'
                }}>
                    <span className="material-icons-round" style={{ color: 'var(--color-text-muted)', fontSize: '20px', marginTop: '0.125rem', flexShrink: 0 }}>info</span>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500, lineHeight: 1.5, margin: 0 }}>
                        Las notificaciones de cambios urgentes de sala o cancelaciones de última hora siempre se enviarán para garantizar tu asistencia.
                    </p>
                </div>
            </main>
        </div>
    );
};
