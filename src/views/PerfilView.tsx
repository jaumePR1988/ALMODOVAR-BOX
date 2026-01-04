import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { storage, db } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';

import { useNavigate } from 'react-router-dom';

export const PerfilView: React.FC = () => {
    const { userData, user } = useAuth();
    const navigate = useNavigate();
    const membership = userData?.membership || 'fit'; // Default to fit

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(userData?.firstName || '');
    const [editLastName, setEditLastName] = useState(userData?.lastName || '');
    const [showAllHistory, setShowAllHistory] = useState(false);

    const [localPhotoPreview, setLocalPhotoPreview] = useState<string | null>(null);
    const [optimisticName, setOptimisticName] = useState<string | null>(null);
    const [optimisticLastName, setOptimisticLastName] = useState<string | null>(null);

    // Renewal Date Logic: 1st of next month
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const renewalDate = nextMonth.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });

    // Calucate real stats
    const calculateActiveMonths = () => {
        if (!userData?.createdAt) return 0;
        try {
            // Check if it's a Firestore Timestamp (has toDate) or a date string/object
            const created = userData.createdAt.toDate ? userData.createdAt.toDate() : new Date(userData.createdAt);
            const now = new Date();
            const months = (now.getFullYear() - created.getFullYear()) * 12 + (now.getMonth() - created.getMonth());
            return Math.max(0, months); // Ensure no negative
        } catch (e) {
            console.warn("Error calculating active months", e);
            return 0; // Fallback
        }
    };

    const stats = {
        totalClasses: userData?.totalClasses || 0, // Assumes this field exists or will exist
        activeMonths: calculateActiveMonths()
    };

    const memberSinceYear = userData?.createdAt
        ? (userData.createdAt.toDate ? userData.createdAt.toDate().getFullYear() : new Date(userData.createdAt).getFullYear())
        : new Date().getFullYear();

    const fullHistory = [
        { title: 'Open Box', date: '21 Oct • 10:00 AM', status: 'Asistido', color: 'green' },
        { title: 'Fit Boxing Kids (Invitado)', date: '18 Oct • 17:00 PM', status: 'Asistido', color: 'green' },
        { title: 'Fit Boxing WOD', date: '15 Oct • 19:00 PM', status: 'Cancelado', color: 'red' },
        { title: 'Open Box', date: '12 Oct • 09:00 AM', status: 'Asistido', color: 'green' },
        { title: 'Fit Boxing WOD', date: '10 Oct • 18:00 PM', status: 'Asistido', color: 'green' },
        { title: 'Yoga Flex', date: '08 Oct • 10:00 AM', status: 'Asistido', color: 'green' }
    ];

    const displayHistory = showAllHistory ? fullHistory : fullHistory.slice(0, 4);

    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!user) {
            alert("Error: No se ha detectado usuario activo.");
            return;
        }

        // Validar tamaño < 5MB
        if (file.size > 5 * 1024 * 1024) {
            alert('La imagen es demasiado grande. Máximo 5MB.');
            return;
        }

        // 1. Optimistic Update: Show local preview immediately
        const objectUrl = URL.createObjectURL(file);
        setLocalPhotoPreview(objectUrl);
        setUploading(true); // Keep spinner but we show the image

        try {
            // Background Upload
            const storageRef = ref(storage, `profile_images/${user.uid}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);

            await setDoc(doc(db, 'users', user.uid), {
                photoURL: downloadURL
            }, { merge: true });

            // Success - Cleanup object URL
            URL.revokeObjectURL(objectUrl);
            setLocalPhotoPreview(null); // userData will take over via onSnapshot
        } catch (error: any) {
            console.error("Error uploading image:", error);
            // Revert optimistic update
            setLocalPhotoPreview(null);

            if (error.message?.includes('network') || error.code === 'storage/retry-limit-exceeded' || error.code === 'storage/canceled') {
                alert('Error de conexión o CORS. Si estás en local, asegúrate de configurar CORS en Firebase.');
            } else if (error.code === 'storage/unauthorized') {
                alert('Permiso denegado. Verifica las Reglas de Seguridad de Storage.');
            } else {
                alert(`Error al subir imagen: ${error.message || 'Desconocido'}`);
            }
        } finally {
            setUploading(false);
        }
    };

    const handleUpdateProfile = async () => {
        if (!user) {
            alert("Error: No usuario activo.");
            return;
        }

        // 1. Optimistic Update: Close form and show new names immediately
        setOptimisticName(editName);
        setOptimisticLastName(editLastName);
        setIsEditing(false);

        try {
            await setDoc(doc(db, 'users', user.uid), {
                firstName: editName,
                lastName: editLastName
            }, { merge: true });
            // Success - userData will eventually update via onSnapshot
        } catch (error) {
            console.error("Error updating profile:", error);
            alert('Error al guardar en la nube. Los cambios pueden no persistir.');
            // Revert changes if needed or keep them locally
            // In a real app we might re-open the form
        } finally {
            // Optional: Clear optimistic data after a delay if we want to ensure sync
            // For now, keeping it set until unmount is fine, or until userData matches
            setTimeout(() => {
                setOptimisticName(null);
                setOptimisticLastName(null);
            }, 5000);
        }
    };

    return (
        <div style={{ paddingBottom: '6rem' }}>
            {/* Header Sticky */}
            <header style={{
                position: 'sticky',
                top: 0,
                zIndex: 40,
                backgroundColor: 'var(--color-bg)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid var(--color-border)',
                padding: '0.75rem 1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h1 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0 }}>Mi Perfil</h1>
                <button
                    onClick={() => navigate('/dashboard/settings')}
                    style={{
                        padding: '0.5rem',
                        borderRadius: '50%',
                        color: 'var(--color-primary)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                    <span className="material-icons-round">settings</span>
                </button>
            </header>

            <div className="section-padding" style={{ paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* User Info Card */}
                <section style={{
                    backgroundColor: 'var(--color-surface)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '1.5rem',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid var(--color-border)',
                    textAlign: 'center'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '-2.5rem',
                        right: '-2.5rem',
                        width: '8rem',
                        height: '8rem',
                        backgroundColor: 'rgba(211, 0, 31, 0.1)',
                        borderRadius: '50%',
                        filter: 'blur(40px)'
                    }}></div>

                    <div style={{ position: 'relative', zIndex: 10 }}>
                        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                            <img
                                src={localPhotoPreview || userData?.photoURL || "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=200"}
                                alt="Profile"
                                style={{
                                    width: '6rem',
                                    height: '6rem',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: '4px solid var(--color-bg)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    opacity: uploading ? 0.5 : 1
                                }}
                            />
                            <button
                                onClick={handleImageClick}
                                disabled={uploading}
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    right: 0,
                                    backgroundColor: 'var(--color-primary)',
                                    color: 'white',
                                    padding: '0.375rem',
                                    borderRadius: '50%',
                                    border: '2px solid var(--color-bg)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer'
                                }}>
                                <span className="material-icons-round" style={{ fontSize: '0.875rem' }}>
                                    {uploading && !localPhotoPreview ? 'hourglass_empty' : 'edit'}
                                </span>
                            </button>
                        </div>

                        {!isEditing ? (
                            <>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.25rem 0' }}>{optimisticName || userData?.firstName} {optimisticLastName || userData?.lastName}</h2>
                                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: '0 0 1rem 0' }}>Miembro desde {memberSinceYear}</p>
                                <button
                                    onClick={() => {
                                        setEditName(userData?.firstName || '');
                                        setEditLastName(userData?.lastName || '');
                                        setIsEditing(true);
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem 1rem',
                                        backgroundColor: 'var(--color-bg)',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: '0.75rem',
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        color: 'var(--color-text-main)',
                                        cursor: 'pointer',
                                        maxWidth: '200px'
                                    }}>
                                    Editar Datos
                                </button>
                            </>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '240px', margin: '0 auto' }}>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    placeholder="Nombre"
                                    style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text-main)' }}
                                />
                                <input
                                    type="text"
                                    value={editLastName}
                                    onChange={(e) => setEditLastName(e.target.value)}
                                    placeholder="Apellido"
                                    style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text-main)' }}
                                />
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => setIsEditing(false)} style={{ flex: 1, padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text-muted)' }}>Cancelar</button>
                                    <button onClick={handleUpdateProfile} style={{ flex: 1, padding: '0.5rem', borderRadius: '0.5rem', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none' }}>Guardar</button>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Membership Card */}
                <section>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="material-icons-round" style={{ color: 'var(--color-primary)' }}>card_membership</span>
                        Membresía
                    </h3>
                    <div style={{
                        background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
                        color: 'white',
                        borderRadius: 'var(--radius-xl)',
                        padding: '1.5rem',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.3)'
                    }}>
                        <div style={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            width: '12rem',
                            height: '12rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '50%',
                            marginRight: '-4rem',
                            marginTop: '-4rem',
                            filter: 'blur(40px)'
                        }}></div>

                        <div style={{ position: 'relative', zIndex: 10 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div>
                                    <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Plan Actual</p>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.25rem 0 0 0', color: 'white' }}>{membership === 'box' ? 'Plan BOX' : 'Plan FIT'}</h2>
                                </div>
                                <span style={{
                                    backgroundColor: 'rgba(34, 197, 94, 0.2)',
                                    color: '#4ade80',
                                    fontSize: '0.75rem',
                                    fontWeight: 800,
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '0.375rem',
                                    border: '1px solid rgba(34, 197, 94, 0.3)'
                                }}>ACTIVO</span>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.375rem' }}>
                                    <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Créditos Restantes</span>
                                    <span style={{ fontWeight: 700 }}>4 / 12</span>
                                </div>
                                <div style={{ width: '100%', height: '0.625rem', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '999px', overflow: 'hidden' }}>
                                    <div style={{ width: '33%', height: '100%', backgroundColor: 'var(--color-primary)', borderRadius: '999px' }}></div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Próxima renovación</span>
                                <span style={{ fontWeight: 500 }}>{renewalDate}</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* History Section */}
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                            <span className="material-icons-round" style={{ color: 'var(--color-primary)' }}>history</span>
                            Historial
                        </h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {displayHistory.map((item, index) => (
                            <div key={index} style={{
                                backgroundColor: 'var(--color-surface)',
                                padding: '1rem',
                                borderRadius: 'var(--radius-xl)',
                                borderLeft: `4px solid ${item.color === 'green' ? '#22c55e' : '#ef4444'}`,
                                border: '1px solid var(--color-border)',
                                borderLeftWidth: '4px', // Override border logic
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                opacity: item.color === 'red' ? 0.8 : 1
                            }}>
                                <div>
                                    <h4 style={{ fontSize: '0.875rem', fontWeight: 700, margin: '0 0 0.125rem 0' }}>{item.title}</h4>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>{item.date}</p>
                                </div>
                                <span style={{
                                    backgroundColor: item.color === 'green' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                    color: item.color === 'green' ? '#16a34a' : '#dc2626',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '0.375rem'
                                }}>
                                    {item.status}
                                </span>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => setShowAllHistory(!showAllHistory)}
                        style={{
                            width: '100%',
                            marginTop: '1rem',
                            padding: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.25rem',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: 'var(--color-text-muted)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'color 0.2s'
                        }}>
                        {showAllHistory ? 'Ver menos' : 'Ver todo el historial'}
                        <span className="material-icons-round" style={{ fontSize: '1.25rem', transform: showAllHistory ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>expand_more</span>
                    </button>
                </section>

                {/* Evolution Banner */}
                <section>
                    <button
                        onClick={() => navigate('/dashboard/profile/evolution')}
                        style={{
                            width: '100%',
                            background: 'linear-gradient(135deg, var(--color-primary) 0%, #a3001b 100%)',
                            borderRadius: 'var(--radius-xl)',
                            padding: '1.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 8px 20px -5px rgba(211, 0, 31, 0.4)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, background: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")', opacity: 0.1 }}></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative', zIndex: 1 }}>
                            <div style={{ width: '3rem', height: '3rem', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span className="material-icons-round" style={{ fontSize: '1.75rem' }}>show_chart</span>
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0, lineHeight: 1.2 }}>Mi Evolución</h3>
                                <p style={{ fontSize: '0.75rem', opacity: 0.9, margin: 0 }}>Ver mis marcas y RMs</p>
                            </div>
                        </div>
                        <span className="material-icons-round" style={{ position: 'relative', zIndex: 1 }}>arrow_forward_ios</span>
                    </button>
                </section>

                {/* Stats Grid */}
                <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{
                        backgroundColor: 'var(--color-surface)',
                        padding: '1rem',
                        borderRadius: 'var(--radius-xl)',
                        border: '1px solid var(--color-border)',
                        textAlign: 'center'
                    }}>
                        <span style={{ display: 'block', fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1, marginBottom: '0.25rem' }}>{stats.totalClasses}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Clases Totales</span>
                    </div>
                    <div style={{
                        backgroundColor: 'var(--color-surface)',
                        padding: '1rem',
                        borderRadius: 'var(--radius-xl)',
                        border: '1px solid var(--color-border)',
                        textAlign: 'center'
                    }}>
                        <span style={{ display: 'block', fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1, marginBottom: '0.25rem' }}>{stats.activeMonths}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Meses Activo</span>
                    </div>
                </section>
            </div>
        </div>
    );
};
