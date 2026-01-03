import React from 'react';

interface BookingSuccessModalProps {
    type: 'booking' | 'waitlist';
    onClose: () => void;
}

export const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({ type, onClose }) => {
    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            animation: 'fadeIn 0.3s ease-out'
        }}>
            <style>
                {`
                    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                    @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                `}
            </style>
            <div style={{
                backgroundColor: 'var(--color-surface)',
                borderRadius: '1.5rem',
                padding: '2rem',
                maxWidth: '320px',
                width: '100%',
                textAlign: 'center',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--color-border)',
                animation: 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.5rem'
            }}>
                {/* Icon Circle */}
                <div style={{
                    width: '5rem',
                    height: '5rem',
                    borderRadius: '50%',
                    backgroundColor: type === 'booking' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(249, 115, 22, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `2px solid ${type === 'booking' ? '#4ade80' : '#f97316'}`,
                    boxShadow: `0 0 20px ${type === 'booking' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(249, 115, 22, 0.2)'}`
                }}>
                    <span className="material-icons-round" style={{
                        fontSize: '3rem',
                        color: type === 'booking' ? '#4ade80' : '#f97316'
                    }}>
                        {type === 'booking' ? 'check' : 'hourglass_empty'}
                    </span>
                </div>

                {/* Text Content */}
                <div>
                    <h3 style={{
                        fontSize: '1.5rem',
                        fontWeight: 800,
                        color: 'var(--color-text-main)',
                        marginBottom: '0.5rem',
                        lineHeight: 1.2
                    }}>
                        {type === 'booking' ? '¡Plaza Confirmada!' : '¡Estás en la Lista!'}
                    </h3>
                    <p style={{
                        fontSize: '0.9375rem',
                        color: 'var(--color-text-muted)',
                        lineHeight: 1.5
                    }}>
                        {type === 'booking'
                            ? 'Todo listo. Prepara tus guantes y nos vemos en el club.'
                            : 'Te avisaremos en cuanto se libere una plaza para ti.'}
                    </p>
                </div>

                {/* Credit Badge */}
                <div style={{
                    backgroundColor: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '0.75rem',
                    padding: '0.75rem 1rem',
                    width: '100%'
                }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                        {type === 'booking' ? 'Crédito descontado' : 'Crédito retenido'}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <span className="material-icons-round" style={{ fontSize: '1rem', color: type === 'booking' ? '#ef4444' : 'var(--color-text-muted)' }}>
                            {type === 'booking' ? 'remove_circle_outline' : 'lock_open'}
                        </span>
                        <span style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                            {type === 'booking' ? '1 Crédito' : '0 Créditos'}
                        </span>
                    </div>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        backgroundColor: 'var(--color-primary)',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '1rem',
                        borderRadius: '0.75rem',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(211, 0, 31, 0.3)',
                        transition: 'transform 0.1s'
                    }}
                >
                    Entendido
                </button>
            </div>
        </div>
    );
};
