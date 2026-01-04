import React from 'react';

interface ClassItem {
    id: string;
    title: string;
    time: string;
    location: string;
    enrolled: number;
    capacity: number;
    status: 'completed' | 'ongoing' | 'upcoming';
    attendees: { id: string, name: string, image: string, status: 'checked-in' | 'pending' }[];
}

interface CoachScheduleViewProps {
    onBack: () => void;
    onClassSelect: (classItem: any) => void;
}

export const CoachScheduleView: React.FC<CoachScheduleViewProps> = ({ onBack, onClassSelect }) => {

    // Mock Data
    const todayClasses: ClassItem[] = [
        {
            id: '1', title: 'Fit Boxing WOD', time: '10:00 - 10:50', location: 'Sala 1',
            enrolled: 12, capacity: 20, status: 'ongoing',
            attendees: []
        },
        {
            id: '2', title: 'Open Box', time: '12:00 - 13:00', location: 'Zona Libre',
            enrolled: 8, capacity: 25, status: 'upcoming',
            attendees: []
        },
        {
            id: '3', title: 'Fit Boxing Technique', time: '16:00 - 17:00', location: 'Sala 2',
            enrolled: 15, capacity: 18, status: 'upcoming',
            attendees: []
        },
        {
            id: '4', title: 'Cross Training', time: '18:30 - 19:30', location: 'Sala 1',
            enrolled: 20, capacity: 20, status: 'upcoming',
            attendees: []
        }
    ];

    const tomorrowClasses: ClassItem[] = [
        {
            id: '5', title: 'Morning Yoga', time: '08:00 - 09:00', location: 'Sala 2',
            enrolled: 5, capacity: 15, status: 'upcoming',
            attendees: []
        },
        {
            id: '6', title: 'Fit Boxing WOD', time: '10:00 - 10:50', location: 'Sala 1',
            enrolled: 18, capacity: 20, status: 'upcoming',
            attendees: []
        }
    ];

    const renderClassCard = (item: ClassItem) => (
        <div
            key={item.id}
            onClick={() => onClassSelect(item)}
            style={{
                backgroundColor: 'var(--color-surface)',
                borderRadius: '1rem',
                padding: '1rem',
                border: '1px solid var(--color-border)',
                marginBottom: '1rem',
                borderLeft: item.status === 'ongoing' ? '4px solid var(--color-primary)' : '1px solid var(--color-border)',
                cursor: 'pointer'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <span style={{
                    padding: '0.25rem 0.5rem',
                    backgroundColor: item.status === 'ongoing' ? 'rgba(34, 197, 94, 0.1)' : 'var(--color-bg)',
                    color: item.status === 'ongoing' ? '#15803d' : 'var(--color-text-muted)',
                    fontSize: '0.75rem', fontWeight: 700, borderRadius: '0.25rem', textTransform: 'uppercase'
                }}>
                    {item.status === 'ongoing' ? 'En Curso' : item.status === 'completed' ? 'Finalizada' : 'Próxima'}
                </span>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>{item.time}</span>
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.25rem', margin: 0 }}>{item.title}</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem', margin: 0, marginBottom: '0.75rem' }}>
                <span className="material-icons-outlined" style={{ fontSize: '1rem' }}>location_on</span> {item.location}
            </p>
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                    <span style={{ color: item.enrolled >= item.capacity ? 'var(--color-primary)' : 'var(--color-text-main)', fontWeight: 700 }}>{item.enrolled}</span>/{item.capacity} inscritos
                </div>
                <span className="material-icons-outlined" style={{ color: 'var(--color-primary)', fontSize: '1.25rem' }}>chevron_right</span>
            </div>
        </div>
    );

    const [selectedDateIndex, setSelectedDateIndex] = React.useState(0);

    // Dynamic Date Logic
    const today = new Date();

    const getTargetDate = (offset: number) => {
        const d = new Date(today);
        d.setDate(today.getDate() + offset);
        return d;
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
    };

    const formatShortDate = (date: Date) => {
        return date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' });
    };

    // Generate next 7 days for the selector
    const dateSelector = Array.from({ length: 7 }, (_, i) => {
        return {
            label: i === 0 ? 'Hoy' : i === 1 ? 'Mañana' : formatShortDate(getTargetDate(i)),
            date: getTargetDate(i),
            index: i
        };
    });

    const activeClasses = selectedDateIndex === 0 ? todayClasses : selectedDateIndex === 1 ? tomorrowClasses : [];

    return (
        <div style={{ padding: '1.5rem 1.25rem', animation: 'fadeIn 0.3s ease-out' }}>
            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--color-text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <span className="material-icons-round">arrow_back</span>
                </button>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Agenda Semanal</h2>
            </div>

            {/* Date Selector */}
            <div className="hide-scrollbar" style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '0.5rem' }}>
                {dateSelector.map((item) => (
                    <button
                        key={item.index}
                        onClick={() => setSelectedDateIndex(item.index)}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '2rem',
                            backgroundColor: selectedDateIndex === item.index ? 'var(--color-primary)' : 'var(--color-surface)',
                            color: selectedDateIndex === item.index ? 'white' : 'var(--color-text-muted)',
                            border: selectedDateIndex === item.index ? 'none' : '1px solid var(--color-border)',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            flexShrink: 0,
                            whiteSpace: 'nowrap',
                            textTransform: 'capitalize',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: selectedDateIndex === item.index ? '0 4px 12px rgba(var(--color-primary-rgb), 0.3)' : 'none'
                        }}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            {/* List */}
            <section>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-muted)', margin: '0 0 1rem 0', textTransform: 'uppercase' }}>
                    {formatDate(getTargetDate(selectedDateIndex))}
                </h3>

                {activeClasses.length > 0 ? (
                    activeClasses.map(renderClassCard)
                ) : (
                    <div style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        padding: '3rem 1rem', textAlign: 'center', color: 'var(--color-text-muted)',
                        backgroundColor: 'var(--color-surface)', borderRadius: '1rem', border: '1px dashed var(--color-border)'
                    }}>
                        <span className="material-icons-round" style={{ fontSize: '3rem', opacity: 0.2, marginBottom: '0.5rem' }}>event_busy</span>
                        <p style={{ margin: 0, fontWeight: 500 }}>No hay clases programadas</p>
                    </div>
                )}
            </section>
        </div>
    );
};
