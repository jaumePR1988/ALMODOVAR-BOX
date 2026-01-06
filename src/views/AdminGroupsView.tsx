
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

interface Group {
    id: string;
    name: string;
    type: 'box' | 'fit';
    weeklyLimit: number;
}

export const AdminGroupsView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentGroup, setCurrentGroup] = useState<Partial<Group>>({ name: '', type: 'box', weeklyLimit: 3 });

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const q = query(collection(db, 'groups'), orderBy('name'));
            const snapshot = await getDocs(q);
            const loaded: Group[] = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Group));
            setGroups(loaded);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!currentGroup.name || !currentGroup.weeklyLimit) return;

        try {
            setLoading(true);
            const data = {
                name: currentGroup.name,
                type: currentGroup.type || 'box',
                weeklyLimit: Number(currentGroup.weeklyLimit)
            };

            if (currentGroup.id) {
                await updateDoc(doc(db, 'groups', currentGroup.id), data);
            } else {
                await addDoc(collection(db, 'groups'), data);
            }
            setIsEditing(false);
            setCurrentGroup({ name: '', type: 'box', weeklyLimit: 3 });
            fetchGroups();
        } catch (e) {
            alert("Error guardando grupo");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Borrar grupo?")) return;
        await deleteDoc(doc(db, 'groups', id));
        fetchGroups();
    };

    return (
        <div className="animate-fade-in p-4 pb-24">
            <header className="flex items-center gap-3 mb-6">
                <button onClick={onBack} className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="text-xl font-bold">Gestión de Grupos</h1>
            </header>

            {/* List */}
            <div className="grid gap-4 mb-8">
                {groups.map(g => (
                    <div key={g.id} className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex justify-between items-center shadow-sm">
                        <div>
                            <h3 className="font-bold text-lg">{g.name}</h3>
                            <div className="flex gap-2 mt-1">
                                <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${g.type === 'fit' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>{g.type}</span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold">{g.weeklyLimit} clases/sem</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => { setCurrentGroup(g); setIsEditing(true); }} className="p-2 text-zinc-500 hover:text-blue-500"><span className="material-symbols-outlined">edit</span></button>
                            <button onClick={() => handleDelete(g.id)} className="p-2 text-zinc-500 hover:text-red-500"><span className="material-symbols-outlined">delete</span></button>
                        </div>
                    </div>
                ))}
                {groups.length === 0 && !loading && <p className="text-center opacity-50">No hay grupos definidos</p>}
            </div>

            <button
                onClick={() => { setCurrentGroup({ name: '', type: 'box', weeklyLimit: 3 }); setIsEditing(true); }}
                className="fixed bottom-6 right-6 h-14 px-6 bg-black dark:bg-white text-white dark:text-black rounded-full shadow-lg font-bold flex items-center gap-2 z-30"
            >
                <span className="material-symbols-outlined">add</span>
                Nuevo Grupo
            </button>

            {/* Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
                    <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-fade-in-up">
                        <h2 className="text-xl font-bold mb-4">{currentGroup.id ? 'Editar' : 'Nuevo'} Grupo</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Nombre</label>
                                <input
                                    value={currentGroup.name}
                                    onChange={e => setCurrentGroup({ ...currentGroup, name: e.target.value })}
                                    className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border-none outline-none font-bold placeholder:font-normal"
                                    placeholder="Ej: AlmodovarFIT"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Tipo</label>
                                    <select
                                        value={currentGroup.type}
                                        onChange={e => setCurrentGroup({ ...currentGroup, type: e.target.value as any })}
                                        className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border-none outline-none font-bold"
                                    >
                                        <option value="box">BOX (Crossfit)</option>
                                        <option value="fit">FIT (Funcional)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Límite Semanal</label>
                                    <input
                                        type="number"
                                        value={currentGroup.weeklyLimit}
                                        onChange={e => setCurrentGroup({ ...currentGroup, weeklyLimit: Number(e.target.value) })}
                                        className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border-none outline-none font-bold"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button onClick={() => setIsEditing(false)} className="flex-1 py-3 text-zinc-500 font-bold">Cancelar</button>
                            <button onClick={handleSave} className="flex-1 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold shadow-lg">Guardar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
