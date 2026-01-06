import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

interface Group {
    id: string;
    name: string;
    type: 'box' | 'fit';
    weeklyLimit: number;
}

export const AdminGroupsView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentGroup, setCurrentGroup] = useState<Partial<Group>>({ name: '', type: 'box', weeklyLimit: 3 });
    const [filterQuery, setFilterQuery] = useState('');

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

    // Images for cards (Using user provided placeholders)
    const BOX_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuAY4LkhvU1YFse9KTIojtjuha8sVuUSIKmZ8SLV0JObgp09gICiHNTz9Ii1fNOB8--U5mUPENxfXLJMabdm3VmL_omvSND1VsT05WDULPYku0peLPoZTfBcNV5gC_3THC4_ZR12ftCupbF9QaLrkbAcvduADcqBAsPqtXpXAPTHW4uo3z0FkCBpa0qBJsnfP8ou3OciY9cEO1sx4uV3GvcqTkkmBopUhWCXzn-a94tfqmIrHIkryIa3AhTN5I_I6yFSL3DcSo6l21o";
    const FIT_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuBmewcvnS3K_zG-t6SrOg3T3i25c1Cco_kjzQ1rSEpnnCmau3VPf4uK-qkwCfGhyjepCmJb3jMiw5W8cpun_XEaUfa-nRkKoE-qZ7abuEbAMR0A3U8pnZCdCEwqKvBaAuHXXS7rn9bfkOcd3H1x1YTpi1S9VhXWjqUTDF6YSP2yufxzEuSjr3hb8lNRoT3PEl91DiDjaEdCN4ioXJZ8wvJVXnVIm-2uD486DGPbJCjFWAxkvyluBVyQROYmqLOrjInVBK4UTcHE2TU";

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const q = query(collection(db, 'groups'), orderBy('name'));
            const snapshot = await getDocs(q);
            const loaded: Group[] = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Group));
            setGroups(loaded);
        } catch (e) {
            console.error(e);
            showToast("Error al cargar grupos", 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!currentGroup.name || !currentGroup.weeklyLimit) {
            showToast("Completa los campos obligatorios", 'error');
            return;
        }

        try {
            setLoading(true);
            const data = {
                name: currentGroup.name,
                type: currentGroup.type || 'box',
                weeklyLimit: Number(currentGroup.weeklyLimit)
            };

            if (currentGroup.id) {
                await updateDoc(doc(db, 'groups', currentGroup.id), data);
                showToast("Grupo actualizado", 'success');
            } else {
                await addDoc(collection(db, 'groups'), data);
                showToast("Grupo creado", 'success');
            }
            setIsEditing(false);
            setCurrentGroup({ name: '', type: 'box', weeklyLimit: 3 });
            fetchGroups();
        } catch (e) {
            showToast("Error al guardar grupo", 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("¿Borrar grupo?")) return;
        try {
            await deleteDoc(doc(db, 'groups', id));
            showToast("Grupo eliminado", 'success');
            fetchGroups();
        } catch (error) {
            showToast("Error al eliminar", 'error');
        }
    };

    const filteredGroups = groups.filter(g => g.name.toLowerCase().includes(filterQuery.toLowerCase()));

    // Helpers for Design
    const getGroupSubtitle = (type: string) => type === 'box' ? 'Entrenamiento Funcional' : 'Fitness & Salud';
    const getGroupDescription = (type: string) => type === 'box' ? 'Alta intensidad, levantamiento de pesas y gimnasia.' : 'Clases dirigidas, cardio, mantenimiento y tonificación.';

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#12141C', // Dark BG
            display: 'flex',
            justifyContent: 'center',
            fontFamily: "'Montserrat', sans-serif"
        }}>
            <div style={{
                width: '100%',
                maxWidth: '480px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#12141C',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Header */}
                <header style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 50,
                    backgroundColor: 'rgba(30, 33, 43, 0.95)', // Dark Surface / 95
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid rgba(42, 45, 58, 0.5)',
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexShrink: 0
                }}>
                    <button onClick={onBack} style={{
                        width: '2.5rem', height: '2.5rem', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', backgroundColor: 'transparent', border: 'none', cursor: 'pointer'
                    }}>
                        <span className="material-icons-round" style={{ fontSize: '24px' }}>arrow_back</span>
                    </button>
                    <h2 style={{
                        fontSize: '1.125rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: 'white',
                        textAlign: 'center',
                        flex: 1
                    }}>
                        Gestión de Grupos
                    </h2>
                    <div style={{ width: '2.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <div style={{
                            width: '2.5rem', height: '2.5rem', borderRadius: '50%',
                            border: '2px solid #E30031', padding: '2px', overflow: 'hidden'
                        }}>
                            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAd01bjAYpy7bJvk9wdc3SdJ0FnGWkfipgGvydD9SmZhXrwCzOOgBCV-n170DCUF5TgZROm4iJ15xtm9CzxTlKWLeeJsAUJirjjrVIxzIm_9IOQk_IFwHnQ2ZMg0apNfXi1uJGiaSnFtcGhrjMhs4TuoxwZtJGuvtxpaOcMSNDw1j8maTJpI8yW6sB1DtY9EJXqVKe0A65Dp0UA2A3UOqW84EFbJWZph3Rt90CjV2ulG_IJHdr_n6t2ufxO7mBn2H6ICqOTO_Pdzxo"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} alt="Profile" />
                        </div>
                    </div>
                </header>

                <main style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '1.5rem 1rem 6rem 1rem', // padding bottom for nav
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem'
                }} className="hide-scrollbar">
                    <style>{`
                        .hide-scrollbar::-webkit-scrollbar { display: none; }
                        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                    `}</style>

                    {/* Search & Actions */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <span className="material-icons-round" style={{
                                position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                                color: '#6B7280', fontSize: '1.25rem'
                            }}>search</span>
                            <input
                                value={filterQuery}
                                onChange={(e) => setFilterQuery(e.target.value)}
                                placeholder="Buscar grupo..."
                                style={{
                                    width: '100%', backgroundColor: '#1E212B', border: 'none',
                                    borderRadius: '0.75rem', padding: '0.75rem 1rem 0.75rem 2.5rem',
                                    color: 'white', fontSize: '0.875rem', fontWeight: 500, outline: 'none',
                                    boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.4)'
                                }}
                            />
                        </div>
                        <button style={{
                            backgroundColor: '#2A2D3A', color: 'white', borderRadius: '0.75rem',
                            padding: '0 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.4)'
                        }}>
                            <span className="material-icons-round" style={{ fontSize: '1.25rem' }}>tune</span>
                        </button>
                    </div>

                    <button onClick={() => { setCurrentGroup({ name: '', type: 'box', weeklyLimit: 3 }); setIsEditing(true); }}
                        style={{
                            width: '100%', backgroundColor: '#E30031', color: 'white',
                            padding: '1rem', borderRadius: '0.75rem', border: 'none',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                            fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase',
                            boxShadow: '0 10px 15px -3px rgba(227, 0, 49, 0.2)', cursor: 'pointer'
                        }}
                    >
                        <span className="material-icons-round">group_add</span>
                        Crear Nuevo Grupo
                    </button>

                    {/* Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div style={{
                            backgroundColor: '#1E212B', padding: '1rem', borderRadius: '0.75rem',
                            border: '1px solid #2A2D3A', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.4)'
                        }}>
                            <div>
                                <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>{groups.length}</span>
                                <span style={{ fontSize: '0.625rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Grupos Activos</span>
                            </div>
                            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#60A5FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span className="material-icons-round">layers</span>
                            </div>
                        </div>
                        <div style={{
                            backgroundColor: '#1E212B', padding: '1rem', borderRadius: '0.75rem',
                            border: '1px solid #2A2D3A', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.4)'
                        }}>
                            <div>
                                <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>--</span>
                                <span style={{ fontSize: '0.625rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Miembros Totales</span>
                            </div>
                            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#4ADE80', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span className="material-icons-round">group</span>
                            </div>
                        </div>
                    </div>

                    {/* Groups List */}
                    <div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'white', textTransform: 'uppercase', marginBottom: '0.75rem', paddingLeft: '0.25rem' }}>Mis Grupos de Trabajo</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {loading ? (
                                <div style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF' }}>Cargando...</div>
                            ) : filteredGroups.map(g => (
                                <div key={g.id} style={{
                                    backgroundColor: '#1E212B', padding: '1rem', borderRadius: '1rem',
                                    border: '1px solid #2A2D3A', transition: 'border-color 0.2s',
                                    boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.4)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                        <img
                                            src={g.type === 'box' ? BOX_IMG : FIT_IMG}
                                            alt={g.name}
                                            style={{ width: '4rem', height: '4rem', borderRadius: '0.75rem', objectFit: 'cover', border: '2px solid #1E212B' }}
                                        />
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <div>
                                                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.name}</h4>
                                                    <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#E30031', marginBottom: '0.25rem' }}>{getGroupSubtitle(g.type)}</p>
                                                </div>
                                                <button style={{ background: 'transparent', border: 'none', color: '#6B7280', padding: '0.25rem' }}>
                                                    <span className="material-icons-round">more_vert</span>
                                                </button>
                                            </div>
                                            <p style={{ fontSize: '0.6875rem', color: '#9CA3AF', lineHeight: '1.25', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {getGroupDescription(g.type)}
                                            </p>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem', marginBottom: '1rem' }}>
                                        <span style={{ backgroundColor: '#2A2D3A', color: '#D1D5DB', fontSize: '0.625rem', fontWeight: 700, padding: '0.25rem 0.5rem', borderRadius: '0.375rem', textTransform: 'uppercase' }}>
                                            {g.weeklyLimit} clases/sem
                                        </span>
                                    </div>

                                    <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #2A2D3A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ display: 'flex', marginLeft: '0.5rem' }}>
                                                <div style={{ width: '1.5rem', height: '1.5rem', borderRadius: '50%', backgroundColor: '#374151', border: '2px solid #1E212B', marginLeft: '-0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', color: 'white', fontWeight: 700 }}>+99</div>
                                            </div>
                                            <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 500 }}>Miembros</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button style={{
                                                height: '2rem', padding: '0 0.75rem', borderRadius: '9999px', backgroundColor: '#2A2D3A',
                                                color: '#D1D5DB', display: 'flex', alignItems: 'center', gap: '0.25rem', border: 'none',
                                                fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer'
                                            }}>
                                                <span className="material-icons-round" style={{ fontSize: '16px' }}>person_add</span>
                                                Asignar
                                            </button>
                                            <button onClick={() => { setCurrentGroup(g); setIsEditing(true); }} style={{
                                                width: '2rem', height: '2rem', borderRadius: '50%', backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                                color: '#60A5FA', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer'
                                            }}>
                                                <span className="material-icons-round" style={{ fontSize: '16px' }}>edit</span>
                                            </button>
                                            <button onClick={() => handleDelete(g.id)} style={{
                                                width: '2rem', height: '2rem', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                                color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer'
                                            }}>
                                                <span className="material-icons-round" style={{ fontSize: '16px' }}>delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>

                {/* Bottom Nav Mockup */}
                <nav style={{
                    position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#1E212B',
                    borderTop: '1px solid #2A2D3A', padding: '0.5rem 1.5rem 1.5rem 1.5rem', zIndex: 40
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', color: '#E30031' }}>
                            <span className="material-icons-round" style={{ fontSize: '28px' }}>grid_view</span>
                            <span style={{ fontSize: '0.625rem', fontWeight: 700 }}>Panel</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', color: '#6B7280' }}>
                            <span className="material-icons-round" style={{ fontSize: '28px' }}>calendar_today</span>
                            <span style={{ fontSize: '0.625rem', fontWeight: 500 }}>Agenda</span>
                        </div>
                        <div style={{ position: 'relative', top: '-1.5rem' }}>
                            <button onClick={() => { setCurrentGroup({ name: '', type: 'box', weeklyLimit: 3 }); setIsEditing(true); }}
                                style={{
                                    width: '3.5rem', height: '3.5rem', borderRadius: '50%', backgroundColor: '#E30031', color: 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none',
                                    boxShadow: '0 8px 20px rgba(227, 0, 49, 0.4)', cursor: 'pointer'
                                }}>
                                <span className="material-icons-round" style={{ fontSize: '28px' }}>add</span>
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', color: '#6B7280' }}>
                            <span className="material-icons-round" style={{ fontSize: '28px' }}>chat</span>
                            <span style={{ fontSize: '0.625rem', fontWeight: 500 }}>Chat</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', color: '#6B7280' }}>
                            <span className="material-icons-round" style={{ fontSize: '28px' }}>person</span>
                            <span style={{ fontSize: '0.625rem', fontWeight: 500 }}>Perfil</span>
                        </div>
                    </div>
                </nav>
            </div>

            {/* Modal */}
            {isEditing && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '1rem', backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(4px)'
                }}>
                    <div style={{
                        width: '100%', maxWidth: '24rem', backgroundColor: '#1E212B', borderRadius: '1.5rem',
                        border: '1px solid #2A2D3A', overflow: 'hidden', display: 'flex', flexDirection: 'column',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #2A2D3A' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', margin: 0 }}>
                                {currentGroup.id ? 'Editar Grupo' : 'Nuevo Grupo'}
                            </h3>
                        </div>
                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '0.25rem' }}>Nombre</label>
                                <input
                                    value={currentGroup.name}
                                    onChange={e => setCurrentGroup({ ...currentGroup, name: e.target.value })}
                                    style={{ width: '100%', backgroundColor: '#12141C', border: '1px solid #2A2D3A', borderRadius: '0.75rem', padding: '0.75rem 1rem', color: 'white', outline: 'none' }}
                                    placeholder="Ej: Crossfit Mañanas"
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '0.25rem' }}>Tipo</label>
                                    <select
                                        value={currentGroup.type}
                                        onChange={e => setCurrentGroup({ ...currentGroup, type: e.target.value as any })}
                                        style={{ width: '100%', backgroundColor: '#12141C', border: '1px solid #2A2D3A', borderRadius: '0.75rem', padding: '0.75rem 1rem', color: 'white', outline: 'none' }}
                                    >
                                        <option value="box">BOX</option>
                                        <option value="fit">FIT</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '0.25rem' }}>Límite Semanal</label>
                                    <input
                                        type="number"
                                        value={currentGroup.weeklyLimit}
                                        onChange={e => setCurrentGroup({ ...currentGroup, weeklyLimit: Number(e.target.value) })}
                                        style={{ width: '100%', backgroundColor: '#12141C', border: '1px solid #2A2D3A', borderRadius: '0.75rem', padding: '0.75rem 1rem', color: 'white', outline: 'none' }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div style={{ padding: '1.5rem', borderTop: '1px solid #2A2D3A', backgroundColor: '#1E212B', display: 'flex', gap: '0.75rem' }}>
                            <button onClick={() => setIsEditing(false)} style={{ flex: 1, padding: '1rem', borderRadius: '0.75rem', border: 'none', backgroundColor: '#12141C', color: '#9CA3AF', fontWeight: 700, cursor: 'pointer' }}>
                                Cancelar
                            </button>
                            <button onClick={handleSave} style={{ flex: 1, padding: '1rem', borderRadius: '0.75rem', border: 'none', backgroundColor: '#E30031', color: 'white', fontWeight: 700, cursor: 'pointer' }}>
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast.visible && (
                <div style={{
                    position: 'fixed', bottom: '6rem', left: '50%', transform: 'translateX(-50%)',
                    backgroundColor: toast.type === 'success' ? '#22c55e' : '#ef4444',
                    color: 'white', padding: '0.75rem 1.5rem', borderRadius: '2rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '0.5rem', zIndex: 100
                }}>
                    <span className="material-icons-round">{toast.type === 'success' ? 'check_circle' : 'error'}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{toast.message}</span>
                </div>
            )}
        </div>
    );
};
