import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';

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

export const AdminUsersView: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'active'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const usersRef = collection(db, 'users');
            // Simply fetch all for now and filter client-side for flexibility
            const q = query(usersRef, orderBy('createdAt', 'desc'));
            // Note: 'createdAt' might need an index, if it fails I'll fallback to simple getDocs
            // For safety in this iteration, let's use simple getDocs and sort manually if needed or just getDocs
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
            // Update local state
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, approved: true } : u));
        } catch (error) {
            console.error("Error approving user:", error);
            alert("Error al aprobar usuario");
        }
    };

    const handleAssignGroup = async (userId: string, group: string) => {
        try {
            await updateDoc(doc(db, 'users', userId), {
                group: group
            });
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, group: group } : u));
        } catch (error) {
            console.error("Error assigning group:", error);
            alert("Error al asignar grupo");
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = (user.firstName + ' ' + user.lastName + user.email).toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter =
            filter === 'all' ? true :
                filter === 'pending' ? !user.approved :
                    filter === 'active' ? user.approved : true;

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="animate-fade-in-up" style={{ padding: '1.5rem', paddingBottom: '6rem' }}>
            <h2 className="heading-section">Gestión de Usuarios</h2>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                <button
                    onClick={() => setFilter('all')}
                    className={`badge-item ${filter === 'all' ? 'active' : ''}`}>
                    Todos
                </button>
                <button
                    onClick={() => setFilter('pending')}
                    className={`badge-item ${filter === 'pending' ? 'active' : ''}`}
                    style={{ position: 'relative' }}>
                    Pendientes
                    {users.filter(u => !u.approved).length > 0 && (
                        <span style={{
                            position: 'absolute', top: '-5px', right: '-5px',
                            backgroundColor: '#ef4444', color: 'white',
                            fontSize: '0.6rem', padding: '0.1rem 0.3rem', borderRadius: '50%'
                        }}>
                            {users.filter(u => !u.approved).length}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setFilter('active')}
                    className={`badge-item ${filter === 'active' ? 'active' : ''}`}>
                    Activos
                </button>
            </div>

            {/* Search */}
            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <span className="material-icons-round" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>search</span>
                <input
                    type="text"
                    placeholder="Buscar por nombre o email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '1rem 1rem 1rem 3rem',
                        borderRadius: '1rem',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-surface)',
                        color: 'var(--color-text-main)',
                        fontSize: '1rem'
                    }}
                />
            </div>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {loading ? (
                    <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>Cargando usuarios...</p>
                ) : filteredUsers.map(user => (
                    <div key={user.id} style={{
                        backgroundColor: 'var(--color-surface)',
                        padding: '1rem',
                        borderRadius: '1rem',
                        border: '1px solid var(--color-border)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                                width: '3rem', height: '3rem', borderRadius: '50%',
                                backgroundColor: 'rgba(var(--color-primary-rgb), 0.1)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                overflow: 'hidden'
                            }}>
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt={user.firstName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{user.firstName[0]}</span>
                                )}
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{user.firstName} {user.lastName}</h3>
                                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{user.email}</p>
                            </div>
                            <div style={{ marginLeft: 'auto' }}>
                                {!user.approved && (
                                    <span style={{
                                        backgroundColor: '#fef3c7', color: '#d97706',
                                        fontSize: '0.7rem', fontWeight: 700, padding: '0.25rem 0.5rem', borderRadius: '0.5rem'
                                    }}>PENDIENTE</span>
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
                            {!user.approved ? (
                                <button
                                    onClick={() => handleApprove(user.id)}
                                    style={{
                                        flex: 1, padding: '0.5rem', backgroundColor: 'var(--color-primary)', color: 'white',
                                        border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer'
                                    }}>
                                    Aprobar
                                </button>
                            ) : (
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Grupo Asignado</label>
                                    <select
                                        value={user.group || ''}
                                        onChange={(e) => handleAssignGroup(user.id, e.target.value)}
                                        style={{
                                            width: '100%', padding: '0.5rem', borderRadius: '0.5rem',
                                            border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)',
                                            color: 'var(--color-text-main)'
                                        }}>
                                        <option value="">Sin Asignar</option>
                                        <option value="morning">Morning (Mañanas)</option>
                                        <option value="afternoon">Mesocranios (Tardes)</option>
                                        <option value="fitboxing">Fit Boxing</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
