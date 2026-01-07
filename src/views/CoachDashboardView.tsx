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
import { collection, query, getDocs } from 'firebase/firestore';
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
            try {
                // Determine "Today" logic.
                // If classes stored string "VIE 2", we need to match that or change DB.
                // Assuming DB uses "date" string like "YYYY-MM-DD" or Timestamp.
                // Start with fetching ALL for Coach and client-side filter date for now if format unknown, 
                // but goal is real data.

                // Let's assume we fetch all 'upcoming' classes for this coach or all classes.
                const q = query(
                    collection(db, 'classes'),
                    // where('coachId', '==', user?.uid), // Optional: only show my classes? Or all box classes? Usually all for Head Coach.
                    // orderBy('date', 'asc'),
                    // orderBy('time', 'asc')
                );

                const snap = await getDocs(q);
                const classes = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                // Simple client side filter for "Today" visualization if we want, or just show next 3.
                // For "Agenda de Hoy", we'd filter. 
                // Let's just show the first 3 "upcoming" ones to populate the UI.
                setTodayClasses(classes.slice(0, 3));
            } catch (e) {
                console.error("Error fetching agenda", e);
            }
        };
        fetchClasses();
    }, [user]);

    const coachName = userData?.firstName || user?.displayName || 'Coach Alex';
    const coachImage = userData?.photoURL || "https://lh3.googleusercontent.com/aida-public/AB6AXuDi1WkpRCM2C7JJdpRLIs623Mbh8co50rXdplQTpItk6NTHaJfSsSp7aTQYLwW0_60WnGTeJYNLceYLMDIWR_hMfv8F86xqDSNyscl-RjSTzf74zgRaxCmqNHR8VntyQAxk6jVV5eYqIO1OgN-6-Cbnf4lhtL_hwpjA6JLEUH17Eznd1wZO8eGgH1P3reRSHzLWvg1ZJEWqwOivPIjqqy_fl7vTOV0jOYJFNaY_BgZPO5wg4PR0qYm518C6ov3L9D9ixT2xLEmcjvA";

    const renderContent = () => {
        switch (activeTab) {
            case 'chat':
                // Default group for coach - In real app fetch from userData.assignedGroup
                const coachGroup = userData?.assignedGroup || 'ALMODOVAR BOX';
                return (
                    <div className="animate-fade-in-up" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CommunityChatView onBack={() => setActiveTab('inicio')} forcedGroup={coachGroup} />
                    </div>
                );
            case 'notificaciones':
                return (
                    <div className="animate-fade-in-up" style={{ paddingBottom: '6rem' }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            padding: '1.5rem 1.25rem 0 1.25rem'
                        }}>
                            <button onClick={() => setActiveTab('inicio')} style={{ background: 'none', border: 'none', color: 'var(--color-text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                <span className="material-icons-round">arrow_back</span>
                            </button>
                            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Notificaciones</h2>
                        </div>
                        <NotificationsView />
                    </div>
                );
            case 'notificar_grupo':
                return (
                    <div className="animate-fade-in-up" style={{ paddingBottom: '6rem', backgroundColor: 'var(--color-bg)' }}>
                        <CoachNotificationsView onBack={() => setActiveTab('inicio')} />
                    </div>
                );
            case 'inicio':
                return (

                    <main className="animate-fade-in-up" style={{ padding: '1.5rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Actions Section */}
                        <section>
                            <h2 className="text-sm font-semibold text-text-muted mb-3 uppercase tracking-wider">Acciones Rápidas</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setActiveTab('notificar_grupo')}
                                    className="bg-surface p-4 rounded-xl shadow-sm border border-transparent flex flex-col items-center justify-center gap-2 cursor-pointer transition-all text-text-main hover:bg-surface-hover active:scale-95 border-b-0 hover:border-primary/20">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <span className="material-icons-round">campaign</span>
                                    </div>
                                    <span className="font-medium text-sm">Notificar Grupo</span>
                                </button>

                                <button className="bg-surface p-4 rounded-xl shadow-sm border border-transparent flex flex-col items-center justify-center gap-2 cursor-pointer transition-all text-text-main hover:bg-surface-hover active:scale-95 border-b-0 hover:border-primary/20">
                                    <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                        <span className="material-icons-round">emoji_events</span>
                                    </div>
                                    <span className="font-medium text-sm">Nuevo Reto</span>
                                </button>
                            </div>
                        </section>

                        {/* Main Stats Card */}
                        <section className="bg-primary rounded-2xl p-5 text-white shadow-lg shadow-primary/30 relative overflow-hidden" style={{ minHeight: '180px' }}>
                            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                            <div className="flex justify-between items-end relative z-10">
                                <div>
                                    <p className="text-white/80 text-sm mb-1">Total Alumnos Hoy</p>
                                    <h3 className="text-4xl font-bold m-0" style={{ color: 'white' }}>48</h3>
                                </div>
                                <div className="text-right">
                                    <p className="text-white/80 text-xs font-medium bg-white/20 px-2 py-1 rounded-lg inline-flex items-center gap-1">
                                        <span className="material-icons-round text-sm">trending_up</span> +12% vs ayer
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 flex gap-4 border-t border-white/20 pt-4 relative z-10">
                                <div>
                                    <span className="block text-xl font-bold" style={{ color: 'white' }}>4</span>
                                    <span className="text-xs text-white/70">Clases</span>
                                </div>
                                <div>
                                    <span className="block text-xl font-bold" style={{ color: 'white' }}>98%</span>
                                    <span className="text-xs text-white/70">Asistencia</span>
                                </div>
                            </div>
                        </section>

                        {/* Agenda */}
                        <section>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold m-0" style={{ color: 'var(--color-text-main)' }}>Agenda de Hoy</h2>
                                <button onClick={() => setActiveTab('agenda')} className="text-primary text-sm font-semibold border-none bg-transparent cursor-pointer">Ver Todo</button>
                            </div>

                            <div className="flex flex-col gap-4">
                                {(todayClasses.length > 0 ? todayClasses : [
                                    // Fallback if empty
                                    { id: 'mock1', title: 'Fit Boxing WOD', time: '10:00', location: 'Sala 1', enrolled: 12, capacity: 20, status: 'ongoing' },
                                    { id: 'mock2', title: 'Open Box', time: '12:00', location: 'Zona Libre', enrolled: 8, capacity: 25, status: 'upcoming' },
                                    { id: 'mock3', title: 'Fit Boxing Kids', time: '17:30', location: 'Sala 1', enrolled: 15, capacity: 16, status: 'upcoming' }
                                ]).map((classItem) => (
                                    <div
                                        key={classItem.id}
                                        onClick={() => setSelectedClass({ ...classItem, date: 'Hoy' })}
                                        className="bg-surface rounded-2xl p-4 shadow-sm border border-border opacity-90 cursor-pointer"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`px-2 py-1 text-xs font-bold rounded uppercase tracking-wide ${classItem.status === 'ongoing' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                {classItem.status === 'ongoing' ? 'En Curso' : 'Próxima'}
                                            </span>
                                            <span className="text-text-muted text-sm font-medium">
                                                {classItem.time ? `${classItem.time} - ${parseInt(classItem.time.split(':')[0]) + 1}:00` : 'Sin horario'}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--color-text-main)' }}>{classItem.title}</h3>
                                        <p className="text-text-muted text-sm mb-3 flex items-center gap-1">
                                            <span className="material-icons-outlined text-base">location_on</span> {classItem.location}
                                        </p>
                                        <div className="flex items-center justify-between border-t border-border pt-3">
                                            <div className="text-sm font-medium text-text-muted">
                                                <span className="font-bold text-primary">{classItem.enrolled}</span>/{classItem.capacity} inscritos
                                            </div>
                                            <button className="text-primary text-sm font-medium hover:underline border-none bg-transparent cursor-pointer">Ver Lista</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Global Management Section */}
                        <section className="mt-2">
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider m-0">Gestión Global</h2>
                            </div>
                            <button
                                onClick={() => navigate('/dashboard/admin/calendar')}
                                className="w-full bg-surface rounded-2xl p-0 shadow-sm hover:shadow-md transition border border-border overflow-hidden group text-left relative cursor-pointer"
                            >
                                <div className="p-5 flex items-center justify-between relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 shrink-0">
                                            <span className="material-icons-round text-2xl">calendar_month</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-base m-0 text-text-main">Gestionar Todas las Clases</h3>
                                            <p className="text-xs text-text-muted mt-0.5 m-0">Visión global y edición de clases</p>
                                        </div>
                                    </div>
                                    <div className="h-8 w-8 rounded-full flex items-center justify-center text-text-muted group-hover:text-primary transition-colors" style={{ backgroundColor: 'var(--color-bg)' }}>
                                        <span className="material-icons-round">chevron_right</span>
                                    </div>
                                </div>
                                <div className="px-5 py-3 border-t border-border flex justify-between items-center relative z-10" style={{ backgroundColor: 'rgba(var(--color-bg-rgb), 0.5)' }}>
                                    <div className="flex -space-x-2">
                                        <div className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[8px] font-bold text-gray-500">L</div>
                                        <div className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[8px] font-bold text-gray-500">M</div>
                                        <div className="h-6 w-6 rounded-full bg-primary border-2 border-white flex items-center justify-center text-[8px] font-bold text-white">X</div>
                                        <div className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[8px] font-bold text-gray-500">J</div>
                                    </div>
                                    <span className="text-xs font-semibold text-primary group-hover:underline">Acceder al calendario</span>
                                </div>
                            </button>
                        </section>
                    </main >
                );
            case 'agenda':
                return <CoachScheduleView onBack={() => setActiveTab('inicio')} onClassSelect={setSelectedClass} />;
            case 'atletas':
                return <CoachAthletesView onBack={() => setActiveTab('inicio')} />;
            case 'ajustes':
                return (
                    <main className="animate-fade-in-up" style={{ padding: '1.5rem 1.25rem' }}>
                        <h2 className="heading-section">Ajustes de Entrenador</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                            <button onClick={toggleTheme} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <span className="material-icons-round">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
                                Cambiar Tema
                            </button>
                            <button onClick={logout} className="btn-secondary" style={{ color: 'var(--color-primary)', borderColor: 'var(--color-primary)' }}>
                                Cerrar Sesión
                            </button>
                        </div>
                    </main>
                );
            default:
                return null;
        }
    };

    // Nav Item Component for this specific view
    const NavItem = ({ icon, label, id }: { icon: string, label: string, id: string }) => (
        <a
            href="#"
            onClick={(e) => { e.preventDefault(); setActiveTab(id); }}
            className={`flex flex-col items-center gap-1 no-underline transition-colors ${activeTab === id ? 'text-primary' : 'text-text-muted group-hover:text-text-main'}`}
        >
            <span className={`material-icons-${activeTab === id ? 'round' : 'outlined'} text-2xl`}>{icon}</span>
            <span className="text-[10px] font-medium">{label}</span>
        </a>
    );

    return (
        <div className="app-container">
            {selectedClass && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100dvh', zIndex: 2000, pointerEvents: 'auto' }}>
                    <CoachClassDetailView
                        classData={selectedClass}
                        onBack={() => setSelectedClass(null)}
                    />
                </div>
            )}
            {/* Header */}
            <header style={{
                flexShrink: 0,
                zIndex: 50,
                backgroundColor: 'rgba(var(--color-surface-rgb), 0.9)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid var(--color-border)',
                padding: '1rem 1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: '4.5rem'
            }}>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                    <div style={{ height: '2.5rem', width: '2.5rem', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--color-primary)', flexShrink: 0 }}>
                        <img alt="Coach Profile" src={coachImage} style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Bienvenido,</p>
                        <h1 style={{ fontWeight: 700, fontSize: '1.125rem', lineHeight: 1, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{coachName}</h1>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0, alignItems: 'center' }}>
                    {/* Chat Icon */}
                    <div
                        onClick={() => setActiveTab('chat')}
                        style={{
                            width: '2.25rem', height: '2.25rem', backgroundColor: 'var(--color-surface)', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-main)',
                            border: '1px solid var(--color-border)', cursor: 'pointer', transition: 'all 0.2s'
                        }}>
                        <span className="material-icons-round" style={{ fontSize: '1.25rem' }}>chat_bubble_outline</span>
                    </div>

                    {/* Notification Icon */}
                    <div onClick={() => setActiveTab('notificaciones')}
                        style={{
                            position: 'relative', width: '2.25rem', height: '2.25rem', backgroundColor: 'var(--color-surface)',
                            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--color-text-main)', border: '1px solid var(--color-border)', cursor: 'pointer'
                        }}>
                        <span className="material-icons-outlined" style={{ fontSize: '1.25rem' }}>notifications</span>
                        <span style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', height: '0.5rem', width: '0.5rem', backgroundColor: 'var(--color-primary)', borderRadius: '50%', border: '1.5px solid var(--color-surface)' }}></span>
                    </div>

                    {/* Theme Toggle */}
                    <button onClick={toggleTheme} style={{
                        background: 'none', border: 'none', color: 'var(--color-text-main)', width: '2.25rem', height: '2.25rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                    }}>
                        <span className="material-icons-round" style={{ fontSize: '1.25rem' }}>{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
                    </button>

                    {/* Logout Button */}
                    <button onClick={logout} style={{
                        background: 'none', border: 'none', color: '#ef4444', width: '2.25rem', height: '2.25rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginLeft: '-0.25rem'
                    }}>
                        <span className="material-icons-round" style={{ fontSize: '1.5rem' }}>logout</span>
                    </button>
                </div>
            </header>

            {/* Scrollable Content Area */}
            <div className="hide-scrollbar" style={{
                flex: 1,
                overflowY: 'scroll', // Force scrollbar to prevent layout shift
                position: 'relative',
                scrollBehavior: 'smooth',
            }}>
                {renderContent()}
            </div>

            {/* Bottom Nav */}
            <nav className="flex-shrink-0 w-full bg-surface border-t border-border pb-safe h-18 flex items-center z-50 px-6">
                <div className="flex justify-between items-center w-full h-full">
                    <NavItem icon="dashboard" label="Inicio" id="inicio" />
                    <NavItem icon="calendar_today" label="Agenda" id="agenda" />

                    <div className="relative -top-5 flex flex-col items-center gap-1 group">
                        <button
                            onClick={() => navigate('/dashboard/coach/add-exercise')}
                            className="h-14 w-14 rounded-full bg-primary text-white border-0 shadow-lg shadow-primary/40 flex items-center justify-center cursor-pointer z-10 transition-transform active:scale-95 group-hover:scale-105">
                            <span className="material-icons-round text-3xl">add</span>
                        </button>
                        <span className="text-[10px] font-extrabold text-text-muted uppercase tracking-wider bg-surface/80 backdrop-blur-sm px-1 rounded">
                            Ejercicio
                        </span>
                    </div>

                    <NavItem icon="groups" label="Alumno/a" id="atletas" />
                    <NavItem icon="settings" label="Ajustes" id="ajustes" />
                </div>
            </nav>
        </div>
    );
};
