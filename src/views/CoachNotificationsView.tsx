import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, query } from 'firebase/firestore';

interface CoachNotificationsViewProps {
    onBack: () => void;
}

export const CoachNotificationsView: React.FC<CoachNotificationsViewProps> = ({ onBack }) => {
    const [recipientType, setRecipientType] = useState<'grupos' | 'individual'>('grupos');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGroups, setSelectedGroups] = useState<string[]>(['morning']);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [fetchedUsers, setFetchedUsers] = useState<any[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [sending, setSending] = useState(false);

    // Notification Content
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [isHighPriority, setIsHighPriority] = useState(false);

    // View State
    const [showHistory, setShowHistory] = useState(false);
    const [history, setHistory] = useState<any[]>([]);

    // Mock Data - Assigned Group (Coach's Group)
    // In a future generic implementation, this would be fetched from the Coach's profile
    const assignedGroup = { id: 'morning', name: 'AlmodovarBox (Mañanas)', memberCount: 12 };

    // Fetch Users from Firestore
    useEffect(() => {
        const fetchUsers = async () => {
            setLoadingUsers(true);
            try {
                // Fetch all users (or filter by role if possible)
                // Assuming 'role' resides in the user document
                const q = query(collection(db, 'users'));
                const querySnapshot = await getDocs(q);
                const users: any[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    // Basic sanity check + mapping
                    if (data.email !== 'admin@almodovarbox.com' && data.email !== 'coach@almodovarbox.com') { // Exclude staff
                        users.push({
                            id: doc.id,
                            name: data.displayName || data.name || data.email.split('@')[0],
                            group: data.group || 'morning', // Fallback to 'morning' for testing if field missing
                            avatar: data.photoURL || `https://ui-avatars.com/api/?name=${data.displayName || 'User'}&background=random`
                        });
                    }
                });
                setFetchedUsers(users);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoadingUsers(false);
            }
        };

        fetchUsers();
    }, []);

    // Filter athletes: Only show those in the coach's assigned group
    const availableAthletes = fetchedUsers.filter(a => a.group === assignedGroup.id);
    const filteredAthletes = availableAthletes.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()));

    // Load History (Local Cache)
    useEffect(() => {
        const savedHistory = localStorage.getItem('coach_notification_history');
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory));
        }
    }, []);

    const toggleGroup = (groupId: string) => {
        if (groupId === assignedGroup.id) {
            setSelectedGroups(prev => prev.includes(groupId) ? [] : [groupId]);
        }
    };

    const toggleUser = (userId: string) => {
        setSelectedUsers(prev =>
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    const handleSend = async () => {
        if (!title || !message) {
            alert('Por favor completa título y mensaje.');
            return;
        }

        setSending(true);

        try {
            // Resolve names for History
            let recipientNames: string[] = [];
            if (recipientType === 'individual') {
                recipientNames = fetchedUsers.filter(a => selectedUsers.includes(a.id)).map(a => a.name);
            } else {
                recipientNames = [assignedGroup.name];
            }

            // 1. Create Notification Object
            const newNotification = {
                title,
                preview: message,
                message,
                timestamp: new Date(), // Firestore Timestamp preferred, utilizing Date for now
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                date: new Date().toLocaleDateString(),
                sender: 'Coach Alex',
                type: isHighPriority ? 'priority_high' : 'campaign',
                color: isHighPriority ? 'brand-red' : 'blue',
                unread: true,
                section: 'Hoy', // UI helper
                recipientType,
                recipients: recipientType === 'individual' ? selectedUsers : [assignedGroup.id], // ID list for backend filtering
                recipientNames, // Snapshot of names
                isHighPriority
            };

            // 2. Save to Firestore (Real Backend)
            await addDoc(collection(db, 'notifications'), newNotification);

            // 3. Save to Local History (Coach View Cache)
            // Ideally we'd also fetch history from DB, but for speed we cache locally
            const updatedHistory = [{ ...newNotification, id: Date.now() }, ...history];
            setHistory(updatedHistory);
            localStorage.setItem('coach_notification_history', JSON.stringify(updatedHistory));

            // 4. Reset & Feedback
            setTitle('');
            setMessage('');
            setIsHighPriority(false);
            setSelectedUsers([]);
            alert('Notificación enviada correctamente');
            setShowHistory(true);
        } catch (error: any) {
            console.error("Error sending notification:", error);
            // Translate common Firebase errors
            if (error.code === 'permission-denied') {
                alert('Error: No tienes permiso. ¿Has configurado las Reglas de Firebase?');
            } else {
                alert('Error al enviar: ' + error.message);
            }
        } finally {
            setSending(false);
        }
    };

    if (showHistory) {
        return (
            <div style={{
                minHeight: '100dvh', backgroundColor: 'var(--color-background)',
                display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif"
            }}>
                <header style={{
                    position: 'sticky', top: 0, zIndex: 50,
                    backgroundColor: 'rgba(var(--color-surface-rgb), 0.95)', backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid var(--color-border)', padding: '1rem',
                    display: 'flex', alignItems: 'center', gap: '1rem'
                }}>
                    <button onClick={() => setShowHistory(false)} style={{
                        background: 'none', border: 'none', color: 'var(--color-text-main)', cursor: 'pointer', display: 'flex'
                    }}>
                        <span className="material-icons-round">arrow_back</span>
                    </button>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text-main)', textTransform: 'uppercase' }}>Historial</h2>
                </header>
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '6rem' }}>
                    {history.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginTop: '2rem' }}>No hay notificaciones enviadas.</p>
                    ) : (
                        history.map((item) => (
                            <div key={item.id || Math.random()} style={{
                                backgroundColor: 'var(--color-surface)', padding: '1rem', borderRadius: '0.75rem',
                                border: '1px solid var(--color-border)', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                                            {item.recipientType === 'individual' ? 'Individual' : 'Grupo'}
                                        </span>
                                        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-main)' }}>
                                            Para: {item.recipientNames ? item.recipientNames.join(', ') : 'Destinatarios'}
                                        </span>
                                    </div>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', marginLeft: '0.5rem' }}>
                                        {item.date}<br />{item.time}
                                    </span>
                                </div>
                                <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '0.5rem 0' }}></div>
                                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '0.25rem' }}>{item.title}</h3>
                                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{item.message}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    }

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
                position: 'sticky', top: 0, zIndex: 50,
                backgroundColor: 'rgba(var(--color-surface-rgb), 0.95)', backdropFilter: 'blur(12px)',
                borderBottom: '1px solid var(--color-border)', padding: '1rem',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
                <button
                    onClick={onBack}
                    style={{
                        padding: '0.5rem', marginLeft: '-0.5rem', borderRadius: '9999px',
                        border: 'none', background: 'transparent', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    <span className="material-icons-round" style={{ fontSize: '24px', color: 'var(--color-text-main)' }}>close</span>
                </button>
                <h2 style={{
                    fontSize: '1.125rem', fontWeight: 700, textTransform: 'uppercase',
                    color: 'var(--color-text-main)', textAlign: 'center', flex: 1
                }}>Nueva Notificación</h2>
                <button
                    onClick={() => setShowHistory(true)}
                    style={{
                        fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)',
                        textTransform: 'uppercase', border: 'none', background: 'transparent', cursor: 'pointer'
                    }}>
                    Historial
                </button>
            </header>

            {/* Main Content */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '32rem', margin: '0 auto', paddingBottom: '2rem' }}>

                {/* Recipient Selection Section */}
                <section style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, padding: '1.5rem 1rem 1rem', color: 'var(--color-text-main)' }}>¿A quién va dirigido?</h3>

                    {/* Tabs */}
                    <div style={{ padding: '0 1rem 1rem' }}>
                        <div style={{
                            display: 'flex', padding: '0.25rem', borderRadius: '0.75rem',
                            backgroundColor: 'rgba(0, 0, 0, 0.06)', border: '1px solid var(--color-border)',
                            overflowX: 'auto', gap: '0.25rem'
                        }} className="no-scrollbar">
                            {['grupos', 'individual'].map((type) => (
                                <label key={type} style={{ flex: 1, minWidth: '80px', cursor: 'pointer' }}>
                                    <input
                                        type="radio" name="recipient_type" value={type}
                                        checked={recipientType === type}
                                        onChange={() => setRecipientType(type as any)}
                                        style={{ display: 'none' }}
                                    />
                                    <div style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        padding: '0.5rem 0.75rem', borderRadius: '0.5rem',
                                        fontSize: '0.875rem', fontWeight: 500, textTransform: 'capitalize',
                                        transition: 'all 0.2s',
                                        backgroundColor: recipientType === type ? 'var(--color-surface)' : 'transparent',
                                        color: recipientType === type ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                        boxShadow: recipientType === type ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
                                    }}>
                                        {type}
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Content based on Recipient Type */}
                    {recipientType === 'individual' ? (
                        <>
                            {/* Individual Search */}
                            <div style={{ padding: '0 1rem 0.5rem' }}>
                                <div style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, display: 'flex', alignItems: 'center', paddingLeft: '0.75rem', pointerEvents: 'none' }}>
                                        <span className="material-icons-round" style={{ color: 'var(--color-text-muted)' }}>search</span>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Buscar atleta..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        style={{
                                            display: 'block', width: '100%', padding: '0.75rem', paddingLeft: '2.5rem',
                                            fontSize: '0.875rem', borderRadius: '0.75rem',
                                            backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
                                            color: 'var(--color-text-main)', outline: 'none'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Users List */}
                            <div className="no-scrollbar" style={{
                                padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem',
                                maxHeight: '300px', overflowY: 'auto',
                                scrollbarWidth: 'none', msOverflowStyle: 'none'
                            }}>
                                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                                    Mostrando usuarios de: <strong>{assignedGroup.name}</strong>
                                </p>
                                {loadingUsers ? (
                                    <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--color-text-muted)' }}>Cargando usuarios...</div>
                                ) : filteredAthletes.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--color-text-muted)' }}>No se encontraron usuarios.</div>
                                ) : (
                                    filteredAthletes.map(user => (
                                        <label key={user.id} style={{
                                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                                            padding: '0.5rem 0.75rem', borderRadius: '0.75rem',
                                            backgroundColor: selectedUsers.includes(user.id) ? 'rgba(211, 0, 31, 0.05)' : 'transparent',
                                            border: selectedUsers.includes(user.id) ? '1px solid var(--color-primary)' : '1px solid transparent',
                                            cursor: 'pointer', transition: 'all 0.2s'
                                        }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.includes(user.id)}
                                                onChange={() => toggleUser(user.id)}
                                                style={{ display: 'none' }}
                                            />
                                            <div style={{
                                                width: '1.25rem', height: '1.25rem', borderRadius: '4px',
                                                border: '1px solid var(--color-border)',
                                                backgroundColor: selectedUsers.includes(user.id) ? 'var(--color-primary)' : 'transparent',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: 'white', flexShrink: 0
                                            }}>
                                                {selectedUsers.includes(user.id) && <span className="material-icons-round" style={{ fontSize: '1rem' }}>check</span>}
                                            </div>
                                            <img src={user.avatar} alt={user.name} style={{ width: '2rem', height: '2rem', borderRadius: '50%', objectFit: 'cover' }} />
                                            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-main)', flex: 1 }}>{user.name}</span>
                                        </label>
                                    ))
                                )}
                            </div>
                        </>
                    ) : (
                        /* Group Selection (Default) */
                        <div style={{ padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            {/* Assigned Group ONLY */}
                            <label style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '0.75rem', borderRadius: '0.5rem', cursor: 'pointer',
                                backgroundColor: selectedGroups.includes(assignedGroup.id) ? 'rgba(211, 0, 31, 0.05)' : 'transparent',
                                border: selectedGroups.includes(assignedGroup.id) ? '1px solid var(--color-primary)' : '1px solid transparent',
                                transition: 'background-color 0.2s'
                            }}>
                                <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-text-main)' }}>
                                    {assignedGroup.name}
                                    <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', marginLeft: '0.5rem', fontWeight: 700 }}>(Asignado)</span>
                                </span>
                                <input
                                    type="checkbox"
                                    checked={selectedGroups.includes(assignedGroup.id)}
                                    onChange={() => toggleGroup(assignedGroup.id)}
                                    style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--color-primary)' }}
                                />
                            </label>
                            <div style={{ padding: '0.5rem 0.5rem' }}>
                                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.025em' }}>
                                    Seleccionado: aprox. {assignedGroup.memberCount} usuarios
                                </p>
                            </div>
                        </div>
                    )}
                </section>

                <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '1.5rem 1rem' }}></div>

                {/* Message Section */}
                <section style={{ display: 'flex', flexDirection: 'column', padding: '0 1rem', gap: '1.25rem' }}>
                    {/* Title Input */}
                    <div>
                        <label htmlFor="title" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-main)', textTransform: 'uppercase' }}>
                            Título
                        </label>
                        <input
                            id="title" type="text" placeholder="Ej: Cambio de horario..."
                            value={title} onChange={(e) => setTitle(e.target.value)}
                            style={{
                                backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
                                color: 'var(--color-text-main)', fontSize: '0.875rem', borderRadius: '0.75rem',
                                width: '100%', padding: '0.875rem', outline: 'none'
                            }}
                        />
                    </div>
                    {/* Message Input */}
                    <div>
                        <label htmlFor="message" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-main)', textTransform: 'uppercase' }}>
                            Mensaje
                        </label>
                        <textarea
                            id="message" rows={4} placeholder="Escribe tu mensaje aquí..."
                            value={message} onChange={(e) => setMessage(e.target.value)}
                            style={{
                                display: 'block', width: '100%', padding: '0.875rem', fontSize: '0.875rem',
                                color: 'var(--color-text-main)', backgroundColor: 'var(--color-surface)',
                                borderRadius: '0.75rem', border: '1px solid var(--color-border)',
                                resize: 'none', outline: 'none', fontFamily: 'inherit'
                            }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{message.length}/140 carácteres</span>
                        </div>
                    </div>

                    {/* Priority Toggle */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '1rem', backgroundColor: 'var(--color-surface)',
                        borderRadius: '0.75rem', border: '1px solid var(--color-border)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: '2.5rem', height: '2.5rem', borderRadius: '50%',
                                backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444'
                            }}>
                                <span className="material-icons-round">priority_high</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-main)' }}>ALTA PRIORIDAD</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Notificar incluso si están en silencio</span>
                            </div>
                        </div>

                        <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={isHighPriority}
                                onChange={(e) => setIsHighPriority(e.target.checked)}
                                style={{ display: 'none' }}
                            />
                            <div style={{
                                width: '2.75rem', height: '1.5rem',
                                backgroundColor: isHighPriority ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                borderRadius: '9999px', position: 'relative', transition: 'background-color 0.2s', opacity: 0.8
                            }}>
                                <div style={{
                                    position: 'absolute', top: '2px', left: '2px', backgroundColor: 'white',
                                    borderRadius: '50%', height: '1.25rem', width: '1.25rem', transition: 'transform 0.2s',
                                    transform: isHighPriority ? 'translateX(1.25rem)' : 'translateX(0)'
                                }}></div>
                            </div>
                        </label>
                    </div>

                    {/* Send Button - Moved Inline */}
                    <button
                        onClick={handleSend}
                        type="button"
                        disabled={sending}
                        style={{
                            marginTop: '2rem',
                            width: '100%', backgroundColor: 'var(--color-primary)', color: 'white',
                            padding: '1rem', borderRadius: '0.5rem', fontSize: '1rem', fontWeight: 700,
                            textTransform: 'uppercase', letterSpacing: '0.025em', border: 'none', cursor: sending ? 'not-allowed' : 'pointer',
                            boxShadow: '0 10px 15px -3px rgba(225, 0, 45, 0.2)',
                            opacity: sending ? 0.7 : 1
                        }}
                    >
                        {sending ? 'ENVIANDO...' : 'ENVIAR AHORA'}
                    </button>
                </section>
            </main>
        </div>
    );
};
