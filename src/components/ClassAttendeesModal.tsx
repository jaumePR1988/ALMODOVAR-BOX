
import React, { useState } from 'react';

interface ClassAttendeesModalProps {
    onClose: () => void;
    enrolled: number;
    capacity: number;
    waitlistCount?: number;
    userStatus?: 'booked' | 'waitlist' | 'none'; // To highlight the user
}

export const ClassAttendeesModal: React.FC<ClassAttendeesModalProps> = ({ onClose, enrolled, capacity, waitlistCount = 2, userStatus = 'none' }) => {
    const [activeTab, setActiveTab] = useState<'attendees' | 'waitlist'>('attendees');

    // Mock Attendees Data
    const attendees = Array.from({ length: enrolled }).map((_, i) => ({
        id: `user-${i}`,
        name: i === 0 && userStatus === 'booked' ? 'Tú' : `Usuario ${i + 1}`,
        image: `https://i.pravatar.cc/150?img=${i + 10}`,
        status: i === 0 && userStatus === 'booked' ? 'confirmed' : 'confirmed',
        plan: i % 2 === 0 ? 'BOX' : 'FIT' // Mock mix of plans
    }));

    // Mock Waitlist Data
    const waitlist = Array.from({ length: waitlistCount }).map((_, i) => ({
        id: `waitlist-${i}`,
        name: i === 1 && userStatus === 'waitlist' ? 'Tú' : `Esperando ${i + 1}`,
        image: `https://i.pravatar.cc/150?img=${i + 30}`,
        position: i + 1,
        plan: i % 3 === 0 ? 'FIT' : 'BOX'
    }));

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 3000,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            animation: 'fadeIn 0.2s ease-out'
        }} onClick={onClose}>
            <div
                style={{
                    width: '100%',
                    maxWidth: '480px',
                    backgroundColor: 'var(--color-bg)', // THEMED
                    borderTopLeftRadius: '1.5rem',
                    borderTopRightRadius: '1.5rem',
                    padding: '1.5rem',
                    maxHeight: '80vh',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 -4px 20px rgba(0,0,0,0.4)',
                    animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Handle for dragging (visual only) */}
                <div style={{ width: '3rem', height: '4px', backgroundColor: '#4B5563', borderRadius: '2px', margin: '0 auto 1.5rem auto' }}></div>

                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '1.5rem', textAlign: 'center' }}>
                    Asistentes
                </h2>

                {/* Tabs */}
                <div style={{ display: 'flex', backgroundColor: 'var(--color-surface)', borderRadius: '0.75rem', padding: '0.25rem', marginBottom: '1.5rem' }}>
                    <button
                        onClick={() => setActiveTab('attendees')}
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            backgroundColor: activeTab === 'attendees' ? 'var(--color-bg)' : 'transparent',
                            color: activeTab === 'attendees' ? 'var(--color-text-main)' : 'var(--color-text-muted)',
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            transition: 'all 0.2s',
                            cursor: 'pointer'
                        }}
                    >
                        Confirmados ({enrolled}/{capacity})
                    </button>
                    <button
                        onClick={() => setActiveTab('waitlist')}
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            backgroundColor: activeTab === 'waitlist' ? 'var(--color-bg)' : 'transparent',
                            color: activeTab === 'waitlist' ? 'var(--color-text-main)' : 'var(--color-text-muted)',
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            transition: 'all 0.2s',
                            cursor: 'pointer'
                        }}
                    >
                        Lista de Espera ({waitlistCount})
                    </button>
                </div>

                {/* List Content - Fixed Min Height to prevent shrinking */}
                <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', minHeight: '50vh' }} className="hide-scrollbar">
                    {activeTab === 'attendees' ? (
                        attendees.map((user) => (
                            <div key={user.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '0.75rem',
                                borderRadius: '0.75rem',
                                backgroundColor: user.name === 'Tú' ? 'rgba(34, 197, 94, 0.1)' : 'transparent', // Highlight user
                                border: user.name === 'Tú' ? '1px solid #22c55e' : '1px solid transparent'
                            }}>
                                <img src={user.image} alt={user.name} style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', objectFit: 'cover' }} />
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontWeight: 700, color: 'var(--color-text-main)', margin: 0 }}>{user.name}</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>
                                        Almodovar <span style={{ color: user.plan === 'BOX' ? 'var(--color-primary)' : 'var(--color-text-main)', fontWeight: 700 }}>{user.plan}</span>
                                    </p>
                                </div>
                                {user.name === 'Tú' && (
                                    <span className="material-icons-round" style={{ color: '#4ade80' }}>check_circle</span>
                                )}
                            </div>
                        ))
                    ) : (
                        waitlist.map((user) => (
                            <div key={user.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1rem',
                                borderRadius: '0.75rem',
                                backgroundColor: user.name === 'Tú' ? 'rgba(249, 115, 22, 0.1)' : 'var(--color-surface)', // Darker background like cards
                                border: user.name === 'Tú' ? '1px solid #f97316' : '1px solid var(--color-border)',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minWidth: '3rem',
                                    paddingRight: '1rem',
                                    borderRight: '1px solid var(--color-border)'
                                }}>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Posición</span>
                                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: user.name === 'Tú' ? '#f97316' : 'var(--color-text-main)' }}>{user.position}</span>
                                </div>

                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <img src={user.image} alt={user.name} style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', objectFit: 'cover' }} />
                                    <div>
                                        <p style={{ fontWeight: 700, color: 'var(--color-text-main)', margin: 0 }}>{user.name}</p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>
                                            {user.name === 'Tú' ? '¡Estás en lista!' : 'Esperando plaza'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer / Back Button */}
                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                    <button
                        onClick={onClose}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            borderRadius: '0.75rem',
                            backgroundColor: 'var(--color-surface)',
                            color: 'var(--color-text-main)',
                            fontWeight: 700,
                            fontSize: '1rem',
                            border: '1px solid var(--color-border)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        Volver
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
};
