import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

interface ExerciseLibraryViewProps {
    onBack: () => void;
    onSelect?: (exercise: any) => void;
}

export const ExerciseLibraryView: React.FC<ExerciseLibraryViewProps> = ({ onBack, onSelect }) => {
    const navigate = useNavigate();
    // Firestore Integration
    const [exercises, setExercises] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('Todos');

    useEffect(() => {
        const q = query(collection(db, 'exercises'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const exercisesData = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    name: data.name,
                    description: data.description,
                    image: data.imageUrl, // Map Firestore imageUrl to local image
                    tags: [data.muscleGroup, data.type].filter(Boolean), // Create tags from metadata
                    category: data.type || 'General',
                    // Pass raw data for editing
                    ...data
                };
            });
            setExercises(exercisesData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredExercises = exercises.filter(ex => {
        const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = activeFilter === 'Todos' || ex.category === activeFilter || ex.tags.includes(activeFilter);
        return matchesSearch && matchesFilter;
    });

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (window.confirm('¿Estás seguro de que quieres eliminar este ejercicio?')) {
            try {
                await deleteDoc(doc(db, 'exercises', id));
            } catch (error) {
                console.error("Error removing document: ", error);
                alert("Error al eliminar el ejercicio.");
            }
        }
    };

    const handleEdit = (e: React.MouseEvent, exercise: any) => {
        e.stopPropagation();
        navigate('/dashboard/coach/add-exercise', { state: exercise });
    };

    return (
        <div style={{
            height: '100dvh',
            backgroundColor: 'var(--color-bg)',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '480px',
            zIndex: 4000, // Top level
            color: 'var(--color-text-main)',
            boxShadow: '0 0 20px rgba(0,0,0,0.5)'
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
                        <button
                            onClick={() => navigate('/dashboard/coach/add-exercise')}
                            style={{
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

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10rem' }}>
                        <div style={{
                            width: '2rem', height: '2rem', borderRadius: '50%',
                            border: '3px solid var(--color-surface)', borderTopColor: 'var(--color-primary)',
                            animation: 'spin 1s linear infinite'
                        }}></div>
                        <style>{`
                            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                        `}</style>
                    </div>
                ) : (
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
                                cursor: 'pointer',
                                position: 'relative'
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
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, lineHeight: 1.25 }}>{ex.name}</h3>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onSelect?.(ex);
                                                }}
                                                style={{
                                                    backgroundColor: 'var(--color-primary)',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '50%',
                                                    width: '1.75rem',
                                                    height: '1.75rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                    marginTop: '-0.25rem',
                                                    marginRight: '-0.25rem'
                                                }}
                                            >
                                                <span className="material-icons-round" style={{ fontSize: '1.25rem' }}>add</span>
                                            </button>
                                        </div>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 0.5rem 0', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{ex.description}</p>
                                        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                                            <span style={{ fontSize: '0.625rem', padding: '0.125rem 0.5rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase', borderRadius: '0.25rem' }}>{ex.category}</span>
                                            {/* Show simple second tag logic based on array */}
                                            {ex.tags[1] && <span style={{ fontSize: '0.625rem', padding: '0.125rem 0.5rem', backgroundColor: 'var(--color-bg)', color: 'var(--color-text-muted)', fontWeight: 500, borderRadius: '0.25rem' }}>{ex.tags[1]}</span>}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.25rem', paddingTop: '0.5rem', borderTop: '1px solid var(--color-bg)', marginTop: '0.5rem' }}>
                                        <button
                                            onClick={(e) => handleEdit(e, ex)}
                                            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-text-muted)', background: 'none', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}
                                        >
                                            <span className="material-icons-round" style={{ fontSize: '1rem' }}>edit</span> Editar
                                        </button>
                                        <button
                                            onClick={(e) => handleDelete(e, ex.id)}
                                            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', fontSize: '0.75rem', fontWeight: 500, color: '#ef4444', background: 'none', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}
                                        >
                                            <span className="material-icons-round" style={{ fontSize: '1rem' }}>delete</span> Borrar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Bottom Nav - simplified for this specific view */}
            <nav style={{
                position: 'fixed',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
                maxWidth: '480px',
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
