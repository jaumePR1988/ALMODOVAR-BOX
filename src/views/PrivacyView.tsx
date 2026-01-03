import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const PrivacyView: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Como el contenido está unificado, redirigimos a TermsView que contiene todo
        navigate('/terms', { replace: true });
    }, [navigate]);

    return null;
};
