import React, { useState } from 'react';

interface Athlete {
    id: string;
    name: string;
    image: string;
    status: 'active' | 'inactive';
    plan: 'box' | 'fit';
    lastAttendance: string;
}

interface CoachAthletesViewProps {
    onBack: () => void;
}

export const CoachAthletesView: React.FC<CoachAthletesViewProps> = ({ onBack }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const athletes: Athlete[] = [
        { id: '1', name: 'Ana Martínez', image: 'https://i.pravatar.cc/150?img=1', status: 'active', plan: 'box', lastAttendance: 'Hoy' },
        { id: '2', name: 'Carlos Ruíz', image: 'https://i.pravatar.cc/150?img=2', status: 'active', plan: 'fit', lastAttendance: 'Ayer' },
        { id: '3', name: 'Laura García', image: 'https://i.pravatar.cc/150?img=5', status: 'inactive', plan: 'fit', lastAttendance: 'Hace 5 días' },
        { id: '4', name: 'David López', image: 'https://i.pravatar.cc/150?img=11', status: 'active', plan: 'box', lastAttendance: 'Hoy' },
        { id: '5', name: 'Elena Torres', image: 'https://i.pravatar.cc/150?img=9', status: 'active', plan: 'box', lastAttendance: 'Hace 2 días' },
        { id: '6', name: 'Pablo Sánchez', image: 'https://i.pravatar.cc/150?img=13', status: 'active', plan: 'fit', lastAttendance: 'Ayer' },
    ];

    const filteredAthletes = athletes.filter(athlete =>
        athlete.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: '1.5rem 1.25rem', animation: 'fadeIn 0.3s ease-out', paddingBottom: '6rem' }}>
            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--color-text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <span className="material-icons-round">arrow_back</span>
                </button>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Directorio de Atletas</h2>
            </div>

            {/* Search Bar */}
            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <span className="material-icons-round" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>search</span>
                <input
                    type="text"
                    placeholder="Buscar atleta..."
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

            {/* Stats Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ backgroundColor: 'var(--color-surface)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                    <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>{athletes.length}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Alumnos</span>
                </div>
                <div style={{ backgroundColor: 'var(--color-surface)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                    <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 800, color: '#22c55e' }}>{athletes.filter(a => a.status === 'active').length}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Activos</span>
                </div>
            </div>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {filteredAthletes.map(athlete => (
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
                                border: '2px solid var(--color-surface)', backgroundColor: athlete.status === 'active' ? '#22c55e' : '#9ca3af'
                            }}></div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>{athlete.name}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                                <span style={{
                                    fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '0.25rem', fontWeight: 700, textTransform: 'uppercase',
                                    backgroundColor: athlete.plan === 'box' ? 'rgba(var(--color-primary-rgb), 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                    color: athlete.plan === 'box' ? 'var(--color-primary)' : '#3b82f6'
                                }}>
                                    Plan {athlete.plan}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>• {athlete.lastAttendance}</span>
                            </div>
                        </div>
                        <span className="material-icons-round" style={{ color: 'var(--color-text-muted)' }}>chevron_right</span>
                    </div>
                ))}

                {filteredAthletes.length === 0 && (
                    <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>No se encontraron atletas.</p>
                )}
            </div>
        </div>
    );
};
