import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { db, storage } from '../firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const CoachAddExerciseView: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const editData = location.state as any; // { id: string, ...data }

    // Form State
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [muscleGroup, setMuscleGroup] = useState('');
    const [equipment, setEquipment] = useState(false);
    const [difficulty, setDifficulty] = useState('beginner');
    const [videoLink, setVideoLink] = useState('');

    // Image State
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    // Pre-fill if editing
    useEffect(() => {
        if (editData) {
            setName(editData.name || '');
            setDescription(editData.description || '');
            setType(editData.type || ''); // Ensure this matches schema keys in Library view
            setMuscleGroup(editData.muscleGroup || ''); // Assuming editData comes from Library item which might have different keys? 
            // NOTE: In LibraryView we mapped data.type to 'category' property in the list, but passed the whole 'data' if using raw doc? 
            // In LibraryView map: { id, name, description, image, tags, category: data.type }.
            // So if we pass 'ex' from LibraryView, 'ex.category' is type. 'ex.tags' is derived.
            // We need to be careful what we pass. LibraryView should pass the RAW data or we map it back.
            // Let's assume LibraryView passes the normalized object we constructed, so 'category' -> type.

            // Correction: library view construction:
            // category: data.type
            // muscleGroup was inside tags array.

            // To make this robust, the LibraryView should ideally pass the RAW doc data + ID.
            // But if we only have the view model, we try to reconstruct.

            if (editData.category) setType(editData.category);
            // We can't easily get muscleGroup from 'tags' reliably if tags are just 'Pectoral', 'Fuerza'.
            // However, looking at LibraryView: `tags: [data.muscleGroup, data.type]`.
            // So we might need to change LibraryView to pass raw data or distinct fields.
            // For now, let's assume we update LibraryView to pass correct props.
            if (editData.muscleGroup) setMuscleGroup(editData.muscleGroup); // If we add this prop in Library

            // Fallback: if we just passed what's in LibraryView state
            if (!editData.muscleGroup && editData.tags) {
                // Try to find which tag is a muscle group
                const muscles = ['chest', 'back', 'legs', 'arms', 'shoulders', 'core', 'fullbody'];
                // logic to reverse map is hard if localized.
                // Ideally LibraryView passes raw data. I will update LibraryView to pass 'muscleGroup' explicitly.
            }

            if (editData.image) setImagePreview(editData.image);
            if (editData.equipment !== undefined) setEquipment(editData.equipment);
            if (editData.difficulty) setDifficulty(editData.difficulty);
            if (editData.videoLink) setVideoLink(editData.videoLink);
        }
    }, [editData]);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if (!name || !type || !muscleGroup) {
            alert('Por favor completa los campos obligatorios (Nombre, Tipo, Grupo Muscular).');
            return;
        }

        // Show Success Modal
        setShowSuccess(true);

        // Navigate after short delay
        setTimeout(() => {
            navigate(-1);
        }, 2000);

        // Fire-and-forget (Background Process)
        const saveProcess = async () => {
            try {
                let imageUrl = imagePreview || ''; // Default to current preview if no new file
                if (imageFile) {
                    const storageRef = ref(storage, `exercise-images/${Date.now()}_${imageFile.name}`);
                    const snapshot = await uploadBytes(storageRef, imageFile);
                    imageUrl = await getDownloadURL(snapshot.ref);
                }

                const exerciseData = {
                    name,
                    description,
                    type,
                    muscleGroup,
                    equipment,
                    difficulty,
                    videoLink,
                    imageUrl,
                    updatedAt: serverTimestamp()
                };

                if (editData && editData.id) {
                    await updateDoc(doc(db, 'exercises', editData.id), exerciseData);
                    console.log("Update successful");
                } else {
                    await addDoc(collection(db, 'exercises'), {
                        ...exerciseData,
                        createdAt: serverTimestamp()
                    });
                    console.log("Create successful");
                }

            } catch (error: any) {
                console.error("Critical Background Error:", error);
            }
        };

        // Execute background process
        saveProcess();
    };

    return (
        <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: 'var(--color-text-main)', fontFamily: 'Montserrat, sans-serif' }}>
            {/* Header */}
            <header style={{
                position: 'sticky', top: 0, zIndex: 50, backgroundColor: 'rgba(var(--color-surface-rgb), 0.95)',
                backdropFilter: 'blur(12px)', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)'
            }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        color: 'var(--color-text-main)', display: 'flex', height: '2.5rem', width: '2.5rem', flexShrink: 0,
                        alignItems: 'center', justifyContent: 'center', borderRadius: '9999px',
                        backgroundColor: 'transparent', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    <span className="material-icons-round" style={{ fontSize: '24px' }}>arrow_back</span>
                </button>
                <h2 style={{ color: 'var(--color-text-main)', fontSize: '1.125rem', fontWeight: 700, lineHeight: 1.25, letterSpacing: '-0.025em', flex: 1, textAlign: 'center', textTransform: 'uppercase', margin: 0 }}>
                    {editData ? 'Editar Ejercicio' : 'Añadir Ejercicio'}
                </h2>
                <div style={{ display: 'flex', height: '2.5rem', alignItems: 'center', justifyContent: 'flex-end', width: '2.5rem' }}>
                    <button
                        onClick={handleSave}
                        style={{
                            color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s',
                        }}>
                        Guardar
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '1.5rem 1rem', paddingBottom: '8rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Image Upload Area */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{
                        position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '1rem',
                        backgroundColor: 'var(--color-bg)', border: '2px dashed var(--color-border)', overflow: 'hidden',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'all 0.3s',
                        backgroundImage: imagePreview ? `url(${imagePreview})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}>
                        {!imagePreview && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
                                <span className="material-icons-round" style={{ fontSize: '2.25rem' }}>add_a_photo</span>
                                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Subir foto del ejercicio</span>
                            </div>
                        )}
                        <input accept="image/*" type="file" onChange={handleImageSelect} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />

                        {/* Edit Button */}
                        <div style={{ position: 'absolute', bottom: '0.75rem', right: '0.75rem', opacity: imagePreview ? 1 : 0, transition: 'opacity 0.2s' }}>
                            <button style={{ backgroundColor: 'var(--color-surface)', padding: '0.5rem', borderRadius: '9999px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', color: 'var(--color-text-main)', border: 'none' }}>
                                <span className="material-icons-round" style={{ fontSize: '20px' }}>edit</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Name & Description */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label htmlFor="exercise-name" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.05em', marginLeft: '0.25rem' }}>
                            Nombre del Ejercicio
                        </label>
                        <input
                            id="exercise-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ej. Press de Banca"
                            style={{
                                display: 'block', width: '100%', borderRadius: '0.75rem', border: '1px solid var(--color-border)',
                                backgroundColor: 'var(--color-surface)', padding: '0.75rem', color: 'var(--color-text-main)', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                                transition: 'all 0.2s', fontSize: '0.875rem', fontWeight: 500, outline: 'none'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label htmlFor="exercise-desc" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.05em', marginLeft: '0.25rem' }}>
                            Descripción
                        </label>
                        <textarea
                            id="exercise-desc"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe la técnica correcta, respiración y consejos..."
                            rows={4}
                            style={{
                                display: 'block', width: '100%', borderRadius: '0.75rem', border: '1px solid var(--color-border)',
                                backgroundColor: 'var(--color-surface)', padding: '0.75rem', color: 'var(--color-text-main)', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                                transition: 'all 0.2s', fontSize: '0.875rem', fontWeight: 500, resize: 'none', outline: 'none', fontFamily: 'inherit'
                            }}
                        />
                    </div>
                </div>

                {/* Type & Muscle Group Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label htmlFor="exercise-type" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.05em', marginLeft: '0.25rem' }}>
                            Tipo
                        </label>
                        <div style={{ position: 'relative' }}>
                            <select
                                id="exercise-type"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                style={{
                                    display: 'block', width: '100%', appearance: 'none', borderRadius: '0.75rem', border: '1px solid var(--color-border)',
                                    backgroundColor: 'var(--color-surface)', padding: '0.75rem', color: 'var(--color-text-main)', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                                    transition: 'all 0.2s', fontSize: '0.875rem', fontWeight: 500, outline: 'none'
                                }}
                            >
                                <option disabled value="">Seleccionar</option>
                                <option value="strength">Fuerza</option>
                                <option value="cardio">Cardio</option>
                                <option value="flexibility">Flexibilidad</option>
                                <option value="balance">Equilibrio</option>
                                <option value="power">Potencia</option>
                            </select>
                            <div style={{ pointerEvents: 'none', position: 'absolute', top: 0, bottom: 0, right: 0, display: 'flex', alignItems: 'center', paddingRight: '0.75rem', color: 'var(--color-text-muted)' }}>
                                <span className="material-icons-round" style={{ fontSize: '20px' }}>expand_more</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label htmlFor="muscle-group" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.05em', marginLeft: '0.25rem' }}>
                            Grupo Muscular
                        </label>
                        <div style={{ position: 'relative' }}>
                            <select
                                id="muscle-group"
                                value={muscleGroup}
                                onChange={(e) => setMuscleGroup(e.target.value)}
                                style={{
                                    display: 'block', width: '100%', appearance: 'none', borderRadius: '0.75rem', border: '1px solid var(--color-border)',
                                    backgroundColor: 'var(--color-surface)', padding: '0.75rem', color: 'var(--color-text-main)', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                                    transition: 'all 0.2s', fontSize: '0.875rem', fontWeight: 500, outline: 'none'
                                }}
                            >
                                <option disabled value="">Seleccionar</option>
                                <option value="chest">Pectoral</option>
                                <option value="back">Espalda</option>
                                <option value="legs">Piernas</option>
                                <option value="arms">Brazos</option>
                                <option value="shoulders">Hombros</option>
                                <option value="core">Core</option>
                                <option value="fullbody">Cuerpo Completo</option>
                            </select>
                            <div style={{ pointerEvents: 'none', position: 'absolute', top: 0, bottom: 0, right: 0, display: 'flex', alignItems: 'center', paddingRight: '0.75rem', color: 'var(--color-text-muted)' }}>
                                <span className="material-icons-round" style={{ fontSize: '20px' }}>expand_more</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Equipment Checkbox */}
                <div style={{
                    borderRadius: '0.75rem', backgroundColor: 'var(--color-surface)', padding: '1rem',
                    boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)', display: 'flex',
                    alignItems: 'center', justifyContent: 'space-between', border: '1px solid var(--color-border)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            display: 'flex', height: '2.5rem', width: '2.5rem', alignItems: 'center', justifyContent: 'center',
                            borderRadius: '9999px', backgroundColor: 'rgba(211, 0, 31, 0.1)', color: 'var(--color-primary)'
                        }}>
                            <span className="material-icons-round">fitness_center</span>
                        </div>
                        <div>
                            <h4 style={{ fontWeight: 700, color: 'var(--color-text-main)', fontSize: '0.875rem', margin: 0 }}>Requiere Equipamiento</h4>
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>Mancuernas, barras, máquinas...</p>
                        </div>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={equipment}
                            onChange={(e) => setEquipment(e.target.checked)}
                            style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: 0 }}
                        />
                        <div style={{
                            width: '2.75rem', height: '1.5rem', backgroundColor: 'var(--color-border)',
                            borderRadius: '9999px', position: 'relative', transition: 'all 0.2s',
                        }} className="peer-focus:outline-none peer-checked:bg-[var(--color-primary)]">
                            <div style={{
                                position: 'absolute', top: '2px', left: '2px', backgroundColor: 'white',
                                border: '1px solid var(--color-border)', borderRadius: '9999px', height: '1.25rem', width: '1.25rem',
                                transition: 'all 0.2s',
                                transform: equipment ? 'translateX(100%)' : 'translateX(0)'
                            }} className="peer-checked:translate-x-full peer-checked:border-white"></div>
                        </div>
                    </label>
                </div>

                {/* Difficulty */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '0.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.05em', marginLeft: '0.25rem' }}>Dificultad</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                        {[
                            { value: 'beginner', emoji: '🌱', label: 'Principiante' },
                            { value: 'intermediate', emoji: '🌿', label: 'Intermedio' },
                            { value: 'advanced', emoji: '🌳', label: 'Avanzado' }
                        ].map((level) => (
                            <label key={level.value} style={{ cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="difficulty"
                                    value={level.value}
                                    checked={difficulty === level.value}
                                    onChange={(e) => setDifficulty(e.target.value)}
                                    style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: 0 }}
                                />
                                <div style={{
                                    borderRadius: '0.75rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', padding: '0.75rem',
                                    textAlign: 'center', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center'
                                }}
                                    className="peer-checked:border-[var(--color-primary)] peer-checked:bg-[rgba(211,0,31,0.05)] peer-checked:text-[var(--color-primary)]">
                                    <span style={{ display: 'block', fontSize: '1.5rem', marginBottom: '0.25rem' }}>{level.emoji}</span>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{level.label}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Video Link */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingTop: '0.5rem' }}>
                    <label htmlFor="video-link" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.05em', marginLeft: '0.25rem' }}>
                        Enlace de Video (Opcional)
                    </label>
                    <div style={{ position: 'relative' }}>
                        <div style={{ pointerEvents: 'none', position: 'absolute', top: 0, bottom: 0, left: 0, display: 'flex', alignItems: 'center', paddingLeft: '0.75rem' }}>
                            <span className="material-icons-round" style={{ color: 'var(--color-text-muted)' }}>play_circle</span>
                        </div>
                        <input
                            id="video-link"
                            type="url"
                            value={videoLink}
                            onChange={(e) => setVideoLink(e.target.value)}
                            placeholder="https://youtube.com/..."
                            style={{
                                display: 'block', width: '100%', borderRadius: '0.75rem', border: '1px solid var(--color-border)',
                                backgroundColor: 'var(--color-surface)', padding: '0.75rem', paddingLeft: '2.5rem', color: 'var(--color-text-main)',
                                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', transition: 'all 0.2s', fontSize: '0.875rem', fontWeight: 500, outline: 'none'
                            }}
                        />
                    </div>
                </div>
            </main>

            {/* Bottom Button - Refined Layout */}
            <div style={{
                position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(var(--color-surface-rgb), 0.95)',
                backdropFilter: 'blur(4px)', padding: '0.75rem 1.5rem 2rem 1.5rem', // Added horizontal padding and extra bottom padding for modern feel
                borderTop: '1px solid var(--color-border)', zIndex: 40,
                display: 'flex', justifyContent: 'center'
            }}>
                <button
                    onClick={handleSave}
                    style={{
                        width: '100%', maxWidth: '400px', borderRadius: '0.75rem', backgroundColor: 'var(--color-primary)', padding: '0.875rem',
                        boxShadow: '0 10px 15px -3px rgba(211, 0, 31, 0.3)', border: 'none', cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}>
                    Guardar Ejercicio
                </button>
            </div>

            {/* Success Modal */}
            {showSuccess && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.2s ease-out'
                }}>
                    <div style={{
                        backgroundColor: 'var(--color-surface)', borderRadius: '1.5rem', padding: '2rem',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        transform: 'scale(1)', animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}>
                        <div style={{
                            width: '4rem', height: '4rem', borderRadius: '50%', backgroundColor: '#22c55e', color: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem'
                        }}>
                            <span className="material-icons-round" style={{ fontSize: '2.5rem' }}>check</span>
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>¡Ejercicio Guardado!</h3>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>Ya disponible en la biblioteca</p>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes popIn {
                    from { transform: scale(0.8); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                input:checked + div {
                    background-color: var(--color-primary) !important;
                    border-color: var(--color-primary) !important;
                    color: var(--color-primary) !important;
                }
                input:checked + div span, input:checked + div h4 {
                    color: inherit;
                }
                /* Specific fix for radio buttons background */
                input[type="radio"]:checked + div {
                    background-color: rgba(211, 0, 31, 0.05) !important;
                    color: var(--color-primary) !important;
                    border-color: var(--color-primary) !important;
                }
                input[type="radio"]:checked + div span {
                    color: inherit !important;
                }
                
                input:checked + div > div {
                    transform: translateX(100%);
                    border-color: white;
                }
            `}</style>
        </div>
    );
};
