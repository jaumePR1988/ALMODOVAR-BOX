import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { CommunityChatView } from './CommunityChatView';
import { NotificationsView } from './NotificationsView';
import { CoachClassDetailView } from './CoachClassDetailView';

export const CoachDashboardView: React.FC = () => {
    const { userData, user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('inicio');
    const [selectedClass, setSelectedClass] = useState<any | null>(null);

    const coachName = userData?.firstName || user?.displayName || 'Coach Alex';
    const coachImage = userData?.photoURL || "https://lh3.googleusercontent.com/aida-public/AB6AXuDi1WkpRCM2C7JJdpRLIs623Mbh8co50rXdplQTpItk6NTHaJfSsSp7aTQYLwW0_60WnGTeJYNLceYLMDIWR_hMfv8F86xqDSNyscl-RjSTzf74zgRaxCmqNHR8VntyQAxk6jVV5eYqIO1OgN-6-Cbnf4lhtL_hwpjA6JLEUH17Eznd1wZO8eGgH1P3reRSHzLWvg1ZJEWqwOivPIzqqy_fl7vTOV0jOYJFNaY_BgZPO5wg4PR0qYm518C6ov3L9D9ixT2xLEmcjvA";

    const renderContent = () => {
        switch (activeTab) {
            case 'chat':
                // Default group for coach - In real app fetch from userData.assignedGroup
                const coachGroup = userData?.assignedGroup || 'ALMODOVAR BOX';
                return (
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.3s ease-out' }}>
                        <CommunityChatView onBack={() => setActiveTab('inicio')} forcedGroup={coachGroup} />
                    </div>
                );
            case 'notificaciones':
                return (
                    <div style={{ paddingBottom: '6rem', animation: 'fadeIn 0.3s ease-out' }}>
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
            case 'inicio':
                return (
                    <main style={{ padding: '1.5rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.3s ease-out' }}>
                        {/* Actions Section */}
                        <section>
                            <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Acciones Rápidas</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <button style={{
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
                        <section>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>Agenda de Hoy</h2>
                                <button onClick={() => setActiveTab('agenda')} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>Ver Todo</button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                                {/* Current Class (Mock Data - Filtered by Name "Coach Alex") */}
                                {/* In real app, we filter by userData.uid === class.coachId */}
                                <div
                                    onClick={() => setSelectedClass({
                                        id: '1', title: 'Fit Boxing WOD', time: '10:00 - 10:50',
                                        coach: coachName, date: 'Hoy', enrolled: 12, capacity: 20, status: 'upcoming'
                                    })}
                                    style={{
                                        backgroundColor: 'var(--color-surface)', borderRadius: '1rem', overflow: 'hidden',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', borderLeft: '4px solid var(--color-primary)',
                                        cursor: 'pointer'
                                    }}>
                                    <div style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                            <span style={{ padding: '0.25rem 0.5rem', backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#15803d', fontSize: '0.75rem', fontWeight: 700, borderRadius: '0.25rem', textTransform: 'uppercase' }}>En Curso</span>
                                            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>10:00 - 10:50</span>
                                        </div>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem', margin: 0 }}>Fit Boxing WOD</h3>
                                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem', margin: 0 }}>
                                            <span className="material-icons-outlined" style={{ fontSize: '1rem' }}>location_on</span> Sala 1
                                        </p>

                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
                                            <div style={{ display: 'flex', gap: '-0.5rem' }}>
                                                {[1, 2, 3].map(i => (
                                                    <img key={i} src={`https://i.pravatar.cc/100?img=${10 + i}`} style={{ width: '2rem', height: '2rem', borderRadius: '50%', border: '2px solid var(--color-surface)', marginLeft: i > 0 ? '-0.5rem' : 0 }} />
                                                ))}
                                                <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', border: '2px solid var(--color-surface)', backgroundColor: '#ddd', marginLeft: '-0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#555' }}>+12</div>
                                            </div>
                                            <button style={{ backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 6px rgba(211,0,31,0.2)' }}>
                                                Gestionar
                                            </button>
                                        </div>
                                    </div>
                                    {/* Progress bar */}
                                    <div style={{ backgroundColor: '#e5e7eb', height: '0.25rem', width: '100%' }}>
                                        <div style={{ backgroundColor: 'var(--color-primary)', height: '100%', width: '60%' }}></div>
                                    </div>
                                </div>

                                {/* Next Class */}
                                <div
                                    onClick={() => setSelectedClass({
                                        id: '2', title: 'Open Box', time: '12:00 - 13:00',
                                        coach: coachName, date: 'Hoy', enrolled: 8, capacity: 25, status: 'upcoming'
                                    })}
                                    style={{
                                        backgroundColor: 'rgba(var(--color-surface-rgb), 0.9)', borderRadius: '1rem', padding: '1rem',
                                        border: '1px solid var(--color-border)', boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                        cursor: 'pointer'
                                    }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                        <span style={{ padding: '0.25rem 0.5rem', backgroundColor: 'var(--color-bg)', color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 700, borderRadius: '0.25rem', textTransform: 'uppercase' }}>Próxima</span>
                                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>12:00 - 13:00</span>
                                    </div>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.25rem', margin: 0 }}>Open Box</h3>
                                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem', margin: 0, marginBottom: '0.75rem' }}>
                                        <span className="material-icons-outlined" style={{ fontSize: '1rem' }}>location_on</span> Zona Libre
                                    </p>
                                    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                                            <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>8</span>/25 inscritos
                                        </div>
                                        <button style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>Ver Lista</button>
                                    </div>
                                </div>

                                { /* Fit Boxing Kids - Filtered OUT for demo purposes (assuming different coach) */}
                                { /* In a real scenario, this would just not be rendered if logic was applied. */}

                            </div>
                        </section>

                        {/* Alerts */}
                        <section>
                            <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Alertas</h2>
                            <div style={{
                                backgroundColor: 'rgba(249, 115, 22, 0.1)', border: '1px solid rgba(249, 115, 22, 0.2)',
                                borderRadius: '0.75rem', padding: '1rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem'
                            }}>
                                <span className="material-icons-round" style={{ color: '#f97316' }}>warning_amber</span>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-main)' }}>Lista de espera llena</h4>
                                    <p style={{ margin: '0.25rem 0', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>La clase de las 18:30 tiene 3 personas en espera. ¿Deseas abrir 2 cupos extra?</p>
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                        <button style={{ border: 'none', background: 'none', color: 'var(--color-primary)', fontSize: '0.75rem', fontWeight: 700, padding: 0, cursor: 'pointer' }}>Sí, abrir cupos</button>
                                        <button style={{ border: 'none', background: 'none', color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 700, padding: 0, cursor: 'pointer' }}>Ignorar</button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </main>
                );
            case 'agenda':
                return (
                    <main style={{ padding: '1.5rem 1.25rem', animation: 'fadeIn 0.3s ease-out' }}>
                        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <button onClick={() => setActiveTab('inicio')} style={{ background: 'none', border: 'none', color: 'var(--color-text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                <span className="material-icons-round">arrow_back</span>
                            </button>
                            <h2 className="heading-section" style={{ margin: 0 }}>Agenda Completa</h2>
                        </div>
                        <div>
                            <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginTop: '2rem' }}>Próximamente: Lista completa de clases</p>
                        </div>
                    </main>
                );
            case 'atletas':
                return (
                    <main style={{ padding: '1.5rem 1.25rem', animation: 'fadeIn 0.3s ease-out' }}>
                        <h2 className="heading-section">Directorio de Atletas</h2>
                        <div>
                            <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginTop: '2rem' }}>Próximamente: Buscador y lista de clientes</p>
                        </div>
                    </main>
                );
            case 'ajustes':
                return (
                    <main style={{ padding: '1.5rem 1.25rem', animation: 'fadeIn 0.3s ease-out' }}>
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
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: '#000', // Dark background for the "desktop" area
            minHeight: '100dvh'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '480px',
                height: '100dvh',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'var(--color-bg)',
                color: 'var(--color-text-main)',
                fontFamily: 'Montserrat, sans-serif',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 0 20px rgba(0,0,0,0.5)' // Shadow to separate from desktop bg
            }}>
                {selectedClass && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100dvh', zIndex: 2000, pointerEvents: 'auto' }}>
                        <CoachClassDetailView
                            classData={selectedClass}
                            onBack={() => setSelectedClass(null)}
                            onViewList={() => { }}
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
                    overflowY: 'auto',
                    position: 'relative',
                    scrollBehavior: 'smooth',
                    // No extra padding needed as Nav is in flow
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

                        <div style={{ position: 'relative', top: '-1.5rem' }}>
                            <button style={{
                                height: '3.5rem', width: '3.5rem', borderRadius: '50%', backgroundColor: 'var(--color-primary)',
                                color: 'white', border: 'none', boxShadow: '0 4px 10px rgba(211, 0, 31, 0.4)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                            }}>
                                <span className="material-icons-round" style={{ fontSize: '2rem' }}>add</span>
                            </button>
                        </div>

                        <NavItem icon="groups" label="Atletas" id="atletas" />
                        <NavItem icon="settings" label="Ajustes" id="ajustes" />
                    </div>
                </nav>
            </div>
        </div>
    );
};
