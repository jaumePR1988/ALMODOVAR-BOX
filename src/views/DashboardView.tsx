import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ClientDashboardView } from './ClientDashboardView';
import { CoachDashboardView } from './CoachDashboardView';

export const DashboardView: React.FC = () => {
    const { role, loading } = useAuth(); // Use explicit role from context

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--color-bg)' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    // Role-based Dispatcher
    if (role === 'coach') {
        return <CoachDashboardView />;
    }

    if (role === 'admin') {
        // For now, admin sees coach view or we can redirect to a future AdminDashboard
        return <CoachDashboardView />;
    }

    // Default to Client Dashboard for 'cliente' and others
    return <ClientDashboardView />;
};
