import React from 'react';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

interface BaseLegalViewProps {
    title: string;
    children: React.ReactNode;
}

export const BaseLegalView: React.FC<BaseLegalViewProps> = ({ title, children }) => {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    return (
        <div className="login-page" style={{
            padding: '1.5rem',
            paddingTop: '5rem', /* Extra space for fixed back button */
            transition: 'background-color 0.3s ease',
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

            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                style={{
                    position: 'fixed',
                    top: '1rem',
                    left: '1rem',
                    zIndex: 50,
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-main)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s ease'
                }}
                aria-label="Volver atrás"
            >
                <span className="material-icons-outlined" style={{ fontSize: '1.25rem' }}>arrow_back</span>
            </button>

            {/* Header */}
            <div className="animate-fade-in-down" style={{
                width: '100%',
                maxWidth: '600px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: '2rem',
                marginTop: '3.5rem'
            }}>
                <div style={{
                    width: '4rem',
                    height: '4rem',
                    marginBottom: '1rem',
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
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-main)', textAlign: 'center' }}>
                    {title}
                </h1>
            </div>

            {/* Content Card */}
            <div className="animate-fade-in-up" style={{
                width: '100%',
                maxWidth: '600px',
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--radius-2xl)',
                boxShadow: 'var(--shadow-soft)',
                padding: '2rem',
                marginBottom: '2rem',
                color: 'var(--color-text-main)',
                lineHeight: '1.7',
                fontSize: '0.95rem'
            }}>
                {children}
            </div>

            <p style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', opacity: 0.6, paddingBottom: '2rem', textAlign: 'center' }}>
                © 2025 Almodovar Group Fitness
            </p>
        </div>
    );
};
