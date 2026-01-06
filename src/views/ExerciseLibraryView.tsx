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
        <div className="flex flex-col h-full bg-[var(--color-bg)] text-[var(--color-text-main)] overflow-hidden">
            {/* Header */}
            <header className="flex-shrink-0 bg-[var(--color-surface)] border-b border-[var(--color-border)] shadow-sm z-50">
                <div className="flex items-center justify-between p-4 pb-2">
                    <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-[var(--color-bg)] transition-colors text-[var(--color-text-main)]">
                        <span className="material-icons-round text-2xl">arrow_back</span>
                    </button>
                    <div className="flex flex-col items-center">
                        <h1 className="text-lg font-bold uppercase tracking-tight">Biblioteca</h1>
                        <span className="text-xs font-medium text-[var(--color-primary)] uppercase tracking-widest">Almodovar Group</span>
                    </div>
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[var(--color-primary)] bg-gray-200">
                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDx8hkqRA0LUsbAarKrWxS5J1zCK9T3qwLK0RGoNlM89kzTf2F9D_ylcGSj32M0LqGsTCZVH24zJE9TOIvMoi2q91WR7kTsxl4R8XiyLLjXWWq7v-iQ7A53tmXzIdg9ddVD5So1SRe43Cg5jhGHEWlHoaLtFRRlDhtBDgvluhv2JDCQwOlAA8paeQq_Wp5Gmpqsy3EYYn6xbBzqi7rJPXEcJogVm9SMS79vxXjhH06-vZTjFT39MUowJlw_R9mpcWLK4QU1VdsOeC0" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                </div>

                <div className="px-4 pb-4 mt-2">
                    <div className="flex gap-3 mb-4">
                        <div className="relative flex-1">
                            <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">search</span>
                            <input
                                type="text"
                                placeholder="Buscar ejercicio..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[var(--color-bg)] border-none rounded-xl py-3 pl-10 pr-4 text-sm text-[var(--color-text-main)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none shadow-inner"
                            />
                        </div>
                        <button
                            onClick={() => navigate('/dashboard/coach/add-exercise')}
                            className="bg-[var(--color-primary)] text-white w-12 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20 hover:scale-105 transition-transform"
                        >
                            <span className="material-icons-round">add</span>
                        </button>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                        {['Todos', 'Fuerza', 'Cardio', 'Funcional', 'Movilidad'].map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${filter === activeFilter
                                        ? 'bg-[var(--color-primary)] text-white shadow-md'
                                        : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)]'
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* List */}
            <main className="flex-1 overflow-y-auto p-4 content-start grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 hide-scrollbar pb-32">
                <div className="col-span-full flex items-center justify-between mb-2 px-1">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        Mis Ejercicios
                        <span className="text-xs font-normal bg-[var(--color-surface)] px-2 py-0.5 rounded-full text-[var(--color-text-muted)] border border-[var(--color-border)]">
                            {filteredExercises.length}
                        </span>
                    </h2>
                    <button className="flex items-center gap-1 text-xs font-medium text-[var(--color-primary)] hover:underline">
                        <span className="material-icons-round text-sm">sort</span> Ordenar
                    </button>
                </div>

                {loading ? (
                    <div className="col-span-full flex justify-center items-center h-40">
                        <div className="w-8 h-8 border-4 border-[var(--color-surface)] border-t-[var(--color-primary)] rounded-full animate-spin"></div>
                    </div>
                ) : (
                    filteredExercises.map(ex => (
                        <div key={ex.id} className="bg-[var(--color-surface)] rounded-2xl p-3 border border-[var(--color-border)] flex gap-4 shadow-sm hover:shadow-md transition-all group relative">
                            <div className="w-24 h-24 rounded-xl bg-[var(--color-bg)] flex-shrink-0 overflow-hidden flex items-center justify-center relative">
                                {ex.image ? (
                                    <img src={ex.image} alt={ex.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="material-icons-round text-4xl text-[var(--color-text-muted)] opacity-50">fitness_center</span>
                                )}
                            </div>
                            <div className="flex-1 flex flex-col justify-between py-0.5">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-base font-bold leading-tight line-clamp-2">{ex.name}</h3>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onSelect?.(ex);
                                            }}
                                            className="bg-[var(--color-primary)] text-white rounded-full w-7 h-7 flex items-center justify-center shadow-sm hover:scale-110 transition-transform -mt-1 -mr-1"
                                        >
                                            <span className="material-icons-round text-lg">add</span>
                                        </button>
                                    </div>
                                    <p className="text-xs text-[var(--color-text-muted)] mt-1 line-clamp-1">{ex.description}</p>
                                    <div className="flex gap-1.5 flex-wrap mt-2">
                                        <span className="text-[10px] px-2 py-0.5 bg-red-500/10 text-[var(--color-primary)] font-bold uppercase rounded-md tracking-wide">
                                            {ex.category}
                                        </span>
                                        {ex.tags[1] && (
                                            <span className="text-[10px] px-2 py-0.5 bg-[var(--color-bg)] text-[var(--color-text-muted)] font-semibold rounded-md">
                                                {ex.tags[1]}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-2 mt-2 border-t border-[var(--color-bg)] opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => handleEdit(e, ex)}
                                        className="flex items-center gap-1 text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]"
                                    >
                                        <span className="material-icons-round text-sm">edit</span> Editar
                                    </button>
                                    <button
                                        onClick={(e) => handleDelete(e, ex.id)}
                                        className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600"
                                    >
                                        <span className="material-icons-round text-sm">delete</span> Borrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </main>
        </div>
    );
};
