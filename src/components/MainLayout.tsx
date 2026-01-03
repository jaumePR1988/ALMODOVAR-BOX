import React from 'react';
import { BottomNav } from './BottomNav';
import { auth } from '../firebase';

interface MainLayoutProps {
    children: React.ReactNode;
    activeTab: string;
    onTabChange: (tab: string) => void;
    userName?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, activeTab, onTabChange, userName }) => {
    return (
        <div className="app-container">
            {/* Native-Like Fixed Header */}
            <header style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                backgroundColor: 'var(--color-surface)',
                backdropFilter: 'blur(10px)',
                padding: '1rem 1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--color-border)',
                height: '4.5rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
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
                            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150"
                            alt="Avatar"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                    <div style={{ minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Hola, {userName || 'Atleta'}</p>
                        <h1 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--color-text-main)', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Vamos a entrenar 💪!</h1>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                    <div style={{
                        position: 'relative',
                        width: '2.5rem',
                        height: '2.5rem',
                        backgroundColor: 'var(--color-surface)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-text-main)',
                        border: '1px solid var(--color-border)',
                        overflow: 'hidden'
                    }}>
                        <span className="material-icons-round" style={{ fontSize: '1.5rem' }}>notifications</span>
                        <span className="blink-pulse" style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', width: '0.6rem', height: '0.6rem', backgroundColor: '#ef4444', border: '2px solid var(--color-surface)', borderRadius: '50%' }}></span>
                    </div>
                    <button
                        onClick={() => auth.signOut()}
                        style={{ background: 'none', border: 'none', color: '#ef4444', width: '2.5rem', height: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        title="Cerrar sesión"
                    >
                        <span className="material-icons-round" style={{ fontSize: '1.5rem' }}>logout</span>
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main style={{ flex: 1, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                {children}
            </main>

            {/* Native-Like Fixed Bottom Nav */}
            <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
        </div>
    );
};
