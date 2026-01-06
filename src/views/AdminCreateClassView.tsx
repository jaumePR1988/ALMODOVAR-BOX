import React, { useState, useEffect } from 'react';
import { classService } from '../services/classService';
import type { ClassData } from '../services/classService';
import { coachService, type Coach } from '../services/coachService';

interface AdminCreateClassViewProps {
    onBack: () => void;
}

export const AdminCreateClassView: React.FC<AdminCreateClassViewProps> = ({ onBack }) => {
    const [className, setClassName] = useState('');
    const [group, setGroup] = useState<'box' | 'fit'>('box');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('10:00');
    const [coachId, setCoachId] = useState('');
    const [capacity, setCapacity] = useState(20);
    const [description, setDescription] = useState('');
    const [isRecurring, setIsRecurring] = useState(false);
    const [recurringDays, setRecurringDays] = useState<string[]>([]);
    const [repeatAllYear, setRepeatAllYear] = useState(false);
    const [notifyUsers, setNotifyUsers] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [coaches, setCoaches] = useState<Coach[]>([]);

    useEffect(() => {
        const fetchCoaches = async () => {
            try {
                const data = await coachService.getCoaches();
                // Filter only active coaches if necessary, or just show all
                setCoaches(data.filter(c => c.active));
            } catch (error) {
                console.error("Error loading coaches:", error);
            }
        };
        fetchCoaches();
    }, []);

    const weekDays = [
        { id: '1', label: 'L' },
        { id: '2', label: 'M' },
        { id: '3', label: 'X' },
        { id: '4', label: 'J' },
        { id: '5', label: 'V' },
        { id: '6', label: 'S' },
        { id: '0', label: 'D' },
    ];

    const toggleDay = (dayId: string) => {
        setRecurringDays(prev =>
            prev.includes(dayId)
                ? prev.filter(d => d !== dayId)
                : [...prev, dayId]
        );
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handlePublish = async () => {
        setIsLoading(true);
        try {
            const classData: ClassData = {
                name: className,
                group: group,
                date: startDate,
                startTime,
                endTime,
                coachId: coachId,
                capacity,
                description,
                isRecurring,
                recurringDays: isRecurring ? recurringDays : [],
                repeatAllYear: isRecurring ? repeatAllYear : false,
                imageFile: imageFile || undefined,
                status: 'active',
            };

            await classService.createClass(classData);
            onBack();
        } catch (error) {
            console.error('Error creating class:', error);
            alert('Error al crear la clase');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        /* USANDO app-container PARA MANTENER COHERENCIA DE TAMAÑO MÓVIL Y TEMA */
        <div className="app-container font-display antialiased bg-[var(--color-bg)]">
            {/* Header Sticky */}
            <header
                className="sticky top-0 z-50 backdrop-blur-xl shadow-sm transition-all"
                style={{
                    backgroundColor: 'rgba(var(--color-surface-rgb), 0.85)',
                    borderBottom: '1px solid var(--color-border)'
                }}
            >
                <div className="flex items-center px-6 py-4 justify-between h-[5rem]">
                    <button
                        onClick={onBack}
                        className="flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                        style={{ color: 'var(--color-text-main)' }}
                    >
                        <span className="material-symbols-outlined text-[26px]">arrow_back</span>
                    </button>
                    <h2
                        className="text-lg font-black leading-tight tracking-wide flex-1 text-center uppercase"
                        style={{ color: 'var(--color-text-main)' }}
                    >
                        Nueva Clase
                    </h2>
                    <button
                        onClick={handlePublish}
                        disabled={isLoading}
                        className="font-bold text-xs transition-colors px-3 py-1.5 rounded-lg hover:bg-brand-red/10 disabled:opacity-50 tracking-wide border border-transparent"
                        style={{ color: 'var(--color-primary)' }}
                    >
                        {isLoading ? '...' : 'GUARDAR'}
                    </button>
                </div>
            </header>

            {/* Main Content Scrollable - CARD LAYOUT */}
            <div className="flex-1 overflow-y-auto pb-44 px-4 py-6 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">

                {/* Section 1: Visual & Identity */}
                <section className="space-y-4">
                    <div
                        className="relative w-full h-32 rounded-3xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group overflow-hidden shadow-sm hover:border-brand-red active:scale-[0.99]"
                        style={{
                            backgroundColor: 'var(--color-surface)',
                            borderColor: 'var(--color-border)',
                        }}
                    >
                        <input
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                            type="file"
                            onChange={handleImageSelect}
                        />
                        {!imagePreview && (
                            <>
                                <div className="p-2.5 rounded-full transition-transform transform group-hover:scale-110 bg-[var(--color-bg)]">
                                    <span className="material-symbols-outlined text-2xl" style={{ color: 'var(--color-text-muted)' }}>add_a_photo</span>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-main)' }}>Portada</p>
                                </div>
                            </>
                        )}
                        {imagePreview && (
                            <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                        )}
                    </div>
                </section>

                {/* Section 2: Core Info (Card Style) */}
                <section className="bg-[var(--color-surface)] rounded-3xl p-5 shadow-sm border border-[var(--color-border)] space-y-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest opacity-60 pl-1" style={{ color: 'var(--color-text-muted)' }}>Nombre</label>
                        <input
                            className="block w-full p-4 border-0 rounded-2xl focus:ring-2 focus:outline-none transition-all font-bold text-lg placeholder-opacity-30"
                            style={{
                                backgroundColor: 'var(--color-bg)',
                                color: 'var(--color-text-main)',
                                '--tw-ring-color': 'var(--color-primary)',
                            } as any}
                            placeholder="Ej. Crossfit Morning"
                            type="text"
                            value={className}
                            onChange={(e) => setClassName(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest opacity-60 pl-1" style={{ color: 'var(--color-text-muted)' }}>Descripción</label>
                        <textarea
                            className="block w-full p-4 border-0 rounded-2xl focus:ring-2 focus:outline-none transition-all text-sm resize-none leading-relaxed font-medium"
                            style={{
                                backgroundColor: 'var(--color-bg)',
                                color: 'var(--color-text-main)',
                                '--tw-ring-color': 'var(--color-primary)',
                            } as any}
                            placeholder="Detalles del WOD, requisitos..."
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest opacity-60 pl-1" style={{ color: 'var(--color-text-muted)' }}>Tipo de Clase</label>
                        <div className="grid grid-cols-2 gap-3">
                            <label className="cursor-pointer relative group">
                                <input
                                    checked={group === 'box'}
                                    className="peer sr-only"
                                    name="group"
                                    type="radio"
                                    onChange={() => setGroup('box')}
                                />
                                <div
                                    className="p-4 rounded-2xl border-2 border-transparent transition-all text-center flex flex-col items-center justify-center gap-2 peer-checked:scale-[0.98]"
                                    style={{
                                        backgroundColor: 'var(--color-bg)',
                                    } as any}
                                >
                                    <span className="material-symbols-outlined text-2xl transition-colors" style={{ color: group === 'box' ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>fitness_center</span>
                                    <span className="font-bold text-xs uppercase tracking-wide transition-colors" style={{ color: group === 'box' ? 'var(--color-text-main)' : 'var(--color-text-muted)' }}>Box</span>
                                </div>
                                {group === 'box' && (
                                    <div className="absolute inset-0 border-2 rounded-2xl pointer-events-none" style={{ borderColor: 'var(--color-primary)' }}></div>
                                )}
                            </label>

                            <label className="cursor-pointer relative group">
                                <input
                                    checked={group === 'fit'}
                                    className="peer sr-only"
                                    name="group"
                                    type="radio"
                                    onChange={() => setGroup('fit')}
                                />
                                <div
                                    className="p-4 rounded-2xl border-2 border-transparent transition-all text-center flex flex-col items-center justify-center gap-2 peer-checked:scale-[0.98]"
                                    style={{
                                        backgroundColor: 'var(--color-bg)',
                                    } as any}
                                >
                                    <span className="material-symbols-outlined text-2xl transition-colors" style={{ color: group === 'fit' ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>self_improvement</span>
                                    <span className="font-bold text-xs uppercase tracking-wide transition-colors" style={{ color: group === 'fit' ? 'var(--color-text-main)' : 'var(--color-text-muted)' }}>Fit</span>
                                </div>
                                {group === 'fit' && (
                                    <div className="absolute inset-0 border-2 rounded-2xl pointer-events-none" style={{ borderColor: 'var(--color-primary)' }}></div>
                                )}
                            </label>
                        </div>
                    </div>
                </section>

                {/* Section 3: Schedule (Card Style) */}
                <section className="bg-[var(--color-surface)] rounded-3xl p-5 shadow-sm border border-[var(--color-border)] space-y-6">
                    <div className="flex items-center gap-3 border-b pb-4 mb-2" style={{ borderColor: 'var(--color-border)' }}>
                        <div className="p-2 rounded-xl bg-brand-red/10 text-brand-red">
                            <span className="material-symbols-outlined text-xl">calendar_month</span>
                        </div>
                        <h3 className="font-bold text-sm uppercase tracking-wide" style={{ color: 'var(--color-text-main)' }}>Horario</h3>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest opacity-60 pl-1" style={{ color: 'var(--color-text-muted)' }}>Fecha</label>
                        <input
                            className="block w-full p-4 border-0 rounded-2xl focus:ring-2 focus:outline-none transition-all font-medium text-base appearance-none"
                            style={{
                                backgroundColor: 'var(--color-bg)',
                                color: 'var(--color-text-main)',
                                '--tw-ring-color': 'var(--color-primary)',
                            } as any}
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest opacity-60 pl-1" style={{ color: 'var(--color-text-muted)' }}>Inicio</label>
                            <input
                                className="block w-full p-4 text-center border-0 rounded-2xl focus:ring-2 focus:outline-none transition-all font-bold text-lg appearance-none"
                                style={{
                                    backgroundColor: 'var(--color-bg)',
                                    color: 'var(--color-text-main)',
                                    '--tw-ring-color': 'var(--color-primary)',
                                } as any}
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest opacity-60 pl-1" style={{ color: 'var(--color-text-muted)' }}>Fin</label>
                            <input
                                className="block w-full p-4 text-center border-0 rounded-2xl focus:ring-2 focus:outline-none transition-all font-bold text-lg appearance-none"
                                style={{
                                    backgroundColor: 'var(--color-bg)',
                                    color: 'var(--color-text-main)',
                                    '--tw-ring-color': 'var(--color-primary)',
                                } as any}
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                {/* Section 4: Recurrence (Card Style) */}
                <section className="bg-[var(--color-surface)] rounded-3xl p-5 shadow-sm border border-[var(--color-border)] space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                                <span className="material-symbols-outlined text-xl">update</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-sm" style={{ color: 'var(--color-text-main)' }}>Repetir</span>
                                <span className="text-[10px] font-bold uppercase tracking-wider opacity-60" style={{ color: 'var(--color-text-muted)' }}>Semanalmente</span>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer scale-110 mr-1">
                            <input
                                checked={isRecurring}
                                className="sr-only peer"
                                type="checkbox"
                                onChange={(e) => setIsRecurring(e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-[var(--color-bg)] shadow-inner peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
                        </label>
                    </div>

                    {isRecurring && (
                        <div className="pt-4 space-y-5 border-t animate-fade-in-up" style={{ borderColor: 'var(--color-border)' }}>
                            <div className="flex justify-between items-center px-1">
                                {weekDays.map(day => (
                                    <button
                                        key={day.id}
                                        onClick={() => toggleDay(day.id)}
                                        className={`size-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${recurringDays.includes(day.id)
                                            ? 'text-white shadow-lg shadow-brand-red/20 scale-110'
                                            : 'bg-[var(--color-bg)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)]'
                                            }`}
                                        style={{
                                            backgroundColor: recurringDays.includes(day.id) ? 'var(--color-primary)' : 'var(--color-bg)',
                                        }}
                                    >
                                        {day.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </section>

                {/* Section 5: Staff & Logic (Card Style) */}
                <section className="bg-[var(--color-surface)] rounded-3xl p-5 shadow-sm border border-[var(--color-border)] space-y-6">
                    <div className="flex items-center gap-3 border-b pb-4 mb-2" style={{ borderColor: 'var(--color-border)' }}>
                        <div className="p-2 rounded-xl bg-brand-dark/10 dark:bg-white/10 text-[var(--color-text-main)]">
                            <span className="material-symbols-outlined text-xl">settings_accessibility</span>
                        </div>
                        <h3 className="font-bold text-sm uppercase tracking-wide" style={{ color: 'var(--color-text-main)' }}>Configuración</h3>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest opacity-60 pl-1" style={{ color: 'var(--color-text-muted)' }}>Entrenador</label>
                        <div className="relative">
                            <select
                                className="block w-full p-4 pl-4 pr-10 border-0 rounded-2xl focus:ring-2 focus:outline-none transition-all font-medium text-sm appearance-none cursor-pointer"
                                style={{
                                    backgroundColor: 'var(--color-bg)',
                                    color: 'var(--color-text-main)',
                                    '--tw-ring-color': 'var(--color-primary)',
                                } as any}
                                value={coachId}
                                onChange={(e) => setCoachId(e.target.value)}
                            >
                                <option disabled value="">Seleccionar Coach</option>
                                {coaches.map(coach => (
                                    <option key={coach.id} value={coach.id}>
                                        {coach.firstName} {coach.lastName} {coach.specialty ? `(${coach.specialty})` : ''}
                                    </option>
                                ))}
                                {coaches.length === 0 && (
                                    <option disabled>Cargando entrenadores...</option>
                                )}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                <span className="material-symbols-outlined text-base" style={{ color: 'var(--color-text-muted)' }}>expand_more</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest opacity-60 pl-1" style={{ color: 'var(--color-text-muted)' }}>Aforo Máximo</label>
                        <div
                            className="flex items-center justify-between p-2 pl-4 rounded-2xl"
                            style={{ backgroundColor: 'var(--color-bg)' }}
                        >
                            <span className="font-bold text-lg" style={{ color: 'var(--color-text-main)' }}>{capacity} <span className="text-xs opacity-50 font-medium ml-1">atletas</span></span>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setCapacity(Math.max(1, capacity - 1))}
                                    className="size-10 rounded-xl flex items-center justify-center transition-colors active:scale-90"
                                    style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }}
                                >
                                    <span className="material-symbols-outlined text-sm">remove</span>
                                </button>
                                <button
                                    onClick={() => setCapacity(capacity + 1)}
                                    className="size-10 rounded-xl flex items-center justify-center transition-colors active:scale-90"
                                    style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }}
                                >
                                    <span className="material-symbols-outlined text-sm">add</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 6: Notifications (Card Style) */}
                <section className="bg-[var(--color-surface)] rounded-3xl p-5 shadow-sm border border-[var(--color-border)] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-red-500/10 text-red-500">
                            <span className="material-symbols-outlined text-xl">notifications_active</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-sm" style={{ color: 'var(--color-text-main)' }}>Notificar</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider opacity-60" style={{ color: 'var(--color-text-muted)' }}>Push a usuarios</span>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer scale-110 mr-1">
                        <input
                            checked={notifyUsers}
                            className="sr-only peer"
                            type="checkbox"
                            onChange={(e) => setNotifyUsers(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-[var(--color-bg)] shadow-inner peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
                    </label>
                </section>

            </div>

            {/* BOTÓN FLOTANTE */}
            <div
                className="absolute bottom-6 left-6 right-6 z-40"
            >
                <button
                    onClick={handlePublish}
                    disabled={isLoading}
                    className="w-full text-white font-bold py-5 rounded-3xl shadow-[0_20px_40px_-5px_rgba(227,0,49,0.4)] hover:shadow-[0_25px_50px_-5px_rgba(227,0,49,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-brand-red to-[#C9002B]"
                >
                    {isLoading ? (
                        <>
                            <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                            <span>Guardando...</span>
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined text-xl">rocket_launch</span>
                            <span>Publicar Clase</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
