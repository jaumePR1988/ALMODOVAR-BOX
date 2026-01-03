import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MainLayout } from '../components/MainLayout';
import { NotificationsView } from './NotificationsView';
import { ConsentModal } from '../components/ConsentModal';
import { PerfilView } from './PerfilView';
import { ProfileSettingsView } from './ProfileSettingsView';
import { NotificationsSettingsView } from './NotificationsSettingsView';
import { TermsView } from './TermsView';

export const ClientDashboardView: React.FC = () => {
    const { user, userData } = useAuth();
    const [activeTab, setActiveTab] = useState('inicio');

    const renderContent = () => {
        switch (activeTab) {
            case 'inicio':
                return <InicioSection membership={userData?.membership || 'fit'} />;
            case 'retos':
                return <div className="section-padding text-center" style={{ marginTop: '2rem' }}>Próximos Retos Almodóvar (Próximamente)</div>;
            case 'reservas':
                return <ReservasSection membership={userData?.membership || 'fit'} />;
            case 'noticias':
                return <div className="section-padding text-center" style={{ marginTop: '2rem' }}>Últimas Noticias (Próximamente)</div>;
            case 'perfil':
                return <PerfilView onSettingsClick={() => setActiveTab('ajustes')} />;
            case 'ajustes':
                return <ProfileSettingsView onBack={() => setActiveTab('perfil')} onNavigate={setActiveTab} />;
            case 'ajustes-notificaciones':
                return <NotificationsSettingsView onBack={() => setActiveTab('ajustes')} />;
            case 'legal':
                return <TermsView onBack={() => setActiveTab('ajustes')} />;
            case 'notificaciones':
                return <NotificationsView />;
            default:
                return <InicioSection membership={userData?.membership || 'fit'} />;
        }
    };

    const hasConsents = userData?.consents?.terms && userData?.consents?.imageRights;
    const [overrideModal, setOverrideModal] = useState(false);
    const showConsentModal = !hasConsents && !overrideModal;

    return (
        <MainLayout
            activeTab={activeTab}
            onTabChange={setActiveTab}
            userName={userData?.firstName || user?.displayName || user?.email?.split('@')[0]}
            userPhotoUrl={userData?.photoURL}
            hideNav={activeTab === 'ajustes'}
        >
            {showConsentModal && <ConsentModal onComplete={() => setOverrideModal(true)} />}
            <div className={`scroll-container hide-scrollbar ${showConsentModal ? 'blur-sm pointer-events-none' : ''}`}>
                {renderContent()}
            </div>
        </MainLayout>
    );
};

const InicioSection: React.FC<{ membership?: 'box' | 'fit' }> = ({ membership }) => {
    // Monthly Calculation Logic (Mocked)
    const monthlyLimit = membership === 'box' ? 12 : 16;
    const usedSessions = 4;
    const coachAssists = 1;
    const lateCancellations = 0; // Cancelled < 1 hour before
    const availableMonthly = monthlyLimit - (usedSessions + coachAssists + lateCancellations);

    // Weekly Calculation Logic (Mocked)
    const weeklyLimit = membership === 'box' ? 2 : 3;
    const attendedThisWeek = 1;
    const remainingWeekly = weeklyLimit - attendedThisWeek;

    return (
        <div style={{ paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Stats Grid */}
            <section className="section-padding" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="card-premium">
                    <span className="text-3xl font-bold" style={{ color: 'var(--color-primary)', display: 'block' }}>{availableMonthly}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Clases disponibles al mes</span>
                </div>
                <div className="card-premium">
                    <span className="text-3xl font-bold" style={{ display: 'block', color: 'var(--color-text-main)' }}>{remainingWeekly}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Clases restantes (sem)</span>
                </div>
            </section>

            {/* Next Class Hero */}
            <section className="section-padding">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
                    <h2 className="heading-section" style={{ margin: 0 }}>Tu próxima clase</h2>
                    <span style={{ fontSize: '0.875rem', color: 'var(--color-primary)', fontWeight: 600 }}>Ver calendario</span>
                </div>
                <div className="hero-next-class">
                    <img src="https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=600" alt="Fit Boxing" />
                    <div className="hero-overlay"></div>
                    <div className="hero-content">
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <span style={{ backgroundColor: 'var(--color-primary)', color: 'white', fontSize: '10px', fontWeight: 800, padding: '0.125rem 0.5rem', borderRadius: '4px', textTransform: 'uppercase' }}>Hoy</span>
                            <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', color: 'white', fontSize: '10px', fontWeight: 800, padding: '0.125rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.3)' }}>18:00 - 18:50</span>
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Fit Boxing WOD</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: '#E5E7EB', marginTop: '0.25rem' }}>
                            <span className="material-icons-round" style={{ fontSize: '1rem' }}>location_on</span>
                            <span>Sala Principal</span>
                            <span>•</span>
                            <span>Coach Alex</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Box Selectors */}
            <section className="section-padding">
                <h2 className="heading-section">Reservar nueva sesión</h2>
                <div className="box-grid">
                    <button className={`box-card ${membership === 'fit' ? 'disabled' : ''}`}>
                        <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400" alt="Box" />
                        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                            <span style={{ color: 'white', fontWeight: 900, fontSize: '1rem', textTransform: 'uppercase', display: 'block' }}>Almodovar</span>
                            <span className="box-label-box" style={{ fontWeight: 900, fontSize: '1.5rem' }}>BOX</span>
                        </div>
                    </button>
                    <button className={`box-card ${membership === 'box' ? 'disabled' : ''}`} style={{ border: '1px solid var(--color-border)' }}>
                        <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=400" alt="Fit" />
                        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                            <span style={{ color: 'white', fontWeight: 900, fontSize: '1rem', textTransform: 'uppercase', display: 'block' }}>Almodovar</span>
                            <span className="box-label-fit" style={{ fontWeight: 900, fontSize: '1.5rem' }}>FIT</span>
                        </div>
                    </button>
                </div>
            </section>
        </div>
    );
};

const ReservasSection: React.FC<{ membership?: 'box' | 'fit' }> = ({ membership }) => {
    const weeklyLimit = membership === 'box' ? 2 : 3;
    const attendedThisWeek = 1; // Mocked
    const remaining = weeklyLimit - attendedThisWeek;
    const canReserve = remaining > 0;

    return (
        <div style={{ paddingTop: '1.5rem' }}>
            <section className="section-padding">
                <h2 className="heading-section">Calendario Semanal</h2>
                <div className="calendar-track hide-scrollbar">
                    <div className="calendar-bubble active">
                        <span style={{ fontSize: '0.625rem', fontWeight: 600 }}>HOY</span>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>24</span>
                        <span style={{ fontSize: '0.625rem', fontWeight: 600 }}>OCT</span>
                    </div>
                    {[25, 26, 27, 28, 29].map((day, i) => (
                        <div key={day} className="calendar-bubble">
                            <span style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{['MIE', 'JUE', 'VIE', 'SAB', 'DOM'][i]}</span>
                            <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>{day}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section className="section-padding" style={{ marginTop: '2rem' }}>
                <div className="session-item" style={{ borderLeftColor: 'var(--color-text-main)' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ textAlign: 'center', minWidth: '3rem' }}>
                            <span style={{ display: 'block', fontWeight: 800 }}>09:00</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>AM</span>
                        </div>
                        <div>
                            <h4 style={{ fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>Open Box</h4>
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>Sesión libre • 60 min</p>
                        </div>
                    </div>
                    <button
                        nativeID="reservar-btn"
                        disabled={!canReserve}
                        style={{
                            backgroundColor: canReserve ? 'var(--color-bg)' : 'transparent',
                            color: canReserve ? 'var(--color-text-main)' : 'var(--color-text-muted)',
                            border: canReserve ? 'none' : '1px solid var(--color-border)',
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            opacity: canReserve ? 1 : 0.5,
                            cursor: canReserve ? 'pointer' : 'not-allowed'
                        }}
                    >
                        {canReserve ? 'Reservar' : 'Límite alcanzado'}
                    </button>
                </div>
                {/* ... other items can be added here if needed, but for refactor keeping same logic */}
                <div className="session-item" style={{ borderLeftColor: 'var(--color-primary)', opacity: 0.6 }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ textAlign: 'center', minWidth: '3rem' }}>
                            <span style={{ display: 'block', fontWeight: 800 }}>10:30</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>AM</span>
                        </div>
                        <div>
                            <h4 style={{ fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>Fit Boxing Kids</h4>
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>COMPLETO</p>
                        </div>
                    </div>
                    <button disabled style={{ backgroundColor: 'transparent', color: '#9CA3AF', border: '1px solid #E5E7EB', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600 }}>Lista Esp.</button>
                </div>

                <div className="session-item" style={{ borderLeftColor: 'var(--color-primary)' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ textAlign: 'center', minWidth: '3rem' }}>
                            <span style={{ display: 'block', fontWeight: 800, color: 'var(--color-primary)' }}>18:00</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--color-primary)' }}>PM</span>
                        </div>
                        <div>
                            <h4 style={{ fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>Fit Boxing WOD</h4>
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>Fuerza funcional</p>
                            <span className="session-badge" style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', marginTop: '0.25rem', display: 'inline-block' }}>4 plazas libres</span>
                        </div>
                    </div>
                    <button style={{ backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, boxShadow: '0 4px 12px rgba(211,0,31,0.3)' }}>Reservado</button>
                </div>
            </section>
        </div>
    );
};
