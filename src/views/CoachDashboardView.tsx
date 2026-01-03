import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const CoachDashboardView: React.FC = () => {
    const { userData, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('classes');

    // Mock Data for Classes
    const todayClasses = [
        { id: 1, time: '09:00', title: 'Open Box', athletes: 4, max: 12, status: 'active' },
        { id: 2, time: '18:00', title: 'Fit Boxing WOD', athletes: 12, max: 12, status: 'full' },
        { id: 3, time: '19:00', title: 'Fit Boxing WOD', athletes: 8, max: 12, status: 'upcoming' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'classes':
                return (
                    <div style={{ paddingBottom: '6rem' }}>
                        <div className="section-padding">
                            <h2 className="heading-section">Clases de Hoy</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {todayClasses.map(cls => (
                                    <div key={cls.id} style={{
                                        backgroundColor: 'var(--color-surface)',
                                        borderRadius: 'var(--radius-xl)',
                                        padding: '1rem',
                                        border: '1px solid var(--color-border)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                                <span style={{ fontWeight: 800, fontSize: '1.125rem' }}>{cls.time}</span>
                                                {cls.status === 'full' && (
                                                    <span style={{ fontSize: '0.625rem', backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '0.125rem 0.375rem', borderRadius: '4px', fontWeight: 700 }}>LLENO</span>
                                                )}
                                            </div>
                                            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>{cls.title}</h3>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>
                                                {cls.athletes} / {cls.max} Atletas
                                            </p>
                                        </div>
                                        <button style={{
                                            backgroundColor: 'var(--color-bg)',
                                            color: 'var(--color-primary)',
                                            border: '1px solid var(--color-border)',
                                            padding: '0.5rem',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <span className="material-icons-round">chevron_right</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 'athletes':
                return <div className="section-padding text-center" style={{ marginTop: '2rem' }}>Directorio de Atletas (Próximamente)</div>;
            case 'profile':
                return (
                    <div className="section-padding" style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <button onClick={logout} style={{ color: 'var(--color-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto' }}>
                            <span className="material-icons-round">logout</span>
                            Cerrar Sesión
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', color: 'var(--color-text-main)' }}>
            {/* Header */}
            <header style={{
                position: 'sticky',
                top: 0,
                zIndex: 40,
                backgroundColor: 'var(--color-bg)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid var(--color-border)',
                padding: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Hola Coach</h1>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>{userData?.firstName || 'Entrenador'}</p>
                </div>
                <button onClick={toggleTheme} className="theme-toggle-btn">
                    <span className="material-icons-round" style={{ fontSize: '1.25rem' }}>
                        {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                    </span>
                </button>
            </header>

            {renderContent()}

            {/* Coach Bottom Nav */}
            <nav style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'var(--color-surface)',
                borderTop: '1px solid var(--color-border)',
                display: 'flex',
                justifyContent: 'space-around',
                padding: '0.75rem',
                paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))',
                zIndex: 50
            }}>
                <NavButton icon="fitness_center" label="Clases" active={activeTab === 'classes'} onClick={() => setActiveTab('classes')} />
                <NavButton icon="groups" label="Atletas" active={activeTab === 'athletes'} onClick={() => setActiveTab('athletes')} />
                <NavButton icon="person" label="Perfil" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
            </nav>
        </div>
    );
};

const NavButton: React.FC<{ icon: string, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
            transition: 'all 0.2s ease'
        }}
    >
        <span className="material-icons-round" style={{ fontSize: '1.5rem', marginBottom: '0.125rem' }}>{icon}</span>
        <span style={{ fontSize: '0.625rem', fontWeight: active ? 700 : 500 }}>{label}</span>
    </button>
);
