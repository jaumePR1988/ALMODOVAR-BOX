import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';

const BACKGROUND_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuAdq0F6ORP3wcsQtUD-WVIZvVjbFfAITVLWIx6qLMRiUjN4wq0MNDCPAaDgHSLW_fT6t_j3Hqdvrr0bu7zDl7bQ4qPNdp_E2_K5yySDoivzUa2B0rfZmqGK3rUNDiq0nnIzlrcM5YCY0jY6BIArwuOZrSzCnVAgZyVnI-rVFHEWVqsA-zb_jAccmhW2G72rI-rNDdsMl26ldAcH3PRLohgjv9myOFiRhLWXJdTzrM14HmwweaHtCcIf_Qa8XGlgfGVC_cDYhQqI1dE";

export const SplashScreen: React.FC<{ onComplete: () => void, loading?: boolean }> = ({ onComplete, loading = false }) => {
    const [timerDone, setTimerDone] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimerDone(true);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (timerDone && !loading && !isFadingOut) {
            setIsFadingOut(true);
            setTimeout(onComplete, 800);
        }
    }, [timerDone, loading, isFadingOut, onComplete]);

    return (
        <div
            className={`splash-wrapper ${isFadingOut ? 'fade-out' : ''}`}
            style={{
                position: 'fixed',
                top: 0,
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
                maxWidth: '480px',
                zIndex: 9999,
                backgroundColor: 'var(--color-bg)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                overflow: 'hidden',
                transition: 'opacity 0.8s ease-in-out, transform 0.6s ease-out'
            }}
        >
            {/* Background Overlay */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                <img
                    src={BACKGROUND_IMAGE}
                    alt="Fitness atmosphere"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'grayscale(100%)',
                        opacity: 0.15
                    }}
                />
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, rgba(26,26,41,0.9), rgba(26,26,41,0.8), rgba(26,26,41,1))'
                }}></div>
            </div>

            {/* Main Content */}
            <div style={{ position: 'relative', zIndex: 10, flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: '400px', padding: '0 2rem' }}>

                {/* Logo Circle */}
                <div className="animate-fade-in-up" style={{ marginBottom: '3rem' }}>
                    <div style={{
                        width: '180px',
                        height: '180px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                    }}>
                        <div className="animate-pulse-slow" style={{
                            position: 'absolute',
                            inset: 0,
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-primary-light)',
                            zIndex: -1
                        }}></div>
                        <img
                            src={logo}
                            alt="ALMODOVARBOX Logo"
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                    </div>
                </div>

                {/* Text Body */}
                <div className="animate-fade-in-up" style={{ textAlign: 'center', animationDelay: '0.2s' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', lineHeight: 1.1, letterSpacing: '-0.025em' }}>
                        Almodovar<br />
                        <span style={{ color: 'var(--color-primary)' }}>Group</span>
                    </h1>
                    <p style={{ marginTop: '1rem', fontSize: '0.75rem', fontWeight: 500, color: '#94a3b8', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                        Fit Boxing & WOD
                    </p>
                </div>

                <div className="animate-fade-in-up" style={{ marginTop: '2rem', textAlign: 'center', maxWidth: '280px', animationDelay: '0.4s' }}>
                    <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6 }}>
                        Transforma tu vida en la primera sala de entrenamiento híbrida del vallés.
                    </p>
                </div>
            </div>

            {/* Footer Info */}
            <div className="animate-fade-in-up" style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '400px', padding: '0 2rem 3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', animationDelay: '0.6s' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="loader"></div>
                    <span style={{ fontSize: '0.75rem', color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                        Cargando...
                    </span>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '10px', color: '#333' }}>
                        v2.0.1 © 2025 Almodovar Group
                    </p>
                </div>
            </div>

            <span className="sr-only">Cargando aplicación Almodovar Group</span>

            <style>{`
        .fade-out { opacity: 0; }
        .splash-wrapper { opacity: 1; }
      `}</style>
        </div>
    );
};
