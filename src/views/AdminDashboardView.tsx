import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { AdminUsersList } from './AdminUsersList';
import { AdminCreateClassView } from './AdminCreateClassView';
import { AdminGroupsView } from './AdminGroupsView';
import { CoachScheduleView } from './CoachScheduleView';
import { AdminCoachesView } from './AdminCoachesView';
import { NotificationsView } from './NotificationsView';
import { CommunityChatView } from './CommunityChatView';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export const AdminDashboardView: React.FC = () => {
    const { userData, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('inicio');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Stats State
    const [stats, setStats] = useState({
        activeUsers: 0,
        pendingUsers: 0,
        classesToday: 12 // Hardcoded as per layout
    });
    const [statsError, setStatsError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Clear error state before fetching
                setStatsError(null);

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
            } catch (error: any) {
                console.error("Error fetching stats:", error);
                setStatsError("Error cargando datos. ¿Eres Admin?");
            }
        };
        fetchStats();
    }, []);

    const adminPhoto = userData?.photoURL || "https://lh3.googleusercontent.com/aida-public/AB6AXuAd01bjAYpy7bJvk9wdc3SdJ0FnGWkfipgGvydD9SmZhXrwCzOOgBCV-n170DCUF5TgZROm4iJ15xtm9CzxTlKWLeeJsAUJirjjrVIxzIm_9IOQk_IFwHnQ2ZMg0apNfXi1uJGiaSnFtcGhrjMhs4TuoxwZtJGuvtxpaOcMSNDw1j8maTJpI8yW6sB1DtY9EJXqVKe0A65Dp0UA2A3UOqW84EFbJWZph3Rt90CjV2ulG_IJHdr_n6t2ufxO7mBn2H6ICqOTO_Pdzxo";

    // Direct Return for Full Screen Views (Bypasses Dashboard Layout)
    if (activeTab === 'create-class') return <AdminCreateClassView onBack={() => setActiveTab('inicio')} />;
    if (activeTab === 'grupos') return <AdminGroupsView onBack={() => setActiveTab('inicio')} />;

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
        if (activeTab === 'inicio') {
            // ... (keep default dashboard rendering logic if it was inline, or simpler if extracted)
            // It seems "inicio" falls through to the return below.
        }

        if (activeTab === 'create-class') return <AdminCreateClassView onBack={() => setActiveTab('inicio')} />;
        if (activeTab === 'grupos') return <AdminGroupsView onBack={() => setActiveTab('inicio')} />;
        if (activeTab === 'usuarios') return <AdminUsersList onBack={() => setActiveTab('inicio')} />;
        if (activeTab === 'coaches') return <AdminCoachesView onBack={() => setActiveTab('inicio')} />;
        if (activeTab === 'agenda') return <CoachScheduleView onBack={() => setActiveTab('inicio')} onClassSelect={() => { }} />;
        if (activeTab === 'notificaciones') return <NotificationsView />;
        if (activeTab === 'chat') return <CommunityChatView />;

        return (
            <main className="animate-fade-in-up" style={{ padding: '1.5rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Hero Stats Card */}
                {statsError && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-500">
                        <span className="material-symbols-outlined">error</span>
                        <p className="font-bold text-sm">{statsError}</p>
                    </div>
                )}
                <section style={{ backgroundColor: 'var(--color-primary)', borderRadius: '1rem', padding: '1rem 1.25rem', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 12px rgba(227, 0, 49, 0.2)' }}>

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

                        <button onClick={() => setActiveTab('coaches')} className="card-premium h-24 flex flex-col items-center justify-center gap-1 group active:scale-[0.98] transition-all border-color-border">
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

    const isDetailedView = ['agenda', 'chat', 'notificaciones', 'usuarios', 'create-class', 'grupos'].includes(activeTab);

    return (
        <div className="app-container">
            {!isDetailedView && renderHeader()}

            {isDetailedView ? (
                <div className="flex-1 overflow-y-auto hide-scrollbar relative">
                    {renderContent()}
                </div>
            ) : (
                <div className="scroll-container hide-scrollbar" style={{ overflowY: 'scroll', position: 'relative', scrollBehavior: 'smooth' }}>
                    {renderContent()}
                </div>
            )}

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

                        <div style={{ position: 'relative', top: '-1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {/* Overlay Background */}
                            {isMenuOpen && (
                                <div
                                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-0 animate-fade-in"
                                    onClick={() => setIsMenuOpen(false)}
                                    style={{ zIndex: 0 }} // Below the buttons
                                ></div>
                            )}

                            {/* Satellite Buttons Container - Only visible when menu is open */}
                            {/* We use specific fixed positions relative to the center trigger for the semi-circle */}
                            <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center w-0 h-0 transition-all duration-300 ${isMenuOpen ? 'visible z-10' : 'invisible -z-10'}`}>

                                {/* 1. + Sesión (Far Left - 180deg/Left) */}
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        setActiveTab('create-class');
                                    }}
                                    className={`absolute flex flex-col items-center gap-1 transition-all duration-500 ease-out delay-100 group ${isMenuOpen ? '-translate-x-[140px] -translate-y-[10px] scale-100 opacity-100' : 'translate-x-0 translate-y-0 scale-50 opacity-0'}`}
                                >
                                    <div className="size-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/30 flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:brightness-110 transition-all">
                                        <span className="material-symbols-outlined text-[24px]">fitness_center</span>
                                    </div>
                                    <span className="text-[11px] font-bold text-white bg-zinc-900/90 px-2.5 py-0.5 rounded-md shadow-sm absolute -bottom-7 whitespace-nowrap transition-all">Sesión</span>
                                </button>

                                {/* 2. + Grupo (Top Left - 135deg) */}
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        setActiveTab('grupos');
                                    }}
                                    className={`absolute flex flex-col items-center gap-1 transition-all duration-500 ease-out delay-[50ms] group ${isMenuOpen ? '-translate-x-[110px] -translate-y-[90px] scale-100 opacity-100' : 'translate-x-0 translate-y-0 scale-50 opacity-0'}`}
                                >
                                    <div className="size-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/30 flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:brightness-110 transition-all">
                                        <span className="material-symbols-outlined text-[28px]">groups</span>
                                    </div>
                                    <span className="text-[11px] font-bold text-white bg-zinc-900/90 px-2.5 py-0.5 rounded-md shadow-sm absolute -bottom-7 whitespace-nowrap transition-all">Grupo</span>
                                </button>

                                {/* 3. + Coach (Top Center - 90deg) */}
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        setActiveTab('coaches');
                                    }}
                                    className={`absolute flex flex-col items-center gap-1 transition-all duration-500 ease-out delay-0 group ${isMenuOpen ? 'translate-x-0 -translate-y-[150px] scale-100 opacity-100' : 'translate-x-0 translate-y-0 scale-50 opacity-0'}`}
                                >
                                    <div className="size-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-xl shadow-purple-500/40 flex items-center justify-center border-2 border-white/10 group-hover:scale-110 group-hover:brightness-110 transition-all">
                                        <span className="material-symbols-outlined text-[32px]">sports_mma</span>
                                    </div>
                                    <span className="text-[11px] font-bold text-white bg-zinc-900/90 px-2.5 py-0.5 rounded-md shadow-sm absolute -bottom-8 whitespace-nowrap transition-all">Coach</span>
                                </button>

                                {/* 4. + Noticia (Top Right - 45deg) */}
                                <button
                                    className={`absolute flex flex-col items-center gap-1 transition-all duration-500 ease-out delay-[50ms] group ${isMenuOpen ? 'translate-x-[110px] -translate-y-[90px] scale-100 opacity-100' : 'translate-x-0 translate-y-0 scale-50 opacity-0'}`}
                                >
                                    <div className="size-14 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30 flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:brightness-110 transition-all">
                                        <span className="material-symbols-outlined text-[28px]">campaign</span>
                                    </div>
                                    <span className="text-[11px] font-bold text-white bg-zinc-900/90 px-2.5 py-0.5 rounded-md shadow-sm absolute -bottom-7 whitespace-nowrap transition-all">Noticia</span>
                                </button>

                                {/* 5. + Reto (Far Right - 0deg) */}
                                <button
                                    className={`absolute flex flex-col items-center gap-1 transition-all duration-500 ease-out delay-100 group ${isMenuOpen ? 'translate-x-[140px] -translate-y-[10px] scale-100 opacity-100' : 'translate-x-0 translate-y-0 scale-50 opacity-0'}`}
                                >
                                    <div className="size-12 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 text-white shadow-lg shadow-teal-500/30 flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:brightness-110 transition-all">
                                        <span className="material-symbols-outlined text-[24px]">emoji_events</span>
                                    </div>
                                    <span className="text-[11px] font-bold text-white bg-zinc-900/90 px-2.5 py-0.5 rounded-md shadow-sm absolute -bottom-7 whitespace-nowrap transition-all">Reto</span>
                                </button>

                            </div>

                            {/* Main Trigger Button */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className={`size-14 rounded-full bg-brand-red text-white border-none shadow-[0_4px_10px_rgba(227,0,49,0.4)] flex items-center justify-center cursor-pointer z-20 active:scale-95 transition-all duration-300 ${isMenuOpen ? 'bg-black rotate-[135deg] scale-90' : 'hover:scale-105 hover:shadow-brand-red/60'}`}
                            >
                                <span className="material-symbols-outlined text-[2rem]">{isMenuOpen ? 'add' : 'add'}</span>
                            </button>
                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem', opacity: isMenuOpen ? 0 : 1, transition: 'opacity 0.2s' }}>
                                Añadir
                            </span>
                        </div>

                        <NavItem icon="chat" label="Chat" id="chat" />
                        <NavItem icon="person" label="Perfil" id="perfil" />
                    </div>
                </nav>
            )}
        </div>
    );
};
