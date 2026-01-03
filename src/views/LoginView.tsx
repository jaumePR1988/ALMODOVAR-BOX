import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export const LoginView: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="login-page" style={{
            minHeight: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            backgroundColor: 'var(--color-bg)',
            transition: 'background-color 0.3s ease',
            width: '100%',
            boxSizing: 'border-box'
        }}>
            {/* Theme Toggle Overlay */}
            <button
                onClick={toggleTheme}
                style={{
                    position: 'fixed',
                    top: '1.5rem',
                    right: '1.5rem',
                    zIndex: 50,
                    background: 'none',
                    border: 'none',
                    fontSize: '1.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.5rem',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    transition: 'all 0.2s ease'
                }}
            >
                {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            {/* Header Section */}
            <div className="animate-fade-in-down" style={{
                width: '100%',
                maxWidth: '448px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: '2rem'
            }}>
                <div style={{
                    width: '7.5rem',
                    height: '7.5rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                }}>
                    <img
                        src="/src/assets/logo.png"
                        alt="Logo"
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                </div>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--color-text-main)', textAlign: 'center', letterSpacing: '-0.025em' }}>
                    Almodovar <span style={{ color: 'var(--color-primary)' }}>Group</span>
                </h1>
                <p style={{ marginTop: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>
                    Transforma tu vida
                </p>
            </div>

            {/* Login Card */}
            <div style={{
                width: '100%',
                maxWidth: '448px',
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--radius-2xl)',
                boxShadow: 'var(--shadow-soft)',
                padding: '2rem',
                position: 'relative',
                overflow: 'hidden'
            }}>

                <div className="badge-tab">
                    <button className="active">
                        Iniciar Sesión
                    </button>
                    <button className="inactive" onClick={() => navigate('/register')}>
                        Registrarse
                    </button>
                </div>

                <form style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div style={{ position: 'relative' }}>
                            <span className="material-icons-outlined" style={{
                                position: 'absolute',
                                left: '0.75rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#9ca3af',
                                fontSize: '1.25rem'
                            }}>
                                email
                            </span>
                            <input
                                id="email"
                                type="email"
                                className="ios-input"
                                placeholder="ejemplo@correo.com"
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div style={{ position: 'relative' }}>
                            <span className="material-icons-outlined" style={{
                                position: 'absolute',
                                left: '0.75rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#9ca3af',
                                fontSize: '1.25rem'
                            }}>
                                lock
                            </span>
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                className="ios-input"
                                placeholder="••••••••"
                                style={{ paddingRight: '2.5rem' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '0.75rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#9ca3af',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <span className="material-icons-outlined" style={{ fontSize: '1.25rem' }}>
                                    {showPassword ? 'visibility' : 'visibility_off'}
                                </span>
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <a href="#" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }}>
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>

                    <button type="submit" className="btn-primary">
                        ACCESO CLIENTES
                    </button>

                    <button type="button" className="btn-secondary" onClick={() => navigate('/register')}>
                        Crear una cuenta nueva
                    </button>
                </form>


            </div>

            {/* Footer */}
            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                    display: 'flex',
                    gap: '1.5rem',
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                    marginTop: '1.5rem',
                    alignItems: 'center'
                }}>
                    <button onClick={() => navigate('/terms')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 'inherit', minHeight: 'auto' }}>Términos</button>
                    <span style={{ opacity: 0.3 }}>|</span>
                    <button onClick={() => navigate('/privacy')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 'inherit', minHeight: 'auto' }}>Privacidad</button>
                    <span style={{ opacity: 0.3 }}>|</span>
                    <button onClick={() => navigate('/help')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 'inherit', minHeight: 'auto' }}>Ayuda</button>
                </div>

                <p style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', opacity: 0.6, paddingTop: '1.5rem', paddingBottom: '2rem' }}>
                    © 2025 Almodovar Group Fitness
                </p>
            </div>
        </div>
    );
};
