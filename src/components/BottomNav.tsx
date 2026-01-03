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
                className={`bottom-nav-item ${activeTab === 'agenda' ? 'active' : ''}`}
                onClick={() => onTabChange('agenda')}
            >
                <span className="material-icons-round">calendar_today</span>
                <span>Agenda</span>
            </div>

            <div className="nav-fab" style={{ flexShrink: 0 }} onClick={() => onTabChange('agenda')}>
                <span className="material-icons-round" style={{ fontSize: '1.75rem' }}>add</span>
            </div>

            <div
                className={`bottom-nav-item ${activeTab === 'perfil' ? 'active' : ''}`}
                onClick={() => onTabChange('perfil')}
            >
                <span className="material-icons-round">fitness_center</span>
                <span>Perfil</span>
            </div>

            <div
                className={`bottom-nav-item ${activeTab === 'cuenta' ? 'active' : ''}`}
                onClick={() => onTabChange('cuenta')}
            >
                <span className="material-icons-round">person</span>
                <span>Cuenta</span>
            </div>
        </nav>
    );
};
