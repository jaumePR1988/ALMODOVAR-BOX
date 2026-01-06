import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

interface AdminUsersListProps {
    onBack: () => void;
}

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    photoURL?: string;
    plan: 'liebre' | 'kanguro' | 'gacela';
    group: 'almodovar_box' | 'almodovar_fit';
    role: 'cliente' | 'coach' | 'admin';
    approved: boolean;
    createdAt: any;
    renewalDate?: string;
}

export const AdminUsersList: React.FC<AdminUsersListProps> = ({ onBack }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterTab, setFilterTab] = useState<'todos' | 'pendientes' | 'activos'>('todos');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showModal, setShowModal] = useState(false);

    // Form state for editing
    const [editForm, setEditForm] = useState({
        firstName: '',
        lastName: '',
        plan: 'liebre' as 'liebre' | 'kanguro' | 'gacela',
        group: 'almodovar_box' as 'almodovar_box' | 'almodovar_fit',
        role: 'cliente' as 'cliente' | 'coach' | 'admin',
        renewalDate: ''
    });

    // Groups state
    const [groupsList, setGroupsList] = useState<{ id: string, name: string }[]>([]);

    // Fetch users and groups
    useEffect(() => {
        fetchUsers();
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const groupsRef = collection(db, 'groups');
            const snapshot = await getDocs(groupsRef);
            setGroupsList(snapshot.docs.map(d => ({ id: d.id, name: d.data().name })));
        } catch (error) {
            console.error('Error fetching groups:', error);
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const usersRef = collection(db, 'users');
            const snapshot = await getDocs(usersRef);
            const usersData: User[] = [];

            snapshot.forEach((doc) => {
                const data = doc.data();
                usersData.push({
                    id: doc.id,
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    email: data.email || '',
                    photoURL: data.photoURL,
                    plan: data.plan || 'liebre',
                    group: data.group || 'almodovar_box',
                    role: data.role || 'cliente',
                    approved: data.approved || false,
                    createdAt: data.createdAt,
                    renewalDate: data.renewalDate || ''
                });
            });

            setUsers(usersData);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter users based on tab and search
    const filteredUsers = users.filter(user => {
        // Tab filter
        if (filterTab === 'pendientes' && user.approved) return false;
        if (filterTab === 'activos' && !user.approved) return false;

        // Search filter
        if (searchQuery) {
            const search = searchQuery.toLowerCase();
            return (
                user.firstName.toLowerCase().includes(search) ||
                user.lastName.toLowerCase().includes(search) ||
                user.email.toLowerCase().includes(search)
            );
        }

        return true;
    });

    // Stats
    const totalUsers = users.length;
    const pendingUsers = users.filter(u => !u.approved).length;

    // Open edit modal
    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setEditForm({
            firstName: user.firstName,
            lastName: user.lastName,
            plan: user.plan,
            group: user.group,
            role: user.role,
            renewalDate: user.renewalDate || new Date().toISOString().split('T')[0]
        });
        setShowModal(true);
    };

    // Save user changes
    const handleSaveUser = async () => {
        if (!selectedUser) return;

        try {
            const userRef = doc(db, 'users', selectedUser.id);
            await updateDoc(userRef, {
                firstName: editForm.firstName,
                lastName: editForm.lastName,
                plan: editForm.plan,
                group: editForm.group,
                role: editForm.role,
                renewalDate: editForm.renewalDate,
                approved: true // Auto-approve when editing
            });

            // Refresh users list
            await fetchUsers();
            setShowModal(false);
            setSelectedUser(null);
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Error al guardar cambios');
        }
    };



    return (
        <div style={{
            minHeight: '100dvh',
            backgroundColor: 'var(--color-background)',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* Header */}
            <header style={{
                position: 'sticky',
                top: 0,
                zIndex: 50,
                backgroundColor: 'rgba(var(--color-surface-rgb), 0.95)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid var(--color-border)',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <button
                    onClick={onBack}
                    style={{
                        padding: '0.5rem',
                        marginLeft: '-0.5rem',
                        borderRadius: '9999px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <span className="material-icons-round" style={{ fontSize: '24px', color: 'var(--color-text-main)' }}>arrow_back</span>
                </button>
                <h2 style={{
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--color-text-main)',
                    textAlign: 'center',
                    flex: 1
                }}>Gestión de Usuarios</h2>
                <button
                    onClick={() => {/* TODO: Add new user */ }}
                    style={{
                        padding: '0.5rem',
                        borderRadius: '9999px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <span className="material-icons-round" style={{ fontSize: '24px', color: 'var(--color-primary)' }}>person_add</span>
                </button>
            </header>

            {/* Main Content */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '32rem', margin: '0 auto', paddingBottom: '2rem' }}>

                {/* Stats Cards */}
                <section style={{ padding: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{
                        backgroundColor: 'var(--color-surface)',
                        padding: '1rem',
                        borderRadius: '0.75rem',
                        border: '1px solid var(--color-border)',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <span className="material-icons-round" style={{ fontSize: '1.25rem', color: 'var(--color-primary)' }}>group</span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Total</span>
                        </div>
                        <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-main)' }}>{totalUsers}</span>
                    </div>
                    <div style={{
                        backgroundColor: 'var(--color-surface)',
                        padding: '1rem',
                        borderRadius: '0.75rem',
                        border: '1px solid var(--color-border)',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        position: 'relative'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <span className="material-icons-round" style={{ fontSize: '1.25rem', color: '#f59e0b' }}>pending</span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Pendientes</span>
                        </div>
                        <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-main)' }}>{pendingUsers}</span>
                        {pendingUsers > 0 && (
                            <div style={{
                                position: 'absolute',
                                top: '0.5rem',
                                right: '0.5rem',
                                backgroundColor: '#ef4444',
                                color: 'white',
                                fontSize: '0.625rem',
                                fontWeight: 700,
                                padding: '0.125rem 0.375rem',
                                borderRadius: '9999px'
                            }}>
                                {pendingUsers}
                            </div>
                        )}
                    </div>
                </section>

                {/* Filter Tabs */}
                <section style={{ padding: '0 1rem 1rem' }}>
                    <div style={{
                        display: 'flex',
                        padding: '0.25rem',
                        borderRadius: '0.75rem',
                        backgroundColor: 'rgba(0, 0, 0, 0.06)',
                        border: '1px solid var(--color-border)',
                        gap: '0.25rem'
                    }}>
                        {(['todos', 'pendientes', 'activos'] as const).map((tab) => (
                            <label key={tab} style={{ flex: 1, cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="filter_tab"
                                    value={tab}
                                    checked={filterTab === tab}
                                    onChange={() => setFilterTab(tab)}
                                    style={{ display: 'none' }}
                                />
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '0.5rem 0.75rem',
                                    borderRadius: '0.5rem',
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    textTransform: 'capitalize',
                                    transition: 'all 0.2s',
                                    backgroundColor: filterTab === tab ? 'var(--color-surface)' : 'transparent',
                                    color: filterTab === tab ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                    boxShadow: filterTab === tab ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
                                }}>
                                    {tab}
                                </div>
                            </label>
                        ))}
                    </div>
                </section>

                {/* Search Bar */}
                <section style={{ padding: '0 1rem 1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: 0,
                            display: 'flex',
                            alignItems: 'center',
                            paddingLeft: '0.75rem',
                            pointerEvents: 'none'
                        }}>
                            <span className="material-icons-round" style={{ color: 'var(--color-text-muted)' }}>search</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar por nombre o email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                display: 'block',
                                width: '100%',
                                padding: '0.75rem',
                                paddingLeft: '2.5rem',
                                fontSize: '0.875rem',
                                borderRadius: '0.75rem',
                                backgroundColor: 'var(--color-surface)',
                                border: '1px solid var(--color-border)',
                                color: 'var(--color-text-main)',
                                outline: 'none'
                            }}
                        />
                    </div>
                </section>

                {/* Users List */}
                <section style={{ padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                            Cargando usuarios...
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '2rem',
                            backgroundColor: 'var(--color-surface)',
                            borderRadius: '0.75rem',
                            border: '1px dashed var(--color-border)'
                        }}>
                            <span className="material-icons-round" style={{ fontSize: '3rem', color: 'var(--color-text-muted)', opacity: 0.5 }}>
                                person_off
                            </span>
                            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                                No se encontraron usuarios
                            </p>
                        </div>
                    ) : (
                        filteredUsers.map(user => (
                            <div
                                key={user.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem',
                                    borderRadius: '0.75rem',
                                    backgroundColor: 'var(--color-surface)',
                                    border: '1px solid var(--color-border)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onClick={() => handleEditUser(user)}
                            >
                                {/* Avatar */}
                                <div style={{ position: 'relative' }}>
                                    {user.photoURL ? (
                                        <img
                                            src={user.photoURL}
                                            alt={user.firstName}
                                            style={{
                                                width: '2.5rem',
                                                height: '2.5rem',
                                                borderRadius: '50%',
                                                objectFit: 'cover',
                                                border: '2px solid var(--color-border)'
                                            }}
                                        />
                                    ) : (
                                        <div style={{
                                            width: '2.5rem',
                                            height: '2.5rem',
                                            borderRadius: '50%',
                                            backgroundColor: 'var(--color-bg)',
                                            border: '2px solid var(--color-border)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1rem',
                                            fontWeight: 700,
                                            color: 'var(--color-text-muted)'
                                        }}>
                                            {user.firstName[0]}{user.lastName[0]}
                                        </div>
                                    )}
                                    {!user.approved && (
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '-2px',
                                            right: '-2px',
                                            width: '0.75rem',
                                            height: '0.75rem',
                                            borderRadius: '50%',
                                            backgroundColor: '#f59e0b',
                                            border: '2px solid var(--color-surface)'
                                        }} />
                                    )}
                                </div>

                                {/* User Info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <h3 style={{
                                            fontSize: '0.875rem',
                                            fontWeight: 700,
                                            color: 'var(--color-text-main)',
                                            margin: 0,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {user.firstName} {user.lastName}
                                        </h3>
                                        {!user.approved && (
                                            <span style={{
                                                fontSize: '0.625rem',
                                                fontWeight: 700,
                                                color: '#f59e0b',
                                                textTransform: 'uppercase',
                                                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                                padding: '0.125rem 0.375rem',
                                                borderRadius: '0.25rem'
                                            }}>
                                                Pendiente
                                            </span>
                                        )}
                                    </div>
                                    <p style={{
                                        fontSize: '0.75rem',
                                        color: 'var(--color-text-muted)',
                                        margin: '0.125rem 0 0 0',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {user.email}
                                    </p>
                                </div>

                                {/* Plan Badge */}
                                <div style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    color: 'var(--color-primary)',
                                    backgroundColor: 'rgba(211, 0, 31, 0.1)',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '0.375rem',
                                    textTransform: 'capitalize'
                                }}>
                                    {user.plan}
                                </div>

                                {/* Edit Icon */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditUser(user);
                                    }}
                                    style={{
                                        padding: '0.5rem',
                                        borderRadius: '50%',
                                        border: 'none',
                                        backgroundColor: 'var(--color-bg)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <span className="material-icons-round" style={{ fontSize: '1.125rem', color: 'var(--color-text-muted)' }}>
                                        edit
                                    </span>
                                </button>
                            </div>
                        ))
                    )}
                </section>
            </main>

            {/* Edit Modal */}
            {showModal && selectedUser && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(4px)',
                    padding: '1rem'
                }}>
                    <div style={{
                        backgroundColor: 'var(--color-surface)',
                        borderRadius: '0.75rem',
                        maxWidth: '28rem',
                        width: '100%',
                        maxHeight: '90vh',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    }}>
                        {/* Modal Header */}
                        <div style={{
                            padding: '1rem',
                            borderBottom: '1px solid var(--color-border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <h3 style={{
                                fontSize: '1rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                color: 'var(--color-text-main)',
                                margin: 0
                            }}>
                                Editar Usuario
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    padding: '0.25rem',
                                    borderRadius: '50%',
                                    border: 'none',
                                    background: 'transparent',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <span className="material-icons-round" style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)' }}>
                                    close
                                </span>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem'
                        }}>
                            {/* User Avatar & Name */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '1rem',
                                backgroundColor: 'var(--color-bg)',
                                borderRadius: '0.75rem'
                            }}>
                                {selectedUser.photoURL ? (
                                    <img
                                        src={selectedUser.photoURL}
                                        alt={selectedUser.firstName}
                                        style={{
                                            width: '4rem',
                                            height: '4rem',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            border: '3px solid var(--color-border)'
                                        }}
                                    />
                                ) : (
                                    <div style={{
                                        width: '4rem',
                                        height: '4rem',
                                        borderRadius: '50%',
                                        backgroundColor: 'var(--color-surface)',
                                        border: '3px solid var(--color-border)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem',
                                        fontWeight: 700,
                                        color: 'var(--color-text-muted)'
                                    }}>
                                        {selectedUser.firstName[0]}{selectedUser.lastName[0]}
                                    </div>
                                )}
                                <div style={{ textAlign: 'center' }}>
                                    <h4 style={{
                                        fontSize: '1rem',
                                        fontWeight: 700,
                                        color: 'var(--color-text-main)',
                                        margin: 0
                                    }}>
                                        {selectedUser.firstName} {selectedUser.lastName}
                                    </h4>
                                    <p style={{
                                        fontSize: '0.75rem',
                                        color: 'var(--color-text-muted)',
                                        margin: '0.25rem 0 0 0'
                                    }}>
                                        {selectedUser.email}
                                    </p>
                                </div>
                            </div>

                            {/* Form Fields */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    color: 'var(--color-text-main)',
                                    textTransform: 'uppercase'
                                }}>
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    value={editForm.firstName}
                                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                        padding: '0.75rem',
                                        fontSize: '0.875rem',
                                        borderRadius: '0.75rem',
                                        backgroundColor: 'var(--color-surface)',
                                        border: '1px solid var(--color-border)',
                                        color: 'var(--color-text-main)',
                                        outline: 'none'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    color: 'var(--color-text-main)',
                                    textTransform: 'uppercase'
                                }}>
                                    Apellido
                                </label>
                                <input
                                    type="text"
                                    value={editForm.lastName}
                                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                        padding: '0.75rem',
                                        fontSize: '0.875rem',
                                        borderRadius: '0.75rem',
                                        backgroundColor: 'var(--color-surface)',
                                        border: '1px solid var(--color-border)',
                                        color: 'var(--color-text-main)',
                                        outline: 'none'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    color: 'var(--color-text-main)',
                                    textTransform: 'uppercase'
                                }}>
                                    Plan
                                </label>
                                <select
                                    value={editForm.plan}
                                    onChange={(e) => setEditForm({ ...editForm, plan: e.target.value as any })}
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                        padding: '0.75rem',
                                        fontSize: '0.875rem',
                                        borderRadius: '0.75rem',
                                        backgroundColor: 'var(--color-surface)',
                                        border: '1px solid var(--color-border)',
                                        color: 'var(--color-text-main)',
                                        outline: 'none'
                                    }}
                                >
                                    <option value="liebre">Liebre (35€)</option>
                                    <option value="kanguro">Kanguro (45€)</option>
                                    <option value="gacela">Gacela (55€)</option>
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <select
                                        value={editForm.group}
                                        onChange={(e) => setEditForm({ ...editForm, group: e.target.value as any })}
                                        style={{
                                            display: 'block',
                                            width: '100%',
                                            padding: '0.75rem',
                                            fontSize: '0.875rem',
                                            borderRadius: '0.75rem',
                                            backgroundColor: 'var(--color-surface)',
                                            border: '1px solid var(--color-border)',
                                            color: 'var(--color-text-main)',
                                            outline: 'none'
                                        }}
                                    >
                                        <option value="">Sin Grupo</option>
                                        {groupsList.map(g => (
                                            <option key={g.id} value={g.id}>{g.name}</option>
                                        ))}
                                        {/* Legacy Fallbacks if needed */}
                                        {!groupsList.find(g => g.id === 'almodovar_box') && <option value="almodovar_box">Box (Legacy)</option>}
                                        {!groupsList.find(g => g.id === 'almodovar_fit') && <option value="almodovar_fit">Fit (Legacy)</option>}
                                    </select>
                                </div>

                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        color: 'var(--color-text-main)',
                                        textTransform: 'uppercase'
                                    }}>
                                        Rol
                                    </label>
                                    <select
                                        value={editForm.role}
                                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value as any })}
                                        style={{
                                            display: 'block',
                                            width: '100%',
                                            padding: '0.75rem',
                                            fontSize: '0.875rem',
                                            borderRadius: '0.75rem',
                                            backgroundColor: 'var(--color-surface)',
                                            border: '1px solid var(--color-border)',
                                            color: 'var(--color-text-main)',
                                            outline: 'none'
                                        }}
                                    >
                                        <option value="cliente">Alumno</option>
                                        <option value="coach">Coach</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    color: 'var(--color-text-main)',
                                    textTransform: 'uppercase'
                                }}>
                                    Próxima Renovación
                                </label>
                                <input
                                    type="date"
                                    value={editForm.renewalDate}
                                    onChange={(e) => setEditForm({ ...editForm, renewalDate: e.target.value })}
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                        padding: '0.75rem',
                                        fontSize: '0.875rem',
                                        borderRadius: '0.75rem',
                                        backgroundColor: 'var(--color-surface)',
                                        border: '1px solid var(--color-border)',
                                        color: 'var(--color-text-main)',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div style={{
                            padding: '1rem',
                            borderTop: '1px solid var(--color-border)',
                            display: 'flex',
                            gap: '0.75rem'
                        }}>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    borderRadius: '0.5rem',
                                    border: '1px solid var(--color-border)',
                                    backgroundColor: 'transparent',
                                    color: 'var(--color-text-main)',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    textTransform: 'uppercase'
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveUser}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    borderRadius: '0.5rem',
                                    border: 'none',
                                    backgroundColor: 'var(--color-primary)',
                                    color: 'white',
                                    fontSize: '0.875rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    textTransform: 'uppercase',
                                    boxShadow: '0 4px 6px -1px rgba(211, 0, 31, 0.2)'
                                }}
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
