import React from 'react';
import logo from '../assets/logo.png';
// @ts-ignore
import html2pdf from 'html2pdf.js';
interface WODReportViewProps {
    classData: any;
    wodExercises: any[];
    onBack: () => void;
}

export const WODReportView: React.FC<WODReportViewProps> = ({ classData, wodExercises, onBack }) => {
    const handleDownloadPDF = async () => {
        const originalElement = document.getElementById('wod-report-root');
        if (!originalElement) return;

        // 1. Clone the element
        const clone = originalElement.cloneNode(true) as HTMLElement;

        // 2. Create container (Off-screen) - Force A4 dimensions
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.left = '-10000px';
        container.style.top = '0';
        container.style.width = '210mm';
        container.style.minHeight = '297mm';
        container.style.backgroundColor = 'white';
        container.style.zIndex = '-1000';
        container.appendChild(clone);
        document.body.appendChild(container);

        // 3. Style the Clone for A4
        const noPrintElements = clone.querySelectorAll('.no-print');
        noPrintElements.forEach(el => el.remove());

        // CRITICAL: Override the mobile-first max-width
        clone.style.maxWidth = 'none';
        clone.style.width = '100%';
        clone.style.height = 'auto';
        clone.style.position = 'relative';
        clone.style.overflow = 'visible';
        clone.style.transform = 'none';
        clone.style.left = 'auto';
        clone.style.top = 'auto';
        clone.style.margin = '0';

        // Fix header width
        const header = clone.querySelector('header');
        if (header) {
            header.style.width = '100%';
            header.style.maxWidth = 'none';
        }

        // 4. Handle Images - Robust CORS Attempt
        const images = Array.from(clone.querySelectorAll('img'));
        await Promise.all(images.map(async (img) => {
            if (!img.src || img.src.startsWith('data:')) return;

            // Attempt to force crossOrigin on the clone's image
            img.crossOrigin = 'Anonymous';

            // Reload the image to ensure the crossOrigin flag takes effect
            const oldSrc = img.src;
            // Add a timestamp to bypass cache and force a new request with CORS headers if needed
            // But usually just setting the attribute is enough if the server supports it.
            // Let's try converting to dataURL via canvas to be 100% sure html2canvas can read it.
            try {
                const response = await fetch(oldSrc, { mode: 'cors' });
                const blob = await response.blob();
                const reader = new FileReader();
                await new Promise((resolve, reject) => {
                    reader.onload = () => {
                        img.src = reader.result as string;
                        resolve(null);
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            } catch (e) {
                console.warn('Could not convert image to base64, leaving as is:', e);
            }
        }));

        // Allow a brief moment for layout/render settle
        await new Promise(r => setTimeout(r, 500));

        // Format Filename: ClassTitle_Date.pdf
        const sanitizedTitle = (classData?.title || 'WOD').replace(/[^a-z0-9]/gi, '_');
        const sanitizedDate = (classData?.date || '').replace(/\//g, '-');
        const filename = `${sanitizedTitle}_${sanitizedDate}.pdf`;

        const opt = {
            margin: [0, 0, 0, 0],
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                letterRendering: true,
                scrollY: 0,
                windowWidth: 794
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        try {
            // @ts-ignore
            await html2pdf().set(opt).from(clone).save();
        } catch (error) {
            console.error('PDF Error:', error);
            alert('Hubo un error generando el PDF. Inténtalo de nuevo.');
        } finally {
            document.body.removeChild(container);
        }
    };

    return (
        <div id="wod-report-root" style={{
            height: '100dvh',
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '480px',
            zIndex: 5000,
            color: '#1a1a1a',
            overflowY: 'auto'
        }}>
            {/* Premium Header - Optimized for Print */}
            <header style={{
                backgroundColor: '#1a1a1a',
                // ... (rest of header unchanged) ...
                color: 'white',
                padding: '1rem',
                position: 'relative',
                textAlign: 'center',
                borderBottom: '4px solid var(--color-primary)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                alignItems: 'center'
            }}>
                <button
                    onClick={onBack}
                    style={{
                        position: 'absolute',
                        top: '0.5rem',
                        left: '0.5rem',
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        color: 'white',
                        padding: '0.5rem',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'block'
                    }}
                    className="no-print"
                >
                    <span className="material-icons-round">close</span>
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img src={logo} alt="Almodovar Box" style={{ height: '3.5rem', objectFit: 'contain' }} />
                    <div style={{ textAlign: 'left' }}>
                        <h1 style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '0.05em', margin: 0, color: 'white', lineHeight: 1 }}>ALMODOVAR BOX</h1>
                        <p style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '2px 0 0 0' }}>Training Session Report</p>
                    </div>
                </div>

                <div style={{ width: '100%', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', opacity: 0.9 }}>
                    <span style={{ fontWeight: 700 }}>{classData.title}</span>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <span>{classData.date}</span>
                        <span>{classData.time}</span>
                        <span>Coach {classData.coach?.split(' ')[0]}</span>
                    </div>
                </div>
            </header>

            {/* WOD Content */}
            <main style={{ padding: '1rem', flex: 1, backgroundColor: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <div style={{ height: '2px', backgroundColor: 'var(--color-primary)', flex: 1 }}></div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#1a1a1a' }}>Programación WOD</h3>
                    <div style={{ height: '2px', backgroundColor: 'var(--color-primary)', flex: 1 }}></div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Helper function to filter exercises */}
                    {(() => {
                        const sections = [
                            { key: 'warmup', title: 'Calentamiento', color: '#f59e0b' },
                            { key: 'wod', title: 'Sesión WOD', color: '#ef4444' },
                            { key: 'cooldown', title: 'Vuelta a la Calma', color: '#3b82f6' }
                        ];

                        const hasAnyExercise = wodExercises.length > 0;

                        if (!hasAnyExercise) {
                            return (
                                <div style={{ textAlign: 'center', padding: '3rem 0', color: '#999' }}>
                                    <span className="material-icons-round" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>fitness_center</span>
                                    <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>La planificación para esta sesión aún no ha sido publicada.</p>
                                </div>
                            );
                        }

                        return sections.map(section => {
                            // Filter exercises for this section. If no section is defined, default to 'wod'
                            const sectionExercises = wodExercises.filter(ex =>
                                (ex.section === section.key) || (!ex.section && section.key === 'wod')
                            );

                            if (sectionExercises.length === 0) return null;

                            return (
                                <div key={section.key} style={{ pageBreakInside: 'avoid' }}>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem',
                                        borderBottom: `2px solid ${section.color} `
                                    }}>
                                        <h3 style={{
                                            fontSize: '0.9rem', fontWeight: 800, margin: 0,
                                            textTransform: 'uppercase', letterSpacing: '0.05em',
                                            color: section.color, paddingBottom: '0.25rem'
                                        }}>
                                            {section.title}
                                        </h3>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {sectionExercises.map((ex, index) => {
                                            // Localization Helper Maps
                                            const typeMap: Record<string, string> = {
                                                strength: 'Fuerza', cardio: 'Cardio', flexibility: 'Flexibilidad',
                                                balance: 'Equilibrio', power: 'Potencia'
                                            };
                                            const displayType = typeMap[ex.category?.toLowerCase()] || ex.category || 'General';

                                            return (
                                                <div key={ex.id} style={{
                                                    display: 'flex',
                                                    gap: '0.75rem',
                                                    border: '1px solid #eee',
                                                    padding: '0.5rem',
                                                    borderRadius: '0.5rem',
                                                    alignItems: 'center',
                                                    backgroundColor: '#fff',
                                                    boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                                                }}>
                                                    <div style={{
                                                        width: '3rem',
                                                        height: '3rem',
                                                        borderRadius: '0.5rem',
                                                        overflow: 'hidden',
                                                        flexShrink: 0,
                                                        backgroundColor: '#f5f5f5',
                                                        border: '1px solid #e5e5e5',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}>
                                                        {ex.image ? (
                                                            <img src={ex.image} alt={ex.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        ) : (
                                                            <span className="material-icons-round" style={{ fontSize: '1.5rem', color: '#ccc' }}>fitness_center</span>
                                                        )}
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.15rem' }}>
                                                            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, margin: 0, color: '#111' }}>{ex.name}</h4>
                                                            <span style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-primary)', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                                                                {displayType}
                                                            </span>
                                                        </div>

                                                        {/* Metrics Row */}
                                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                                            {(ex.series && ex.series !== '-') && (
                                                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.15rem', backgroundColor: '#f9fafb', padding: '0 0.25rem', borderRadius: '2px' }}>
                                                                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#111' }}>{ex.series}</span>
                                                                    <span style={{ fontSize: '0.6rem', fontWeight: 600, color: '#666', textTransform: 'uppercase' }}>Ser.</span>
                                                                </div>
                                                            )}
                                                            {(ex.reps && ex.reps !== '-') && (
                                                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.15rem', backgroundColor: '#f9fafb', padding: '0 0.25rem', borderRadius: '2px' }}>
                                                                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#111' }}>{ex.reps}</span>
                                                                    <span style={{ fontSize: '0.6rem', fontWeight: 600, color: '#666', textTransform: 'uppercase' }}>Reps</span>
                                                                </div>
                                                            )}
                                                            {(ex.rounds !== undefined && ex.rounds !== '') && (
                                                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.15rem', backgroundColor: '#ffedd5', padding: '0 0.25rem', borderRadius: '2px' }}>
                                                                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#c2410c' }}>{ex.rounds}</span>
                                                                    <span style={{ fontSize: '0.6rem', fontWeight: 600, color: '#c2410c', textTransform: 'uppercase' }}>Vueltas</span>
                                                                </div>
                                                            )}
                                                            {(ex.minutes !== undefined && ex.minutes !== '') && (
                                                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.15rem', backgroundColor: '#dbeafe', padding: '0 0.25rem', borderRadius: '2px' }}>
                                                                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e40af' }}>{ex.minutes}'</span>
                                                                    <span style={{ fontSize: '0.6rem', fontWeight: 600, color: '#1e40af', textTransform: 'uppercase' }}>Min</span>
                                                                </div>
                                                            )}
                                                            {(ex.kcal !== undefined && ex.kcal !== '') && (
                                                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.15rem', backgroundColor: '#fce7f3', padding: '0 0.25rem', borderRadius: '2px' }}>
                                                                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#9d174d' }}>{ex.kcal}</span>
                                                                    <span style={{ fontSize: '0.6rem', fontWeight: 600, color: '#9d174d', textTransform: 'uppercase' }}>Kcal</span>
                                                                </div>
                                                            )}
                                                            {(ex.seconds !== undefined && ex.seconds !== '') && (
                                                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.15rem', backgroundColor: '#dbeafe', padding: '0 0.25rem', borderRadius: '2px' }}>
                                                                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e40af' }}>{ex.seconds}''</span>
                                                                    <span style={{ fontSize: '0.6rem', fontWeight: 600, color: '#1e40af', textTransform: 'uppercase' }}>Seg</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {ex.description && (
                                                            <p style={{ fontSize: '0.7rem', color: '#666', marginTop: '0.2rem', lineHeight: 1.25, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                                {ex.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            );
                        });
                    })()}
                </div>

                {/* Footer Quote / Branding */}
                <div style={{ marginTop: '1.5rem', textAlign: 'center', padding: '1rem', backgroundColor: '#fcfcfc', borderRadius: '0.5rem', border: '1px dashed #eee' }}>
                    <p style={{ fontSize: '0.75rem', color: '#888', margin: 0, fontStyle: 'italic', fontWeight: 500 }}>"No pain, no gain. Let's crush this session!"</p>
                    <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }}></div>
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', color: '#1a1a1a' }}>ALMODOVAR BOX</span>
                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }}></div>
                    </div>
                </div>
            </main>

            {/* Actions */}
            <div style={{ padding: '1rem', borderTop: '1px solid #f0f0f0', backgroundColor: 'white', display: 'flex', gap: '0.5rem' }} className="no-print">
                <button
                    onClick={handleDownloadPDF}
                    style={{
                        flex: 1,
                        backgroundColor: 'var(--color-primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.75rem',
                        padding: '0.75rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(var(--color-primary-rgb), 0.3)'
                    }}
                >
                    <span className="material-icons-round">download</span>
                    Descargar PDF
                </button>
                <button
                    onClick={onBack}
                    style={{
                        padding: '0.75rem 1rem',
                        backgroundColor: '#f0f0f0',
                        color: '#666',
                        border: 'none',
                        borderRadius: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                    }}
                >
                    Cerrar
                </button>
            </div>

            <style>{`
@media print {
    @page {
        size: A4;
        margin: 0;
    }
    html, body, #root {
        height: auto!important;
        min - height: 100 % !important;
        overflow: visible!important;
        margin: 0!important;
        padding: 0!important;
        background - color: white!important;
    }
    body * {
        visibility: hidden;
    }
    #wod - report - root {
        position: absolute;
        left: 0;
        top: 0;
        width: 100 %;
        height: auto!important;
        min - height: 100 %;
        max - width: none!important;
        margin: 0;
        padding: 0;
        z - index: 9999;
        overflow: visible!important;
        transform: none!important;
        background - color: white;
        display: block!important;
        visibility: visible!important;
    }
    #wod - report - root * {
        visibility: visible!important;
    }
    /* Ensure headers/footers of the report are correct */
    header, main {
        width: 100 %;
        height: auto!important;
        overflow: visible!important;
    }
                    .no - print {
        display: none!important;
    }
}
`}</style>
        </div>
    );
};
