import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

interface CoachAthletesViewProps {
    onBack: () => void;
}

export const CoachAthletesView: React.FC<CoachAthletesViewProps> = ({ onBack }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                // Hardcoded coach group for now, matching CoachNotificationsView
                const targetGroup = 'morning';

                const querySnapshot = await getDocs(collection(db, 'users'));
                const fetched: any[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    // Option B: Strict filtering. Only show users assigned to the coach's group.
                    if (data.group === targetGroup && data.email !== 'admin@almodovarbox.com' && data.email !== 'coach@almodovarbox.com') {
                        fetched.push({
                            id: doc.id,
                            name: data.displayName || data.name || data.email?.split('@')[0] || 'Usuario',
                            image: data.photoURL || `https://ui-avatars.com/api/?name=${data.displayName || 'User'}&background=random`,
                            status: data.status || 'active',
                            plan: data.plan || 'box',
                            lastAttendance: 'Sin datos'
                        });
                    }
                });
                setUsers(fetched);
            } catch (error) {
                console.error("Error fetching athletes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: '1.5rem 1.25rem', animation: 'fadeIn 0.3s ease-out', paddingBottom: '6rem' }}>
            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--color-text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <span className="material-icons-round">arrow_back</span>
                </button>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Alumnos/as del grupo</h2>
            </div>

            {/* Search Bar */}
            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <span className="material-icons-round" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>search</span>
                <input
                    type="text"
                    placeholder="Buscar alumno..."
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

            {/* Stats Summary - ONLY TOTAL */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ backgroundColor: 'var(--color-surface)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                    <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                        {loading ? '...' : users.length}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Alumnos</span>
                </div>
            </div>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {loading ? (
                    <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>Cargando alumnos...</p>
                ) : filteredUsers.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>No se encontraron alumnos.</p>
                ) : (
                    filteredUsers.map(athlete => (
                        <div key={athlete.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            backgroundColor: 'var(--color-surface)',
                            padding: '0.75rem',
                            borderRadius: '1rem',
                            border: '1px solid var(--color-border)',
                            cursor: 'pointer'
                        }}>
                            <div style={{ position: 'relative' }}>
                                <img src={athlete.image} alt={athlete.name} style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%', objectFit: 'cover' }} />
                                <div style={{
                                    position: 'absolute', bottom: 0, right: 0, width: '0.75rem', height: '0.75rem', borderRadius: '50%',
                                    border: '2px solid var(--color-surface)', backgroundColor: '#22c55e'
                                }}></div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>{athlete.name}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                                    <span style={{
                                        fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '0.25rem', fontWeight: 700, textTransform: 'uppercase',
                                        backgroundColor: 'rgba(var(--color-primary-rgb), 0.1)',
                                        color: 'var(--color-primary)'
                                    }}>
                                        {athlete.plan.toUpperCase()}
                                    </span>
                                    {athlete.lastAttendance !== 'Sin datos' && (
                                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>• {athlete.lastAttendance}</span>
                                    )}
                                </div>
                            </div>
                            <span className="material-icons-round" style={{ color: 'var(--color-text-muted)' }}>chevron_right</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
