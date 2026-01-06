import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, updateDoc, type QuerySnapshot, type DocumentData, type FirestoreError } from 'firebase/firestore';
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

interface AdminUsersListProps {
    onBack?: () => void;
}

export const AdminUsersList: React.FC<AdminUsersListProps> = ({ onBack }) => {
    const { userData } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'overview' | 'pending'>('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [approvalFormData, setApprovalFormData] = useState({
        plan: 'liebre',
        group: 'almodovar_box',
        role: 'cliente'
    });

    const openApprovalModal = (user: User) => {
        setSelectedUser(user);
        setApprovalFormData({
            plan: user.plan || 'liebre',
            group: user.group || 'almodovar_box',
            role: user.role || 'cliente'
        });
    };

    const confirmApprove = async () => {
        if (!selectedUser) return;

        try {
            await updateDoc(doc(db, 'users', selectedUser.id), {
                approved: true,
                plan: approvalFormData.plan,
                group: approvalFormData.group,
                role: approvalFormData.role,
                approvedAt: new Date().toISOString()
            });

            // Optimistic update
            setUsers(prev => prev.map(u => u.id === selectedUser.id ? {
                ...u,
                approved: true,
                plan: approvalFormData.plan,
                group: approvalFormData.group,
                role: approvalFormData.role
            } : u));

            setSelectedUser(null);
        } catch (error) {
            console.error("Error approving user:", error);
        }
    };

    useEffect(() => {
        const usersRef = collection(db, 'users');
        const unsubscribe = onSnapshot(usersRef, (snapshot: QuerySnapshot<DocumentData>) => {
            const fetchedUsers: User[] = [];
            snapshot.forEach((doc) => {
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
            setLoading(false);
        }, (error: FirestoreError) => {
            console.error("Error subscribing to users:", error);
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);



    const pendingUsers = users.filter(u => !u.approved);
    const activeUsers = users.filter(u => u.approved);

    const filteredActiveUsers = activeUsers.filter(user => {
        const matchesSearch = (user.firstName + ' ' + user.lastName + user.email).toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });



    const getGroupName = (group?: string) => {
        if (group === 'almodovar_fit') return 'AlmodovarFIT';
        if (group === 'almodovar_box') return 'AlmodovarBOx';
        return 'AlmodovarBOx'; // Default
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
                <div className="flex flex-col items-center flex-1">
                    <h2 className="text-[var(--color-text-main)] text-lg font-bold leading-tight tracking-tight text-center uppercase">{title}</h2>
                    <span className="text-[10px] text-brand-red font-mono bg-brand-red/10 px-2 rounded-full border border-brand-red/20">v2.0 DARK</span>
                </div>
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
                <main className="flex-1 px-4 py-6 space-y-6"> {/* Increased spacing */}
                    {pendingUsers.length === 0 ? (
                        <div className="text-center py-10">
                            <span className="material-symbols-outlined text-[48px] text-gray-300">check_circle</span>
                            <p className="text-gray-500 mt-2 font-medium">No hay peticiones pendientes</p>
                        </div>
                    ) : (
                        pendingUsers.map(user => (
                            <div key={user.id} className="bg-[var(--color-surface)] p-6 rounded-2xl shadow-soft border border-[var(--color-border)] flex flex-col gap-4 animate-fade-in-up transition-colors duration-300">
                                <div className="flex gap-4">
                                    <div className="size-14 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-lg shrink-0 overflow-hidden border-2 border-white/50">
                                        {user.photoURL ? <img src={user.photoURL} alt={user.firstName} className="size-full object-cover" /> : user.firstName[0]}
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center">
                                        <h4 className="font-bold text-[var(--color-text-main)] text-lg leading-tight">{user.firstName} {user.lastName}</h4>
                                        <p className="text-xs text-[var(--color-text-muted)] mt-1">{user.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => openApprovalModal(user)}
                                    className="w-full py-3 bg-brand-red text-white font-bold rounded-xl shadow-lg shadow-brand-red/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                                    Aprobar Acceso
                                </button>
                            </div>
                        ))
                    )}
                </main>

                {/* Approval Modal */}
                {selectedUser && (
                    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                        <div className="bg-[var(--color-surface)] w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-slide-up sm:animate-zoom-in">
                            <div className="p-4 border-b border-[var(--color-border)] flex justify-between items-center">
                                <h3 className="text-lg font-bold text-[var(--color-text-main)]">Aprobar Usuario</h3>
                                <button onClick={() => setSelectedUser(null)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <div className="p-4 space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-[var(--color-bg)] rounded-xl">
                                    <div className="size-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold shrink-0">
                                        {selectedUser.firstName[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-[var(--color-text-main)]">{selectedUser.firstName} {selectedUser.lastName}</p>
                                        <p className="text-xs text-[var(--color-text-muted)]">{selectedUser.email}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-[var(--color-text-muted)] uppercase mb-2">Plan de Suscripción</label>
                                        <select
                                            value={approvalFormData.plan}
                                            onChange={(e) => setApprovalFormData({ ...approvalFormData, plan: e.target.value })}
                                            className="w-full p-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-main)] focus:ring-2 focus:ring-brand-red outline-none appearance-none font-medium"
                                        >
                                            <option value="liebre">Plan Liebre (35€)</option>
                                            <option value="gacela">Plan Gacela (55€)</option>
                                            <option value="kanguro">Plan Kanguro (45€)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-[var(--color-text-muted)] uppercase mb-2">Grupo</label>
                                        <select
                                            value={approvalFormData.group}
                                            onChange={(e) => setApprovalFormData({ ...approvalFormData, group: e.target.value })}
                                            className="w-full p-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-main)] focus:ring-2 focus:ring-brand-red outline-none appearance-none font-medium"
                                        >
                                            <option value="almodovar_box">AlmodovarBOx</option>
                                            <option value="almodovar_fit">AlmodovarFIT</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-[var(--color-text-muted)] uppercase mb-1.5">Rol de Usuario</label>
                                        <select
                                            value={approvalFormData.role}
                                            onChange={(e) => setApprovalFormData({ ...approvalFormData, role: e.target.value })}
                                            className="w-full p-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-main)] focus:ring-2 focus:ring-brand-red outline-none appearance-none"
                                        >
                                            <option value="cliente">Cliente (Atleta)</option>
                                            <option value="coach">Coach (Entrenador)</option>
                                            <option value="admin">Administrador</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-2 flex gap-3">
                                    <button
                                        onClick={() => setSelectedUser(null)}
                                        className="flex-1 py-3 font-bold text-[var(--color-text-muted)] bg-[var(--color-bg)] rounded-xl hover:bg-gray-200 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={confirmApprove}
                                        className="flex-1 py-3 font-bold text-white bg-brand-red rounded-xl shadow-lg shadow-brand-red/20 active:scale-95 transition-transform"
                                    >
                                        Confirmar y Aprobar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="h-[100dvh] bg-[var(--color-bg)] flex flex-col font-display antialiased overflow-y-auto overflow-x-hidden transition-colors duration-300">
            {renderHeader("Gestión de Usuarios", onBack || (() => { }))}

            <main className="flex-1 px-5 py-8 space-y-8 pb-40">
                {/* Hero Card: Pending Requests */}
                <button
                    onClick={() => setViewMode('pending')}
                    className="w-full relative overflow-hidden bg-gradient-to-br from-brand-dark to-gray-900 rounded-3xl shadow-xl p-6 text-left text-white group cursor-pointer active:scale-[0.98] transition-all border border-gray-800"
                >
                    <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <span className="material-symbols-outlined text-[120px]">person_add</span>
                    </div>

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2">
                                <div className={`size-2 rounded-full ${pendingUsers.length > 0 ? 'bg-brand-red animate-pulse' : 'bg-green-500'}`}></div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                    {pendingUsers.length > 0 ? 'Requiere Atención' : 'Todo en orden'}
                                </span>
                            </div>
                            {pendingUsers.length > 0 && (
                                <div className="bg-brand-red text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg shadow-brand-red/20">
                                    {pendingUsers.length} NUEVOS
                                </div>
                            )}
                        </div>

                        <h3 className="text-2xl font-black mb-1">Solicitudes<br />Pendientes</h3>
                        <p className="text-sm text-gray-400 font-medium mb-6">Gestiona los nuevos miembros.</p>

                        <div className="flex items-center justify-between">
                            <div className="flex -space-x-3">
                                {pendingUsers.slice(0, 4).map((u, i) => (
                                    <div key={u.id} className="size-10 rounded-full ring-2 ring-brand-dark bg-gray-100 flex items-center justify-center text-xs font-bold text-brand-dark overflow-hidden relative z-10" style={{ zIndex: 10 - i }}>
                                        {u.photoURL ? <img src={u.photoURL} className="size-full object-cover" /> : u.firstName[0]}
                                    </div>
                                ))}
                                {pendingUsers.length > 4 && (
                                    <div className="size-10 rounded-full ring-2 ring-brand-dark bg-gray-800 flex items-center justify-center text-[10px] font-bold text-white relative z-0">
                                        +{pendingUsers.length - 4}
                                    </div>
                                )}
                            </div>
                            <div className="size-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm group-hover:bg-white/20 transition-colors">
                                <span className="material-symbols-outlined text-white">arrow_forward</span>
                            </div>
                        </div>
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
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="size-12 rounded-full border-4 border-white/10 border-t-brand-red animate-spin"></div>
                        <p className="text-white/40 text-xs font-bold tracking-[0.2em] uppercase animate-pulse">Cargando Usuarios...</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredActiveUsers.map(user => {
                            const groupName = getGroupName(user.group);
                            const planPrice = getPlanPrice(user.plan);

                            // Premium Card Styles
                            // Inline checks to avoid build corruption
                            // const isPlanGacela = user.plan === 'gacela';
                            // const isPlanLiebre = user.plan === 'liebre';

                            return (
                                <div key={user.id} className="bg-[#151518] rounded-2xl border border-white/5 p-4 flex items-center justify-between shadow-sm hover:border-white/10 transition-all group">
                                    <div className="flex items-center gap-4">
                                        {/* Minimalist Avatar */}
                                        <div className="relative">
                                            <div className="size-12 rounded-xl bg-[#232328] flex items-center justify-center text-white/50 font-bold overflow-hidden border border-white/5">
                                                {user.photoURL ? (
                                                    <img src={user.photoURL} alt={user.firstName} className="size-full object-cover" />
                                                ) : (
                                                    user.firstName[0]
                                                )}
                                            </div>
                                            {/* Status Dot */}
                                            <div className={`absolute -bottom-1 -right-1 size-3 rounded-full border-2 border-[#151518] ${user.group === 'afternoon' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                                        </div>

                                        {/* User Info */}
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-white text-base leading-none">
                                                    {user.firstName} {user.lastName}
                                                </h4>
                                                {user.plan === 'gacela' && <span className="material-symbols-outlined text-purple-500 text-[14px]">verified</span>}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-brand-red font-mono bg-brand-red/10 px-1.5 py-0.5 rounded-[4px] border border-brand-red/10">
                                                    {groupName}
                                                </span>
                                                <span className="text-[10px] text-white/30 uppercase tracking-widest font-medium">
                                                    {user.email}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Side */}
                                    <div className="flex items-center gap-4">
                                        <div className="text-right hidden sm:block">
                                            <span className="block text-white font-bold">{planPrice}</span>
                                            <span className="text-[9px] text-white/30 uppercase">/mes</span>
                                        </div>
                                        <button
                                            onClick={() => openApprovalModal(user)}
                                            className="h-9 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-bold tracking-wide uppercase transition-colors border border-white/5 flex items-center gap-2"
                                        >
                                            <span className="hidden sm:inline">Editar</span>
                                            <span className="material-symbols-outlined text-[16px]">edit</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                {/* Edit Modal (Added to Main View) */}
                {selectedUser && viewMode === 'overview' && (
                    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
                        <div className="bg-[#1A1A1A] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-slide-up sm:animate-zoom-in border border-white/10">
                            <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#232328]">
                                <h3 className="text-lg font-bold text-white">
                                    {selectedUser.approved ? 'Editar Miembro' : 'Aprobar Solicitud'}
                                </h3>
                                <button onClick={() => setSelectedUser(null)} className="text-white/30 hover:text-white transition-colors">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <div className="p-5 space-y-6">
                                <div className="flex items-center gap-3 p-3 bg-black/20 rounded-xl border border-white/5">
                                    <div className="size-10 rounded-lg bg-[#2D2D35] flex items-center justify-center text-white font-bold shrink-0">
                                        {selectedUser.firstName[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">{selectedUser.firstName} {selectedUser.lastName}</p>
                                        <p className="text-xs text-white/40">{selectedUser.email}</p>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">Plan de Suscripción</label>
                                        <div className="relative">
                                            <select
                                                value={approvalFormData.plan}
                                                onChange={(e) => setApprovalFormData({ ...approvalFormData, plan: e.target.value })}
                                                className="w-full p-4 rounded-xl bg-[#0A0A0A] border border-white/10 text-white appearance-none focus:border-brand-red outline-none transition-colors font-medium text-sm"
                                            >
                                                <option value="liebre">Plan Liebre (35€)</option>
                                                <option value="kanguro">Plan Kanguro (45€)</option>
                                                <option value="gacela">Plan Gacela (55€)</option>
                                            </select>
                                            <div className="absolute right-4 top-4 pointer-events-none text-white/30">
                                                <span className="material-symbols-outlined text-sm">expand_more</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">Grupo</label>
                                            <div className="relative">
                                                <select
                                                    value={approvalFormData.group}
                                                    onChange={(e) => setApprovalFormData({ ...approvalFormData, group: e.target.value })}
                                                    className="w-full p-4 rounded-xl bg-[#0A0A0A] border border-white/10 text-white appearance-none focus:border-brand-red outline-none transition-colors font-medium text-sm"
                                                >
                                                    <option value="almodovar_box">AlmodovarBOx</option>
                                                    <option value="almodovar_fit">AlmodovarFIT</option>
                                                </select>
                                                <div className="absolute right-4 top-4 pointer-events-none text-white/30">
                                                    <span className="material-symbols-outlined text-sm">expand_more</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">Rol</label>
                                            <div className="relative">
                                                <select
                                                    value={approvalFormData.role}
                                                    onChange={(e) => setApprovalFormData({ ...approvalFormData, role: e.target.value })}
                                                    className="w-full p-4 rounded-xl bg-[#0A0A0A] border border-white/10 text-white appearance-none focus:border-brand-red outline-none transition-colors font-medium text-sm"
                                                >
                                                    <option value="cliente">Atleta</option>
                                                    <option value="coach">Coach</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                                <div className="absolute right-4 top-4 pointer-events-none text-white/30">
                                                    <span className="material-symbols-outlined text-sm">expand_more</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2 flex gap-3">
                                    <button
                                        onClick={() => setSelectedUser(null)}
                                        className="flex-1 py-3.5 font-bold text-white/50 bg-transparent rounded-xl hover:text-white transition-colors uppercase text-xs tracking-wider"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={confirmApprove}
                                        className="flex-[2] py-3.5 font-bold text-white bg-brand-red rounded-xl shadow-lg shadow-brand-red/20 active:scale-95 transition-transform uppercase text-xs tracking-wider"
                                    >
                                        {selectedUser.approved ? 'Guardar Cambios' : 'Aprobar Acceso'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>


        </div>
    );
};
