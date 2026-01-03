import React from 'react';

interface BottomNavProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
    return (
        <nav className="bottom-nav-fixed">
            <div
                className={`bottom-nav-item ${activeTab === 'inicio' ? 'active' : ''}`}
                onClick={() => onTabChange('inicio')}
            >
                <span className="material-icons-round">home</span>
                <span>Inicio</span>
            </div>

            <div
                className={`bottom-nav-item ${activeTab === 'reservas' ? 'active' : ''}`}
                onClick={() => onTabChange('reservas')}
            >
                <span className="material-icons-round">calendar_today</span>
                <span>Reservas</span>
            </div>

            <div className="nav-fab" style={{ flexShrink: 0 }} onClick={() => onTabChange('reservas')}>
                <span className="material-icons-round" style={{ fontSize: '1.75rem' }}>add</span>
            </div>

            <div
                className={`bottom-nav-item ${activeTab === 'noticias' ? 'active' : ''}`}
                onClick={() => onTabChange('noticias')}
            >
                <span className="material-icons-round">newspaper</span>
                <span>Noticias</span>
            </div>

            <div
                className={`bottom-nav-item ${activeTab === 'perfil' ? 'active' : ''}`}
                onClick={() => onTabChange('perfil')}
            >
                <span className="material-icons-round">person</span>
                <span>Perfil</span>
            </div>
        </nav>
    );
};
