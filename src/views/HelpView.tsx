import React from 'react';
import { BaseLegalView } from './BaseLegalView';

export const HelpView: React.FC = () => {
    return (
        <BaseLegalView title="Centro de Ayuda">
            <h3 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>Preguntas Frecuentes</h3>
            <br />
            <p><strong>¿Cómo reservo una clase?</strong><br />Una vez autorizado tu perfil por el administrador, podrás ver el calendario y reservar tu plaza en el menú de "WOD / Reservas".</p>
            <br />
            <p><strong>¿Mi perfil no ha sido autorizado?</strong><br />La validación suele realizarse en un plazo de 24 horas. Si pasado este tiempo sigues sin acceso, por favor <strong>comunícate mediante teléfono o WhatsApp</strong>.</p>
            <br />
            <p><strong>¿Cómo cambio mi contraseña?</strong><br />Puedes solicitar un enlace de recuperación en la pantalla de inicio o cambiarla desde tu "Perfil" una vez dentro de la APP.</p>
            <br />
            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '1.5rem 0' }} />
            <h3 style={{ color: 'var(--color-primary)', fontSize: '1.1rem', marginBottom: '1rem' }}>Soporte Directo</h3>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="material-icons-outlined" style={{ fontSize: '1.2rem' }}>phone</span>
                <strong>Teléfono / WhatsApp:</strong> 662 086 632
            </p>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span className="material-icons-outlined" style={{ fontSize: '1.2rem' }}>email</span>
                <strong>Email:</strong> almodovarbox@gmail.com
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                Horario de atención: Lunes a Viernes de 09:00 a 21:00.
            </p>
        </BaseLegalView>
    );
};
