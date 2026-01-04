import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

interface Exercise {
    id: string;
    name: string;
    description: string;
    type: string; // 'Fuerza', 'Cardio', etc.
    muscleGroup: string;
    imageUrl?: string;
}

const MUSCLE_GROUPS = ['Todos', 'Pectoral', 'Espalda', 'Pierna', 'Hombro', 'Bíceps', 'Tríceps', 'Core', 'Full Body'];
// const TYPES = ['Todos', 'Fuerza', 'Cardio', 'Habilidad', 'Flexibilidad']; 

const CoachLibraryView: React.FC = () => {
    const navigate = useNavigate();
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMuscle, setSelectedMuscle] = useState('Todos');
    // const [selectedType, setSelectedType] = useState('Todos'); // Simplify for now to just Muscle Groups as requested in prompt "Type/Muscle filters" but let's stick to just Muscle for UI clarity first unless needed.

    useEffect(() => {
        const q = query(collection(db, 'exercises'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const exercisesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Exercise[];
            setExercises(exercisesData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredExercises = exercises.filter(ex => {
        const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesMuscle = selectedMuscle === 'Todos' || ex.muscleGroup === selectedMuscle;
        // const matchesType = selectedType === 'Todos' || ex.type === selectedType;
        return matchesSearch && matchesMuscle;
    });

    return (
        <div className="app-container h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text-primary)]">
            {/* Header */}
            <header className="flex items-center p-4 sticky top-0 z-10 bg-[var(--color-bg)]/95 backdrop-blur-sm border-b border-[var(--color-border)] animate-fade-in-up">
                <button onClick={() => navigate(-1)} className="p-2 mr-2 rounded-full hover:bg-[var(--color-surface)] transition-colors text-[var(--color-text-primary)]">
                    <span className="material-icons-round">arrow_back</span>
                </button>
                <h1 className="text-xl font-bold flex-1">Biblioteca</h1>
                <div className="w-10 h-10 bg-[var(--color-surface)] rounded-full flex items-center justify-center text-[var(--color-primary)]">
                    <span className="material-icons-round">fitness_center</span>
                </div>
            </header>

            {/* Search & Filters */}
            <div className="p-4 space-y-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                {/* Search Bar */}
                <div className="relative">
                    <span className="material-icons-round absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">search</span>
                    <input
                        type="text"
                        placeholder="Buscar ejercicio..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[var(--color-surface)] text-[var(--color-text-primary)] pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all shadow-sm"
                    />
                </div>

                {/* Horizontal Filter Pills */}
                <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide -mx-4 px-4">
                    {MUSCLE_GROUPS.map(muscle => (
                        <button
                            key={muscle}
                            onClick={() => setSelectedMuscle(muscle)}
                            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedMuscle === muscle
                                    ? 'bg-[var(--color-primary)] text-white shadow-md transform scale-105'
                                    : 'bg-[var(--color-surface)] text-gray-400 hover:bg-gray-700'
                                }`}
                        >
                            {muscle}
                        </button>
                    ))}
                </div>
            </div>

            {/* Exercises Grid */}
            <div className="flex-1 overflow-y-auto p-4 pt-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
                    </div>
                ) : filteredExercises.length === 0 ? (
                    <div className="text-center py-10 opacity-60">
                        <p>No se encontraron ejercicios.</p>
                        <button
                            onClick={() => navigate('/dashboard/coach/add-exercise')}
                            className="text-[var(--color-primary)] mt-4 font-bold"
                        >
                            + Crear Nuevo
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 pb-20">
                        {filteredExercises.map((ex) => (
                            <div
                                key={ex.id}
                                className="bg-[var(--color-surface)] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all active:scale-95 cursor-pointer flex flex-col"
                            >
                                <div className="h-24 bg-gray-700 relative overflow-hidden">
                                    {ex.imageUrl ? (
                                        <img src={ex.imageUrl} alt={ex.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                                            <span className="material-icons-round text-4xl">fitness_center</span>
                                        </div>
                                    )}
                                    <div className="absolute top-1 right-1 bg-black/60 px-2 py-0.5 rounded text-[10px] text-white backdrop-blur-sm">
                                        {ex.type}
                                    </div>
                                </div>
                                <div className="p-3 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-bold text-sm leading-tight mb-1 line-clamp-2">{ex.name}</h3>
                                        <p className="text-xs text-[var(--color-text-secondary)]">{ex.muscleGroup}</p>
                                    </div>
                                    {/* Difficulty Dot */}
                                    <div className="mt-2 flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-[var(--color-primary)]"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Floating Action Button (Consistent with Dashboard) */}
            <button
                onClick={() => navigate('/dashboard/coach/add-exercise')}
                className="fixed bottom-6 right-6 w-14 h-14 bg-[var(--color-primary)] rounded-full shadow-lg shadow-[var(--color-primary)]/40 flex items-center justify-center text-white z-20 animate-fade-in-up hover:scale-110 transition-transform"
                style={{ animationDelay: '0.4s' }}
            >
                <div className="text-2xl font-light">+</div>
            </button>
        </div>
    );
};

export default CoachLibraryView;
