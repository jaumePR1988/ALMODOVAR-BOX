import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { CommunityChatView } from './CommunityChatView';
import { NotificationsView } from './NotificationsView';
import { CoachClassDetailView } from './CoachClassDetailView';
import { CoachScheduleView } from './CoachScheduleView';
import { CoachAthletesView } from './CoachAthletesView';
import { CoachNotificationsView } from './CoachNotificationsView';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase';

export const CoachDashboardView: React.FC = () => {
    const { userData, user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('inicio');
    const [selectedClass, setSelectedClass] = useState<any | null>(null);
    const [todayClasses, setTodayClasses] = useState<any[]>([]);

    // Fetch Today's Classes
    React.useEffect(() => {
        const fetchClasses = async () => {
            if (!user?.uid) return;

            try {
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const day = String(today.getDate()).padStart(2, '0');
                const todayString = `${year}-${month}-${day}`;

                // Query for classes assigned to THIS coach for TODAY
                const q = query(
                    collection(db, 'classes'),
                    where('coachId', '==', user.uid),
                    where('date', '==', todayString)
                );

                const snap = await getDocs(q);
                const classes = snap.docs.map(d => ({ id: d.id, ...d.data() }));

                // Sort by start time if needed
                classes.sort((a: any, b: any) => a.startTime.localeCompare(b.startTime));

                // --- MOCK SIMULATION REMOVED ---

                setTodayClasses(classes);
            } catch (e) {
                console.error("Error fetching agenda", e);
            }
        };
        fetchClasses();
    }, [user]);

    const coachName = userData?.firstName || user?.displayName || 'Coach Alex';
    const coachImage = userData?.photoURL || "https://lh3.googleusercontent.com/aida-public/AB6AXuDi1WkpRCM2C7JJdpRLIs623Mbh8co50rXdplQTpItk6NTHaJfSsSp7aTQYLwW0_60WnGTeJYNLceYLMDIWR_hMfv8F86xqDSNyscl-RjSTzf74zgRaxCmqNHR8VntyQAxk6jVV5eYqIO1OgN-6-Cbnf4lhtL_hwpjA6JLEUH17Eznd1wZO8eGgH1P3reRSHzLWvg1ZJEWqwOivPIjqqy_fl7vTOV0jOYJFNaY_BgZPO5wg4PR0qYm518C6ov3L9D9ixT2xLEmcjvA";

    // Calculate Stats for Today
    const totalClasses = todayClasses.length;
    const totalStudents = todayClasses.reduce((acc, curr) => acc + (curr.enrolled || 0), 0);
    const totalCapacity = todayClasses.reduce((acc, curr) => acc + (curr.capacity || 0), 0);
    const attendanceRate = totalCapacity > 0 ? Math.round((totalStudents / totalCapacity) * 100) : 0;

    const renderContent = () => {
        switch (activeTab) {
            // ... (keep existing cases)
            case 'inicio':
                return (
                    <main className="animate-fade-in-up flex flex-col gap-6 pb-32 section-padding pt-6">
                        {/* Main Stats Cards - Aligned with User Dashboard card-premium */}
                        {/* Red Stats Card */}
                        <div style={{ height: '1rem' }}></div>
                        <section>
                            <div className="bg-[#D90429] rounded-2xl p-6 text-white shadow-lg shadow-red-900/20 flex justify-between items-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                                    <span className="material-icons-round text-9xl text-white">analytics</span>
                                </div>

                                <div className="flex flex-col items-center flex-1 relative z-10">
                                    <span className="text-3xl font-black leading-none drop-shadow-sm">{totalStudents}</span>
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-white/90 mt-1">Alumnos</span>
                                </div>

                                <div className="h-8 w-px bg-white/20"></div>

                                <div className="flex flex-col items-center flex-1 relative z-10">
                                    <span className="text-3xl font-black leading-none drop-shadow-sm">{totalClasses}</span>
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-white/90 mt-1">Clases</span>
                                </div>

                                <div className="h-8 w-px bg-white/20"></div>

                                <div className="flex flex-col items-center flex-1 relative z-10">
                                    <span className="text-3xl font-black leading-none drop-shadow-sm">{attendanceRate}%</span>
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-white/90 mt-1">Asistencia</span>
                                </div>
                            </div>
                        </section>

                        {/* Actions Section */}
                        <section>
                            <h2 className="heading-section text-sm uppercase tracking-widest text-text-muted mb-3">Acciones Rápidas</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setActiveTab('notificar_grupo')}
                                    className="card-premium flex flex-col items-center justify-center gap-3 cursor-pointer transition-all hover:-translate-y-1 hover:border-primary/50 active:scale-95 group h-32"
                                >
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                        <span className="material-icons-round text-xl">campaign</span>
                                    </div>
                                    <span className="font-bold text-xs text-text-main">Notificar Grupo</span>
                                </button>

                                <button className="card-premium flex flex-col items-center justify-center gap-3 cursor-pointer transition-all hover:-translate-y-1 hover:border-blue-500/50 active:scale-95 group h-32">
                                    <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                                        <span className="material-icons-round text-xl">emoji_events</span>
                                    </div>
                                    <span className="font-bold text-xs text-text-main">Nuevo Reto</span>
                                </button>
                            </div>
                        </section>

                        {/* Agenda - User Dashboard Style */}
                        <section>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="heading-section m-0">Agenda de Hoy</h2>
                                <button
                                    onClick={() => setActiveTab('agenda')}
                                    className="text-primary text-xs font-bold uppercase tracking-wider bg-transparent hover:bg-primary/5 px-2 py-1 rounded transition-colors cursor-pointer border-none"
                                >
                                    Ver Todo
                                </button>
                            </div>

                            <div className="flex flex-col gap-4">
                                {todayClasses.length > 0 ? (
                                    todayClasses.map((classItem) => {
                                        const now = new Date();
                                        const [startH, startM] = classItem.startTime.split(':').map(Number);
                                        const [endH, endM] = classItem.endTime.split(':').map(Number);
                                        const classStart = new Date();
                                        classStart.setHours(startH, startM, 0);
                                        const classEnd = new Date();
                                        classEnd.setHours(endH, endM, 0);

                                        const isOngoing = now >= classStart && now <= classEnd;
                                        const isPast = now > classEnd;
                                        const isFull = classItem.enrolled >= classItem.capacity;

                                        return (
                                            <div
                                                key={classItem.id}
                                                onClick={() => setSelectedClass({ ...classItem, date: 'Hoy' })}
                                                className="hero-next-class cursor-pointer group active:scale-98 transition-transform"
                                            >
                                                <img
                                                    src={classItem.imageUrl || "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop&q=60"}
                                                    alt={classItem.name}
                                                    className={`transition-transform duration-700 group-hover:scale-105 ${isPast ? 'grayscale brightness-50' : ''}`}
                                                />
                                                <div className="hero-overlay"></div>

                                                {/* Status Badge */}
                                                <div className={`absolute top-4 right-4 items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md border border-white/20 shadow-lg flex ${isOngoing ? 'bg-green-500 text-white' : isPast ? 'bg-gray-500/80 text-white' : 'bg-white/20 text-white'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${isOngoing ? 'bg-white animate-pulse' : 'bg-white/50'}`}></span>
                                                    {isOngoing ? 'En Curso' : isPast ? 'Finalizada' : 'Próxima'}
                                                </div>

                                                <div className="hero-content">
                                                    <div className="flex justify-between items-center w-full mb-2">
                                                        <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">{classItem.group === 'box' ? 'Box' : 'Estudio 2'}</span>
                                                        <span className="bg-primary text-white text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">{classItem.startTime}</span>
                                                    </div>
                                                    <h3 className="text-xl font-bold leading-tight mb-2 text-white shadow-black/50 drop-shadow-sm">{classItem.name}</h3>

                                                    <div className="flex items-center gap-2 text-white/90 text-xs font-medium">
                                                        <div className="flex -space-x-2">
                                                            {[...Array(Math.min(3, classItem.enrolled || 0))].map((_, i) => (
                                                                <div key={i} className="h-5 w-5 rounded-full border border-black/20 bg-gray-300"></div>
                                                            ))}
                                                        </div>
                                                        <span>{classItem.enrolled} / {classItem.capacity} alumnos</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="card-premium flex flex-col items-center justify-center p-8 text-center border-dashed">
                                        <div className="h-12 w-12 bg-bg rounded-full flex items-center justify-center mb-4">
                                            <span className="material-icons-round text-2xl text-text-muted">event_busy</span>
                                        </div>
                                        <p className="font-bold text-text-main mb-1">Sin clases hoy</p>
                                        <p className="text-xs text-text-muted">¡Día libre!</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </main >
                );
            case 'agenda':
                return <CoachScheduleView onBack={() => setActiveTab('inicio')} onClassSelect={setSelectedClass} />;
            case 'atletas':
                return <CoachAthletesView onBack={() => setActiveTab('inicio')} />;
            case 'ajustes':
                return (
                    <main className="animate-fade-in-up section-padding pt-6">
                        <h2 className="heading-section">Ajustes</h2>
                        <div className="flex flex-col gap-4">
                            <button onClick={toggleTheme} className="card-premium flex items-center justify-between cursor-pointer hover:bg-bg transition-colors w-full">
                                <span className="font-bold text-text-main flex items-center gap-2">
                                    <span className="material-icons-round">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
                                    {theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
                                </span>
                                <span className="material-icons-round text-text-muted">chevron_right</span>
                            </button>
                            <button onClick={logout} className="card-premium flex items-center justify-between cursor-pointer hover:bg-primary/5 transition-colors w-full border-primary/30 text-primary">
                                <span className="font-bold flex items-center gap-2">
                                    <span className="material-icons-round">logout</span>
                                    Cerrar Sesión
                                </span>
                            </button>
                        </div>
                    </main>
                );
            default:
                return null;
        }
    };

    // Nav Item Component - Aligned with User Dashboard BottomNav styles
    const NavItem = ({ icon, label, id }: { icon: string, label: string, id: string }) => (
        <a
            href="#"
            onClick={(e) => { e.preventDefault(); setActiveTab(id); }}
            className={`bottom-nav-item ${activeTab === id ? 'active' : ''} no-underline`}
        >
            <span className="material-icons-round">{icon}</span>
            <span>{label}</span>
        </a>
    );

    return (
        <div className="app-container font-sans text-text-main bg-bg">
            {selectedClass && (
                <div className="fixed inset-0 w-full h-dvh z-[2000] pointer-events-auto bg-bg">
                    <CoachClassDetailView
                        classData={selectedClass}
                        onBack={() => setSelectedClass(null)}
                    />
                </div>
            )}

            {/* Header - Matches MainLayout */}
            {!['chat'].includes(activeTab) && (
                <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md h-[4.5rem] flex items-center justify-between px-5 border-b border-border transition-all">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="h-10 w-10 rounded-full border-2 border-primary bg-gray-200 overflow-hidden flex-shrink-0">
                            <img alt="Coach" src={coachImage} className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold text-text-muted uppercase leading-none mb-0.5">Coach</p>
                            <h1 className="text-sm font-extrabold text-text-main truncate leading-tight">{coachName}</h1>
                        </div>
                    </div>

                    <div className="flex gap-1 items-center flex-shrink-0">
                        <button
                            onClick={() => setActiveTab('chat')}
                            className="h-9 w-9 rounded-full flex items-center justify-center text-text-main bg-transparent border-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            title="Chat"
                        >
                            <span className="material-icons-round text-xl">chat_bubble_outline</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('notificaciones')}
                            className="h-9 w-9 rounded-full flex items-center justify-center text-text-main bg-transparent border-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                            title="Notificaciones"
                        >
                            <span className="material-icons-round text-xl">notifications</span>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-brand-red rounded-full border-2 border-surface"></span>
                        </button>
                        <button
                            onClick={toggleTheme}
                            className="h-9 w-9 rounded-full flex items-center justify-center text-text-main bg-transparent border-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            title="Cambiar tema"
                        >
                            <span className="material-icons-round text-xl">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
                        </button>
                        <button
                            onClick={logout}
                            className="h-9 w-9 rounded-full flex items-center justify-center text-red-500 bg-transparent border-none cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            title="Cerrar sesión"
                        >
                            <span className="material-icons-round text-xl">logout</span>
                        </button>
                    </div>
                </header>
            )}

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-container hide-scrollbar">
                {renderContent()}
            </div>

            {/* Bottom Nav - Matches MainLayout BottomNav structure */}
            <nav className="bottom-nav-fixed">
                <NavItem icon="dashboard" label="Inicio" id="inicio" />
                <NavItem icon="calendar_today" label="Agenda" id="agenda" />

                {/* FAB - Create */}
                <div className="nav-fab-container group" onClick={() => navigate('/dashboard/coach/add-exercise')}>
                    <div className="nav-fab-sphere group-hover:scale-110 transition-transform">
                        <span className="material-icons-round">add</span>
                    </div>
                    <span className="nav-fab-label opacity-0 group-hover:opacity-100 h-0 group-hover:h-auto overflow-hidden transition-all">Crear</span>
                </div>

                <NavItem icon="groups" label="Alumnos" id="atletas" />
                <NavItem icon="settings" label="Ajustes" id="ajustes" />
            </nav>
        </div>
    );
};
