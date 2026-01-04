import React, { useState } from 'react';

interface AttendanceViewProps {
    classData: any;
    onBack: () => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({ classData, onBack }) => {
    // Mock Data for Attendees
    const [searchTerm, setSearchTerm] = useState('');
    const [attendees, setAttendees] = useState([
        { id: 1, name: 'María García', status: 'confirmed', type: 'Asistencia confirmada', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvcE-LuAafZrYoCM75hKZyJ5P2lByeeh-LxdKS9qcW9fKtrFOPoz7-skE3U83es3q0Yhc6ozuoau81RVYHCfaE4jDtCWKujBjN2QGEkQsiD1O0v1dAYVBcnZORiTKEGkiOlOjxcxp3ho0aZEbM4WEFkACXQdfsDXVxeP6IRfmyUUteKrpEsvvq2i9n7dzP00AqcFD4ssUqrg36HZj_I7dN0FqKrPJR8O0TBVVkXBC-vgDwFxMIeBeLlOw0Bxni2gjTWu1Ztg5btYQ', checked: true },
        { id: 2, name: 'Carlos Rodriguez', status: 'plan', type: 'Plan Mensual', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKeqQDR0BqL-_KY2wQeTUBwZoRae7Hsb6-J3cEbk-ZSdFuS1y-Xt8vRbQHB2e-xtK3IRSWOWBIF2MQS0G893blKSafp0T51VorkbVOo_bRILYhU5bcWogXfbGHcHBLzmMjuIAdBKmZf7vX5IOU_xTCWPWIGbWnPVSEthrCjFal8CSdZ3dHwfvecNoe2wxkXGIHLKOTaAQcmbGUkOF5BJC7f_5vQu3XpsGugAbk7hE-z4O_j2MqnF1iNDQ5vRd4ZpEUxz-FCYhJaxg', checked: false },
        { id: 3, name: 'Ana López', status: 'bono', type: 'Bono 10 Sesiones', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCktRyUtw3VWEg6B7hGJyE0Fm2FDypI7iDmGvMh4b5JMlW6Lhgm53aYtSiKBnxFxrpDTkhSu-TivwNUMm3wVf0lwX6G6DWke_JNtaYDdSln_y47vqYQRRX1v3iqOEOqhoVbj3aFXE6mxUaGoI-_zFpTWN853j1HChHxJaVPmlKWuUWLVJgiucTGS7b2hCQle-b862io62bSrGnb4h3TXcQ83VMyeKxb84Rzo9tZS7yvXH6A-KljfH0zsVEW7-FMpBEEIY8lxD0kmCQ', checked: false },
        { id: 4, name: 'Javier (Walk-in)', status: 'walk-in', type: 'Pago Pendiente', image: null, checked: true },
        { id: 5, name: 'Sofia O.', status: 'cancelled', type: 'Cancelado', image: null, checked: false },
    ]);

    const toggleAttendance = (id: number) => {
        setAttendees(attendees.map(att =>
            att.id === id && att.status !== 'cancelled' ? { ...att, checked: !att.checked } : att
        ));
    };

    const handleMarkAll = () => {
        setAttendees(attendees.map(att =>
            att.status !== 'cancelled' ? { ...att, checked: true } : att
        ));
    };

    const handleAddWalkIn = () => {
        const newId = Math.max(...attendees.map(a => a.id)) + 1;
        const newWalkIn = {
            id: newId,
            name: `Walk-in Guest ${newId}`,
            status: 'walk-in',
            type: 'Pago Pendiente',
            image: null,
            checked: true
        };
        setAttendees([...attendees, newWalkIn]);
    };

    const filteredAttendees = attendees.filter(a =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const presentCount = attendees.filter(a => a.checked).length;
    const totalCount = attendees.filter(a => a.status !== 'cancelled').length; // Assuming cancelled don't count towards capacity for this view

    return (
        <div style={{
            height: '100dvh',
            backgroundColor: 'var(--color-bg)',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '480px',
            zIndex: 3000, // Higher than detail view
            color: 'var(--color-text-main)',
        }}>
            {/* Header */}
            <header style={{
                position: 'fixed', top: 0, width: '100%', maxWidth: '480px',
                backgroundColor: 'rgba(var(--color-surface-rgb), 0.95)', backdropFilter: 'blur(12px)',
                borderBottom: '1px solid var(--color-border)', height: '4.5rem',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem', zIndex: 3010
            }}>
                <button onClick={onBack} style={{
                    background: 'none', border: 'none', padding: '0.5rem', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', cursor: 'pointer', marginLeft: '-0.5rem',
                    color: 'var(--color-text-muted)'
                }}>
                    <span className="material-icons-outlined" style={{ fontSize: '1.5rem' }}>arrow_back</span>
                </button>
                <div style={{ flex: 1, marginLeft: '0.5rem' }}>
                    <h1 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0, lineHeight: 1.2 }}>Asistencia</h1>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>{classData.title} - {classData.time.split(' - ')[0]}</p>
                </div>
                <div style={{
                    backgroundColor: 'var(--color-surface)', padding: '0.25rem 0.5rem', borderRadius: '0.375rem',
                    fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', border: '1px solid var(--color-border)'
                }}>
                    {presentCount}/{totalCount}
                </div>
            </header>

            {/* Main Content */}
            <main style={{
                flex: 1, overflowY: 'auto', paddingTop: '6rem', paddingBottom: '8rem', paddingLeft: '1.25rem', paddingRight: '1.25rem',
                scrollbarWidth: 'none'
            }} className="hide-scrollbar">

                {/* Stats Card */}
                <section style={{
                    backgroundColor: 'var(--color-surface)', borderRadius: '1rem', padding: '1rem',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid var(--color-border)', marginBottom: '1.5rem'
                }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{
                            height: '4rem', width: '4rem', backgroundColor: 'rgba(211, 0, 31, 0.1)', borderRadius: '0.75rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0
                        }}>
                            <span className="material-icons-round" style={{ fontSize: '1.875rem' }}>fitness_center</span>
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>{classData.title}</h2>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <span className="material-icons-outlined" style={{ fontSize: '1rem' }}>schedule</span>
                                    {classData.time}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <span className="material-icons-outlined" style={{ fontSize: '1rem' }}>location_on</span>
                                    Sala 1
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                            <span style={{ color: 'var(--color-text-muted)' }}>Confirmados</span>
                            <span style={{ color: 'var(--color-primary)' }}>{Math.round((presentCount / totalCount) * 100)}%</span>
                        </div>
                        <div style={{ height: '0.5rem', width: '100%', backgroundColor: 'var(--color-bg)', borderRadius: '9999px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${(presentCount / totalCount) * 100}%`, backgroundColor: 'var(--color-primary)', borderRadius: '9999px' }}></div>
                        </div>
                    </div>
                </section>

                {/* Walk-in Button */}
                <section style={{ marginBottom: '1.5rem' }}>
                    <button
                        onClick={handleAddWalkIn}
                        style={{
                            width: '100%', backgroundColor: 'var(--color-surface)',
                            border: '2px dashed rgba(211, 0, 31, 0.3)', borderRadius: '0.75rem', padding: '1rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                            cursor: 'pointer', transition: 'all 0.2s'
                        }}>
                        <div style={{
                            height: '2rem', width: '2rem', borderRadius: '50%', backgroundColor: 'var(--color-primary)',
                            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 4px 6px rgba(211, 0, 31, 0.3)'
                        }}>
                            <span className="material-icons-round" style={{ fontSize: '1.25rem' }}>add</span>
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <span style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)' }}>Registrar Walk-in</span>
                            <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>Añadir alumno sin reserva</span>
                        </div>
                    </button>
                </section>

                {/* Search */}
                <div style={{ position: 'relative', marginBottom: '1rem' }}>
                    <span className="material-icons-outlined" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', fontSize: '1.25rem' }}>search</span>
                    <input
                        type="text"
                        placeholder="Buscar alumno..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
                            borderRadius: '0.75rem', padding: '0.75rem 1rem 0.75rem 2.5rem', fontSize: '0.875rem',
                            outline: 'none', color: 'var(--color-text-main)'
                        }}
                    />
                </div>

                {/* List Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 0.25rem', marginBottom: '0.75rem' }}>
                    <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Listado de Inscritos</h3>
                    <button onClick={handleMarkAll} style={{ background: 'none', border: 'none', fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 700, cursor: 'pointer' }}>Marcar Todos</button>
                </div>

                {/* Attendees List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {filteredAttendees.map(attendee => (
                        <div key={attendee.id}
                            onClick={() => toggleAttendance(attendee.id)}
                            style={{
                                backgroundColor: attendee.status === 'walk-in' ? 'rgba(59, 130, 246, 0.05)' : 'var(--color-surface)',
                                padding: '0.75rem', borderRadius: '0.75rem',
                                border: attendee.status === 'walk-in' ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid var(--color-border)',
                                // Highlight check
                                boxShadow: attendee.checked ? '0 0 0 1px rgba(34, 197, 94, 0.3)' : 'none',
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                opacity: attendee.status === 'cancelled' ? 0.5 : 1,
                                cursor: 'pointer'
                            }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ position: 'relative' }}>
                                    {attendee.image ? (
                                        <img src={attendee.image} alt={attendee.name} style={{
                                            height: '2.5rem', width: '2.5rem', borderRadius: '50%', objectFit: 'cover',
                                            // border: attendee.checked ? '2px solid #22c55e' : 'none'
                                        }} />
                                    ) : (
                                        <div style={{
                                            height: '2.5rem', width: '2.5rem', borderRadius: '50%',
                                            backgroundColor: attendee.status === 'walk-in' ? 'rgba(59, 130, 246, 0.1)' : 'var(--color-bg)',
                                            color: attendee.status === 'walk-in' ? '#3b82f6' : 'var(--color-text-muted)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem'
                                        }}>
                                            {attendee.name.substring(0, 2).toUpperCase()}
                                        </div>
                                    )}
                                    {attendee.checked && (
                                        <span className="material-icons-round" style={{
                                            position: 'absolute', bottom: '-0.1rem', right: '-0.1rem', fontSize: '0.75rem',
                                            backgroundColor: '#22c55e', color: 'white', borderRadius: '50%', padding: '0.1rem',
                                            border: '1px solid var(--color-surface)'
                                        }}>check</span>
                                    )}
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '0.875rem', fontWeight: 700, margin: 0, color: 'var(--color-text-main)' }}>{attendee.name}</h4>
                                    <p style={{
                                        fontSize: '0.75rem', margin: 0,
                                        color: attendee.status === 'confirmed' ? '#16a34a' : (attendee.status === 'walk-in' ? '#2563eb' : 'var(--color-text-muted)'),
                                        fontWeight: 500
                                    }}>{attendee.type}</p>
                                </div>
                            </div>

                            <button style={{
                                height: '2rem', width: '2rem', borderRadius: '50%',
                                backgroundColor: attendee.checked ? '#dcfce7' : (attendee.status === 'cancelled' ? 'rgba(239, 68, 68, 0.1)' : 'transparent'),
                                color: attendee.checked ? '#16a34a' : (attendee.status === 'cancelled' ? '#ef4444' : 'transparent'),
                                border: !attendee.checked && attendee.status !== 'cancelled' ? '2px solid var(--color-border)' : 'none',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
                            }}>
                                <span className="material-icons-round" style={{ fontSize: '1.25rem' }}>
                                    {attendee.status === 'cancelled' ? 'block' : 'check'}
                                </span>
                            </button>
                        </div>
                    ))}
                </div>

            </main>

            {/* Footer Actions */}
            <div style={{
                position: 'fixed', bottom: 0, width: '100%', maxWidth: '480px',
                backgroundColor: 'var(--color-surface)', borderTop: '1px solid var(--color-border)',
                padding: '1rem', paddingBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem',
                boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.05)', zIndex: 3010
            }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Total Presentes</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
                        {presentCount} <span style={{ fontSize: '0.875rem', fontWeight: 400, color: 'var(--color-text-muted)' }}>/ {totalCount}</span>
                    </span>
                </div>
                <button
                    onClick={onBack}
                    style={{
                        flex: 1, backgroundColor: 'var(--color-primary)', color: 'white',
                        border: 'none', borderRadius: '0.75rem', padding: '0.875rem',
                        fontWeight: 700, fontSize: '1rem', boxShadow: '0 4px 12px rgba(211, 0, 31, 0.3)',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                    }}>
                    <span className="material-icons-round">save</span>
                    Confirmar
                </button>
            </div>
        </div>
    );
};
