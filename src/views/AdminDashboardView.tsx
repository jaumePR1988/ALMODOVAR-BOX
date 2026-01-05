import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { AdminUsersView } from './AdminUsersView';
import { CoachScheduleView } from './CoachScheduleView';
import { NotificationsView } from './NotificationsView';
import { CommunityChatView } from './CommunityChatView';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export const AdminDashboardView: React.FC = () => {
    const { userData, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('inicio');

    // Stats State
    const [stats, setStats] = useState({
        activeUsers: 0,
        pendingUsers: 0,
        classesToday: 12 // Hardcoded as per layout
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const usersRef = collection(db, 'users');
                const snapshot = await getDocs(usersRef);
                let total = 0;
                let pending = 0;
                snapshot.forEach(doc => {
                    total++;
                    if (!doc.data().approved) pending++;
                });
                setStats(prev => ({
                    ...prev,
                    activeUsers: total - pending,
                    pendingUsers: pending
                }));
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };
        fetchStats();
    }, []);

    const adminPhoto = userData?.photoURL || "https://lh3.googleusercontent.com/aida-public/AB6AXuAd01bjAYpy7bJvk9wdc3SdJ0FnGWkfipgGvydD9SmZhXrwCzOOgBCV-n170DCUF5TgZROm4iJ15xtm9CzxTlKWLeeJsAUJirjjrVIxzIm_9IOQk_IFwHnQ2ZMg0apNfXi1uJGiaSnFtcGhrjMhs4TuoxwZtJGuvtxpaOcMSNDw1j8maTJpI8yW6sB1DtY9EJXqVKe0A65Dp0UA2A3UOqW84EFbJWZph3Rt90CjV2ulG_IJHdr_n6t2ufxO7mBn2H6ICqOTO_Pdzxo";

    const renderHeader = () => (
        <header style={{
            flexShrink: 0,
            zIndex: 50,
            backgroundColor: 'rgba(var(--color-surface-rgb), 0.9)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--color-border)',
            padding: '1rem 1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '4.5rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                <div style={{ height: '2.5rem', width: '2.5rem', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--color-primary)', flexShrink: 0 }}>
                    <img alt="Admin Profile" src={adminPhoto} style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Panel de,</p>
                    <h1 style={{ fontWeight: 700, fontSize: '1.125rem', lineHeight: 1, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Administración</h1>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0, alignItems: 'center' }}>
                <div onClick={() => setActiveTab('chat')} className="size-8 rounded-full bg-color-surface border border-color-border flex items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <span className="material-symbols-outlined text-[18px] text-color-text-main">chat_bubble</span>
                </div>

                <div onClick={() => setActiveTab('notificaciones')} className="relative size-8 rounded-full bg-color-surface border border-color-border flex items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <span className="material-symbols-outlined text-[18px] text-color-text-main">notifications</span>
                    {stats.pendingUsers > 0 && (
                        <span className="absolute top-1.5 right-1.5 size-2 bg-brand-red rounded-full border-2 border-color-surface"></span>
                    )}
                </div>

                <button onClick={toggleTheme} className="size-8 flex items-center justify-center text-color-text-main cursor-pointer">
                    <span className="material-symbols-outlined text-[18px]">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
                </button>

                <button onClick={logout} className="size-8 flex items-center justify-center text-brand-red cursor-pointer">
                    <span className="material-symbols-outlined text-[20px]">logout</span>
                </button>
            </div>
        </header>
    );

    const renderContent = () => {
        if (activeTab === 'usuarios') return <AdminUsersView onBack={() => setActiveTab('inicio')} />;
        if (activeTab === 'agenda') return <CoachScheduleView onBack={() => setActiveTab('inicio')} onClassSelect={() => { }} />;
        if (activeTab === 'notificaciones') return <NotificationsView />;
        if (activeTab === 'chat') return <CommunityChatView />;

        return (
            <main className="animate-fade-in-up" style={{ padding: '1.5rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Hero Stats Card */}
                <section style={{
                    backgroundColor: 'var(--color-primary)', borderRadius: '1rem', padding: '1rem 1.25rem',
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    boxShadow: '0 4px 12px rgba(227, 0, 49, 0.2)'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, lineHeight: 1 }}>{stats.activeUsers}</h3>
                        </div>
                        <p style={{ fontSize: '0.75rem', opacity: 0.9, margin: '0.25rem 0 0 0', fontWeight: 500 }}>Activos</p>
                    </div>

                    <div style={{ width: '1px', height: '2rem', backgroundColor: 'rgba(255,255,255,0.2)' }}></div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, lineHeight: 1 }}>{stats.classesToday}</h3>
                        <p style={{ fontSize: '0.75rem', opacity: 0.9, margin: '0.25rem 0 0 0', fontWeight: 500 }}>Clases Hoy</p>
                    </div>

                    <div style={{ width: '1px', height: '2rem', backgroundColor: 'rgba(255,255,255,0.2)' }}></div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, lineHeight: 1 }}>{stats.pendingUsers}</h3>
                        <p style={{ fontSize: '0.75rem', opacity: 0.9, margin: '0.25rem 0 0 0', fontWeight: 500 }}>Pendientes</p>
                    </div>
                </section>

                {/* Grid Areas */}
                <section>
                    <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Panel de gestión</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <button onClick={() => setActiveTab('agenda')} className="card-premium h-32 flex flex-col items-center justify-center gap-2 text-center group active:scale-[0.98] transition-all border-color-border">
                            <div className="size-10 rounded-full bg-brand-red/10 text-brand-red flex items-center justify-center group-hover:bg-brand-red/20 transition-colors">
                                <span className="material-symbols-outlined text-[22px]">calendar_month</span>
                            </div>
                            <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-text-main)' }}>Gestión de clases</span>
                            <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{stats.classesToday} programadas</span>
                        </button>

                        <button onClick={() => setActiveTab('usuarios')} className="card-premium h-32 flex flex-col items-center justify-center gap-2 text-center group active:scale-[0.98] transition-all border-color-border">
                            <div className="size-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                                <span className="material-symbols-outlined text-[22px]">group</span>
                            </div>
                            <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-text-main)' }}>Gestión de usuarios</span>
                            <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{stats.pendingUsers} por aprobar</span>
                        </button>

                        <button className="card-premium h-32 col-span-2 flex items-center justify-between px-6 group active:scale-[0.98] transition-all border-color-border">
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[28px]">payments</span>
                                </div>
                                <div className="text-left">
                                    <span style={{ display: 'block', fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-text-main)' }}>4.250€</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Caja del Mes</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-1 rounded-full font-bold flex items-center gap-0.5">
                                    <span className="material-symbols-outlined text-[10px]">trending_up</span>+12%
                                </span>
                            </div>
                        </button>

                        <button className="card-premium h-24 flex flex-col items-center justify-center gap-1 group active:scale-[0.98] transition-all border-color-border">
                            <span className="material-symbols-outlined text-[24px] text-purple-500">sports_mma</span>
                            <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-text-main)' }}>Coaches</span>
                        </button>

                        <button className="card-premium h-24 flex flex-col items-center justify-center gap-1 group active:scale-[0.98] transition-all border-color-border">
                            <span className="material-symbols-outlined text-[24px] text-teal-500">emoji_events</span>
                            <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-text-main)' }}>Retos</span>
                        </button>
                    </div>
                </section>

                <button onClick={logout} className="btn-secondary flex items-center justify-center gap-3 active:scale-[0.98] transition-all" style={{ padding: '0.875rem' }}>
                    <span className="material-symbols-outlined text-color-text-muted">settings</span>
                    <span style={{ color: 'var(--color-text-main)', fontWeight: 700, fontSize: '0.875rem' }}>Configuración General</span>
                </button>
            </main>
        );
    };

    const NavItem = ({ icon, label, id }: { icon: string, label: string, id: string }) => (
        <a
            href="#"
            onClick={(e) => { e.preventDefault(); setActiveTab(id); }}
            style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem',
                color: activeTab === id ? 'var(--color-primary)' : 'var(--color-text-muted)',
                textDecoration: 'none', transition: 'color 0.2s', flex: 1
            }}
        >
            <span className="material-symbols-outlined" style={{ fontSize: '1.5rem', fontVariationSettings: `'FILL' ${activeTab === id ? 1 : 0}, 'wght' 400` }}>{icon}</span>
            <span style={{ fontSize: '10px', fontWeight: 600 }}>{label}</span>
        </a>
    );

    const isDetailedView = ['agenda', 'chat', 'notificaciones', 'usuarios'].includes(activeTab);

    return (
        <div className="app-container">
            {!isDetailedView && renderHeader()}
            <div className="scroll-container hide-scrollbar" style={{ overflowY: 'scroll', position: 'relative', scrollBehavior: 'smooth' }}>
                {renderContent()}
            </div>

            {/* Bottom Nav */}
            {!isDetailedView && (
                <nav style={{
                    flexShrink: 0,
                    width: '100%',
                    backgroundColor: 'var(--color-surface)',
                    borderTop: '1px solid var(--color-border)',
                    paddingBottom: 'env(safe-area-inset-bottom)',
                    height: '4.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    zIndex: 50,
                    paddingLeft: '1.5rem',
                    paddingRight: '1.5rem'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: '100%' }}>
                        <NavItem icon="grid_view" label="Panel" id="inicio" />
                        <NavItem icon="calendar_today" label="Agenda" id="agenda" />

                        <div style={{ position: 'relative', top: '-1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                            <button className="size-14 rounded-full bg-brand-dark text-white border-none shadow-[0_4px_10px_rgba(41,44,61,0.4)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.6)] flex items-center justify-center cursor-pointer z-10 active:scale-95 transition-transform">
                                <span className="material-symbols-outlined text-[2rem]">add</span>
                            </button>
                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Añadir</span>
                        </div>

                        <NavItem icon="chat" label="Chat" id="chat" />
                        <NavItem icon="person" label="Perfil" id="perfil" />
                    </div>
                </nav>
            )}
        </div>
    );
};
