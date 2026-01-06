import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, QuerySnapshot } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';


interface CoachAthletesViewProps {
    onBack: () => void;
}

interface User {
    uid: string;
    displayName?: string;
    name?: string;
    email?: string;
    photoURL?: string;
    status?: string;
    plan?: string;
    lastAttendance?: string;
    firstName?: string;
}

export const CoachAthletesView: React.FC<CoachAthletesViewProps> = ({ onBack }) => {
    const { userData } = useAuth();
    // const navigate = useNavigate(); // Removed unused

    const [searchTerm, setSearchTerm] = useState('');
    const [athletes, setAthletes] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userData) return;

        // Determine target group from coach profile
        const group = userData.assignedGroup || 'ALMODOVAR BOX'; // Default fallback

        // Server-side filtering: Only fetch users in this group (and client role)
        // Note: Requires index on [assignedGroup, role] if we filter by both. 
        // For now let's just filter by group to be safe on indexes, or just simple check.
        // Assuming 'users' collection has 'assignedGroup' field.

        const q = query(
            collection(db, 'users'),
            where('assignedGroup', '==', group),
            where('role', '==', 'cliente')
            // orderBy('firstName', 'asc') // Might need index: assignedGroup ASC, role ASC, firstName ASC
        );

        const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot) => {
            const usersData = snapshot.docs.map(doc => ({
                uid: doc.id,
                ...doc.data()
            })) as User[];

            // Client-side sort to avoid index issues for now
            usersData.sort((a, b) => (a.firstName || '').localeCompare(b.firstName || ''));

            setAthletes(usersData);
            setLoading(false);
        }, (err: any) => {
            console.error("Error fetching athletes:", err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userData]);

    const filteredUsers = athletes.filter(athlete => // Changed from users to athletes
        (athlete.displayName || athlete.name || athlete.email?.split('@')[0] || 'Usuario').toLowerCase().includes(searchTerm.toLowerCase())
    ).map(athlete => ({ // Map to the structure expected by the rendering logic
        id: athlete.uid,
        name: athlete.displayName || athlete.name || athlete.email?.split('@')[0] || 'Usuario',
        image: athlete.photoURL || `https://ui-avatars.com/api/?name=${athlete.displayName || 'User'}&background=random`,
        status: athlete.status || 'active',
        plan: athlete.plan || 'box',
        lastAttendance: 'Sin datos' // This will need to be fetched separately or added to user data
    }));

    return (
        <div className="p-5 pb-24 animate-fade-in-up">
            <div className="mb-6 flex items-center gap-2">
                <button onClick={onBack} className="text-text-main flex items-center justify-center p-2 -ml-2 rounded-full hover:bg-surface-hover transition-colors">
                    <span className="material-icons-round">arrow_back</span>
                </button>
                <h2 className="text-xl font-bold m-0">Alumnos/as del grupo</h2>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
                <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">search</span>
                <input
                    type="text"
                    placeholder="Buscar alumno..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-surface text-text-main text-base focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                />
            </div>

            {/* Stats Summary - ONLY TOTAL */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ backgroundColor: 'var(--color-surface)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                    <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                        {loading ? '...' : athletes.length}
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
