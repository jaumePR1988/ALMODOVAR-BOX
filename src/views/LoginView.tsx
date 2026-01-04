import React, { useState } from 'react';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export const LoginView: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            // El observador onAuthStateChanged en AuthContext se encargará de actualizar el estado
            // y App.tsx se encargará de redirigir según el estado del usuario.
        } catch (err: any) {
            console.error("Error en login:", err);
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                setError("Credenciales incorrectas. Por favor, revisa tu correo y contraseña.");
            } else if (err.code === 'auth/too-many-requests') {
                setError("Demasiados intentos fallidos. Inténtalo más tarde.");
            } else {
                setError("Error al iniciar sesión. Inténtalo de nuevo.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page" style={{
            padding: '1.5rem',
            paddingTop: '2rem', /* Reduced top padding as wrapper handles centering */
            paddingBottom: '2rem',
            transition: 'background-color 0.3s ease',
            boxSizing: 'border-box',
            display: 'flex',             /* Enable flexbox on container */
            flexDirection: 'column',
            minHeight: '100dvh'          /* Ensure container is full height */
        }}>
            {/* Theme Toggle Overlay */}
            <button
                onClick={toggleTheme}
                type="button"
                style={{
                    position: 'absolute',
                    top: '1.5rem',
                    right: '1.5rem',
                    zIndex: 50,
                    background: 'none',
                    border: 'none',
                    fontSize: '1.25rem',
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

            {/* Content Wrapper for Safe Centering */}
            <div style={{
                width: '100%',
                maxWidth: '448px',
                margin: 'auto',          /* This does the magic: Centers vertically and horizontally safely */
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>

                {/* Header Section */}
                <div className="animate-fade-in-down" style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginBottom: '2rem',
                    /* marginTop: 'auto' removed */
                }}>
                    <div style={{
                        width: '10rem',
                        height: '10rem',
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                    }}>
                        <img
                            src={logo}
                            alt="Logo"
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                    </div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-main)', textAlign: 'center', letterSpacing: '-0.025em' }}>
                        Almodovar <span style={{ color: 'var(--color-primary)' }}>Group</span>
                    </h1>
                    <p style={{ marginTop: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>
                        Transforma tu vida
                    </p>
                </div>

                {/* Login Card */}
                <div style={{
                    width: '100%',
                    backgroundColor: 'var(--color-surface)',
                    borderRadius: 'var(--radius-2xl)',
                    boxShadow: 'var(--shadow-soft)',
                    padding: '1.5rem',
                    position: 'relative',
                    overflow: 'hidden',
                    marginBottom: '2rem'
                }}>

                    <div className="badge-tab">
                        <button className="active">
                            Iniciar Sesión
                        </button>
                        <button className="inactive" onClick={() => navigate('/register')}>
                            Registrarse
                        </button>
                    </div>

                    {error && (
                        <div style={{
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            color: '#ef4444',
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-lg)',
                            marginBottom: '1rem',
                            fontSize: '0.875rem',
                            textAlign: 'center',
                            border: '1px solid rgba(239, 68, 68, 0.2)'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                    required
                                    style={{ paddingRight: '2.5rem' }}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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

                        <button
                            className="btn-primary"
                            type="submit"
                            disabled={loading}
                            style={{
                                opacity: loading ? 0.7 : 1,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            {loading ? (
                                <>
                                    <span className="material-icons-outlined animate-spin" style={{ fontSize: '1.25rem' }}>sync</span>
                                    ACCEDIENDO...
                                </>
                            ) : 'ACCESO CLIENTES'}
                        </button>

                        <button className="btn-secondary" onClick={() => navigate('/register')} type="button">
                            Crear una cuenta nueva
                        </button>
                    </form>


                </div>

                {/* Footer */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        display: 'flex',
                        gap: '1.5rem',
                        fontSize: '0.75rem',
                        color: 'var(--color-text-muted)',
                        marginTop: '0.5rem',
                        alignItems: 'center'
                    }}>
                        <button onClick={() => navigate('/terms')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 'inherit', minHeight: 'auto' }}>Términos y Privacidad</button>
                        <span style={{ opacity: 0.3 }}>|</span>
                        <button onClick={() => navigate('/help')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 'inherit', minHeight: 'auto' }}>Ayuda</button>
                    </div>

                    <p style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', opacity: 0.6, paddingTop: '1rem', paddingBottom: '2rem' }}>
                        © 2025 Almodovar Group Fitness
                    </p>
                </div>
            </div>
        </div>
    );
};
