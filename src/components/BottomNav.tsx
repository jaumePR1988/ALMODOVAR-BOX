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
                className={`bottom-nav-item ${activeTab === 'retos' ? 'active' : ''}`}
                onClick={() => onTabChange('retos')}
            >
                <span className="material-icons-round">emoji_events</span>
                <span>Retos</span>
            </div>

            <div
                className={`nav-fab-container ${activeTab === 'reservas' ? 'active' : ''}`}
                onClick={() => onTabChange('reservas')}
            >
                <div className="nav-fab-sphere">
                    <span className="material-icons-round">add</span>
                </div>
                <span className="nav-fab-label">Reservar</span>
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
                <span className="material-icons-round">fitness_center</span>
                <span>Perfil</span>
            </div>
        </nav>
    );
};
