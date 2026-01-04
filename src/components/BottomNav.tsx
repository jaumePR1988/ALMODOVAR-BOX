import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface BottomNavProps {
    // Legacy props kept for compatibility if needed, but mainly unused now
    activeTab?: string;
    onTabChange?: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) => location.pathname.includes(path);

    return (
        <nav className="bottom-nav-fixed">
            <div
                className={`bottom-nav-item ${isActive('/home') ? 'active' : ''}`}
                onClick={() => navigate('/dashboard/home')}
            >
                <span className="material-icons-round">home</span>
                <span>Inicio</span>
            </div>

            <div
                className={`bottom-nav-item ${isActive('/challenges') ? 'active' : ''}`}
                onClick={() => navigate('/dashboard/challenges')}
                style={{ marginRight: '1rem' }}
            >
                <span className="material-icons-round">emoji_events</span>
                <span>Retos</span>
            </div>

            <div
                className={`nav-fab-container ${isActive('/schedule') ? 'active' : ''}`}
                onClick={() => navigate('/dashboard/schedule')}
            >
                <div className="nav-fab-sphere">
                    <span className="material-icons-round">add</span>
                </div>
                <span className="nav-fab-label">Reservar</span>
            </div>

            <div
                className={`bottom-nav-item ${isActive('/news') ? 'active' : ''}`}
                onClick={() => navigate('/dashboard/news')}
                style={{ marginLeft: '1rem' }}
            >
                <span className="material-icons-round">newspaper</span>
                <span>Noticias</span>
            </div>

            <div
                className={`bottom-nav-item ${isActive('/profile') || isActive('/settings') ? 'active' : ''}`}
                onClick={() => navigate('/dashboard/profile')}
            >
                <span className="material-icons-round">fitness_center</span>
                <span>Perfil</span>
            </div>
        </nav>
    );
};
