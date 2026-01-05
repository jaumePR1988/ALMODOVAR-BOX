import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { AdminUsersView } from './AdminUsersView';
import { CoachScheduleView } from './CoachScheduleView'; // Reusing for now
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export const AdminDashboardView: React.FC = () => {
    const { userData, logout } = useAuth();
    const { theme } = useTheme(); // ThemeContext might fight with Tailwind's dark mode initially, but user asked for "light" class in HTML. 
    // I will ignore theme context for now and strictly follow their "light" design or assume tailwind handles it via 'class'.

    const [activeTab, setActiveTab] = useState('inicio');

    // Stats State
    const [stats, setStats] = useState({
        totalUsers: 0,
        pendingUsers: 0,
        activeUsers: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

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

            setStats({
                totalUsers: total,
                pendingUsers: pending,
                activeUsers: total - pending
            });
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    const adminName = userData?.firstName || 'Admin';
    const adminPhoto = userData?.photoURL || `https://ui-avatars.com/api/?name=${adminName}&background=E30031&color=fff`;
    const today = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });

    // Helper to render the specific view content or the main dashboard
    const renderMainContent = () => {
        if (activeTab === 'usuarios') return <AdminUsersView />;
        if (activeTab === 'agenda') return <CoachScheduleView onBack={() => setActiveTab('inicio')} onClassSelect={() => { }} />;

        // Default: 'inicio' (The Dashboard Grid)
        return (
            <div className="animate-fade-in-up">
                <div className="flex items-center justify-between mb-3 px-1">
                    <h3 className="text-lg font-bold text-brand-dark uppercase tracking-wide">Resumen Hoy</h3>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{today}</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white p-3 rounded-xl shadow-soft border border-gray-100 flex flex-col items-center justify-center text-center gap-1 group active:scale-95 transition-transform">
                        <div className="size-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-1 group-hover:bg-blue-100 transition-colors">
                            <span className="material-symbols-outlined text-[18px]">group</span>
                        </div>
                        <span className="text-2xl font-extrabold text-brand-dark leading-none">{stats.activeUsers}</span>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide leading-tight">Usuarios<br />Activos</span>
                    </div>
                    {/* Placeholder for Classes Today */}
                    <div className="bg-white p-3 rounded-xl shadow-soft border border-gray-100 flex flex-col items-center justify-center text-center gap-1 group active:scale-95 transition-transform">
                        <div className="size-8 rounded-full bg-brand-red/10 text-brand-red flex items-center justify-center mb-1 group-hover:bg-brand-red/20 transition-colors">
                            <span className="material-symbols-outlined text-[18px]">fitness_center</span>
                        </div>
                        <span className="text-2xl font-extrabold text-brand-dark leading-none">--</span>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide leading-tight">Clases<br />Hoy</span>
                    </div>
                    {/* Placeholder for Pending (mapped to Pending Users for now?) or Payments */}
                    <div
                        onClick={() => setActiveTab('usuarios')}
                        className="bg-white p-3 rounded-xl shadow-soft border border-gray-100 flex flex-col items-center justify-center text-center gap-1 group active:scale-95 transition-transform cursor-pointer">
                        <div className={`size-8 rounded-full ${stats.pendingUsers > 0 ? 'bg-orange-50 text-orange-500' : 'bg-green-50 text-green-500'} flex items-center justify-center mb-1 group-hover:bg-orange-100 transition-colors`}>
                            <span className="material-symbols-outlined text-[18px]">{stats.pendingUsers > 0 ? 'pending_actions' : 'check_circle'}</span>
                        </div>
                        <span className="text-2xl font-extrabold text-brand-dark leading-none">{stats.pendingUsers}</span>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide leading-tight">Usuarios<br />Pend.</span>
                    </div>
                </div>

                <div className="space-y-4 mt-6">
                    <h3 className="text-lg font-bold text-brand-dark uppercase tracking-wide px-1">Áreas de Gestión</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setActiveTab('agenda')}
                            className="bg-white p-4 rounded-2xl shadow-soft border border-gray-100 text-left hover:shadow-md transition-all active:scale-[0.98] group relative overflow-hidden">
                            <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="material-symbols-outlined text-[64px] text-brand-red">calendar_month</span>
                            </div>
                            <div className="size-10 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center mb-3">
                                <span className="material-symbols-outlined text-[24px]">calendar_month</span>
                            </div>
                            <h4 className="font-bold text-brand-dark text-sm mb-1">Gestión de Clases</h4>
                            <p className="text-[10px] text-gray-500 font-medium">Programar WODs</p>
                        </button>

                        <button
                            onClick={() => setActiveTab('usuarios')}
                            className="bg-white p-4 rounded-2xl shadow-soft border border-gray-100 text-left hover:shadow-md transition-all active:scale-[0.98] group relative overflow-hidden">
                            <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="material-symbols-outlined text-[64px] text-blue-600">person_add</span>
                            </div>
                            <div className="size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                                <span className="material-symbols-outlined text-[24px]">group</span>
                            </div>
                            <h4 className="font-bold text-brand-dark text-sm mb-1">Gestión de Usuarios</h4>
                            <p className="text-[10px] text-gray-500 font-medium">{stats.pendingUsers} pendientes</p>
                        </button>

                        <button className="bg-brand-dark p-4 rounded-2xl shadow-soft text-left hover:shadow-lg transition-all active:scale-[0.98] group relative overflow-hidden col-span-2">
                            <div className="absolute right-0 bottom-0 p-4 opacity-10">
                                <span className="material-symbols-outlined text-[80px] text-white">payments</span>
                            </div>
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="size-10 rounded-xl bg-white/10 text-white flex items-center justify-center mb-3 backdrop-blur-sm">
                                        <span className="material-symbols-outlined text-[24px]">payments</span>
                                    </div>
                                    <h4 className="font-bold text-white text-base mb-1">Pagos Recibidos</h4>
                                    <p className="text-xs text-gray-300 font-medium">Próximamente</p>
                                </div>
                                <div className="text-right">
                                    <span className="block text-2xl font-bold text-white">0 €</span>
                                </div>
                            </div>
                        </button>

                        <button className="bg-gradient-to-br from-brand-red to-red-600 p-4 rounded-2xl shadow-soft text-left hover:shadow-lg transition-all active:scale-[0.98] group relative overflow-hidden col-span-2 text-white">
                            <div className="absolute right-0 top-0 p-3 opacity-20">
                                <span className="material-symbols-outlined text-[64px]">campaign</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                    <span className="material-symbols-outlined text-[24px]">send</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-base">Mensajería Push</h4>
                                    <p className="text-xs text-white/80 font-medium">Enviar notificación a todos</p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>

                <button onClick={logout} className="w-full flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200 group active:bg-gray-100 transition-colors mt-6">
                    <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[20px]">logout</span>
                        </div>
                        <span className="text-sm font-bold text-brand-dark">Cerrar Sesión</span>
                    </div>
                    <span className="material-symbols-outlined text-gray-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
                </button>
            </div>
        );
    };

    return (
        <div className="font-display bg-background-light text-text-primary min-h-screen flex flex-col overflow-x-hidden antialiased">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
                <div className="flex items-center p-4 pb-4 justify-between">
                    <button className="text-text-primary flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                        <span className="material-symbols-outlined text-[24px]">menu</span>
                    </button>
                    <h2 className="text-brand-dark text-lg font-bold leading-tight tracking-tight flex-1 text-center uppercase">Panel de Control</h2>
                    <div className="flex size-10 items-center justify-end">
                        <button className="flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-brand-red p-0.5 hover:bg-gray-100 transition-colors">
                            <img alt="Profile" className="size-full rounded-full object-cover" src={adminPhoto} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 px-4 py-6 space-y-6 pb-24">
                {renderMainContent()}
            </main>

            {/* Bottom Nav */}
            <nav className="fixed bottom-0 w-full bg-white border-t border-gray-100 pb-safe pt-2 px-6 z-40">
                <div className="flex justify-between items-end pb-2">
                    <button
                        onClick={() => setActiveTab('inicio')}
                        className={`flex flex-col items-center gap-1 w-16 ${activeTab === 'inicio' ? 'text-brand-red' : 'text-gray-400 hover:text-brand-dark'} transition-colors`}>
                        <span className={`material-symbols-outlined text-[28px] ${activeTab === 'inicio' ? 'filled' : ''}`}>grid_view</span>
                        <span className="text-[10px] font-bold">Panel</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('agenda')}
                        className={`flex flex-col items-center gap-1 w-16 ${activeTab === 'agenda' ? 'text-brand-red' : 'text-gray-400 hover:text-brand-dark'} transition-colors`}>
                        <span className="material-symbols-outlined text-[28px]">calendar_today</span>
                        <span className="text-[10px] font-medium">Agenda</span>
                    </button>

                    <div className="relative -top-6">
                        <button className="flex items-center justify-center size-14 rounded-full bg-brand-dark shadow-[0_8px_20px_rgba(41,44,61,0.3)] text-white transition-transform active:scale-95">
                            <span className="material-symbols-outlined text-[28px]">add</span>
                        </button>
                    </div>

                    <button className="flex flex-col items-center gap-1 w-16 text-gray-400 hover:text-brand-dark transition-colors">
                        <span className="material-symbols-outlined text-[28px]">chat</span>
                        <span className="text-[10px] font-medium">Chat</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('usuarios')}
                        className={`flex flex-col items-center gap-1 w-16 ${activeTab === 'usuarios' ? 'text-brand-red' : 'text-gray-400 hover:text-brand-dark'} transition-colors`}>
                        <span className="material-symbols-outlined text-[28px]">person</span>
                        <span className="text-[10px] font-medium">Usuarios</span>
                    </button>
                </div>
            </nav>
        </div>
    );
};
