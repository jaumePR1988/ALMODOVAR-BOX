import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

interface ConsentModalProps {
    onComplete: () => void;
}

export const ConsentModal: React.FC<ConsentModalProps> = ({ onComplete }) => {
    const { user } = useAuth();
    const [consents, setConsents] = useState({
        terms: false,
        imageRights: false,
        marketing: false
    });
    const [loading, setLoading] = useState(false);

    const handleCheckboxChange = (field: keyof typeof consents) => {
        setConsents(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSubmit = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const userRef = doc(db, 'users', user.uid);
            // Use setDoc with merge to ensure it works even if the user doc doesn't exist yet
            await setDoc(userRef, {
                uid: user.uid, // Ensure UID is present
                email: user.email, // Ensure Email is present
                role: 'cliente', // Default role if missing
                consents: {
                    ...consents,
                    version: '1.0',
                    timestamp: new Date().toISOString()
                }
            }, { merge: true });

            // AuthContext is reactive (onSnapshot), so userData will update automatically
            // BUT we call onComplete to force UI update immediately to prevent "stuck" feeling
            onComplete();
        } catch (error) {
            console.error("Error saving consents:", error);
            alert("Hubo un error al guardar tus preferencias. Por favor, inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = consents.terms && consents.imageRights;

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
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <span className="material-icons-round" style={{ fontSize: '3rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>gavel</span>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-main)', lineHeight: 1.2 }}>Términos del Box</h2>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Para continuar, necesitamos que aceptes las siguientes condiciones.</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>

                    {/* Terms */}
                    <label style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', cursor: 'pointer' }}>
                        <div style={{ position: 'relative', top: '0.15rem' }}>
                            <input
                                type="checkbox"
                                checked={consents.terms}
                                onChange={() => handleCheckboxChange('terms')}
                                style={{ accentColor: 'var(--color-primary)', width: '1.1rem', height: '1.1rem' }}
                            />
                        </div>
                        <span style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', lineHeight: 1.4 }}>
                            He leído y acepto los <strong style={{ color: 'var(--color-primary)' }}>Términos y Condiciones</strong> y la <strong style={{ color: 'var(--color-primary)' }}>Política de Privacidad</strong>. <span style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 700 }}>(Obligatorio)</span>
                        </span>
                    </label>

                    {/* Image Rights */}
                    <label style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', cursor: 'pointer' }}>
                        <div style={{ position: 'relative', top: '0.15rem' }}>
                            <input
                                type="checkbox"
                                checked={consents.imageRights}
                                onChange={() => handleCheckboxChange('imageRights')}
                                style={{ accentColor: 'var(--color-primary)', width: '1.1rem', height: '1.1rem' }}
                            />
                        </div>
                        <span style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', lineHeight: 1.4 }}>
                            Acepto el uso de mi imagen para fines promocionales y dentro de la comunidad de la app. <span style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 700 }}>(Obligatorio)</span>
                        </span>
                    </label>

                    {/* Marketing */}
                    <label style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', cursor: 'pointer' }}>
                        <div style={{ position: 'relative', top: '0.15rem' }}>
                            <input
                                type="checkbox"
                                checked={consents.marketing}
                                onChange={() => handleCheckboxChange('marketing')}
                                style={{ accentColor: 'var(--color-primary)', width: '1.1rem', height: '1.1rem' }}
                            />
                        </div>
                        <span style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', lineHeight: 1.4 }}>
                            Deseo recibir comunicaciones comerciales y ofertas por email o notificación push. <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>(Opcional)</span>
                        </span>
                    </label>

                </div>

                <button
                    onClick={handleSubmit}
                    disabled={!isFormValid || loading}
                    className="btn-primary"
                    style={{
                        opacity: isFormValid ? 1 : 0.5,
                        cursor: isFormValid ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                    }}
                >
                    {loading ? (
                        <>
                            <span className="loader" style={{ width: '1rem', height: '1rem', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white' }}></span>
                            <span>Guardando...</span>
                        </>
                    ) : (
                        <>
                            <span>Continuar al Box</span>
                            <span className="material-icons-round">arrow_forward</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
