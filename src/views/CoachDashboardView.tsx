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

export const CoachDashboardView: React.FC = () => {
    const { userData, user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('inicio');
    const [selectedClass, setSelectedClass] = useState<any | null>(null);

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
                    <div className="animate-fade-in-up" style={{ paddingBottom: '6rem', backgroundColor: 'var(--color-background)' }}>
                        <CoachNotificationsView onBack={() => setActiveTab('inicio')} />
                    </div>
                );
            case 'inicio':
                return (
                    <main className="animate-fade-in-up" style={{ padding: '1.5rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Actions Section */}
                        <section>
                            <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Acciones Rápidas</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <button
                                    onClick={() => setActiveTab('notificar_grupo')}
                                    style={{
                                        backgroundColor: 'var(--color-surface)', padding: '1rem', borderRadius: '0.75rem',
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid transparent',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                        cursor: 'pointer', transition: 'all 0.2s', color: 'var(--color-text-main)'
                                    }}>
                                    <div style={{ height: '2.5rem', width: '2.5rem', borderRadius: '50%', backgroundColor: 'rgba(211, 0, 31, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                                        <span className="material-icons-round">campaign</span>
                                    </div>
                                    <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>Notificar Grupo</span>
                                </button>

                                <button style={{
                                    backgroundColor: 'var(--color-surface)', padding: '1rem', borderRadius: '0.75rem',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid transparent',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                    cursor: 'pointer', transition: 'all 0.2s', color: 'var(--color-text-main)'
                                }}>
                                    <div style={{ height: '2.5rem', width: '2.5rem', borderRadius: '50%', backgroundColor: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                                        <span className="material-icons-round">emoji_events</span>
                                    </div>
                                    <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>Nuevo Reto</span>
                                </button>
                            </div>
                        </section>



                        {/* Main Stats Card - Compact Version */}
                        <section style={{
                            backgroundColor: 'var(--color-primary)', borderRadius: '1rem', padding: '1rem 1.25rem',
                            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            boxShadow: '0 4px 12px rgba(211, 0, 31, 0.2)'
                        }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, lineHeight: 1 }}>48</h3>
                                    <span style={{ fontSize: '0.65rem', backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.1rem 0.3rem', borderRadius: '0.25rem' }}>+12%</span>
                                </div>
                                <p style={{ fontSize: '0.75rem', opacity: 0.9, margin: '0.25rem 0 0 0', fontWeight: 500 }}>Alumnos hoy</p>
                            </div>

                            <div style={{ width: '1px', height: '2rem', backgroundColor: 'rgba(255,255,255,0.2)' }}></div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, lineHeight: 1 }}>4</h3>
                                <p style={{ fontSize: '0.75rem', opacity: 0.9, margin: '0.25rem 0 0 0', fontWeight: 500 }}>Clases</p>
                            </div>

                            <div style={{ width: '1px', height: '2rem', backgroundColor: 'rgba(255,255,255,0.2)' }}></div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, lineHeight: 1 }}>98%</h3>
                                <p style={{ fontSize: '0.75rem', opacity: 0.9, margin: '0.25rem 0 0 0', fontWeight: 500 }}>Asistencia</p>
                            </div>
                        </section>


                        {/* Agenda */}
                        <section style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Agenda de Hoy</h2>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--color-primary)', fontWeight: 600, margin: '0.25rem 0 0 0' }}>
                                        {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                                    </p>
                                </div>
                                <button onClick={() => setActiveTab('agenda')} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>Ver Todo</button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                {[
                                    {
                                        id: '1',
                                        title: 'Fit Boxing WOD',
                                        time: '10:00 - 10:50',
                                        location: 'Sala 1',
                                        enrolled: 12,
                                        capacity: 20,
                                        status: 'ongoing',
                                        image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&q=80&w=800', // Boxing image
                                        coach: coachName
                                    },
                                    {
                                        id: '2',
                                        title: 'Open Box',
                                        time: '12:00 - 13:00',
                                        location: 'Zona Libre',
                                        enrolled: 8,
                                        capacity: 25,
                                        status: 'upcoming',
                                        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800', // Gym image
                                        coach: coachName
                                    },
                                    {
                                        id: '3',
                                        title: 'Yoga Flex',
                                        time: '18:00 - 19:00',
                                        location: 'Sala 2',
                                        enrolled: 15,
                                        capacity: 15,
                                        status: 'upcoming',
                                        image: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&q=80&w=800', // Yoga image
                                        coach: coachName
                                    }
                                ].map((classItem) => (
                                    <div
                                        key={classItem.id}
                                        onClick={() => setSelectedClass({ ...classItem, date: 'Hoy' })}
                                        style={{
                                            backgroundColor: 'var(--color-surface)',
                                            borderRadius: '1.25rem',
                                            overflow: 'hidden',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                            cursor: 'pointer',
                                            position: 'relative',
                                            border: '1px solid var(--color-border)'
                                        }}>

                                        {/* Hero Image Section */}
                                        <div style={{ height: '8rem', position: 'relative', overflow: 'hidden' }}>
                                            <img
                                                src={classItem.image}
                                                alt={classItem.title}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}></div>

                                            {/* Status Badge */}
                                            <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}>
                                                {classItem.status === 'ongoing' ? (
                                                    <span style={{
                                                        backgroundColor: '#22c55e', color: 'white',
                                                        fontSize: '0.65rem', fontWeight: 800, padding: '0.25rem 0.6rem',
                                                        borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.05em',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                                    }}>
                                                        En Curso
                                                    </span>
                                                ) : (
                                                    <span style={{
                                                        backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', backdropFilter: 'blur(4px)',
                                                        fontSize: '0.65rem', fontWeight: 700, padding: '0.25rem 0.6rem',
                                                        borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.05em'
                                                    }}>
                                                        {classItem.time}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                                <div>
                                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.25rem 0', lineHeight: 1.2 }}>{classItem.title}</h3>
                                                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem', margin: 0 }}>
                                                        <span className="material-icons-outlined" style={{ fontSize: '1rem' }}>location_on</span> {classItem.location}
                                                    </p>
                                                </div>
                                            </div>

                                            <div style={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)'
                                            }}>
                                                {/* Attendees Count */}
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <span className="material-icons-outlined" style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', marginRight: '0.25rem' }}>group</span>
                                                        <span style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>{classItem.enrolled}</span>
                                                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>/{classItem.capacity}</span>
                                                    </div>
                                                </div>

                                                {/* Manage Button - ALWAYS VISIBLE */}
                                                <button style={{
                                                    backgroundColor: 'var(--color-primary)',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '0.5rem 1.25rem',
                                                    borderRadius: '0.5rem',
                                                    fontSize: '0.875rem',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    boxShadow: '0 4px 10px rgba(211,0,31,0.3)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.25rem'
                                                }}>
                                                    <span>Gestionar</span>
                                                    <span className="material-icons-round" style={{ fontSize: '1rem' }}>arrow_forward</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </main>
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
            style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem',
                color: activeTab === id ? 'var(--color-primary)' : 'var(--color-text-muted)',
                textDecoration: 'none', transition: 'color 0.2s'
            }}
        >
            <span className={`material-icons-${activeTab === id ? 'round' : 'outlined'}`} style={{ fontSize: '1.5rem' }}>{icon}</span>
            <span style={{ fontSize: '10px', fontWeight: 500 }}>{label}</span>
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
            <nav style={{
                flexShrink: 0,
                width: '100%',
                backgroundColor: 'var(--color-surface)',
                borderTop: '1px solid var(--color-border)',
                paddingBottom: 'env(safe-area-inset-bottom)',
                height: '4.5rem',
                display: 'flex',
                alignItems: 'center',
                zIndex: 50,
                paddingLeft: '1.5rem',
                paddingRight: '1.5rem'
            }}>
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    width: '100%',
                    height: '100%'
                }}>
                    <NavItem icon="dashboard" label="Inicio" id="inicio" />
                    <NavItem icon="calendar_today" label="Agenda" id="agenda" />

                    <div style={{
                        position: 'relative',
                        top: '-1.25rem', // Adjusted slightly to accommodate text
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.25rem'
                    }}>
                        <button
                            onClick={() => navigate('/dashboard/coach/add-exercise')}
                            style={{
                                height: '3.5rem', width: '3.5rem', borderRadius: '50%', backgroundColor: 'var(--color-primary)',
                                color: 'white', border: 'none', boxShadow: '0 4px 10px rgba(211, 0, 31, 0.4)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                zIndex: 10
                            }}>
                            <span className="material-icons-round" style={{ fontSize: '2rem' }}>add</span>
                        </button>
                        <span style={{
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            color: 'var(--color-text-muted)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            backgroundColor: 'var(--color-surface)', // Background to ensure legibility over border if needed, or transparent
                            padding: '0 0.25rem',
                            borderRadius: '4px'
                        }}>
                            Ejercicio
                        </span>
                    </div>

                    <NavItem icon="groups" label="Atletas" id="atletas" />
                    <NavItem icon="settings" label="Ajustes" id="ajustes" />
                </div>
            </nav>
        </div>
    );
};
