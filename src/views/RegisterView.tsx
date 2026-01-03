import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export const RegisterView: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Aquí irá la lógica de Firebase más adelante
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="login-page" style={{
                minHeight: '100dvh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem',
                backgroundColor: 'var(--color-bg)',
                textAlign: 'center'
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '400px',
                    backgroundColor: 'var(--color-surface)',
                    borderRadius: 'var(--radius-2xl)',
                    padding: '2.5rem',
                    boxShadow: 'var(--shadow-soft)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1.5rem',
                    animation: 'fadeInUp 0.6s ease-out'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <span className="material-icons-outlined" style={{ fontSize: '3rem', color: '#22c55e' }}>check_circle</span>
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-main)' }}>Perfil Creado</h2>
                    <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6', fontSize: '0.9rem' }}>
                        ¡Genial! Tu solicitud ha sido enviada con éxito.
                    </p>
                    <div style={{
                        backgroundColor: 'var(--color-bg)',
                        padding: '1rem',
                        borderRadius: 'var(--radius-xl)',
                        border: '1px solid var(--color-border)',
                        width: '100%'
                    }}>
                        <p style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.85rem' }}>
                            Esperando autorización del administrador del gimnasio.
                        </p>
                    </div>
                    <button
                        className="btn-primary"
                        onClick={() => navigate('/login')}
                        style={{ marginTop: '0.5rem' }}
                    >
                        VOLVER AL LOGIN
                    </button>
                </div>
            </div>
        );
    }

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
            {/* Theme Toggle */}
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

            {/* Header */}
            <div className="animate-fade-in-down" style={{
                width: '100%',
                maxWidth: '448px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: '1.5rem',
                marginTop: '1.5rem'
            }}>
                <div style={{
                    width: '5rem',
                    height: '5rem',
                    marginBottom: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <img
                        src="/src/assets/logo.png"
                        alt="Logo"
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                </div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-main)', textAlign: 'center', letterSpacing: '-0.025em' }}>
                    Almodovar <span style={{ color: 'var(--color-primary)' }}>Group</span>
                </h1>
                <p style={{ marginTop: '0.25rem', color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 500 }}>
                    Transforma tu vida
                </p>
            </div>

            {/* Form Card */}
            <div style={{
                width: '100%',
                maxWidth: '448px',
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--radius-2xl)',
                boxShadow: 'var(--shadow-soft)',
                padding: '1.25rem',
                marginBottom: '1rem'
            }}>
                {/* Tabs */}
                <div className="badge-tab">
                    <button className="inactive" onClick={() => navigate('/login')}>
                        Iniciar Sesión
                    </button>
                    <button className="active">
                        Registrarse
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div className="grid-2">
                        <div style={{ position: 'relative' }}>
                            <span className="material-icons-outlined" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '1.1rem' }}>person</span>
                            <input className="ios-input" placeholder="Nombre" required type="text" style={{ paddingLeft: '2.25rem' }} />
                        </div>
                        <input className="ios-input" placeholder="Apellidos" required type="text" style={{ paddingLeft: '1rem' }} />
                    </div>

                    <div className="grid-2">
                        <div style={{ position: 'relative' }}>
                            <span className="material-icons-outlined" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '1.1rem' }}>phone</span>
                            <input className="ios-input" placeholder="Teléfono" required type="tel" style={{ paddingLeft: '2.25rem' }} />
                        </div>
                        <input className="ios-input" type="date" placeholder="F. Nac" style={{ paddingLeft: '1rem' }} />
                    </div>

                    <div style={{ marginTop: '0.25rem' }}>
                        <span className="form-section-title">Dirección completa *</span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                            <input className="ios-input" placeholder="Calle / Avenida" required type="text" style={{ paddingLeft: '1rem' }} />
                            <div className="grid-3">
                                <input className="ios-input" placeholder="Nº" required type="text" style={{ paddingLeft: '1rem' }} />
                                <div style={{ gridColumn: 'span 2' }}>
                                    <input className="ios-input" placeholder="Código Postal" required type="text" style={{ paddingLeft: '1rem' }} />
                                </div>
                            </div>
                            <input className="ios-input" placeholder="Ciudad" required type="text" style={{ paddingLeft: '1rem' }} />
                        </div>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <span className="material-icons-outlined" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '1.1rem' }}>email</span>
                        <input className="ios-input" placeholder="Correo Electrónico" required type="email" style={{ paddingLeft: '2.25rem' }} />
                    </div>

                    <div className="grid-2" style={{ gap: '0.75rem' }}>
                        <div style={{ position: 'relative' }}>
                            <span className="material-icons-outlined" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '1.1rem' }}>lock</span>
                            <input className="ios-input" placeholder="Contraseña" required type={showPassword ? 'text' : 'password'} style={{ paddingLeft: '2.25rem' }} />
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
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <span className="material-icons-outlined" style={{ fontSize: '1.1rem' }}>
                                    {showPassword ? 'visibility' : 'visibility_off'}
                                </span>
                            </button>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <span className="material-icons-outlined" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '1.1rem' }}>lock_reset</span>
                            <input className="ios-input" placeholder="Confirmar" required type={showPassword ? 'text' : 'password'} style={{ paddingLeft: '2.25rem' }} />
                        </div>
                    </div>

                    <label className="checkbox-container">
                        <input type="checkbox" required />
                        <span>
                            Acepto los <a href="#">términos</a> y la <a href="#">política de privacidad</a>
                        </span>
                    </label>

                    <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', padding: '0.875rem' }}>
                        CREAR CUENTA
                    </button>
                </form>
            </div>

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

            <p style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)', opacity: 0.6, paddingTop: '1.5rem', paddingBottom: '1rem' }}>
                © 2025 Almodovar Group Fitness
            </p>
        </div>
    );
};
