import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';

export const NotificationsView: React.FC = () => {
    // Local state to simulate read/unread messages
    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        // Real-time listener from Firestore
        const q = query(
            collection(db, 'notifications'),
            orderBy('id', 'desc'), // Assuming 'id' is timestamp-based number, or use 'timestamp' field
            limit(50)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const loadedMessages: any[] = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                loadedMessages.push({
                    id: data.id || doc.id,
                    sender: data.sender || 'Sistema',
                    time: data.time || '',
                    title: data.title,
                    preview: data.preview || data.message,
                    type: data.type || 'campaign',
                    color: data.color || 'blue',
                    unread: data.unread !== undefined ? data.unread : true, // Default to true if missing
                    section: data.section || 'Hoy',
                    // ... add other fields needed
                });
            });
            // Merge with simple mocks if database is empty? OR just rely on DB?
            // If DB is empty, user sees nothing.
            // We can keep the mocks if DB is empty for demo purposes?
            // Use mocks combined with DB logic?
            // Let's rely on DB + mocks hardcoded as fallback if empty might be confusing.
            // I'll append the mocks at the END if they are not in DB.
            // Actually, simplest is just show DB. But to keep the "demo" feeling with "Coach Alex",
            // I will prepend the DB messages to the hardcoded mocks as a 'base'.

            const initialMock = [
                {
                    id: 1,
                    sender: 'Coach Alex',
                    time: '10:30 AM',
                    title: '¡Plan de nutrición actualizado!',
                    preview: 'Hola, he revisado tus progresos de la semana y he ajustado los macros en tu plan de comidas para maximizar tu rendimiento...',
                    type: 'person',
                    color: 'blue',
                    unread: true,
                    section: 'Hoy'
                },
                {
                    id: 2,
                    sender: 'Recordatorio de Clase',
                    time: '09:00 AM',
                    title: 'Tu clase comienza en 1 hora',
                    preview: 'No olvides tu toalla y botella de agua para la sesión de HIIT de las 10:00 AM.',
                    type: 'notifications_active',
                    color: 'brand-red', // Custom red
                    unread: true,
                    section: 'Hoy'
                },
                {
                    id: 3,
                    sender: 'Promo Suplementos',
                    time: '16:45 PM',
                    title: 'Promo Suplementos',
                    preview: 'Solo por esta semana, disfruta de un 20% de descuento en toda la gama de proteínas veganas. ¡Aprovecha ahora!',
                    type: 'local_offer',
                    color: 'purple',
                    unread: false,
                    section: 'Ayer'
                },
                {
                    id: 4,
                    sender: 'Mantenimiento Sauna',
                    time: '11:20 AM',
                    title: 'Mantenimiento Sauna',
                    preview: 'Informamos que la sauna masculina estará fuera de servicio por mantenimiento rutinario el día de mañana.',
                    type: 'campaign',
                    color: 'gray',
                    unread: false,
                    section: 'Ayer'
                }
            ];
            setMessages([...loadedMessages, ...initialMock]);
        }, (error) => {
            console.error("Error listening to notifications:", error);
        });

        return () => unsubscribe();
    }, []);

    const unreadCount = messages.filter(m => m.unread).length;

    const markAllAsRead = () => {
        setMessages(prev => prev.map(msg => ({ ...msg, unread: false })));
    };

    const markAsRead = (id: number) => {
        setMessages(prev => prev.map(msg => msg.id === id ? { ...msg, unread: false } : msg));
    };

    // Helper to get colors based on type
    const getIconStyles = (color: string) => {
        switch (color) {
            case 'blue':
                return { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6', border: 'rgba(59, 130, 246, 0.2)' };
            case 'brand-red':
                return { bg: 'rgba(211, 0, 31, 0.1)', text: 'var(--color-primary)', border: 'rgba(211, 0, 31, 0.2)' };
            case 'purple':
                return { bg: 'rgba(147, 51, 234, 0.1)', text: '#9333ea', border: 'rgba(147, 51, 234, 0.2)' };
            default:
                return { bg: 'var(--color-bg)', text: 'var(--color-text-muted)', border: 'var(--color-border)' };
        }
    };

    const renderSection = (sectionName: string, msgs: typeof messages) => {
        if (msgs.length === 0) return null;

        return (
            <section style={{ marginBottom: '2rem' }}>
                <h4 style={{
                    paddingLeft: '0.5rem',
                    marginBottom: '0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--color-text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                }}>{sectionName}</h4>

                <div style={{
                    backgroundColor: 'var(--color-surface)',
                    borderRadius: 'var(--radius-xl)',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)',
                    border: '1px solid var(--color-border)'
                }}>
                    {msgs.map((msg, index) => {
                        const styles = getIconStyles(msg.color);
                        return (
                            <div
                                key={msg.id}
                                onClick={() => markAsRead(msg.id)}
                                style={{
                                    padding: '1rem',
                                    position: 'relative',
                                    cursor: 'pointer',
                                    borderBottom: index !== msgs.length - 1 ? '1px solid var(--color-border)' : 'none',
                                    opacity: msg.unread ? 1 : 0.9,
                                    backgroundColor: msg.unread ? 'rgba(211, 0, 31, 0.02)' : 'transparent'
                                }}
                            >
                                {msg.unread && (
                                    <div style={{
                                        position: 'absolute',
                                        left: 0,
                                        top: 0,
                                        bottom: 0,
                                        width: '4px',
                                        backgroundColor: 'var(--color-primary)'
                                    }}></div>
                                )}
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '2.75rem',
                                        height: '2.75rem',
                                        borderRadius: '50%',
                                        backgroundColor: styles.bg,
                                        color: styles.text,
                                        border: `1px solid ${styles.border}`,
                                        flexShrink: 0
                                    }}>
                                        <span className="material-icons-round" style={{ fontSize: '1.25rem' }}>{msg.type}</span>
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.125rem' }}>
                                            <h5 style={{
                                                color: 'var(--color-text-main)',
                                                fontWeight: msg.unread ? 800 : 700,
                                                fontSize: '0.875rem',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                paddingRight: '0.5rem'
                                            }}>
                                                {msg.sender}
                                            </h5>
                                            <span style={{
                                                color: msg.unread ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                                fontSize: '0.75rem',
                                                fontWeight: msg.unread ? 700 : 400,
                                                flexShrink: 0
                                            }}>
                                                {msg.time}
                                            </span>
                                        </div>
                                        <p style={{ color: 'var(--color-text-main)', fontWeight: 500, fontSize: '0.75rem', marginBottom: '0.25rem' }}>{msg.title}</p>
                                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {msg.preview}
                                        </p>
                                    </div>
                                    <div style={{ alignSelf: 'center' }}>
                                        <span className="material-icons-round" style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>chevron_right</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        );
    };

    return (
        <div className="section-padding" style={{ paddingTop: '1.5rem', paddingBottom: '6rem' }}>
            <div className="flex justify-between items-end mb-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', paddingLeft: '0.25rem', paddingRight: '0.25rem' }}>
                <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '0.25rem' }}>Mis Mensajes</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                        Tienes <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{unreadCount} nuevos</span> mensajes.
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: 'var(--color-primary)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.025em',
                            marginBottom: '0.25rem',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        Marcar todo leído
                    </button>
                )}
            </div>

            {renderSection('Hoy', messages.filter(m => m.section === 'Hoy'))}
            {renderSection('Ayer', messages.filter(m => m.section === 'Ayer'))}
        </div>
    );
};
