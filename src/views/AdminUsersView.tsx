import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    group?: string;
    approved?: boolean;
    photoURL?: string;
    plan?: string;
}

interface AdminUsersViewProps {
    onBack?: () => void;
}

export const AdminUsersView: React.FC<AdminUsersViewProps> = ({ onBack }) => {
    const { userData } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'overview' | 'pending'>('overview');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const usersRef = collection(db, 'users');
            const querySnapshot = await getDocs(usersRef);

            const fetchedUsers: User[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                fetchedUsers.push({
                    id: doc.id,
                    firstName: data.firstName || data.displayName?.split(' ')[0] || 'User',
                    lastName: data.lastName || data.displayName?.split(' ').slice(1).join(' ') || '',
                    email: data.email,
                    role: data.role || 'cliente',
                    group: data.group,
                    approved: data.approved,
                    photoURL: data.photoURL,
                    plan: data.plan
                });
            });
            setUsers(fetchedUsers);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (userId: string) => {
        try {
            await updateDoc(doc(db, 'users', userId), {
                approved: true
            });
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, approved: true } : u));
        } catch (error) {
            console.error("Error approving user:", error);
        }
    };

    const pendingUsers = users.filter(u => !u.approved);
    const activeUsers = users.filter(u => u.approved);

    const filteredActiveUsers = activeUsers.filter(user => {
        const matchesSearch = (user.firstName + ' ' + user.lastName + user.email).toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const getPlanColor = (plan?: string) => {
        if (plan === 'liebre') return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-100' };
        if (plan === 'gacela') return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100' };
        return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-100' };
    };

    const getGroupColor = (group?: string) => {
        if (group === 'afternoon') return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' };
        if (group === 'morning') return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-100' };
        return { bg: 'bg-brand-dark', text: 'text-white', border: 'border-brand-dark' };
    };

    const getGroupName = (group?: string) => {
        if (group === 'afternoon') return 'Mesocranios';
        if (group === 'morning') return 'AlmodovarFit';
        if (group === 'fitboxing') return 'Fit Boxing';
        return 'AlmodovarBox';
    };

    const getPlanPrice = (plan?: string) => {
        if (plan === 'liebre') return '35€';
        if (plan === 'gacela') return '55€';
        return '45€';
    };

    const adminPhoto = userData?.photoURL || "https://lh3.googleusercontent.com/aida-public/AB6AXuAd01bjAYpy7bJvk9wdc3SdJ0FnGWkfipgGvydD9SmZhXrwCzOOgBCV-n170DCUF5TgZROm4iJ15xtm9CzxTlKWLeeJsAUJirjjrVIxzIm_9IOQk_IFwHnQ2ZMg0apNfXi1uJGiaSnFtcGhrjMhs4TuoxwZtJGuvtxpaOcMSNDw1j8maTJpI8yW6sB1DtY9EJXqVKe0A65Dp0UA2A3UOqW84EFbJWZph3Rt90CjV2ulG_IJHdr_n6t2ufxO7mBn2H6ICqOTO_Pdzxo";

    const renderHeader = (title: string, backAction: () => void) => (
        <header className="sticky top-0 z-50 bg-[var(--color-surface)]/95 backdrop-blur-md shadow-sm pt-[env(safe-area-inset-top)] transition-colors duration-300">
            <div className="flex items-center p-4 justify-between h-[4.5rem]">
                <button onClick={backAction} className="text-[var(--color-text-main)] flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-[var(--color-bg)] transition-colors">
                    <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                </button>
                <h2 className="text-[var(--color-text-main)] text-lg font-bold leading-tight tracking-tight flex-1 text-center uppercase">{title}</h2>
                <div className="flex size-10 items-center justify-end">
                    <button className="flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-brand-red p-0.5 hover:bg-[var(--color-bg)] transition-colors">
                        <img alt="Profile" className="size-full rounded-full object-cover" src={adminPhoto} />
                    </button>
                </div>
            </div>
        </header>
    );

    if (viewMode === 'pending') {
        return (
            <div className="min-h-screen bg-[var(--color-bg)] flex flex-col font-display antialiased transition-colors duration-300">
                {renderHeader("Pendientes", () => setViewMode('overview'))}
                <main className="flex-1 px-4 py-6 space-y-4">
                    {pendingUsers.length === 0 ? (
                        <div className="text-center py-10">
                            <span className="material-symbols-outlined text-[48px] text-gray-300">check_circle</span>
                            <p className="text-gray-500 mt-2 font-medium">No hay peticiones pendientes</p>
                        </div>
                    ) : (
                        pendingUsers.map(user => (
                            <div key={user.id} className="bg-[var(--color-surface)] p-4 rounded-xl shadow-soft border border-[var(--color-border)] flex flex-col gap-4 animate-fade-in-up transition-colors duration-300">
                                <div className="flex gap-4">
                                    <div className="size-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-lg shrink-0 overflow-hidden">
                                        {user.photoURL ? <img src={user.photoURL} alt={user.firstName} className="size-full object-cover" /> : user.firstName[0]}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-[var(--color-text-main)] text-base leading-tight">{user.firstName} {user.lastName}</h4>
                                        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{user.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleApprove(user.id)}
                                    className="w-full py-2.5 bg-brand-red text-white font-bold rounded-lg shadow-lg shadow-brand-red/20 active:scale-[0.98] transition-transform"
                                >
                                    Aprobar Acceso
                                </button>
                            </div>
                        ))
                    )}
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--color-bg)] flex flex-col font-display antialiased overflow-x-hidden transition-colors duration-300">
            {renderHeader("Gestión de Usuarios", onBack || (() => { }))}

            <main className="flex-1 px-4 py-6 space-y-6 pb-24">
                {/* Hero Card: Pending Requests */}
                <button
                    onClick={() => setViewMode('pending')}
                    className="w-full relative overflow-hidden bg-brand-dark rounded-2xl shadow-soft p-5 text-left text-white group cursor-pointer active:scale-[0.98] transition-transform"
                >
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="material-symbols-outlined text-[100px]">person_add</span>
                    </div>
                    <div className="relative z-10 flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${pendingUsers.length > 0 ? 'animate-pulse' : ''}`}>
                                    {pendingUsers.length > 0 ? 'Atención requerida' : 'Sin pendientes'}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold mb-1">Peticiones Pendientes</h3>
                            <p className="text-sm text-gray-300 font-medium">Revisar solicitudes de acceso</p>
                        </div>
                        <div className="bg-brand-red size-12 rounded-xl flex items-center justify-center shadow-lg border-2 border-brand-dark shrink-0">
                            <span className="text-xl font-bold">{pendingUsers.length}</span>
                        </div>
                    </div>
                    <div className="mt-4 flex -space-x-2 overflow-hidden">
                        {pendingUsers.slice(0, 5).map(u => (
                            <div key={u.id} className="size-8 rounded-full ring-2 ring-brand-dark bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500 overflow-hidden">
                                {u.photoURL ? <img src={u.photoURL} className="size-full object-cover" /> : u.firstName[0]}
                            </div>
                        ))}
                    </div>
                </button>

                {/* Search & Statistics */}
                <div style={{ top: 'calc(4.5rem + env(safe-area-inset-top) - 1px)' }} className="sticky z-30 bg-[var(--color-bg)] py-2 -mx-4 px-4 transition-all">
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-[var(--color-text-muted)]">search</span>
                            </div>
                            <input
                                className="block w-full pl-10 pr-3 py-3 border-none rounded-xl bg-[var(--color-surface)] shadow-soft placeholder-[var(--color-text-muted)]/50 focus:ring-2 focus:ring-brand-red text-sm font-medium text-[var(--color-text-main)] transition-colors"
                                placeholder="Buscar usuario por nombre..."
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="bg-[var(--color-surface)] size-[46px] shrink-0 rounded-xl shadow-soft text-[var(--color-text-main)] hover:bg-[var(--color-bg)] transition-colors border border-transparent focus:ring-2 focus:ring-brand-red flex items-center justify-center">
                            <span className="material-symbols-outlined">filter_list</span>
                        </button>
                    </div>
                </div>

                {/* Active Users List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-lg font-bold text-[var(--color-text-main)] uppercase tracking-wide">Usuarios Inscritos</h3>
                        <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wide">{activeUsers.length} Total</span>
                    </div>

                    {loading ? (
                        <p className="text-center text-[var(--color-text-muted)] py-10">Cargando usuarios...</p>
                    ) : (
                        filteredActiveUsers.map(user => {
                            const planStyles = getPlanColor(user.plan);
                            const groupStyles = getGroupColor(user.group);
                            return (
                                <div key={user.id} className="bg-[var(--color-surface)] p-4 rounded-xl shadow-soft border border-[var(--color-border)] flex flex-col gap-4 relative overflow-hidden animate-fade-in-up transition-colors duration-300">
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-3">
                                            <div className="size-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg shrink-0 overflow-hidden">
                                                {user.photoURL ? <img src={user.photoURL} alt={user.firstName} className="size-full object-cover" /> : user.firstName[0]}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-[var(--color-text-main)] text-base leading-tight">{user.firstName} {user.lastName}</h4>
                                                <div className="flex flex-wrap gap-2 mt-1.5">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${groupStyles.bg} ${groupStyles.text} uppercase tracking-wide border ${groupStyles.border}`}>
                                                        {getGroupName(user.group)}
                                                    </span>
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${planStyles.bg} ${planStyles.text} uppercase tracking-wide border ${planStyles.border}`}>
                                                        {user.plan === 'liebre' ? 'Plan Liebre' : user.plan === 'gacela' ? 'Plan Gacela' : 'Sin Plan'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-lg font-bold text-[var(--color-text-main)]">{getPlanPrice(user.plan)}</span>
                                            <span className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold">Mensual</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[var(--color-border)]">
                                        <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-[var(--color-bg)]">
                                            <span className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold mb-1">Clases Mes</span>
                                            <div className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[16px] text-brand-red">calendar_month</span>
                                                <span className="text-lg font-bold text-[var(--color-text-main)]">14</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-[var(--color-bg)]">
                                            <span className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold mb-1">Esta Semana</span>
                                            <div className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[16px] text-brand-red">today</span>
                                                <span className="text-lg font-bold text-[var(--color-text-main)]">3</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </main>

            {/* Bottom Nav fixed inside the view since dashboard's is hidden */}
            <nav className="fixed bottom-0 w-full max-w-[480px] bg-[var(--color-surface)] border-t border-[var(--color-border)] pb-safe pt-2 px-6 z-40 transition-colors duration-300">
                <div className="flex justify-between items-end pb-2">
                    <button onClick={onBack} className="flex flex-col items-center gap-1 w-16 text-brand-red">
                        <span className="material-symbols-outlined text-[28px] filled">grid_view</span>
                        <span className="text-[10px] font-bold">Panel</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 w-16 text-[var(--color-text-muted)]">
                        <span className="material-symbols-outlined text-[28px]">calendar_today</span>
                        <span className="text-[10px] font-medium">Agenda</span>
                    </button>
                    <div className="relative -top-6">
                        <button className="flex items-center justify-center size-14 rounded-full bg-brand-dark shadow-[0_8px_20px_rgba(41,44,61,0.3)] text-white transition-transform active:scale-95">
                            <span className="material-symbols-outlined text-[28px]">add</span>
                        </button>
                    </div>
                    <button className="flex flex-col items-center gap-1 w-16 text-[var(--color-text-muted)]">
                        <span className="material-symbols-outlined text-[28px]">chat</span>
                        <span className="text-[10px] font-medium">Chat</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 w-16 text-[var(--color-text-muted)]">
                        <span className="material-symbols-outlined text-[28px]">person</span>
                        <span className="text-[10px] font-medium">Perfil</span>
                    </button>
                </div>
            </nav>
        </div>
    );
};
