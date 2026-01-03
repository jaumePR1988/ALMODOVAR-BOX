import React, { useState } from 'react';

interface RatingModalProps {
    className?: string; // e.g., "Fit Boxing WOD"
    classTime?: string; // e.g., "Ayer 18:00"
    onClose: () => void;
    onSubmit: (data: { general: number; coach: number; effort: number }) => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({ className = "Clase", classTime = "", onClose, onSubmit }) => {
    const [generalRating, setGeneralRating] = useState(0);
    const [coachRating, setCoachRating] = useState(0);
    const [effortRating, setEffortRating] = useState(5); // Default middle value 1-10
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setLoading(false);
        onSubmit({
            general: generalRating,
            coach: coachRating,
            effort: effortRating
        });
    };

    const isValid = generalRating > 0 && coachRating > 0;

    const StarRating = ({ value, onChange, label }: { value: number, onChange: (v: number) => void, label: string }) => (
        <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--color-text-main)' }}>{label}</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => onChange(star)}
                        style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer',
                            color: star <= value ? '#FFD700' : 'var(--color-text-muted)',
                            transition: 'color 0.2s'
                        }}
                    >
                        <span className="material-icons-round" style={{ fontSize: '2rem' }}>
                            {star <= value ? 'star' : 'star_border'}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
        }}>
            <div style={{
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                width: '100%',
                maxWidth: '400px',
                border: '1px solid var(--color-border)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                position: 'relative'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-text-muted)',
                        cursor: 'pointer'
                    }}
                >
                    <span className="material-icons-round">close</span>
                </button>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '0.25rem' }}>Valora tu clase</h2>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-primary)', fontWeight: 600, margin: 0 }}>{className}</p>
                    {classTime && <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>{classTime}</p>}
                </div>

                {/* Rating Forms */}
                <StarRating value={generalRating} onChange={setGeneralRating} label="Valoración General" />
                <StarRating value={coachRating} onChange={setCoachRating} label="Valoración Coach / Contenido" />

                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <label style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>Nivel de Esfuerzo</label>
                        <span style={{ fontWeight: 800, color: 'var(--color-primary)' }}>{effortRating}/10</span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={effortRating}
                        onChange={(e) => setEffortRating(Number(e.target.value))}
                        style={{
                            width: '100%',
                            accentColor: 'var(--color-primary)',
                            height: '6px',
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '3px',
                            appearance: 'none'
                        }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem', fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                        <span>Suave</span>
                        <span>Mortal</span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={handleSubmit}
                        disabled={!isValid || loading}
                        className="btn-primary"
                        style={{
                            flex: 1,
                            opacity: isValid ? 1 : 0.5,
                            cursor: isValid ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        {loading ? (
                            <>
                                <span className="loader" style={{ width: '1rem', height: '1rem', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white' }}></span>
                                <span>Enviando...</span>
                            </>
                        ) : 'Enviar Valoración'}
                    </button>
                </div>
            </div>
        </div>
    );
};
