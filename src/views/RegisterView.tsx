import React, { useState } from 'react';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export const RegisterView: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        birthDate: '',
        street: '',
        number: '',
        zip: '',
        city: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        if (formData.password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        setLoading(true);

        try {
            // 1. Crear usuario en Auth
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;

            // 2. Crear documento en Firestore
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                email: user.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                birthDate: formData.birthDate,
                address: {
                    street: formData.street,
                    number: formData.number,
                    zip: formData.zip,
                    city: formData.city
                },
                role: 'cliente',
                approved: true, // TEMPORARY: Validation disabled
                consents: {
                    terms: true, // User accepted via checkbox
                    imageRights: false, // Default to false, will be asked if needed or we can ask in form
                    marketing: false,
                    version: '1.0',
                    timestamp: new Date().toISOString()
                },
                createdAt: serverTimestamp()
            });

            setIsSubmitted(true);
        } catch (err: any) {
            console.error("Error en registro:", err);
            if (err.code === 'auth/email-already-in-use') {
                setError("Este correo electrónico ya está registrado.");
            } else if (err.code === 'auth/invalid-email') {
                setError("El correo electrónico no es válido.");
            } else if (err.code === 'auth/weak-password') {
                setError("La contraseña es muy débil.");
            } else {
                setError("Ha ocurrido un error durante el registro. Inténtalo de nuevo.");
            }
        } finally {
            setLoading(false);
        }
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
            padding: '1.5rem',
            paddingTop: '2rem', /* Reduced top padding as wrapper handles centering */
            paddingBottom: '2rem',
            transition: 'background-color 0.3s ease',
            boxSizing: 'border-box',
            display: 'flex',             /* Enable flexbox on container */
            flexDirection: 'column',
            minHeight: '100dvh'          /* Ensure container is full height */
        }}>
            {/* Theme Toggle */}
            <button
                type="button"
                onClick={toggleTheme}
                style={{
                    position: 'absolute',
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

            {/* Content Wrapper for Safe Centering */}
            <div style={{
                width: '100%',
                maxWidth: '448px',
                margin: 'auto',          /* This does the magic: Centers vertically and horizontally safely */
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>

                {/* Header */}
                <div className="animate-fade-in-down" style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginBottom: '1.5rem',
                    /* marginTop: 'auto' removed */
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
                            src={logo}
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
                    backgroundColor: 'var(--color-surface)',
                    borderRadius: 'var(--radius-2xl)',
                    boxShadow: 'var(--shadow-soft)',
                    padding: '1.25rem',
                    marginBottom: '1rem'
                }}>
                    {/* Tabs */}
                    <div className="badge-tab">
                        <button type="button" className="inactive" onClick={() => navigate('/login')}>
                            Iniciar Sesión
                        </button>
                        <button type="button" className="active">
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

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div className="grid-2">
                            <div style={{ position: 'relative' }}>
                                <span className="material-icons-outlined" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '1.1rem' }}>person</span>
                                <input
                                    id="firstName"
                                    className="ios-input"
                                    placeholder="Nombre"
                                    required
                                    type="text"
                                    style={{ paddingLeft: '2.25rem' }}
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <input
                                id="lastName"
                                className="ios-input"
                                placeholder="Apellidos"
                                required
                                type="text"
                                style={{ paddingLeft: '1rem' }}
                                value={formData.lastName}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="grid-2">
                            <div style={{ position: 'relative' }}>
                                <span className="material-icons-outlined" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '1.1rem' }}>phone</span>
                                <input
                                    id="phone"
                                    className="ios-input"
                                    placeholder="Teléfono"
                                    required
                                    type="tel"
                                    style={{ paddingLeft: '2.25rem' }}
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div style={{ position: 'relative' }}>
                                <span className="material-icons-outlined" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '1.1rem' }}>cake</span>
                                <input
                                    id="birthDate"
                                    className="ios-input"
                                    type="date"
                                    placeholder="Fecha de Nacimiento"
                                    required
                                    style={{ paddingLeft: '2.25rem' }}
                                    value={formData.birthDate}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div style={{ marginTop: '0.25rem' }}>
                            <span className="form-section-title">Dirección completa *</span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                                <input
                                    id="street"
                                    className="ios-input"
                                    placeholder="Calle / Avenida"
                                    required
                                    type="text"
                                    style={{ paddingLeft: '1rem' }}
                                    value={formData.street}
                                    onChange={handleInputChange}
                                />
                                <div className="grid-3">
                                    <input
                                        id="number"
                                        className="ios-input"
                                        placeholder="Nº"
                                        required
                                        type="text"
                                        style={{ paddingLeft: '1rem' }}
                                        value={formData.number}
                                        onChange={handleInputChange}
                                    />
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <input
                                            id="zip"
                                            className="ios-input"
                                            placeholder="Código Postal"
                                            required
                                            type="text"
                                            style={{ paddingLeft: '1rem' }}
                                            value={formData.zip}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <input
                                    id="city"
                                    className="ios-input"
                                    placeholder="Ciudad"
                                    required
                                    type="text"
                                    style={{ paddingLeft: '1rem' }}
                                    value={formData.city}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div style={{ position: 'relative' }}>
                            <span className="material-icons-outlined" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '1.1rem' }}>email</span>
                            <input
                                id="email"
                                className="ios-input"
                                placeholder="Correo Electrónico"
                                required
                                type="email"
                                style={{ paddingLeft: '2.25rem' }}
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="grid-2" style={{ gap: '0.75rem' }}>
                            <div style={{ position: 'relative' }}>
                                <span className="material-icons-outlined" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '1.1rem' }}>lock</span>
                                <input
                                    id="password"
                                    className="ios-input"
                                    placeholder="Contraseña"
                                    required
                                    type={showPassword ? 'text' : 'password'}
                                    style={{ paddingLeft: '2.25rem' }}
                                    value={formData.password}
                                    onChange={handleInputChange}
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
                                <input
                                    id="confirmPassword"
                                    className="ios-input"
                                    placeholder="Confirmar"
                                    required
                                    type={showPassword ? 'text' : 'password'}
                                    style={{ paddingLeft: '2.25rem' }}
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <label className="checkbox-container">
                            <input type="checkbox" required />
                            <span>
                                Acepto los <button type="button" onClick={() => navigate('/terms')} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', padding: 0, textDecoration: 'underline', font: 'inherit' }}>términos</button> y la <button type="button" onClick={() => navigate('/privacy')} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', padding: 0, textDecoration: 'underline', font: 'inherit' }}>política de privacidad</button>
                            </span>
                        </label>

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                            style={{
                                marginTop: '0.5rem',
                                padding: '0.875rem',
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
                                    CREANDO CUENTA...
                                </>
                            ) : 'CREAR CUENTA'}
                        </button>
                    </form>
                </div>

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

                <p style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)', opacity: 0.6, paddingTop: '1rem', paddingBottom: '2rem' }}>
                    © 2025 Almodovar Group Fitness
                </p>
            </div>
        </div>
    );
};
