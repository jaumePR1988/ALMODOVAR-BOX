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

                // Sort by start time if needed (client side sort is fine for small list)
                classes.sort((a: any, b: any) => a.startTime.localeCompare(b.startTime));

                setTodayClasses(classes);
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

                            <div className="flex flex-col gap-5">
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
                                        const spotsLeft = classItem.capacity - classItem.enrolled;

                                        return (
                                            <div
                                                key={classItem.id}
                                                onClick={() => setSelectedClass({ ...classItem, date: 'Hoy' })}
                                                className="rounded-3xl overflow-hidden shadow-md relative cursor-pointer group"
                                                style={{ height: '220px', backgroundColor: 'var(--color-surface)' }}
                                            >
                                                {/* Hero Background Image */}
                                                <div className="absolute inset-0">
                                                    <img
                                                        src={classItem.imageUrl || "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop&q=60"}
                                                        alt={classItem.name}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                                                </div>

                                                {/* Card Content Overlay */}
                                                <div className="absolute inset-0 p-5 flex flex-col justify-between">

                                                    {/* Top Badges */}
                                                    <div className="flex justify-between items-start">
                                                        <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider backdrop-blur-md shadow-sm ${isOngoing ? 'bg-green-500/90 text-white' : isPast ? 'bg-gray-500/90 text-white' : 'bg-primary/90 text-white'}`}>
                                                            {isOngoing ? 'En Curso' : isPast ? 'Finalizada' : 'Próxima'}
                                                        </span>

                                                        {isFull ? (
                                                            <span className="px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider bg-red-500/90 text-white backdrop-blur-md">
                                                                Completa
                                                            </span>
                                                        ) : (
                                                            <span className="px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider bg-black/50 text-white backdrop-blur-md border border-white/20">
                                                                {spotsLeft} plazas
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Bottom Info */}
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1 text-white/90 text-xs uppercase font-bold tracking-wider">
                                                            <span className="material-icons-round text-sm text-primary">schedule</span>
                                                            {classItem.startTime} - {classItem.endTime}
                                                        </div>

                                                        <h3 className="text-2xl font-black text-white mb-1 leading-tight">{classItem.name}</h3>

                                                        <p className="text-white/80 text-sm flex items-center gap-1 mb-4">
                                                            <span className="material-icons-outlined text-base">location_on</span>
                                                            {classItem.group === 'box' ? 'Box Area' : 'Fitness Studio'}
                                                        </p>

                                                        {/* Attendees & Action */}
                                                        <div className="flex items-center justify-between border-t border-white/20 pt-3">
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex -space-x-2">
                                                                    {/* Mock Avatars - In real app map enrolled users */}
                                                                    {[...Array(Math.min(3, classItem.enrolled))].map((_, i) => (
                                                                        <div key={i} className="h-6 w-6 rounded-full border-2 border-black bg-gray-300"></div>
                                                                    ))}
                                                                    {classItem.enrolled > 3 && (
                                                                        <div className="h-6 w-6 rounded-full border-2 border-black bg-gray-700 text-white text-[10px] flex items-center justify-center">+{classItem.enrolled - 3}</div>
                                                                    )}
                                                                </div>
                                                                <span className="text-white font-bold text-sm">
                                                                    {classItem.enrolled} <span className="text-white/60 font-medium">/ {classItem.capacity}</span>
                                                                </span>
                                                            </div>

                                                            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors flex items-center gap-1">
                                                                Gestionar
                                                                <span className="material-icons-round text-sm">arrow_forward</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-8 text-center text-text-muted bg-surface rounded-2xl border border-dashed border-border">
                                        <span className="material-icons-round text-4xl mb-2 opacity-50">event_busy</span>
                                        <p className="font-medium">No tienes clases asignadas hoy</p>
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
        <div style={{
            position: 'fixed', // Lock window scroll
            inset: 0,
            backgroundColor: 'var(--color-bg)', // Fondo general
            display: 'flex',
            justifyContent: 'center', // Centrar la app horizontalmente
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* App Container (Mobile Frame) */}
            <div style={{
                width: '100%',
                maxWidth: '480px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'var(--color-background)', // Fondo de la app
                position: 'relative',
                boxShadow: '0 0 20px rgba(0,0,0,0.1)'
            }}>
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
        </div>
    );
};
