import React from 'react';
import { BottomNav } from './BottomNav';
import { auth } from '../firebase';
import { useTheme } from '../context/ThemeContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

interface MainLayoutProps {
    children: React.ReactNode;
    userName?: string;
    userPhotoUrl?: string;
    hideNav?: boolean; // Prop to hide nav (e.g. chat, specific pages)
    hideHeader?: boolean;
    onChatClick?: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, userName, userPhotoUrl, hideNav, hideHeader, onChatClick }) => {
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();

    // Determine if we should show nav based on path (optional override)
    // If hideNav is passed explicitly, respect it. Otherwise check path.
    const shouldHideNav = hideNav;

    return (
        <div className="app-container">
            {/* Native-Like Fixed Header */}
            {!shouldHideNav && !hideHeader && (
                <header style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    backgroundColor: 'var(--color-surface)',
                    backdropFilter: 'blur(10px)',
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid var(--color-border)',
                    height: '4.5rem',
                    gap: '1rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0, paddingRight: '0.5rem' }}>
                        <div style={{
                            width: '2.5rem',
                            height: '2.5rem',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            border: '2px solid var(--color-primary)',
                            background: '#eee',
                            flexShrink: 0
                        }}>
                            <img
                                src={userPhotoUrl || "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150"}
                                alt="Avatar"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                        <div style={{ minWidth: 0 }}>
                            <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Hola, {userName || 'Atleta'}</p>
                            <h1 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-text-main)', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Vamos a entrenar 💪!</h1>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0, alignItems: 'center' }}>
                        <div
                            onClick={onChatClick}
                            style={{
                                width: '2.25rem',
                                height: '2.25rem',
                                backgroundColor: 'var(--color-surface)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--color-text-main)',
                                border: '1px solid var(--color-border)',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}>
                            <span className="material-icons-round" style={{ fontSize: '1.25rem' }}>chat_bubble_outline</span>
                        </div>
                        <div
                            onClick={() => navigate('/dashboard/notifications')}
                            style={{
                                position: 'relative',
                                width: '2.25rem',
                                height: '2.25rem',
                                backgroundColor: 'var(--color-surface)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: location.pathname.includes('notifications') ? 'var(--color-primary)' : 'var(--color-text-main)',
                                border: location.pathname.includes('notifications') ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                                overflow: 'hidden',
                                cursor: 'pointer'
                            }}>
                            <span className="material-icons-round" style={{ fontSize: '1.25rem' }}>notifications</span>
                            <span className="blink-pulse" style={{ position: 'absolute', top: '0.4rem', right: '0.4rem', width: '0.5rem', height: '0.5rem', backgroundColor: '#ef4444', border: '1.5px solid var(--color-surface)', borderRadius: '50%' }}></span>
                        </div>
                        <button
                            onClick={toggleTheme}
                            style={{ background: 'none', border: 'none', color: 'var(--color-text-main)', width: '2.25rem', height: '2.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                            title="Cambiar tema"
                        >
                            <span className="material-icons-round" style={{ fontSize: '1.25rem' }}>
                                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                            </span>
                        </button>
                        <button
                            onClick={() => auth.signOut()}
                            style={{ background: 'none', border: 'none', color: '#ef4444', width: '2.25rem', height: '2.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                            title="Cerrar sesión"
                        >
                            <span className="material-icons-round" style={{ fontSize: '1.25rem' }}>logout</span>
                        </button>
                    </div>
                </header>
            )}

            {/* Main Content Area with Animations */}
            <main style={{ flex: 1, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Native-Like Fixed Bottom Nav */}
            {!shouldHideNav && <BottomNav />}
        </div>
    );
};
