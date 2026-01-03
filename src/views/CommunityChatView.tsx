import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

interface Message {
    id: string;
    text: string;
    senderId: string;
    senderName: string;
    timestamp: Date;
    isMe: boolean;
    role?: 'coach' | 'admin' | 'user';
}

export const CommunityChatView: React.FC<{ onBack: () => void; forcedGroup?: string }> = ({ onBack, forcedGroup }) => {
    const { user, userData } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Use forcedGroup if provided (for coaches), otherwise fallback to user membership
    const userGroup = forcedGroup || (userData?.membership === 'box' ? 'ALMODOVAR BOX' : 'ALMODOVAR FIT');
    // Determine color based on group name if forced, or membership
    const isBox = userGroup.includes('BOX') || userData?.membership === 'box';
    const groupColor = isBox ? 'var(--color-text-main)' : 'var(--color-primary)';

    useEffect(() => {
        // Load mock messages initially
        const initialMessages: Message[] = [
            {
                id: '1',
                text: '¡Bienvenidos al grupo de la comunidad! 👋',
                senderId: 'admin',
                senderName: 'Coach Alex',
                timestamp: new Date(Date.now() - 86400000), // Yesterday
                isMe: false,
                role: 'coach'
            },
            {
                id: '2',
                text: '¿Alguien para entrenar mañana a las 10?',
                senderId: 'u1',
                senderName: 'María García',
                timestamp: new Date(Date.now() - 3600000 * 2), // 2 hours ago
                isMe: false,
                role: 'user'
            },
            {
                id: '3',
                text: 'Yo me apunto! 💪',
                senderId: 'u2',
                senderName: 'Carlos R.',
                timestamp: new Date(Date.now() - 3600000 * 1.5), // 1.5 hours ago
                isMe: false,
                role: 'user'
            }
        ];
        setMessages(initialMessages);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!inputText.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            senderId: user?.uid || 'me',
            senderName: userData?.firstName || 'Yo',
            timestamp: new Date(),
            isMe: true,
            role: 'user'
        };

        setMessages(prev => [...prev, newMessage]);
        setInputText('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--color-bg)' }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem',
                backgroundColor: 'var(--color-surface)',
                borderBottom: '1px solid var(--color-border)',
                gap: '1rem',
                position: 'sticky',
                top: 0,
                zIndex: 20
            }}>
                <button
                    onClick={onBack}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-text-main)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <span className="material-icons-round">arrow_back</span>
                </button>
                <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--color-text-main)' }}>{userGroup}</h2>
                    <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', margin: 0 }}>305 miembros</p>
                </div>
                <button style={{ background: 'none', border: 'none', color: 'var(--color-text-main)', cursor: 'pointer' }}>
                    <span className="material-icons-round">more_vert</span>
                </button>
            </div>

            {/* Messages Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }} className="hide-scrollbar">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        style={{
                            alignSelf: msg.isMe ? 'flex-end' : 'flex-start',
                            maxWidth: '75%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: msg.isMe ? 'flex-end' : 'flex-start'
                        }}
                    >
                        {!msg.isMe && (
                            <span style={{
                                fontSize: '0.75rem',
                                color: msg.role === 'coach' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                fontWeight: 700,
                                marginBottom: '0.2rem',
                                marginLeft: '0.5rem'
                            }}>
                                {msg.senderName} {msg.role === 'coach' && '⭐'}
                            </span>
                        )}
                        <div style={{
                            backgroundColor: msg.isMe ? 'var(--color-primary)' : 'var(--color-surface)',
                            color: msg.isMe ? 'white' : 'var(--color-text-main)',
                            padding: '0.75rem 1rem',
                            borderRadius: '1rem',
                            borderTopLeftRadius: !msg.isMe ? '0.25rem' : '1rem',
                            borderTopRightRadius: msg.isMe ? '0.25rem' : '1rem',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                            position: 'relative'
                        }}>
                            <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.4' }}>{msg.text}</p>
                            <span style={{
                                fontSize: '0.65rem',
                                opacity: 0.7,
                                display: 'block',
                                textAlign: 'right',
                                marginTop: '0.25rem',
                                marginBottom: '-0.25rem'
                            }}>
                                {formatTime(msg.timestamp)}
                            </span>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={{
                padding: '0.75rem 1rem 2rem 1rem', // Extra bottom padding for safe area
                backgroundColor: 'var(--color-surface)',
                borderTop: '1px solid var(--color-border)',
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'flex-end'
            }}>
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Escribe un mensaje..."
                    style={{
                        flex: 1,
                        backgroundColor: 'var(--color-bg)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '1.25rem',
                        padding: '0.75rem 1rem',
                        fontSize: '0.95rem',
                        color: 'var(--color-text-main)',
                        resize: 'none',
                        maxHeight: '100px',
                        minHeight: '44px',
                        outline: 'none',
                        fontFamily: 'inherit'
                    }}
                    rows={1}
                />
                <button
                    onClick={handleSend}
                    disabled={!inputText.trim()}
                    style={{
                        width: '2.75rem',
                        height: '2.75rem',
                        borderRadius: '50%',
                        backgroundColor: inputText.trim() ? 'var(--color-primary)' : 'var(--color-bg)',
                        color: inputText.trim() ? 'white' : 'var(--color-text-muted)',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: inputText.trim() ? 'pointer' : 'default',
                        transition: 'all 0.2s',
                        flexShrink: 0
                    }}
                >
                    <span className="material-icons-round">send</span>
                </button>
            </div>
        </div>
    );
};
