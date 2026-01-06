import React, { useState, useEffect } from 'react';
import { coachService, type Coach } from '../services/coachService';

interface AdminCoachesViewProps {
    onBack: () => void;
}

export const AdminCoachesView: React.FC<AdminCoachesViewProps> = ({ onBack }) => {
    const [coaches, setCoaches] = useState<Coach[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCoach, setEditingCoach] = useState<Coach | null>(null);
    const [filterQuery, setFilterQuery] = useState('');

    // Form State
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [groups, setGroups] = useState<('box' | 'fit')[]>([]);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Hardcoded stats for design fidelity
    const activeCoachesCount = coaches.filter(c => c.active).length;
    const inactiveCoachesCount = coaches.filter(c => !c.active).length;

    useEffect(() => {
        loadCoaches();
    }, []);

    const loadCoaches = async () => {
        setIsLoading(true);
        try {
            const data = await coachService.getCoaches();
            setCoaches(data);
        } catch (error) {
            console.error("Failed to load coaches", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (coach?: Coach) => {
        if (coach) {
            setEditingCoach(coach);
            setFirstName(coach.firstName);
            setLastName(coach.lastName);
            setSpecialty(coach.specialty);
            setGroups(coach.groups || []);
            setPhotoPreview(coach.photoURL || null);
        } else {
            setEditingCoach(null);
            setFirstName('');
            setLastName('');
            setSpecialty('');
            setGroups([]);
            setPhotoPreview(null);
        }
        setPhotoFile(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCoach(null);
    };

    const toggleGroup = (group: 'box' | 'fit') => {
        setGroups(prev =>
            prev.includes(group)
                ? prev.filter(g => g !== group)
                : [...prev, group]
        );
    };

    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPhotoFile(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        if (!firstName || !lastName || !specialty) {
            alert("Por favor completa los campos obligatorios");
            return;
        }

        setIsSaving(true);
        try {
            const coachData = {
                firstName,
                lastName,
                specialty,
                groups,
                active: editingCoach ? editingCoach.active : true, // Preserve active status usually
                photoURL: editingCoach?.photoURL // Keep existing if not replaced
            };

            if (editingCoach && editingCoach.id) {
                await coachService.updateCoach(editingCoach.id, coachData, photoFile || undefined);
            } else {
                await coachService.addCoach(coachData as any, photoFile || undefined);
            }

            await loadCoaches();
            handleCloseModal();
        } catch (error) {
            alert("Error al guardar entrenador");
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggleActive = async (coach: Coach) => {
        // Logic to toggle active status
        if (!coach.id) return;
        try {
            await coachService.updateCoach(coach.id, { active: !coach.active });
            loadCoaches();
        } catch (error) {
            console.error("Error toggling coach status", error);
        }
    };


    const handleDelete = async (id: string) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este entrenador?")) {
            try {
                await coachService.deleteCoach(id);
                await loadCoaches();
            } catch (error) {
                alert("Error al eliminar");
            }
        }
    };

    // AdminPhoto fallback (hardcoded from your HTML example for consistency or use auth context)
    const adminPhoto = "https://lh3.googleusercontent.com/aida-public/AB6AXuAd01bjAYpy7bJvk9wdc3SdJ0FnGWkfipgGvydD9SmZhXrwCzOOgBCV-n170DCUF5TgZROm4iJ15xtm9CzxTlKWLeeJsAUJirjjrVIxzIm_9IOQk_IFwHnQ2ZMg0apNfXi1uJGiaSnFtcGhrjMhs4TuoxwZtJGuvtxpaOcMSNDw1j8maTJpI8yW6sB1DtY9EJXqVKe0A65Dp0UA2A3UOqW84EFbJWZph3Rt90CjV2ulG_IJHdr_n6t2ufxO7mBn2H6ICqOTO_Pdzxo";

    const filteredCoaches = coaches.filter(c =>
        filterQuery === '' ||
        c.firstName.toLowerCase().includes(filterQuery.toLowerCase()) ||
        c.lastName.toLowerCase().includes(filterQuery.toLowerCase()) ||
        c.specialty.toLowerCase().includes(filterQuery.toLowerCase())
    );

    return (
        /* USING INLINE STYLES AND TAILWIND CLASSES MATCHING THE HTML PROVIDED */
        <div className="font-display bg-dark-bg text-dark-text-main h-[100dvh] flex flex-col overflow-hidden antialiased">

            {/* MATCHING HEADER STYLE */}
            <header className="sticky top-0 z-50 bg-dark-surface/95 backdrop-blur-md shadow-sm border-b border-dark-surface-2/50 shrink-0">
                <div className="flex items-center p-4 pb-4 justify-between h-[4.5rem]">
                    <button
                        onClick={onBack}
                        className="text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-dark-surface-2 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                    </button>
                    <h2 className="text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center uppercase">Gestión de Entrenadores</h2>
                    <div className="flex size-10 items-center justify-end">
                        <button className="flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-brand-red p-0.5 hover:bg-dark-surface-2 transition-colors">
                            <img alt="Profile Picture" className="size-full rounded-full object-cover" src={adminPhoto} />
                        </button>
                    </div>
                </div>
            </header>

            {/* SCROLLABLE CONTENT */}
            <main className="flex-1 overflow-y-auto px-4 py-6 space-y-6 pb-24 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">

                {/* SEARCH BAR */}
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 material-symbols-outlined text-[20px]">search</span>
                        <input
                            className="w-full bg-dark-surface border-none rounded-xl py-3 pl-10 pr-4 text-sm font-medium shadow-soft focus:ring-2 focus:ring-brand-red/40 placeholder:text-gray-500 text-white"
                            placeholder="Buscar entrenador..."
                            type="text"
                            value={filterQuery}
                            onChange={(e) => setFilterQuery(e.target.value)}
                        />
                    </div>
                    <button className="bg-dark-surface-2 text-white rounded-xl px-4 flex items-center justify-center shadow-soft hover:bg-[#353949] transition-colors border border-transparent">
                        <span className="material-symbols-outlined text-[20px]">tune</span>
                    </button>
                </div>

                {/* ADD NEW BUTTON */}
                <button
                    onClick={() => handleOpenModal()}
                    className="w-full bg-brand-red text-white p-4 rounded-xl shadow-lg shadow-brand-red/20 flex items-center justify-center gap-2 font-bold uppercase text-sm hover:bg-red-600 active:scale-[0.98] transition-all"
                >
                    <span className="material-symbols-outlined">person_add</span>
                    Añadir Nuevo Entrenador
                </button>

                {/* STATUS CARDS */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-dark-surface p-4 rounded-xl shadow-soft border border-dark-surface-2 flex items-center justify-between">
                        <div>
                            <span className="block text-2xl font-extrabold text-white">{activeCoachesCount}</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Total Activos</span>
                        </div>
                        <div className="size-10 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center">
                            <span className="material-symbols-outlined">check_circle</span>
                        </div>
                    </div>
                    <div className="bg-dark-surface p-4 rounded-xl shadow-soft border border-dark-surface-2 flex items-center justify-between">
                        <div>
                            <span className="block text-2xl font-extrabold text-white">{inactiveCoachesCount}</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Inactivos</span>
                        </div>
                        <div className="size-10 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center">
                            <span className="material-symbols-outlined">beach_access</span>
                        </div>
                    </div>
                </div>

                {/* COACH LIST */}
                <div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-wide px-1 mb-3">Equipo Técnico</h3>
                    <div className="space-y-3">
                        {isLoading ? (
                            <div className="flex justify-center py-10 text-white">
                                <span className="material-symbols-outlined animate-spin text-3xl opacity-50">progress_activity</span>
                            </div>
                        ) : filteredCoaches.length === 0 ? (
                            <div className="text-center py-10 opacity-50">
                                <p className="text-white">No se encontraron entrenadores.</p>
                            </div>
                        ) : (
                            filteredCoaches.map(coach => (
                                <div
                                    key={coach.id}
                                    className={`bg-dark-surface p-4 rounded-2xl shadow-soft border border-dark-surface-2 group ${!coach.active ? 'opacity-60' : ''}`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`relative ${!coach.active ? 'grayscale' : ''}`}>
                                            <img
                                                alt="Trainer"
                                                className="size-16 rounded-xl object-cover border-2 border-dark-surface shadow-sm"
                                                src={coach.photoURL || "https://lh3.googleusercontent.com/aida-public/AB6AXuAY4LkhvU1YFse9KTIojtjuha8sVuUSIKmZ8SLV0JObgp09gICiHNTz9Ii1fNOB8--U5mUPENxfXLJMabdm3VmL_omvSND1VsT05WDULPYku0peLPoZTfBcNV5gC_3THC4_ZR12ftCupbF9QaLrkbAcvduADcqBAsPqtXpXAPTHW4uo3z0FkCBpa0qBJsnfP8ou3OciY9cEO1sx4uV3GvcqTkkmBopUhWCXzn-a94tfqmIrHIkryIa3AhTN5I_I6yFSL3DcSo6l21o"} // User Placeholder or default
                                            />
                                            <div className={`absolute -bottom-1 -right-1 size-5 border-2 border-dark-surface rounded-full ${coach.active ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className={`font-bold text-base truncate ${coach.active ? 'text-white' : 'text-gray-400'}`}>
                                                        {coach.firstName} {coach.lastName}
                                                    </h4>
                                                    <p className={`text-xs font-semibold mb-1 ${coach.active ? 'text-brand-red' : 'text-gray-500'}`}>
                                                        {coach.specialty}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleOpenModal(coach)}
                                                    className="text-gray-500 hover:text-white p-1"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {coach.active ? (
                                                    <>
                                                        {coach.groups?.includes('box') && (
                                                            <span className="bg-dark-surface-2 text-gray-300 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">AlmodovarBox</span>
                                                        )}
                                                        {coach.groups?.includes('fit') && (
                                                            <span className="bg-dark-surface-2 text-gray-300 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">AlmodovarFit</span>
                                                        )}
                                                        {(!coach.groups || coach.groups.length === 0) && (
                                                            <span className="bg-dark-surface-2 text-gray-300 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">General</span>
                                                        )}
                                                    </>
                                                ) : (
                                                    <span className="bg-dark-surface-2 text-gray-400 border border-dark-surface-2 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">Inactivo</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-dark-surface-2 flex justify-between items-center">
                                        <div className="flex items-center gap-1 text-gray-400">
                                            <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                                            <span className="text-xs font-medium">Clases esta semana: NA</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleOpenModal(coach)}
                                                className="size-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center hover:bg-blue-500/20 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">edit</span>
                                            </button>

                                            {coach.active ? (
                                                <button
                                                    onClick={() => handleToggleActive(coach)}
                                                    className="size-8 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center hover:bg-orange-500/20 transition-colors"
                                                    title="Desactivar (Vacaciones)"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">beach_access</span>
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleToggleActive(coach)}
                                                    className="size-8 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center hover:bg-green-500/20 transition-colors"
                                                    title="Reactivar"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">check</span>
                                                </button>
                                            )}

                                            <button
                                                onClick={() => coach.id && handleDelete(coach.id)}
                                                className="size-8 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>

            {/* MODAL RE-STYLED TO MATCH PREVIOUSLY REQUESTED DARK THEME IF POSSIBLE, BUT KEEPING FUNCTIONAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleCloseModal}></div>
                    <div className="relative w-full max-w-sm bg-dark-surface rounded-[2rem] shadow-2xl border border-dark-surface-2 overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="p-6 pb-4 border-b border-dark-surface-2">
                            <h3 className="font-bold text-xl text-white">
                                {editingCoach ? 'Editar Entrenador' : 'Nuevo Entrenador'}
                            </h3>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Photo Upload */}
                            <div className="flex justify-center">
                                <div className="relative group cursor-pointer" onClick={() => document.getElementById('coach-photo-input')?.click()}>
                                    <div className="size-24 rounded-full bg-dark-surface-2 overflow-hidden border-2 border-dashed border-gray-600 flex items-center justify-center transition-all group-hover:border-brand-red">
                                        {photoPreview ? (
                                            <img src={photoPreview} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="material-symbols-outlined text-3xl opacity-30 text-white">add_a_photo</span>
                                        )}
                                    </div>
                                    <div className="absolute bottom-0 right-0 p-1.5 bg-brand-red rounded-full text-white shadow-lg">
                                        <span className="material-symbols-outlined text-sm">edit</span>
                                    </div>
                                    <input
                                        type="file"
                                        id="coach-photo-input"
                                        hidden
                                        accept="image/*"
                                        onChange={handlePhotoSelect}
                                    />
                                </div>
                            </div>

                            {/* Inputs */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase font-bold tracking-wider opacity-60 ml-1 text-gray-400">Nombre</label>
                                        <input
                                            value={firstName}
                                            onChange={e => setFirstName(e.target.value)}
                                            className="w-full p-3 rounded-xl bg-dark-surface-2 border-none focus:ring-2 focus:ring-brand-red font-bold text-white placeholder-gray-600"
                                            placeholder="Ej. Juan"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase font-bold tracking-wider opacity-60 ml-1 text-gray-400">Apellidos</label>
                                        <input
                                            value={lastName}
                                            onChange={e => setLastName(e.target.value)}
                                            className="w-full p-3 rounded-xl bg-dark-surface-2 border-none focus:ring-2 focus:ring-brand-red font-bold text-white placeholder-gray-600"
                                            placeholder="Pérez"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] uppercase font-bold tracking-wider opacity-60 ml-1 text-gray-400">Especialidad</label>
                                    <input
                                        value={specialty}
                                        onChange={e => setSpecialty(e.target.value)}
                                        className="w-full p-3 rounded-xl bg-dark-surface-2 border-none focus:ring-2 focus:ring-brand-red font-medium text-white placeholder-gray-600"
                                        placeholder="Ej. Crossfit L1"
                                    />
                                </div>

                                {/* Group Selection */}
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold tracking-wider opacity-60 ml-1 text-gray-400">Asignar a Grupos</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => toggleGroup('box')}
                                            className={`p-4 rounded-xl border flex items-center justify-center gap-2 transition-all ${groups.includes('box')
                                                    ? 'bg-brand-red text-white border-brand-red shadow-lg shadow-brand-red/20'
                                                    : 'bg-dark-surface-2 border-transparent text-gray-400 hover:text-white'
                                                }`}
                                        >
                                            <span className="material-symbols-outlined">fitness_center</span>
                                            <span className="font-bold text-xs uppercase">Box</span>
                                        </button>
                                        <button
                                            onClick={() => toggleGroup('fit')}
                                            className={`p-4 rounded-xl border flex items-center justify-center gap-2 transition-all ${groups.includes('fit')
                                                    ? 'bg-cyan-600 text-white border-cyan-600 shadow-lg shadow-cyan-600/20'
                                                    : 'bg-dark-surface-2 border-transparent text-gray-400 hover:text-white'
                                                }`}
                                        >
                                            <span className="material-symbols-outlined">self_improvement</span>
                                            <span className="font-bold text-xs uppercase">Fit</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-dark-surface-2 bg-dark-surface flex gap-3">
                            <button
                                onClick={handleCloseModal}
                                className="flex-1 py-4 rounded-xl font-bold text-gray-400 hover:bg-dark-surface-2 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex-1 py-4 rounded-xl font-bold bg-brand-red text-white shadow-lg shadow-brand-red/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                {isSaving ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
