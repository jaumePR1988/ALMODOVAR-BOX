import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, orderBy, addDoc, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
interface BenchmarkLog {
    id: string;
    exerciseId: string;
    value: number; // kg or time (seconds)
    date: Timestamp;
    notes?: string;
}

interface BenchmarkType {
    id: string;
    label: string;
    unit: string;
    type: 'max' | 'min' | 'count';
}

const BENCHMARKS: BenchmarkType[] = [
    { id: 'deadlift', label: 'Peso Muerto', unit: 'kg', type: 'max' },
    { id: 'back_squat', label: 'Sentadilla T.', unit: 'kg', type: 'max' },
    { id: 'front_squat', label: 'Sentadilla F.', unit: 'kg', type: 'max' },
    { id: 'clean_jerk', label: 'Clean & Jerk', unit: 'kg', type: 'max' },
    { id: 'snatch', label: 'Snatch', unit: 'kg', type: 'max' },
    { id: 'fran', label: 'Fran', unit: 'min', type: 'min' },
    { id: 'murph', label: 'Murph', unit: 'min', type: 'min' },
];

export const EvolutionView: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [selectedBenchmark, setSelectedBenchmark] = useState<BenchmarkType>(BENCHMARKS[0]);
    const [logs, setLogs] = useState<BenchmarkLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Form state
    const [newValue, setNewValue] = useState('');
    const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
    const [saving, setSaving] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false); // Placeholder logic for confetti

    // --- Data Fetching ---
    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, 'benchmarks'),
            where('userId', '==', user.uid),
            where('exerciseId', '==', selectedBenchmark.id),
            orderBy('date', 'asc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as BenchmarkLog[];
            setLogs(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, selectedBenchmark]);

    // --- Logic ---
    const handleSave = async () => {
        if (!newValue || !user) return;
        setSaving(true);
        try {
            // Fix: Handle comma properly for European users
            const sanitizedValue = newValue.replace(',', '.');
            const parsedValue = parseFloat(sanitizedValue);

            if (isNaN(parsedValue)) {
                alert("Por favor introduce un número válido");
                setSaving(false);
                return;
            }

            // Fix: Create date at noon to avoid timezone shifting previous day issues
            const dateObj = new Date(newDate);
            dateObj.setHours(12, 0, 0, 0);

            await addDoc(collection(db, 'benchmarks'), {
                userId: user.uid,
                exerciseId: selectedBenchmark.id,
                value: parsedValue,
                date: Timestamp.fromDate(dateObj),
                createdAt: serverTimestamp()
            });

            // Is it a PR?
            const currentMax = logs.length > 0 ? Math.max(...logs.map(l => l.value)) : 0;
            if (parsedValue > currentMax && selectedBenchmark.type !== 'min') {
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 3000);
            }

            setIsAddModalOpen(false);
            setNewValue('');
        } catch (error) {
            console.error("Error saving benchmark:", error);
            alert("Error al guardar. Inténtalo de nuevo.");
        } finally {
            setSaving(false);
        }
    };

    // Calculate max/min for chart scaling
    const maxValue = logs.length > 0 ? Math.max(...logs.map(l => l.value)) * 1.2 : 100;

    return (
        <div className="app-container min-h-screen bg-[var(--color-bg)] flex flex-col relative overflow-hidden">
            {/* Background Gradient Mesh */}
            <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-[var(--color-primary)]/10 to-transparent pointer-events-none" />

            {/* Header */}
            <header className="flex items-center p-4 sticky top-0 z-10 bg-[var(--color-bg)]/80 backdrop-blur-md border-b border-[var(--color-border)] animate-fade-in-up">
                <button onClick={() => navigate(-1)} className="p-2 mr-2 rounded-full hover:bg-[var(--color-surface)] transition-colors text-[var(--color-text-primary)]">
                    <span className="material-icons-round">arrow_back</span>
                </button>
                <h1 className="text-xl font-black italic uppercase tracking-wider flex-1">Mi Evolución</h1>
            </header>

            {/* Benchmark Selector */}
            <div className="p-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide -mx-4 px-4 items-center">
                    {BENCHMARKS.map(b => (
                        <button
                            key={b.id}
                            onClick={() => setSelectedBenchmark(b)}
                            className={`whitespace-nowrap px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${selectedBenchmark.id === b.id
                                ? 'bg-gradient-to-r from-[var(--color-primary)] to-red-600 text-white shadow-lg shadow-red-500/30 scale-105 ring-2 ring-red-400/50'
                                : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] border border-transparent hover:border-[var(--color-border)]'
                                }`}
                        >
                            {b.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-4 pb-32 overflow-y-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="animate-spin h-10 w-10 border-4 border-[var(--color-primary)] rounded-full border-t-transparent"></div>
                        <p className="text-xs text-[var(--color-text-muted)] font-bold animate-pulse">CARGANDO DATOS...</p>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-6 bg-[var(--color-surface)]/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-[var(--color-border)] mx-auto max-w-sm">
                        <div className="w-20 h-20 bg-[var(--color-surface)] rounded-full flex items-center justify-center mb-4 shadow-inner">
                            <span className="material-icons-round text-4xl text-[var(--color-text-muted)] opacity-50">fitness_center</span>
                        </div>
                        <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-1">Sin Registros</h3>
                        <p className="text-[var(--color-text-secondary)] text-center text-sm mb-6">
                            Aún no has registrado ninguna marca para <br />
                            <span className="font-bold text-[var(--color-primary)]">{selectedBenchmark.label}</span>.
                        </p>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="px-8 py-3 bg-[var(--color-primary)] hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 transition-all hover:scale-105 active:scale-95"
                        >
                            REGISTRAR PRIMER PR
                        </button>
                    </div>
                ) : (
                    <>
                        {/* PREMIUM CHART AREA */}
                        <div className="bg-[var(--color-surface)] p-6 rounded-3xl shadow-xl shadow-black/5 mb-8 relative border border-[var(--color-border)]">
                            {/* PR Badge */}
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-[10px] font-black px-2 py-1 rounded-md shadow-lg transform rotate-3">
                                CURRENT PR: {Math.max(...logs.map(l => l.value))} {selectedBenchmark.unit}
                            </div>

                            <h3 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-6">Evolución Anual</h3>

                            <div className="flex items-end justify-between h-[220px] gap-3 px-2">
                                <AnimatePresence>
                                    {logs.slice(-7).map((log, index) => { // Only show last 7 for aesthetic spacing
                                        const heightPercent = Math.max(15, (log.value / maxValue) * 100);
                                        const isPr = log.value === Math.max(...logs.map(l => l.value));

                                        return (
                                            <div key={log.id} className="flex flex-col items-center flex-1 group relative h-full justify-end">
                                                {/* Float Value */}
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.5 + (index * 0.1) }}
                                                    className={`mb-2 text-[10px] font-black ${isPr ? 'text-[var(--color-text-primary)] scale-110' : 'text-[var(--color-text-muted)]'}`}
                                                >
                                                    {log.value}
                                                </motion.div>

                                                {/* The Bar */}
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${heightPercent}%` }}
                                                    transition={{ duration: 1, type: "spring", bounce: 0.2, delay: index * 0.1 }}
                                                    className={`w-full max-w-[24px] rounded-t-lg relative overflow-hidden ${isPr
                                                        ? 'bg-gradient-to-t from-[var(--color-primary)] to-red-400 shadow-[0_0_15px_rgba(211,0,31,0.5)]'
                                                        : 'bg-[var(--color-surface-hover)]'
                                                        }`}
                                                >
                                                    {/* Shine Effect */}
                                                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50"></div>
                                                </motion.div>

                                                {/* Date Label */}
                                                <div className="mt-3 text-[9px] font-bold text-[var(--color-text-muted)] uppercase">
                                                    {log.date.toDate().toLocaleDateString(undefined, { month: 'short' })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* DETAILED LIST */}
                        <div>
                            <div className="flex items-center justify-between mb-4 px-2">
                                <h3 className="text-sm font-black text-[var(--color-text-primary)] uppercase tracking-wide">Historial Detallado</h3>
                                <span className="text-[10px] bg-[var(--color-surface)] border border-[var(--color-border)] px-2 py-1 rounded-md text-[var(--color-text-muted)] font-bold">Total: {logs.length}</span>
                            </div>

                            <div className="space-y-3">
                                {logs.slice().reverse().map((log, index) => {
                                    // Make sure we have at least 2 logs to compare for PR logic
                                    // AND we are looking at the newest one (index 0 because reversed)
                                    // AND the new value is greater than the next one in the reversed list (which was the previous record)
                                    // This is a simplified client-side check.
                                    // Better logic: is this value the max of all values up to this date?
                                    // For now, let's keep it simple: Highlight if it's the absolute Max
                                    const isPr = log.value === Math.max(...logs.map(l => l.value));
                                    const dateObj = log.date.toDate();

                                    return (
                                        <motion.div
                                            key={log.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group flex items-center justify-between p-4 bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] rounded-2xl border border-[var(--color-border)] transition-all cursor-default"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-xs font-black text-[var(--color-text-muted)] uppercase">{dateObj.toLocaleDateString(undefined, { month: 'short' })}</span>
                                                    <span className="text-lg font-black text-[var(--color-text-primary)] leading-none">{dateObj.getDate()}</span>
                                                </div>
                                                <div className="h-8 w-[1px] bg-[var(--color-border)]"></div>
                                                <div className="flex flex-col">
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="font-black text-2xl tracking-tight">{log.value}</span>
                                                        <span className="text-xs font-bold text-[var(--color-text-muted)] lowercase">{selectedBenchmark.unit}</span>
                                                    </div>
                                                    {isPr && (
                                                        <span className="text-[9px] text-green-500 font-black bg-green-500/10 px-1.5 rounded py-0.5 w-fit mt-0.5 tracking-wider border border-green-500/20">PERSONAL RECORD</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Logic needed here for actual PR tagging historically, keeping it simple for now */}
                                            <button className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] transition-colors">
                                                <span className="material-icons-round text-sm">edit</span>
                                            </button>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Floating Action Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAddModalOpen(true)}
                className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-[var(--color-primary)] to-red-700 rounded-full shadow-xl shadow-red-600/30 flex items-center justify-center text-white z-30 ring-4 ring-white/10"
            >
                <span className="material-icons-round text-3xl">add</span>
            </motion.button>

            {/* ADD MODAL - PREMIUM BOTTOM SHEET */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
                            onClick={() => setIsAddModalOpen(false)}
                        />
                        <motion.div
                            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed bottom-0 left-0 right-0 bg-[var(--color-surface)] border-t border-[var(--color-border)] rounded-t-[2.5rem] z-50 p-8 shadow-2xl safe-area-bottom w-full max-w-lg mx-auto"
                        >
                            <div className="w-16 h-1.5 bg-gray-300/20 rounded-full mx-auto mb-8"></div>

                            <h2 className="text-3xl font-black mb-1 tracking-tight">Nuevo Registro</h2>
                            <p className="text-[var(--color-text-muted)] mb-8 font-medium">Añadir resultado para <strong className="text-[var(--color-primary)]">{selectedBenchmark.label}</strong></p>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">Marca ({selectedBenchmark.unit})</label>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            value={newValue}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(',', '.');
                                                // Allow digits and single dot
                                                if (/^\d*\.?\d*$/.test(val)) {
                                                    setNewValue(val);
                                                }
                                            }}
                                            placeholder="0"
                                            className="w-full bg-[var(--color-bg)] text-[var(--color-text-primary)] text-5xl font-black p-6 rounded-3xl border-2 border-transparent focus:border-[var(--color-primary)] focus:bg-[var(--color-bg)]/80 outline-none transition-all text-center tracking-tighter shadow-inner"
                                            autoFocus
                                        />
                                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] font-black text-xl opacity-30">{selectedBenchmark.unit}</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">Fecha</label>
                                    <input
                                        type="date"
                                        value={newDate}
                                        onChange={(e) => setNewDate(e.target.value)}
                                        className="w-full bg-[var(--color-bg)] text-[var(--color-text-primary)] font-bold p-4 rounded-xl outline-none border border-transparent focus:border-[var(--color-text-muted)] transition-all"
                                    />
                                </div>

                                <button
                                    onClick={handleSave}
                                    disabled={!newValue || saving}
                                    className={`w-full py-5 rounded-2xl font-black text-lg text-white mt-4 shadow-xl transition-all relative overflow-hidden ${!newValue || saving
                                        ? 'bg-gray-500/50 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-[var(--color-primary)] to-red-600 hover:shadow-red-500/40 active:scale-[0.98]'
                                        }`}
                                >
                                    {saving ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></span>
                                            GUARDANDO...
                                        </span>
                                    ) : 'GUARDAR RESULTADO'}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* CONFETTI OVERLAY (Simple CSS implementation for now) */}
            {showConfetti && (
                <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center overflow-hidden">
                    <div className="text-6xl animate-bounce">🎉</div>
                    <div className="absolute top-1/2 left-1/4 text-4xl animate-pulse">✨</div>
                    <div className="absolute top-1/3 right-1/4 text-5xl animate-bounce" style={{ animationDelay: '0.2s' }}>🔥</div>
                </div>
            )}
        </div>
    );
};
