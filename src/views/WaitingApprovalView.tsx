import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext';

export const WaitingApprovalView: React.FC = () => {
    const navigate = useNavigate();
    const { isApproved, user } = useAuth();

    // Si el usuario es aprobado mientras está en esta pantalla, redirigir al login (que le llevará al dashboard)
    if (isApproved) {
        navigate('/login', { replace: true });
    }

    const handleSignOut = async () => {
        await auth.signOut();
        navigate('/login');
    };

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
                    <span className="material-icons-outlined" style={{ fontSize: '3rem', color: '#22c55e' }}>hourglass_empty</span>
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-main)' }}>Perfil Pendiente</h2>
                <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6', fontSize: '0.9rem' }}>
                    Tu cuenta ha sido creada correctamente, pero aún está <strong>pendiente de validación</strong> por parte del administrador.
                </p>
                <div style={{
                    backgroundColor: 'var(--color-bg)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid var(--color-border)',
                    width: '100%'
                }}>
                    <p style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.85rem' }}>
                        Recibirás acceso una vez que hayamos verificado tu perfil.
                    </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
                    <button
                        className="btn-primary"
                        onClick={() => window.location.reload()}
                        style={{ marginTop: '0.5rem' }}
                    >
                        COMPROBAR ESTADO
                    </button>
                    <button
                        className="btn-secondary"
                        onClick={handleSignOut}
                        style={{ padding: '0.75rem' }}
                    >
                        CERRAR SESIÓN
                    </button>
                </div>

                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                    Identificado como: <br /> <strong>{user?.email}</strong>
                </p>
            </div>
        </div>
    );
};
