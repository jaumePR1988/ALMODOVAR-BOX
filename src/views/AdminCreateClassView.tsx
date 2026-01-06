import React, { useState, useEffect } from 'react';
import { classService } from '../services/classService';
import type { ClassData } from '../services/classService';
import { coachService, type Coach } from '../services/coachService';

interface AdminCreateClassViewProps {
    onBack: () => void;
}

export const AdminCreateClassView: React.FC<AdminCreateClassViewProps> = ({ onBack }) => {
    const [className, setClassName] = useState('');
    const [group, setGroup] = useState<'box' | 'fit'>('box');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('10:00');
    const [coachId, setCoachId] = useState('');
    const [capacity, setCapacity] = useState(20);
    const [description, setDescription] = useState('');
    const [isRecurring, setIsRecurring] = useState(false);
    const [recurringDays, setRecurringDays] = useState<string[]>([]);
    const [repeatAllYear] = useState(false);
    const [notifyUsers, setNotifyUsers] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [coaches, setCoaches] = useState<Coach[]>([]);

    useEffect(() => {
        const fetchCoaches = async () => {
            try {
                const data = await coachService.getCoaches().catch(err => {
                    console.warn("Could not load coaches (permission error?):", err);
                    return [] as Coach[];
                });
                if (data && data.length > 0) {
                    setCoaches(data.filter(c => c.active));
                }
            } catch (error) {
                console.error("Error loading coaches:", error);
                // Fallback: empty list, don't break UI
            }
        };
        fetchCoaches();
    }, []);

    const weekDays = [
        { id: '1', label: 'L' },
        { id: '2', label: 'M' },
        { id: '3', label: 'X' },
        { id: '4', label: 'J' },
        { id: '5', label: 'V' },
        { id: '6', label: 'S' },
        { id: '0', label: 'D' },
    ];

    const toggleDay = (dayId: string) => {
        setRecurringDays(prev =>
            prev.includes(dayId)
                ? prev.filter(d => d !== dayId)
                : [...prev, dayId]
        );
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handlePublish = async () => {
        setIsLoading(true);
        try {
            const classData: ClassData = {
                name: className,
                group: group,
                date: startDate,
                startTime,
                endTime,
                coachId: coachId,
                capacity,
                description,
                isRecurring,
                recurringDays: isRecurring ? recurringDays : [],
                repeatAllYear: isRecurring ? repeatAllYear : false,
                imageFile: imageFile || undefined,
                status: 'active',
            };

            await classService.createClass(classData);
            onBack();
        } catch (error) {
            console.error('Error creating class:', error);
            alert('Error al crear la clase');
        } finally {
            setIsLoading(false);
        }
    };

    const inputStyle = {
        display: 'block',
        width: '100%',
        padding: '0.75rem',
        fontSize: '0.875rem',
        borderRadius: '0.75rem',
        backgroundColor: 'var(--color-bg)',
        border: '1px solid var(--color-border)',
        color: 'var(--color-text-main)',
        outline: 'none'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '0.5rem',
        fontSize: '0.75rem',
        fontWeight: 700,
        color: 'var(--color-text-main)',
        textTransform: 'uppercase' as const
    };

    return (
        <div style={{
            position: 'fixed', // Lock window scroll
            inset: 0,
            backgroundColor: 'var(--color-background)',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* Header */}
            <header style={{
                flexShrink: 0,
                zIndex: 50,
                backgroundColor: 'rgba(var(--color-surface-rgb), 0.95)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid var(--color-border)',
                width: '100%'
            }}>
                <div style={{
                    maxWidth: '480px',
                    margin: '0 auto',
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
                        Nueva Clase
                    </h2>
                    {/* Header 'Guardar' removed as we have bottom button */}
                    <div style={{ width: '2rem' }}></div>
                </div>
            </header>

            {/* Main Content - SCROLLABLE AREA */}
            <main
                className="hide-scrollbar" // Helper class for hiding scrollbar if available, style below handles inline
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    scrollbarWidth: 'none', // Firefox
                    msOverflowStyle: 'none' // IE/Edge
                }}
            >
                {/* Style tag to hide webkit scrollbar specifically for this component */}
                <style>{`
                    main::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>
                <div style={{
                    width: '100%',
                    maxWidth: '480px',
                    padding: '1rem',
                    paddingBottom: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                }}>
                    {/* Image Upload */}
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        height: '14rem',
                        flexShrink: 0,
                        borderRadius: '0.75rem', // Match design system
                        border: '2px dashed var(--color-border)',
                        backgroundColor: 'var(--color-surface)',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                    }}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            style={{
                                position: 'absolute',
                                inset: 0,
                                width: '100%',
                                height: '100%',
                                opacity: 0,
                                cursor: 'pointer',
                                zIndex: 10
                            }}
                        />
                        {!imagePreview && (
                            <>
                                <div style={{
                                    padding: '0.625rem',
                                    borderRadius: '9999px',
                                    backgroundColor: 'var(--color-bg)'
                                }}>
                                    <span className="material-icons-round" style={{ fontSize: '1.5rem', color: 'var(--color-text-muted)' }}>
                                        add_a_photo
                                    </span>
                                </div>
                                <p style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    color: 'var(--color-text-main)',
                                    margin: 0
                                }}>
                                    Portada
                                </p>
                            </>
                        )}
                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Preview"
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        )}
                    </div>

                    {/* Core Info Card */}
                    <div style={{
                        backgroundColor: 'var(--color-surface)',
                        borderRadius: '0.75rem',
                        border: '1px solid var(--color-border)',
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }}>
                        {/* Name */}
                        <div>
                            <label style={labelStyle}>Nombre</label>
                            <input
                                type="text"
                                placeholder="Ej. Crossfit Morning"
                                value={className}
                                onChange={(e) => setClassName(e.target.value)}
                                style={inputStyle}
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label style={labelStyle}>Descripción</label>
                            <textarea
                                placeholder="Detalles del WOD, requisitos..."
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                style={{
                                    ...inputStyle,
                                    resize: 'none'
                                }}
                            />
                        </div>

                        {/* Group Type */}
                        <div>
                            <label style={labelStyle}>Tipo de Clase</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <label style={{
                                    cursor: 'pointer',
                                    position: 'relative'
                                }}>
                                    <input
                                        type="radio"
                                        name="group"
                                        checked={group === 'box'}
                                        onChange={() => setGroup('box')}
                                        style={{ display: 'none' }}
                                    />
                                    <div style={{
                                        padding: '1rem',
                                        borderRadius: '0.75rem',
                                        backgroundColor: 'var(--color-bg)',
                                        border: group === 'box' ? '2px solid var(--color-primary)' : '2px solid transparent',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        transition: 'all 0.2s'
                                    }}>
                                        <span className="material-icons-round" style={{
                                            fontSize: '1.5rem',
                                            color: group === 'box' ? 'var(--color-primary)' : 'var(--color-text-muted)'
                                        }}>
                                            fitness_center
                                        </span>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            textTransform: 'uppercase',
                                            color: group === 'box' ? 'var(--color-text-main)' : 'var(--color-text-muted)'
                                        }}>
                                            Box
                                        </span>
                                    </div>
                                </label>

                                <label style={{
                                    cursor: 'pointer',
                                    position: 'relative'
                                }}>
                                    <input
                                        type="radio"
                                        name="group"
                                        checked={group === 'fit'}
                                        onChange={() => setGroup('fit')}
                                        style={{ display: 'none' }}
                                    />
                                    <div style={{
                                        padding: '1rem',
                                        borderRadius: '0.75rem',
                                        backgroundColor: 'var(--color-bg)',
                                        border: group === 'fit' ? '2px solid var(--color-primary)' : '2px solid transparent',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        transition: 'all 0.2s'
                                    }}>
                                        <span className="material-icons-round" style={{
                                            fontSize: '1.5rem',
                                            color: group === 'fit' ? 'var(--color-primary)' : 'var(--color-text-muted)'
                                        }}>
                                            self_improvement
                                        </span>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            textTransform: 'uppercase',
                                            color: group === 'fit' ? 'var(--color-text-main)' : 'var(--color-text-muted)'
                                        }}>
                                            Fit
                                        </span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Schedule Card */}
                    <div style={{
                        backgroundColor: 'var(--color-surface)',
                        borderRadius: '0.75rem',
                        border: '1px solid var(--color-border)',
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            paddingBottom: '0.75rem',
                            borderBottom: '1px solid var(--color-border)'
                        }}>
                            <div style={{
                                padding: '0.5rem',
                                borderRadius: '0.5rem',
                                backgroundColor: 'rgba(211, 0, 31, 0.1)'
                            }}>
                                <span className="material-icons-round" style={{ fontSize: '1.25rem', color: 'var(--color-primary)' }}>
                                    calendar_month
                                </span>
                            </div>
                            <h3 style={{
                                fontSize: '0.875rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                color: 'var(--color-text-main)',
                                margin: 0
                            }}>
                                Horario
                            </h3>
                        </div>

                        {/* Date */}
                        <div>
                            <label style={labelStyle}>Fecha</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                style={inputStyle}
                            />
                        </div>

                        {/* Time Range */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <div>
                                <label style={labelStyle}>Inicio</label>
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    style={{ ...inputStyle, textAlign: 'center', fontWeight: 700 }}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Fin</label>
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    style={{ ...inputStyle, textAlign: 'center', fontWeight: 700 }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Recurrence Card */}
                    <div style={{
                        backgroundColor: 'var(--color-surface)',
                        borderRadius: '0.75rem',
                        border: '1px solid var(--color-border)',
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                    padding: '0.5rem',
                                    borderRadius: '0.5rem',
                                    backgroundColor: 'rgba(59, 130, 246, 0.1)'
                                }}>
                                    <span className="material-icons-round" style={{ fontSize: '1.25rem', color: '#3b82f6' }}>
                                        update
                                    </span>
                                </div>
                                <div>
                                    <span style={{
                                        fontSize: '0.875rem',
                                        fontWeight: 700,
                                        color: 'var(--color-text-main)',
                                        display: 'block'
                                    }}>
                                        Repetir
                                    </span>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                        color: 'var(--color-text-muted)'
                                    }}>
                                        Semanalmente
                                    </span>
                                </div>
                            </div>
                            <label style={{
                                position: 'relative',
                                display: 'inline-flex',
                                alignItems: 'center',
                                cursor: 'pointer'
                            }}>
                                <input
                                    type="checkbox"
                                    checked={isRecurring}
                                    onChange={(e) => setIsRecurring(e.target.checked)}
                                    style={{ display: 'none' }}
                                />
                                <div style={{
                                    width: '2.75rem',
                                    height: '1.5rem',
                                    backgroundColor: isRecurring ? 'var(--color-primary)' : 'var(--color-bg)',
                                    borderRadius: '9999px',
                                    position: 'relative',
                                    transition: 'background-color 0.2s',
                                    border: '1px solid var(--color-border)'
                                }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: '2px',
                                        left: '2px',
                                        backgroundColor: 'white',
                                        borderRadius: '50%',
                                        height: '1.25rem',
                                        width: '1.25rem',
                                        transition: 'transform 0.2s',
                                        transform: isRecurring ? 'translateX(1.25rem)' : 'translateX(0)'
                                    }} />
                                </div>
                            </label>
                        </div>

                        {isRecurring && (
                            <div style={{
                                paddingTop: '0.75rem',
                                borderTop: '1px solid var(--color-border)'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    {weekDays.map(day => (
                                        <button
                                            key={day.id}
                                            onClick={() => toggleDay(day.id)}
                                            style={{
                                                width: '2.25rem',
                                                height: '2.25rem',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '0.75rem',
                                                fontWeight: 700,
                                                border: 'none',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                backgroundColor: recurringDays.includes(day.id) ? 'var(--color-primary)' : 'var(--color-bg)',
                                                color: recurringDays.includes(day.id) ? 'white' : 'var(--color-text-muted)'
                                            }}
                                        >
                                            {day.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Configuration Card */}
                    <div style={{
                        backgroundColor: 'var(--color-surface)',
                        borderRadius: '0.75rem',
                        border: '1px solid var(--color-border)',
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            paddingBottom: '0.75rem',
                            borderBottom: '1px solid var(--color-border)'
                        }}>
                            <div style={{
                                padding: '0.5rem',
                                borderRadius: '0.5rem',
                                backgroundColor: 'rgba(0, 0, 0, 0.1)'
                            }}>
                                <span className="material-icons-round" style={{ fontSize: '1.25rem', color: 'var(--color-text-main)' }}>
                                    settings_accessibility
                                </span>
                            </div>
                            <h3 style={{
                                fontSize: '0.875rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                color: 'var(--color-text-main)',
                                margin: 0
                            }}>
                                Configuración
                            </h3>
                        </div>

                        {/* Coach */}
                        <div>
                            <label style={labelStyle}>Entrenador</label>
                            <div style={{ position: 'relative' }}>
                                <select
                                    value={coachId}
                                    onChange={(e) => setCoachId(e.target.value)}
                                    style={{
                                        ...inputStyle,
                                        paddingRight: '2.5rem',
                                        appearance: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <option disabled value="">Seleccionar Coach</option>
                                    {coaches.map(coach => (
                                        <option key={coach.id} value={coach.id}>
                                            {coach.firstName} {coach.lastName} {coach.specialty ? `(${coach.specialty})` : ''}
                                        </option>
                                    ))}
                                    {coaches.length === 0 && (
                                        <option disabled>Cargando entrenadores...</option>
                                    )}
                                </select>
                                <div style={{
                                    position: 'absolute',
                                    right: '0.75rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    pointerEvents: 'none'
                                }}>
                                    <span className="material-icons-round" style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }}>
                                        expand_more
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Capacity */}
                        <div>
                            <label style={labelStyle}>Aforo Máximo</label>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.75rem',
                                backgroundColor: 'var(--color-bg)'
                            }}>
                                <span style={{
                                    fontSize: '1.125rem',
                                    fontWeight: 700,
                                    color: 'var(--color-text-main)'
                                }}>
                                    {capacity} <span style={{ fontSize: '0.75rem', opacity: 0.5, fontWeight: 500 }}>atletas</span>
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <button
                                        onClick={() => setCapacity(Math.max(1, capacity - 1))}
                                        style={{
                                            width: '2.5rem',
                                            height: '2.5rem',
                                            borderRadius: '0.5rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: 'none',
                                            backgroundColor: 'var(--color-surface)',
                                            color: 'var(--color-text-main)',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <span className="material-icons-round" style={{ fontSize: '0.875rem' }}>remove</span>
                                    </button>
                                    <button
                                        onClick={() => setCapacity(capacity + 1)}
                                        style={{
                                            width: '2.5rem',
                                            height: '2.5rem',
                                            borderRadius: '0.5rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: 'none',
                                            backgroundColor: 'var(--color-surface)',
                                            color: 'var(--color-text-main)',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <span className="material-icons-round" style={{ fontSize: '0.875rem' }}>add</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notifications Card */}
                    <div style={{
                        backgroundColor: 'var(--color-surface)',
                        borderRadius: '0.75rem',
                        border: '1px solid var(--color-border)',
                        padding: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                                padding: '0.5rem',
                                borderRadius: '0.5rem',
                                backgroundColor: 'rgba(239, 68, 68, 0.1)'
                            }}>
                                <span className="material-icons-round" style={{ fontSize: '1.25rem', color: '#ef4444' }}>
                                    notifications_active
                                </span>
                            </div>
                            <div>
                                <span style={{
                                    fontSize: '0.875rem',
                                    fontWeight: 700,
                                    color: 'var(--color-text-main)',
                                    display: 'block'
                                }}>
                                    Notificar
                                </span>
                                <span style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    color: 'var(--color-text-muted)'
                                }}>
                                    Push a usuarios
                                </span>
                            </div>
                        </div>
                        <label style={{
                            position: 'relative',
                            display: 'inline-flex',
                            alignItems: 'center',
                            cursor: 'pointer'
                        }}>
                            <input
                                type="checkbox"
                                checked={notifyUsers}
                                onChange={(e) => setNotifyUsers(e.target.checked)}
                                style={{ display: 'none' }}
                            />
                            <div style={{
                                width: '2.75rem',
                                height: '1.5rem',
                                backgroundColor: notifyUsers ? 'var(--color-primary)' : 'var(--color-bg)',
                                borderRadius: '9999px',
                                position: 'relative',
                                transition: 'background-color 0.2s',
                                border: '1px solid var(--color-border)'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    top: '2px',
                                    left: '2px',
                                    backgroundColor: 'white',
                                    borderRadius: '50%',
                                    height: '1.25rem',
                                    width: '1.25rem',
                                    transition: 'transform 0.2s',
                                    transform: notifyUsers ? 'translateX(1.25rem)' : 'translateX(0)'
                                }} />
                            </div>
                        </label>
                    </div>
                </div>

                {/* Main Action Button (Static at bottom) */}
                <div style={{ marginTop: '1rem', width: '100%' }}>
                    <button
                        onClick={handlePublish}
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            borderRadius: '0.75rem',
                            border: 'none',
                            background: 'linear-gradient(to right, var(--color-primary), #C9002B)',
                            color: 'white',
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            textTransform: 'uppercase',
                            boxShadow: '0 20px 40px -5px rgba(227, 0, 49, 0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            opacity: isLoading ? 0.5 : 1,
                            transition: 'all 0.2s'
                        }}
                    >
                        {isLoading ? (
                            <>
                                <span className="material-icons-round" style={{ fontSize: '1.25rem', animation: 'spin 1s linear infinite' }}>
                                    progress_activity
                                </span>
                                <span>Guardando...</span>
                            </>
                        ) : (
                            <>
                                <span className="material-icons-round" style={{ fontSize: '1.25rem' }}>
                                    rocket_launch
                                </span>
                                <span>Publicar Clase</span>
                            </>
                        )}
                    </button>
                </div>
            </main>
        </div>
    );
};
