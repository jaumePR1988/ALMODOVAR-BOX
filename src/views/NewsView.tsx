import React, { useState } from 'react';

export const NewsView: React.FC = () => {
    const [filter, setFilter] = useState('Todo');

    // Simple state for demonstration of "Like" functionality
    const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

    const toggleLike = (postId: string) => {
        setLikedPosts(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    return (
        <div style={{ paddingBottom: '6rem' }}>
            {/* Header Sticky */}
            <header style={{
                position: 'sticky',
                top: 0,
                zIndex: 50,
                backgroundColor: 'rgba(var(--color-surface-rgb), 0.95)',
                background: 'var(--color-bg)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                padding: '1rem 0'
            }}>
                <div style={{ padding: '0 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Anuncios</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button style={{ position: 'relative', padding: '0.5rem', background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                            <span className="material-icons-round">notifications</span>
                            <span style={{ position: 'absolute', top: '8px', right: '8px', width: '10px', height: '10px', backgroundColor: 'var(--color-primary)', borderRadius: '50%', border: '2px solid var(--color-bg)' }}></span>
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="hide-scrollbar" style={{ display: 'flex', padding: '0 1rem', gap: '1.5rem', overflowX: 'auto', borderBottom: '1px solid var(--color-border)' }}>
                    {['Todo', 'Noticias', 'Entrenadores', 'Galería'].map((item) => (
                        <button
                            key={item}
                            onClick={() => setFilter(item)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                paddingBottom: '0.75rem',
                                borderBottom: `2px solid ${filter === item ? 'var(--color-primary)' : 'transparent'}`,
                                color: filter === item ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                fontWeight: filter === item ? 700 : 500,
                                fontSize: '0.875rem',
                                whiteSpace: 'nowrap',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </header>

            <main style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Featured Section */}
                <section style={{ position: 'relative', borderRadius: 'var(--radius-xl)', overflow: 'hidden', height: '16rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)', zIndex: 10 }}></div>
                    <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDi-1QtAa087puyvW-MUKIfuW6cF_-usrk4tySSW4pBmL62eCX_2NqgL7tg5IrP3a5j6Zarzu6UI4g6Qt-wuGIuNA797RCcIFEUGqsrf2FEqlvHx8JmMRoYDfdYIVDH-rETEz8X4naFnfSLsKytzC8I8XEcvfbW6mU4k2IFsGO0CDrJH1lQKk_QTaB8fK3qRkfAzU0Ig44HeDJymlCRiZXNcgwXLRqGnShvDwZp7z3hykhDq-1UDsQwMWE5aOoWsxYRPgKEtRzJMCc"
                        alt="News"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '1.25rem', zIndex: 20, width: '100%' }}>
                        <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', backgroundColor: 'var(--color-primary)', color: 'white', fontSize: '0.75rem', fontWeight: 700, borderRadius: '9999px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Destacado</span>
                        <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem', lineHeight: 1.2 }}>¡Nuevo Horario de Open Box!</h2>
                        <p style={{ color: '#E5E7EB', fontSize: '0.875rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>Hemos ampliado las horas para que puedas entrenar a tu ritmo. Revisa los nuevos slots disponibles en la app.</p>
                    </div>
                </section>

                {/* Important Alert */}
                <section>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-main)' }}>Importante</h3>
                    <div style={{ backgroundColor: 'var(--color-surface)', borderLeft: '4px solid var(--color-primary)', borderRadius: 'var(--radius-default)', padding: '1rem', display: 'flex', gap: '1rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ padding: '0.5rem', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.1)', height: 'min-content' }}>
                            <span className="material-icons-round" style={{ color: 'var(--color-primary)', fontSize: '1.25rem' }}>warning</span>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text-main)', margin: 0 }}>Mantenimiento de Instalaciones</h4>
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Hoy, 10:00</span>
                            </div>
                            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>La zona de duchas estará cerrada por mantenimiento este viernes de 14:00 a 16:00.</p>
                        </div>
                    </div>
                </section>

                {/* Recent News */}
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text-main)' }}>Reciente</h3>
                        <button style={{ color: 'var(--color-primary)', fontSize: '0.875rem', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>Ver todo</button>
                    </div>

                    {/* Post 1 */}
                    <article style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', marginBottom: '1.5rem', border: '1px solid var(--color-border)' }}>
                        <div style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5ENcPkmTRelTMfsc6M5y7GSEqZm1TjY-tXusawPX01v0EY_Wl9ubjayugEeK0pgO_XxvJbAkJzzfuYrn-BnBCnlYEl1AwqPyFsKwA1Gje59x63QX4MJRiH9LzqVBrCzoB7zVKlPXquVmIlLbttCMu5LlIfj-LzC2tAo-i-Bv-Eb8wT9NT-1FzWay1qEUWjkt6lB-AuVO4pCCsy01paV6W6lcHJrsL87Zkq8ltrmqPpHzcMNG8gMcFZNQb41t6nkuIuFiAgGYuUk0" alt="Coach" style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', objectFit: 'cover' }} />
                            <div>
                                <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-main)', margin: 0 }}>Jesús (Coach)</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>Hace 2 horas • Fit Boxing WOD</p>
                            </div>
                        </div>
                        <div style={{ padding: '0 1rem 0.75rem 1rem' }}>
                            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', lineHeight: 1.6 }}>¡Gran energía en la clase de hoy equipo! 💪 Aquí les dejo algunos momentos del entrenamiento de fuerza funcional. Recuerden hidratarse bien.</p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', marginBottom: '0.75rem' }}>
                            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqe0RNOFsCxhXQ3llglXLpiGHl848jGrRErkqshop3ZeExXQ50xk9zqoMpe4vD1w1BgX7-7O7YT9Uk7Z81-dauwlDe1XkQYTjdMAjbqdwSugIB_qGSFG0_mVOIUKOGP4XUAF11SVplDqV9NnvMgzOW8gVdN2VjooTK3vHMAxHTNFSbWZmAVoAw4LmxPpwYJtqPMLfCdWKSN6X9hZAZjYnWZ90mNHMc7QXOxjFe6NJXub10A7tFXZLjvsKeTiXBzoaig_K-wYIR728" alt="Training 1" style={{ width: '100%', height: '10rem', objectFit: 'cover' }} />
                            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAggX8YnSDjqPbwzs4gaCx_S3oElOY1x0wDDHTpNGWk1OhqT9V42dy7myXK4gxDWdFeZWTWZFYlvUvpn1lRYAsF2NMNaGJS60fSpyE_AcZufxapOVHjpc3pR_efpuwMKCz48wJQ0hwf7f--yTEinzlNX_Wl6fh7x7teUVbeyqO6EhbtqdrscmFdOgtHAYLrX2V9p4syRWUyi-VPoTnnZnZ4I6yu5-PYqmBUWZf1LWd_VayXkxtg5_de9-2i2drbXfPfCw9zzALrm4Y" alt="Training 2" style={{ width: '100%', height: '10rem', objectFit: 'cover' }} />
                        </div>
                        <div style={{ padding: '0 1rem 1rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    onClick={() => toggleLike('post1')}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                        background: 'none',
                                        border: 'none',
                                        color: likedPosts['post1'] ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <span className={`material-icons-round`} style={{ fontSize: '1.25rem' }}>
                                        {likedPosts['post1'] ? 'favorite' : 'favorite_border'}
                                    </span>
                                    <span style={{ fontSize: '0.875rem' }}>{likedPosts['post1'] ? 25 : 24}</span>
                                </button>
                                <button style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                                    <span className="material-icons-round" style={{ fontSize: '1.25rem' }}>chat_bubble_outline</span>
                                    <span style={{ fontSize: '0.875rem' }}>Comentar</span>
                                </button>
                            </div>
                            <button style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                                <span className="material-icons-round" style={{ fontSize: '1.25rem' }}>share</span>
                            </button>
                        </div>
                    </article>

                    {/* Post 2 (Admin) */}
                    <article style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', padding: '1.25rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', position: 'relative', overflow: 'hidden', border: '1px solid var(--color-border)', marginBottom: '1.5rem' }}>
                        <div style={{ position: 'absolute', top: '0', right: '0', padding: '1rem', opacity: 0.05, pointerEvents: 'none' }}>
                            <span className="material-icons-round" style={{ fontSize: '5rem', color: 'var(--color-primary)' }}>campaign</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                            <div style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', backgroundColor: 'var(--color-secondary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>AG</span>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-main)', margin: 0 }}>Administración</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>Ayer • General</p>
                            </div>
                        </div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>Recordatorio: Renovación de Cuotas</h4>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>Recuerda que el plazo para la renovación de cuotas mensuales finaliza el día 5. Puedes realizar el pago directamente desde la sección "Mi Cuenta".</p>
                        <button style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-primary)', fontSize: '0.875rem', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
                            Ir a Pagos <span className="material-icons-round" style={{ fontSize: '1rem' }}>arrow_forward</span>
                        </button>
                    </article>

                    {/* Event Card */}
                    <article style={{ background: 'linear-gradient(135deg, var(--color-secondary), #111827)', borderRadius: 'var(--radius-xl)', padding: '1.25rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', color: 'white', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', right: '-2.5rem', bottom: '-2.5rem', width: '10rem', height: '10rem', backgroundColor: 'white', opacity: 0.05, borderRadius: '50%', filter: 'blur(40px)' }}></div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', position: 'relative', zIndex: 10 }}>
                            <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.5rem', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: 600 }}>Próximo Evento</div>
                            <span className="material-icons-round" style={{ opacity: 0.5 }}>event</span>
                        </div>

                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem', position: 'relative', zIndex: 10 }}>Masterclass de Fit Boxing</h3>
                        <p style={{ fontSize: '0.875rem', opacity: 0.7, marginBottom: '1rem', position: 'relative', zIndex: 10 }}>Sábado 24 de Febrero • 10:00 AM</p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 10 }}>
                            <div style={{ display: 'flex', paddingLeft: '0.5rem' }}>
                                {[1, 2].map((i) => (
                                    <div key={i} style={{ width: '2rem', height: '2rem', borderRadius: '50%', border: '2px solid var(--color-secondary)', backgroundColor: '#374151', marginLeft: '-0.5rem', overflow: 'hidden' }}>
                                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" style={{ width: '100%', height: '100%' }} />
                                    </div>
                                ))}
                                <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', border: '2px solid var(--color-secondary)', backgroundColor: '#4B5563', color: 'white', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '-0.5rem' }}>+12</div>
                            </div>
                            <button style={{ backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>Apuntarme</button>
                        </div>
                    </article>

                </section>
            </main>
        </div>
    );
};
