import React, { useState } from 'react';

interface CoachNotificationsViewProps {
    onBack: () => void;
}

export const CoachNotificationsView: React.FC<CoachNotificationsViewProps> = ({ onBack }) => {
    const [recipientType, setRecipientType] = useState<'todos' | 'grupos' | 'equipo' | 'individual'>('grupos');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGroups, setSelectedGroups] = useState<string[]>(['morning']);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [isHighPriority, setIsHighPriority] = useState(false);

    // Mock Data - Representing the "Assigned Group" logic
    // In a real app, this would come from the user's profile/permissions
    const assignedGroup = { id: 'morning', name: 'AlmodovarBox (Mañanas)', memberCount: 45 };
    const otherGroups = [
        { id: 'afternoon', name: 'AlmodovarBox (Tardes)', memberCount: 38 },
        { id: 'competition', name: 'Equipo Competición', memberCount: 12 }
    ];

    const toggleGroup = (groupId: string) => {
        // Restriction logic: If coach is restricted, maybe warn them? 
        // For now, we allow toggling but visually emphasize the assigned one.
        setSelectedGroups(prev =>
            prev.includes(groupId)
                ? prev.filter(id => id !== groupId)
                : [...prev, groupId]
        );
    };

    return (
        <div style={{
            minHeight: '100dvh',
            backgroundColor: '#ffffff', // bg-background-light
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "'Inter', sans-serif"
        }} className="dark:bg-[#23263a]">

            {/* Header */}
            <header style={{
                position: 'sticky',
                top: 0,
                zIndex: 50,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid #e5e7eb',
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
                    <span className="material-icons-round" style={{ fontSize: '24px', color: '#111827' }}>close</span>
                </button>
                <h2 style={{
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#111827',
                    textAlign: 'center',
                    flex: 1
                }}>Nueva Notificación</h2>
                <button style={{
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: '#E1002D',
                    textTransform: 'uppercase',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer'
                }}>
                    Historial
                </button>
            </header>

            {/* Main Content */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '32rem', margin: '0 auto', paddingBottom: '6rem' }}>

                {/* Recipient Selection Section */}
                <section style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, padding: '1.5rem 1rem 1rem', color: '#111827' }}>¿A quién va dirigido?</h3>

                    {/* Tabs */}
                    <div style={{ padding: '0 1rem 1rem' }}>
                        <div style={{
                            display: 'flex',
                            padding: '0.25rem',
                            borderRadius: '0.75rem',
                            backgroundColor: '#f3f4f6',
                            border: '1px solid #e5e7eb',
                            overflowX: 'auto',
                            gap: '0.25rem'
                        }} className="no-scrollbar">
                            {['todos', 'grupos', 'equipo', 'individual'].map((type) => (
                                <label key={type} style={{ flex: 1, minWidth: '80px', cursor: 'pointer' }}>
                                    <input
                                        type="radio"
                                        name="recipient_type"
                                        value={type}
                                        checked={recipientType === type}
                                        onChange={() => setRecipientType(type as any)}
                                        style={{ display: 'none' }}
                                    />
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '0.5rem 0.75rem',
                                        borderRadius: '0.5rem',
                                        fontSize: '0.875rem',
                                        fontWeight: 500,
                                        textTransform: 'capitalize',
                                        transition: 'all 0.2s',
                                        backgroundColor: recipientType === type ? 'white' : 'transparent',
                                        color: recipientType === type ? '#E1002D' : '#6b7280',
                                        boxShadow: recipientType === type ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                                    }}>
                                        {type}
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Search */}
                    <div style={{ padding: '0 1rem 0.5rem' }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, display: 'flex', alignItems: 'center', paddingLeft: '0.75rem', pointerEvents: 'none' }}>
                                <span className="material-icons-round" style={{ color: '#9ca3af' }}>search</span>
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar grupo..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    padding: '0.75rem',
                                    paddingLeft: '2.5rem',
                                    fontSize: '0.875rem',
                                    borderRadius: '0.75rem',
                                    backgroundColor: '#f9fafb',
                                    border: '1px solid #e5e7eb',
                                    color: '#111827',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </div>

                    {/* Groups List */}
                    <div style={{ padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {/* Assigned Group */}
                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            backgroundColor: selectedGroups.includes(assignedGroup.id) ? '#fef2f2' : 'transparent', // Red tint if selected
                            transition: 'background-color 0.2s'
                        }}>
                            <span style={{ fontSize: '1rem', fontWeight: 500, color: '#374151' }}>
                                {assignedGroup.name}
                                <span style={{ fontSize: '0.75rem', color: '#E1002D', marginLeft: '0.5rem', fontWeight: 700 }}>(Asignado)</span>
                            </span>
                            <input
                                type="checkbox"
                                checked={selectedGroups.includes(assignedGroup.id)}
                                onChange={() => toggleGroup(assignedGroup.id)}
                                style={{ width: '1.25rem', height: '1.25rem', accentColor: '#E1002D' }}
                            />
                        </label>

                        {/* Other Groups (Disabled/Restricted logic simulator) */}
                        {otherGroups.map(group => (
                            <label key={group.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0.75rem',
                                borderRadius: '0.5rem',
                                cursor: 'not-allowed',
                                opacity: 0.6
                            }}>
                                <span style={{ fontSize: '1rem', fontWeight: 500, color: '#374151' }}>{group.name}</span>
                                <input
                                    type="checkbox"
                                    disabled
                                    style={{ width: '1.25rem', height: '1.25rem' }}
                                />
                            </label>
                        ))}
                    </div>

                    <div style={{ padding: '0.5rem 1.5rem' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#E1002D', textTransform: 'uppercase', letterSpacing: '0.025em' }}>
                            Seleccionado: aprox. {assignedGroup.memberCount} usuarios
                        </p>
                    </div>
                </section>

                <div style={{ height: '1px', backgroundColor: '#e5e7eb', margin: '1.5rem 1rem' }}></div>

                {/* Message Section */}
                <section style={{ display: 'flex', flexDirection: 'column', padding: '0 1rem', gap: '1.25rem' }}>

                    {/* Title Input */}
                    <div>
                        <label htmlFor="title" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#111827', textTransform: 'uppercase' }}>
                            Título de la notificación
                        </label>
                        <input
                            id="title"
                            type="text"
                            placeholder="Ej: Cambio de horario..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{
                                backgroundColor: '#f9fafb',
                                border: '1px solid #e5e7eb',
                                color: '#111827',
                                fontSize: '0.875rem',
                                borderRadius: '0.75rem',
                                width: '100%',
                                padding: '0.875rem',
                                outline: 'none'
                            }}
                        />
                    </div>

                    {/* Message Input */}
                    <div>
                        <label htmlFor="message" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#111827', textTransform: 'uppercase' }}>
                            Mensaje
                        </label>
                        <textarea
                            id="message"
                            rows={4}
                            placeholder="Escribe tu mensaje aquí..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            style={{
                                display: 'block',
                                width: '100%',
                                padding: '0.875rem',
                                fontSize: '0.875rem',
                                color: '#111827',
                                backgroundColor: '#f9fafb',
                                borderRadius: '0.75rem',
                                border: '1px solid #e5e7eb',
                                resize: 'none',
                                outline: 'none',
                                fontFamily: 'inherit'
                            }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{message.length}/140 carácteres</span>
                        </div>
                    </div>

                    {/* Priority Toggle */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1rem',
                        backgroundColor: '#f9fafb',
                        borderRadius: '0.75rem',
                        border: '1px solid #f3f4f6'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: '2.5rem', height: '2.5rem',
                                borderRadius: '50%',
                                backgroundColor: '#fee2e2',
                                color: '#dc2626'
                            }}>
                                <span className="material-icons-round">priority_high</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827' }}>ALTA PRIORIDAD</span>
                                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Notificar incluso si están en silencio</span>
                            </div>
                        </div>

                        <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={isHighPriority}
                                onChange={(e) => setIsHighPriority(e.target.checked)}
                            />
                            <div style={{
                                width: '2.75rem', height: '1.5rem',
                                backgroundColor: isHighPriority ? '#E1002D' : '#d1d5db',
                                borderRadius: '9999px',
                                position: 'relative',
                                transition: 'background-color 0.2s'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    top: '2px', left: '2px',
                                    backgroundColor: 'white',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '50%',
                                    height: '1.25rem', width: '1.25rem',
                                    transition: 'transform 0.2s',
                                    transform: isHighPriority ? 'translateX(1.25rem)' : 'translateX(0)'
                                }}></div>
                            </div>
                        </label>
                    </div>

                </section>
            </main>

            {/* Footer */}
            <footer style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                borderTop: '1px solid #e5e7eb',
                zIndex: 40,
                width: '100%',
                maxWidth: '32rem',
                margin: '0 auto'
            }}>
                <button
                    type="button"
                    style={{
                        width: '100%',
                        backgroundColor: '#E1002D',
                        color: 'white',
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.025em',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 10px 15px -3px rgba(225, 0, 45, 0.2)'
                    }}
                >
                    ENVIAR AHORA
                </button>
            </footer>

            {/* TODO: Implement backend logic for checking coach group assignment permissions */}
            {/* TODO: Implement API call to send push notification */}
        </div>
    );
};
