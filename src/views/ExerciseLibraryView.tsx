import React, { useState } from 'react';

interface ExerciseLibraryViewProps {
    onBack: () => void;
}

export const ExerciseLibraryView: React.FC<ExerciseLibraryViewProps> = ({ onBack }) => {
    // Mock Data based on HTML
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('Todos');

    const exercises = [
        {
            id: 1,
            name: 'Back Squat',
            description: 'Barbell high bar squat for lower body.',
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBrd5b2oD4CmG3h3WgSgWZd5skT1gBU1KpBR9yKO-_uVPZi6xZ6ItqnUoXhhISJuusQWRZhkDaFLUayf6ZCl8iTHlRCVrzvGjQ1opLxlU5PTv6NEt2ztgP00eP41VU9sugsH5T-gMF7eO0aLS7_E0mHU2D3gDtvAlm4NK8rA744pGrbSwkVIZD17F4uPv6tT2PNInziuDkMGJYzAuZU2PJdnvFYpJNgL5ND0IG0nXwhqhR0xrHyrkSyGyj24pXLKVdoUdGj-TulXZ8",
            tags: ['Fuerza', 'Piernas'],
            category: 'Fuerza'
        },
        {
            id: 2,
            name: 'Push Ups',
            description: 'Flexiones estándar en el suelo.',
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfcg0XPA0LaJ3p-ahyCVk8GFsAGlyxmCK8yfScGfke87UA-h0vzdCiFduCapnveRV1jNneRQg0oG1cms3EcszKBOriJnJaZfGie-cI2N_tWAzz6ANbmFV5vHiBaFQHnWnAbHGwvFl-x3Cgq3LFv6p7xhSCAQkL_GVOT9b4FHbE61vUjvkot004aK9HqwQFK01a18-I11W0HPxDzD5vuRN6pptL0cW1SihoP-m3AFfv2XdULUhrf5__CwFZA7uZ5PORT-QTVVLZYl8",
            tags: ['Funcional', 'Pecho'],
            category: 'Funcional'
        },
        {
            id: 3,
            name: 'Burpees',
            description: 'Cardio intenso de cuerpo completo.',
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCd54a-ImETfTVz2gFM4OYUm198ahuNitORe9lHNWQ8OgkddWiSz-U7FkwbABLlwQdh8eC0BuIl_oTGzYwflRFWwEOFTOBii4Z3m-r5C-F0rIc4PIjlt2_Q2Q5XaJbYiywdK00c2JmN6Nxu74doaNJ6L2pjE8A07ZJlxq_Rpy5hjnnYfVUWcq36Ri4aw0vOwLT2PnTYEa00V6IaU9Lw1Atj7sjczVvHequLXDCFS09bqBpNn4ftkXnBTjYUUsKK2F6E9EWT5C4hzWM",
            tags: ['Cardio', 'Full Body'],
            category: 'Cardio'
        },
        {
            id: 4,
            name: 'Dumbbell Row',
            description: 'Sin foto adjunta.',
            image: null,
            tags: ['Fuerza', 'Espalda'],
            category: 'Fuerza'
        },
    ];

    const filteredExercises = exercises.filter(ex => {
        const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = activeFilter === 'Todos' || ex.category === activeFilter; // Simplified logic for demo
        return matchesSearch && matchesFilter;
    });

    return (
        <div style={{
            height: '100dvh',
            backgroundColor: 'var(--color-bg)',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 4000, // Top level
            color: 'var(--color-text-main)',
        }}>
            {/* Header */}
            <header style={{
                backgroundColor: 'var(--color-surface)',
                borderBottom: '1px solid var(--color-border)',
                paddingBottom: '1rem',
                zIndex: 50,
                boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)'
            }}>
                <div style={{ padding: '3rem 1rem 0.5rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button onClick={onBack} style={{ background: 'none', border: 'none', padding: '0.5rem', marginLeft: '-0.5rem', cursor: 'pointer', color: 'var(--color-text-main)' }}>
                        <span className="material-icons-round" style={{ fontSize: '1.5rem' }}>arrow_back</span>
                    </button>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h1 style={{ fontSize: '1.125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.025em', margin: 0 }}>Biblioteca</h1>
                        <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Almodovar Group</span>
                    </div>
                    <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--color-primary)', backgroundColor: '#e5e7eb' }}>
                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDx8hkqRA0LUsbAarKrWxS5J1zCK9T3qwLK0RGoNlM89kzTf2F9D_ylcGSj32M0LqGsTCZVH24zJE9TOIvMoi2q91WR7kTsxl4R8XiyLLjXWWq7v-iQ7A53tmXzIdg9ddVD5So1SRe43Cg5jhGHEWlHoaLtFRRlDhtBDgvluhv2JDCQwOlAA8paeQq_Wp5Gmpqsy3EYYn6xbBzqi7rJPXEcJogVm9SMS79vxXjhH06-vZTjFT39MUowJlw_R9mpcWLK4QU1VdsOeC0" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                </div>

                <div style={{ padding: '0 1rem', marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <span className="material-icons-round" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>search</span>
                            <input
                                type="text"
                                placeholder="Buscar ejercicio..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%',
                                    backgroundColor: 'var(--color-bg)',
                                    border: 'none',
                                    borderRadius: '0.75rem',
                                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                                    fontSize: '0.875rem',
                                    color: 'var(--color-text-main)',
                                    outline: 'none',
                                    boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
                                }}
                            />
                        </div>
                        <button style={{
                            backgroundColor: 'var(--color-primary)',
                            color: 'white',
                            width: '3rem',
                            borderRadius: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 10px 15px -3px rgba(239, 68, 68, 0.2)',
                            border: 'none',
                            cursor: 'pointer'
                        }}>
                            <span className="material-icons-round">add</span>
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', overflowX: 'auto', paddingBottom: '0.25rem' }} className="hide-scrollbar">
                        {['Todos', 'Fuerza', 'Cardio', 'Funcional', 'Movilidad'].map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                style={{
                                    padding: '0.375rem 1rem',
                                    borderRadius: '9999px',
                                    fontSize: '0.75rem',
                                    fontWeight: filter === activeFilter ? 600 : 500,
                                    whiteSpace: 'nowrap',
                                    backgroundColor: filter === activeFilter ? 'var(--color-primary)' : 'var(--color-surface)',
                                    color: filter === activeFilter ? 'white' : 'var(--color-text-muted)',
                                    border: filter === activeFilter ? 'none' : '1px solid var(--color-border)',
                                    cursor: 'pointer',
                                    boxShadow: filter === activeFilter ? '0 4px 6px -1px rgba(239, 68, 68, 0.2)' : 'none',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* List */}
            <main style={{ flex: 1, padding: '1.5rem 1rem', paddingBottom: '7rem', overflowY: 'auto' }} className="hide-scrollbar">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', padding: '0 0.25rem' }}>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Mis Ejercicios
                        <span style={{ fontSize: '0.75rem', fontWeight: 400, backgroundColor: 'var(--color-bg)', padding: '0.125rem 0.5rem', borderRadius: '9999px', color: 'var(--color-text-muted)' }}>{filteredExercises.length}</span>
                    </h2>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <span className="material-icons-round" style={{ fontSize: '0.875rem' }}>sort</span> Ordenar
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {filteredExercises.map(ex => (
                        <div key={ex.id} style={{
                            backgroundColor: 'var(--color-surface)',
                            borderRadius: '1rem',
                            padding: '0.75rem',
                            border: '1px solid var(--color-border)',
                            display: 'flex',
                            gap: '1rem',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                            transition: 'transform 0.2s',
                            cursor: 'pointer'
                        }}>
                            <div style={{ width: '6rem', height: '6rem', borderRadius: '0.75rem', backgroundColor: 'var(--color-bg)', flexShrink: 0, overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {ex.image ? (
                                    <img src={ex.image} alt={ex.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <span className="material-icons-round" style={{ fontSize: '2.5rem', color: 'var(--color-text-muted)' }}>fitness_center</span>
                                )}
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '0.125rem 0' }}>
                                <div>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, lineHeight: 1.25 }}>{ex.name}</h3>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 0.5rem 0', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{ex.description}</p>
                                    <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                                        <span style={{ fontSize: '0.625rem', padding: '0.125rem 0.5rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase', borderRadius: '0.25rem' }}>{ex.category}</span>
                                        {/* Show simple second tag logic based on array */}
                                        {ex.tags[1] && <span style={{ fontSize: '0.625rem', padding: '0.125rem 0.5rem', backgroundColor: 'var(--color-bg)', color: 'var(--color-text-muted)', fontWeight: 500, borderRadius: '0.25rem' }}>{ex.tags[1]}</span>}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.25rem', paddingTop: '0.5rem', borderTop: '1px solid var(--color-bg)', marginTop: '0.5rem' }}>
                                    <button style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-text-muted)', background: 'none', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}>
                                        <span className="material-icons-round" style={{ fontSize: '1rem' }}>edit</span> Editar
                                    </button>
                                    <button style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', fontSize: '0.75rem', fontWeight: 500, color: '#ef4444', background: 'none', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}>
                                        <span className="material-icons-round" style={{ fontSize: '1rem' }}>delete</span> Borrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Bottom Nav - simplified for this specific view */}
            <nav style={{
                position: 'fixed', bottom: 0, left: 0, width: '100%',
                backgroundColor: 'var(--color-surface)',
                borderTop: '1px solid var(--color-border)',
                paddingBottom: 'env(safe-area-inset-bottom)',
                paddingTop: '0.5rem',
                zIndex: 50,
                boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.05)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '4rem', maxWidth: '480px', margin: '0 auto' }}>
                    <button onClick={onBack} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer', width: '4rem' }}>
                        <span className="material-icons-round" style={{ fontSize: '1.5rem' }}>home</span>
                        <span style={{ fontSize: '0.625rem', fontWeight: 500 }}>Inicio</span>
                    </button>
                    <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', width: '4rem', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '-2.5rem', backgroundColor: 'var(--color-primary)', padding: '0.75rem', borderRadius: '50%', border: '4px solid var(--color-surface)', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                            <span className="material-icons-round" style={{ fontSize: '1.5rem', color: 'white' }}>fitness_center</span>
                        </div>
                        <span style={{ fontSize: '0.625rem', fontWeight: 700, marginTop: '1.5rem' }}>Ejercicios</span>
                    </button>
                    <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer', width: '4rem' }}>
                        <span className="material-icons-round" style={{ fontSize: '1.5rem' }}>person</span>
                        <span style={{ fontSize: '0.625rem', fontWeight: 500 }}>Perfil</span>
                    </button>
                </div>
            </nav>
        </div>
    );
};
