import React from 'react';
import { BaseLegalView } from './BaseLegalView';

export const TermsView: React.FC = () => {
    return (
        <BaseLegalView title="Condiciones de Uso y Política de Privacidad">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p><strong>Almodóvar Group (integrado por Almodóvar Fit y Almodóvar Box)</strong></p>

                <section>
                    <h3 style={{ color: 'var(--color-primary)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>1) Información del responsable del tratamiento</h3>
                    <p><strong>Responsable:</strong> Jesús Almodóvar<br />
                        <strong>Domicilio:</strong> Av. dels Rabassaires, 30 – 2ª planta, 08100 Mollet del Vallès (Barcelona)<br />
                        <strong>Web:</strong> <a href="http://www.almodovargroup.es" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>www.almodovargroup.es</a><br />
                        <strong>Correo de contacto:</strong> almodovarbox@gmail.com<br />
                        <strong>Teléfono:</strong> 662 086 632</p>
                    <p style={{ fontSize: '0.85rem', fontStyle: 'italic', marginTop: '0.5rem' }}>En este documento, “Almodóvar Group” hace referencia al conjunto de servicios ofrecidos bajo las líneas Almodóvar Fit y Almodóvar Box.</p>
                </section>

                <section>
                    <h3 style={{ color: 'var(--color-primary)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>2) Finalidad, legitimación y conservación de los datos</h3>
                    <p><strong>Finalidad:</strong> gestión integral de la relación con clientes y personas interesadas (altas, reservas, facturación, atención al cliente, comunicaciones informativas y operativas). No se toman decisiones automatizadas.</p>
                    <p><strong>Base jurídica:</strong></p>
                    <ul style={{ paddingLeft: '1.5rem' }}>
                        <li>Ejecución de contrato/solicitud del cliente (prestación de servicios de salud y bienestar).</li>
                        <li>Consentimiento expreso del interesado para comunicaciones.</li>
                    </ul>
                    <p><strong>Conservación:</strong> mientras exista relación comercial y, posteriormente, durante los plazos legalmente establecidos.</p>
                </section>

                <section>
                    <h3 style={{ color: 'var(--color-primary)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>3) Destinatarios y procedencia de los datos</h3>
                    <p><strong>Cesiones previstas:</strong> gestorías, entidades de crédito y organismos públicos cuando resulte necesario para obligaciones contables, fiscales o legales de clientes empresa.</p>
                    <p><strong>Usuarios de la plataforma/centro:</strong> no se realizan cesiones no necesarias para la prestación del servicio.</p>
                    <p><strong>Procedencia:</strong> datos facilitados por el propio interesado.</p>
                </section>

                <section>
                    <h3 style={{ color: 'var(--color-primary)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>4) Derechos de las personas</h3>
                    <p>Puede ejercer acceso, rectificación, supresión, oposición, limitación y portabilidad, así como retirar el consentimiento, escribiendo a <strong>almodovarbox@gmail.com</strong>.</p>
                    <p>Tiene derecho a reclamar ante la autoridad de control competente.</p>
                </section>

                <section>
                    <h3 style={{ color: 'var(--color-primary)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>5) Información sobre el uso de la APP</h3>
                    <p>El acceso y navegación por la <strong>APP Almodóvar Box</strong> implican la aceptación de estas condiciones.</p>
                    <p><strong>Requisitos de uso:</strong> El usuario declara ser mayor de 18 años o estar supervisado por tutores legales. Deberá custodiar su contraseña y notificar usos no autorizados.</p>
                </section>

                <section>
                    <h3 style={{ color: 'var(--color-primary)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>6) Condiciones comerciales y de suscripción</h3>
                    <p><strong>Almodóvar Box:</strong> Entrenamiento funcional híbrido. 2 sesiones/semana (105€/mes), 3 sesiones/semana (159,90€/mes). Matrícula 59,90€.</p>
                    <p><strong>Almodóvar Fit:</strong> Sesiones colectivas. 2 sesiones/semana (54,90€/mes), 3 sesiones/semana (74,90€/mes). Matrícula 59,90€.</p>
                    <p><strong>Importante:</strong> Suscripción mensual no acumulable. Bajas voluntarias requieren 3 meses de espera o matrícula de 150€ para re-alta.</p>
                </section>

                <section>
                    <h3 style={{ color: 'var(--color-primary)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>7) Normas de uso de las instalaciones</h3>
                    <ul style={{ paddingLeft: '1.5rem', fontSize: '0.9rem' }}>
                        <li>Uso respetuoso y limpieza del material.</li>
                        <li>Obligatorio toalla, ropa y calzado deportivo adecuado.</li>
                        <li>Prohibido fumar, alcohol o sustancias estupefacientes.</li>
                        <li>Conductas agresivas implican expulsión inmediata y baja definitiva.</li>
                    </ul>
                </section>

                <section>
                    <h3 style={{ color: 'var(--color-primary)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>8) Responsabilidad y garantías – salud</h3>
                    <p>El usuario es responsable de su estado de salud y del uso adecuado de los servicios. Se recomienda consultar a un especialista en caso de patologías.</p>
                </section>

                <section>
                    <h3 style={{ color: 'var(--color-primary)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>10) Política de cookies (resumen)</h3>
                    <p>Se emplean cookies técnicas y de terceros para análisis de uso. El usuario puede configurar su navegador para aceptar, rechazar o eliminar cookies.</p>
                </section>

                <section style={{ marginTop: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Para la resolución de conflictos, las partes se someten a los juzgados y tribunales del domicilio del usuario bajo la ley española.</p>
                </section>
            </div>
        </BaseLegalView>
    );
};
