import React, { useState, useEffect } from 'react';
import { coachService, type Coach } from '../services/coachService';

interface AdminCoachesViewProps {
    onBack: () => void;
}

export const AdminCoachesView: React.FC<AdminCoachesViewProps> = ({ onBack }) => {
    const [coaches, setCoaches] = useState<Coach[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCoach, setEditingCoach] = useState<Coach | null>(null);
    const [filterQuery, setFilterQuery] = useState('');

    // Form State
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [groups, setGroups] = useState<('box' | 'fit')[]>([]);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Toast State
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | null; visible: boolean }>({
        message: '',
        type: null,
        visible: false
    });

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type, visible: true });
        setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
    };

    // Hardcoded stats for design fidelity
    const activeCoachesCount = coaches.filter(c => c.active).length;
    const inactiveCoachesCount = coaches.filter(c => !c.active).length;

    useEffect(() => {
        loadCoaches();
    }, []);

    const loadCoaches = async () => {
        setIsLoading(true);
        try {
            const data = await coachService.getCoaches();
            setCoaches(data);
        } catch (error) {
            console.error("Failed to load coaches", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (coach?: Coach) => {
        if (coach) {
            setEditingCoach(coach);
            setFirstName(coach.firstName);
            setLastName(coach.lastName);
            setSpecialty(coach.specialty);
            setGroups(coach.groups || []);
            setPhotoPreview(coach.photoURL || null);
        } else {
            setEditingCoach(null);
            setFirstName('');
            setLastName('');
            setSpecialty('');
            setGroups([]);
            setPhotoPreview(null);
        }
        setPhotoFile(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCoach(null);
    };

    const toggleGroup = (group: 'box' | 'fit') => {
        setGroups(prev =>
            prev.includes(group)
                ? prev.filter(g => g !== group)
                : [...prev, group]
        );
    };

    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPhotoFile(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        if (!firstName || !lastName || !specialty) {
            showToast("Por favor completa los campos obligatorios", 'error');
            return;
        }

        setIsSaving(true);
        try {
            const coachData = {
                firstName,
                lastName,
                specialty,
                groups,
                active: editingCoach && editingCoach.active !== undefined ? editingCoach.active : true,
                photoURL: editingCoach?.photoURL
            };

            if (editingCoach && editingCoach.id) {
                await coachService.updateCoach(editingCoach.id, coachData, photoFile || undefined);
                showToast("Entrenador actualizado correctamente", 'success');
            } else {
                await coachService.addCoach({ ...coachData, active: true } as any, photoFile || undefined);
                showToast("Entrenador registrado correctamente", 'success');
            }

            await loadCoaches();
            handleCloseModal();
        } catch (error) {
            console.error("Save error:", error);
            showToast("Error al guardar entrenador.", 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggleActive = async (coach: Coach) => {
        // Logic to toggle active status
        if (!coach.id) return;
        try {
            await coachService.updateCoach(coach.id, { active: !coach.active });
            loadCoaches();
        } catch (error) {
            console.error("Error toggling coach status", error);
        }
    };


    const handleDelete = async (id: string) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este entrenador?")) {
            try {
                await coachService.deleteCoach(id);
                await loadCoaches();
                showToast("Entrenador eliminado", 'success');
            } catch (error) {
                showToast("Error al eliminar", 'error');
            }
        }
    };

    // AdminPhoto fallback (hardcoded from your HTML example for consistency or use auth context)
    const adminPhoto = "https://lh3.googleusercontent.com/aida-public/AB6AXuAd01bjAYpy7bJvk9wdc3SdJ0FnGWkfipgGvydD9SmZhXrwCzOOgBCV-n170DCUF5TgZROm4iJ15xtm9CzxTlKWLeeJsAUJirjjrVIxzIm_9IOQk_IFwHnQ2ZMg0apNfXi1uJGiaSnFtcGhrjMhs4TuoxwZtJGuvtxpaOcMSNDw1j8maTJpI8yW6sB1DtY9EJXqVKe0A65Dp0UA2A3UOqW84EFbJWZph3Rt90CjV2ulG_IJHdr_n6t2ufxO7mBn2H6ICqOTO_Pdzxo";

    const filteredCoaches = coaches.filter(c =>
        filterQuery === '' ||
        c.firstName.toLowerCase().includes(filterQuery.toLowerCase()) ||
        c.lastName.toLowerCase().includes(filterQuery.toLowerCase()) ||
        c.specialty.toLowerCase().includes(filterQuery.toLowerCase())
    );



    // Styles
    const cardStyle = {
        backgroundColor: 'var(--color-surface)',
        borderRadius: '0.75rem',
        border: '1px solid var(--color-border)',
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    };

    const inputStyle = {
        width: '100%',
        backgroundColor: 'var(--color-bg)',
        border: '1px solid var(--color-border)',
        borderRadius: '0.75rem',
        padding: '0.75rem 1rem',
        color: 'var(--color-text-main)',
        fontSize: '0.875rem',
        outline: 'none',
        fontFamily: "'Inter', sans-serif"
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'var(--color-bg)',
            display: 'flex',
            justifyContent: 'center',
            fontFamily: "'Inter', sans-serif"
        }}>
            <div style={{
                width: '100%',
                maxWidth: '480px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'var(--color-bg)',
                position: 'relative'
            }}>
                {/* Header */}
                <header style={{
                    flexShrink: 0,
                    zIndex: 50,
                    backgroundColor: 'rgba(var(--color-surface-rgb), 0.95)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid var(--color-border)',
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <button
                        onClick={onBack}
                        style={{
                            padding: '0.5rem',
                            marginLeft: '-0.5rem',
                            borderRadius: '9999px',
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <span className="material-icons-round" style={{ fontSize: '24px', color: 'var(--color-text-main)' }}>
                            arrow_back
                        </span>
                    </button>
                    <h2 style={{
                        fontSize: '1.125rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: 'var(--color-text-main)',
                        textAlign: 'center',
                        flex: 1
                    }}>
                        Entrenadores
                    </h2>
                    <div style={{ width: '2rem', height: '2rem', borderRadius: '9999px', overflow: 'hidden', display: 'flex', justifyContent: 'flex-end' }}>
                        <img
                            src={adminPhoto}
                            alt="Profile"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '50%',
                                border: '1px solid var(--color-primary)'
                            }}
                        />
                    </div>
                </header>

                {/* Main Content */}
                <main
                    className="hide-scrollbar"
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none'
                    }}
                >
                    <style>{`
                        main::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>

                    {/* Search Bar */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <span className="material-icons-round" style={{
                                position: 'absolute',
                                left: '0.75rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--color-text-muted)',
                                fontSize: '1.25rem'
                            }}>search</span>
                            <input
                                value={filterQuery}
                                onChange={(e) => setFilterQuery(e.target.value)}
                                placeholder="Buscar entrenador..."
                                style={{
                                    ...inputStyle,
                                    paddingLeft: '2.5rem'
                                }}
                            />
                        </div>
                        <button style={{
                            backgroundColor: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '0.75rem',
                            width: '2.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--color-text-main)',
                            cursor: 'pointer'
                        }}>
                            <span className="material-icons-round">tune</span>
                        </button>
                    </div>

                    {/* Add Button */}
                    <button
                        onClick={() => handleOpenModal()}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            backgroundColor: 'var(--color-primary)',
                            backgroundImage: 'linear-gradient(to right, var(--color-primary), #C9002B)',
                            border: 'none',
                            borderRadius: '0.75rem',
                            color: 'white',
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(227, 0, 49, 0.2)'
                        }}
                    >
                        <span className="material-icons-round">person_add</span>
                        <span>Añadir Nuevo Entrenador</span>
                    </button>

                    {/* Stats Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div style={cardStyle}>
                            <div>
                                <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
                                    {activeCoachesCount}
                                </span>
                                <span style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>
                                    Activos
                                </span>
                            </div>
                            <div style={{
                                width: '2.5rem', height: '2.5rem', borderRadius: '50%',
                                backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <span className="material-icons-round">check_circle</span>
                            </div>
                        </div>
                        <div style={cardStyle}>
                            <div>
                                <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
                                    {inactiveCoachesCount}
                                </span>
                                <span style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>
                                    Inactivos
                                </span>
                            </div>
                            <div style={{
                                width: '2.5rem', height: '2.5rem', borderRadius: '50%',
                                backgroundColor: 'rgba(249, 115, 22, 0.1)', color: '#f97316',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <span className="material-icons-round">beach_access</span>
                            </div>
                        </div>
                    </div>

                    {/* Coach List */}
                    <div>
                        <h3 style={{
                            fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase',
                            color: 'var(--color-text-main)', marginBottom: '0.75rem', marginLeft: '0.25rem'
                        }}>
                            Equipo Técnico
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {isLoading ? (
                                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                                    <span className="material-icons-round" style={{ animation: 'spin 1s linear infinite' }}>progress_activity</span>
                                </div>
                            ) : filteredCoaches.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)', opacity: 0.6 }}>
                                    No se encontraron entrenadores.
                                </div>
                            ) : (
                                filteredCoaches.map(coach => (
                                    <div key={coach.id} style={{
                                        backgroundColor: 'var(--color-surface)',
                                        borderRadius: '1rem',
                                        border: '1px solid var(--color-border)',
                                        padding: '1rem',
                                        opacity: coach.active ? 1 : 0.6
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                            <div style={{ position: 'relative' }}>
                                                <img
                                                    src={coach.photoURL || "https://lh3.googleusercontent.com/aida-public/AB6AXuAY4LkhvU1YFse9KTIojtjuha8sVuUSIKmZ8SLV0JObgp09gICiHNTz9Ii1fNOB8--U5mUPENxfXLJMabdm3VmL_omvSND1VsT05WDULPYku0peLPoZTfBcNV5gC_3THC4_ZR12ftCupbF9QaLrkbAcvduADcqBAsPqtXpXAPTHW4uo3z0FkCBpa0qBJsnfP8ou3OciY9cEO1sx4uV3GvcqTkkmBopUhWCXzn-a94tfqmIrHIkryIa3AhTN5I_I6yFSL3DcSo6l21o"}
                                                    alt="Coach"
                                                    style={{
                                                        width: '4rem', height: '4rem', borderRadius: '0.75rem', objectFit: 'cover',
                                                        filter: coach.active ? 'none' : 'grayscale(100%)',
                                                        backgroundColor: 'var(--color-bg)'
                                                    }}
                                                />
                                                <div style={{
                                                    position: 'absolute', bottom: '-0.25rem', right: '-0.25rem',
                                                    width: '1.25rem', height: '1.25rem', borderRadius: '50%',
                                                    border: '2px solid var(--color-surface)',
                                                    backgroundColor: coach.active ? '#22c55e' : '#6b7280'
                                                }}></div>
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <div>
                                                        <h4 style={{
                                                            fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-main)',
                                                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px'
                                                        }}>
                                                            {coach.firstName} {coach.lastName}
                                                        </h4>
                                                        <p style={{
                                                            fontSize: '0.75rem', fontWeight: 600,
                                                            color: coach.active ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                                            marginBottom: '0.25rem'
                                                        }}>
                                                            {coach.specialty}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleOpenModal(coach)}
                                                        style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '0.25rem' }}
                                                    >
                                                        <span className="material-icons-round">more_vert</span>
                                                    </button>
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                                                    {(coach.groups && coach.groups.length > 0) ? coach.groups.map(g => (
                                                        <span key={g} style={{
                                                            backgroundColor: 'var(--color-bg)', color: 'var(--color-text-muted)',
                                                            fontSize: '0.625rem', fontWeight: 700, padding: '0.25rem 0.5rem',
                                                            borderRadius: '0.375rem', textTransform: 'uppercase'
                                                        }}>
                                                            {g === 'box' ? 'AlmodovarBox' : 'AlmodovarFit'}
                                                        </span>
                                                    )) : (
                                                        <span style={{
                                                            backgroundColor: 'var(--color-bg)', color: 'var(--color-text-muted)',
                                                            fontSize: '0.625rem', fontWeight: 700, padding: '0.25rem 0.5rem',
                                                            borderRadius: '0.375rem', textTransform: 'uppercase'
                                                        }}>General</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-text-muted)' }}>
                                                <span className="material-icons-round" style={{ fontSize: '1rem' }}>calendar_today</span>
                                                <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>Clases: NA</span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button onClick={() => handleOpenModal(coach)} style={{ width: '2rem', height: '2rem', borderRadius: '50%', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                                    <span className="material-icons-round" style={{ fontSize: '1.125rem' }}>edit</span>
                                                </button>
                                                <button onClick={() => handleToggleActive(coach)} style={{ width: '2rem', height: '2rem', borderRadius: '50%', backgroundColor: coach.active ? 'rgba(249, 115, 22, 0.1)' : 'rgba(34, 197, 94, 0.1)', color: coach.active ? '#f97316' : '#22c55e', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                                    <span className="material-icons-round" style={{ fontSize: '1.125rem' }}>{coach.active ? 'beach_access' : 'check'}</span>
                                                </button>
                                                <button onClick={() => coach.id && handleDelete(coach.id)} style={{ width: '2rem', height: '2rem', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                                    <span className="material-icons-round" style={{ fontSize: '1.125rem' }}>delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(4px)'
                }}>
                    <div style={{
                        width: '100%',
                        maxWidth: '24rem',
                        backgroundColor: 'var(--color-surface)',
                        borderRadius: '1.5rem',
                        border: '1px solid var(--color-border)',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        maxHeight: '90vh',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }}>
                        {/* Modal Header */}
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-main)', margin: 0 }}>
                                {editingCoach ? 'Editar Entrenador' : 'Nuevo Entrenador'}
                            </h3>
                        </div>

                        {/* Modal Body */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {/* Photo */}
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <div
                                    style={{ position: 'relative', cursor: 'pointer' }}
                                    onClick={() => document.getElementById('coach-photo-input')?.click()}
                                >
                                    <div style={{
                                        width: '6rem', height: '6rem', borderRadius: '50%', backgroundColor: 'var(--color-bg)',
                                        border: '2px dashed var(--color-border)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        {photoPreview ? (
                                            <img src={photoPreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <span className="material-icons-round" style={{ fontSize: '2rem', opacity: 0.3, color: 'var(--color-text-main)' }}>add_a_photo</span>
                                        )}
                                    </div>
                                    <div style={{
                                        position: 'absolute', bottom: 0, right: 0, padding: '0.375rem',
                                        backgroundColor: 'var(--color-primary)', borderRadius: '50%', color: 'white', display: 'flex'
                                    }}>
                                        <span className="material-icons-round" style={{ fontSize: '1rem' }}>edit</span>
                                    </div>
                                    <input type="file" id="coach-photo-input" hidden accept="image/*" onChange={handlePhotoSelect} />
                                </div>
                            </div>

                            {/* Inputs */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Nombre</label>
                                    <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Ej. Juan" style={inputStyle} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Apellidos</label>
                                    <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Pérez" style={inputStyle} />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Especialidad</label>
                                <input value={specialty} onChange={e => setSpecialty(e.target.value)} placeholder="Ej. Crossfit L1" style={inputStyle} />
                            </div>

                            {/* Groups */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Asignar a Grupos</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                    <button onClick={() => toggleGroup('box')} style={{
                                        padding: '1rem', borderRadius: '0.75rem', border: groups.includes('box') ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                                        backgroundColor: groups.includes('box') ? 'var(--color-primary)' : 'var(--color-bg)',
                                        color: groups.includes('box') ? 'white' : 'var(--color-text-muted)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'all 0.2s'
                                    }}>
                                        <span className="material-icons-round">fitness_center</span>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Box</span>
                                    </button>
                                    <button onClick={() => toggleGroup('fit')} style={{
                                        padding: '1rem', borderRadius: '0.75rem', border: groups.includes('fit') ? '1px solid #0891b2' : '1px solid var(--color-border)',
                                        backgroundColor: groups.includes('fit') ? '#0891b2' : 'var(--color-bg)',
                                        color: groups.includes('fit') ? 'white' : 'var(--color-text-muted)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'all 0.2s'
                                    }}>
                                        <span className="material-icons-round">self_improvement</span>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Fit</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', display: 'flex', gap: '0.75rem' }}>
                            <button onClick={handleCloseModal} style={{
                                flex: 1, padding: '1rem', borderRadius: '0.75rem', border: 'none', backgroundColor: 'var(--color-bg)', color: 'var(--color-text-muted)',
                                fontWeight: 700, cursor: 'pointer'
                            }}>
                                Cancelar
                            </button>
                            <button onClick={handleSave} disabled={isSaving} style={{
                                flex: 1, padding: '1rem', borderRadius: '0.75rem', border: 'none',
                                background: 'linear-gradient(to right, var(--color-primary), #C9002B)',
                                color: 'white', fontWeight: 700, cursor: isSaving ? 'not-allowed' : 'pointer', opacity: isSaving ? 0.5 : 1
                            }}>
                                {isSaving ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast.visible && (
                <div style={{
                    position: 'fixed',
                    bottom: '2rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: toast.type === 'success' ? '#22c55e' : '#ef4444',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '2rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    zIndex: 100,
                    animation: 'fadeInUp 0.3s ease-out'
                }}>
                    <span className="material-icons-round">
                        {toast.type === 'success' ? 'check_circle' : 'error'}
                    </span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{toast.message}</span>
                </div>
            )}
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translate(-50%, 20px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }
            `}</style>
        </div>
    );
};
