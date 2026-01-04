import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const ProfileSettingsView: React.FC = () => {
    const { userData, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

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
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        padding: '0.5rem',
                        marginLeft: '-0.5rem',
                        borderRadius: '50%',
                        color: 'var(--color-text-muted)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                    <span className="material-icons-round">arrow_back</span>
                </button>
                <h1 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0 }}>Ajustes</h1>
                <div style={{ width: '2.5rem' }}></div>
            </header>

            <div className="section-padding" style={{ paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* Profile Summary */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingLeft: '0.5rem', paddingTop: '0.5rem' }}>
                    <div style={{ position: 'relative' }}>
                        <img
                            src={userData?.photoURL || "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=200"}
                            alt="Profile"
                            style={{
                                width: '4rem',
                                height: '4rem',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '2px solid var(--color-primary)',
                                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                            }}
                        />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.125rem', fontWeight: 800, lineHeight: 1.25, margin: 0 }}>{userData?.firstName || 'Usuario Almodovar'}</h2>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>{userData?.email || 'usuario@email.com'}</p>
                    </div>
                </div>

                {/* Account Management */}
                <section>
                    <h3 style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', paddingLeft: '0.5rem' }}>Gestión de Cuenta</h3>
                    <div style={{
                        backgroundColor: 'var(--color-surface)',
                        borderRadius: 'var(--radius-xl)',
                        border: '1px solid var(--color-border)',
                        overflow: 'hidden'
                    }}>
                        {/* Edit Profile */}

                        {/* Change Password */}
                        <button
                            onClick={() => {
                                // This requires re-auth. For now, let's show an alert or a simple prompt.
                                alert("Funcionalidad de cambio de contraseña segura próximamente. Requiere re-autenticación.");
                            }}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '1rem',
                                background: 'none',
                                border: 'none',
                                borderBottom: '1px solid var(--color-border)',
                                cursor: 'pointer',
                                textAlign: 'left'
                            }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ padding: '0.5rem', backgroundColor: 'rgba(249, 115, 22, 0.1)', color: '#f97316', borderRadius: '0.5rem', display: 'flex' }}>
                                    <span className="material-icons-round" style={{ fontSize: '1.25rem' }}>lock_outline</span>
                                </div>
                                <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>Cambiar Contraseña</span>
                            </div>
                            <span className="material-icons-round" style={{ color: '#9CA3AF' }}>chevron_right</span>
                        </button>

                        {/* Notifications */}
                        <button
                            onClick={() => navigate('/dashboard/settings/notifications')}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '1rem',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                textAlign: 'left'
                            }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ padding: '0.5rem', backgroundColor: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', borderRadius: '0.5rem', display: 'flex' }}>
                                    <span className="material-icons-round" style={{ fontSize: '1.25rem' }}>notifications_none</span>
                                </div>
                                <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>Gestión de Notificaciones</span>
                            </div>
                            <span className="material-icons-round" style={{ color: '#9CA3AF' }}>chevron_right</span>
                        </button>
                    </div>
                </section>

                {/* Legal Section */}
                <section>
                    <h3 style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', paddingLeft: '0.5rem' }}>Legal</h3>
                    <div style={{
                        backgroundColor: 'var(--color-surface)',
                        borderRadius: 'var(--radius-xl)',
                        border: '1px solid var(--color-border)',
                        overflow: 'hidden'
                    }}>
                        <button
                            onClick={() => alert('Próximamente')}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '1rem',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                textAlign: 'left'
                            }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ padding: '0.5rem', backgroundColor: 'var(--color-bg)', color: 'var(--color-text-muted)', borderRadius: '0.5rem', display: 'flex' }}>
                                    <span className="material-icons-round" style={{ fontSize: '1.25rem' }}>description</span>
                                </div>
                                <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>Legal y Privacidad</span>
                            </div>
                            <span className="material-icons-round" style={{ color: '#9CA3AF' }}>chevron_right</span>
                        </button>
                    </div>
                </section>

                {/* Logout Section */}
                <section style={{ paddingTop: '0.5rem' }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            borderRadius: 'var(--radius-xl)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            backgroundColor: 'var(--color-surface)',
                            color: 'var(--color-primary)',
                            fontWeight: 700,
                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            transition: 'background-color 0.2s'
                        }}>
                        <span className="material-icons-round">logout</span>
                        Cerrar Sesión
                    </button>
                    <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '1.5rem', fontWeight: 500 }}>Almodovar Group App v1.0.0</p>
                </section>
            </div>
        </div>
    );
};
