import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-purple-600 to-violet-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-white">Política de Privacidad</h1>
              </div>
              <Link
                to="/register"
                className="text-white hover:text-purple-100 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="text-sm text-gray-500 mb-8">
                Última actualización: {new Date().toLocaleDateString('es-ES')}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Información que Recopilamos</h2>
                <p className="mb-4">
                  Recopilamos información personal que nos proporcionas directamente al registrarte
                  y utilizar nuestros servicios:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Nombre de usuario y correo electrónico</li>
                  <li>Información de perfil y preferencias</li>
                  <li>Datos de uso de la plataforma</li>
                  <li>Información de dispositivos y navegación</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Cómo Utilizamos tu Información</h2>
                <p className="mb-4">
                  Utilizamos la información recopilada para:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Proporcionar y mantener nuestros servicios</li>
                  <li>Mejorar la experiencia del usuario</li>
                  <li>Comunicarnos contigo sobre actualizaciones</li>
                  <li>Garantizar la seguridad de la plataforma</li>
                  <li>Cumplir con obligaciones legales</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Compartir Información</h2>
                <p className="mb-4">
                  No vendemos, alquilamos ni compartimos tu información personal con terceros,
                  excepto en las siguientes circunstancias:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Con tu consentimiento explícito</li>
                  <li>Para cumplir con obligaciones legales</li>
                  <li>Para proteger nuestros derechos y seguridad</li>
                  <li>Con proveedores de servicios que nos ayudan a operar</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Seguridad de Datos</h2>
                <p className="mb-4">
                  Implementamos medidas de seguridad técnicas y organizativas para proteger tu
                  información personal contra acceso no autorizado, alteración, divulgación o
                  destrucción. Utilizamos encriptación SSL/TLS para la transmisión de datos.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookies y Tecnologías Similares</h2>
                <p className="mb-4">
                  Utilizamos cookies y tecnologías similares para mejorar tu experiencia en nuestra
                  plataforma. Puedes controlar el uso de cookies a través de la configuración de tu navegador.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Tus Derechos</h2>
                <p className="mb-4">
                  Tienes derecho a:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Acceder a tu información personal</li>
                  <li>Rectificar datos inexactos</li>
                  <li>Solicitar la eliminación de tus datos</li>
                  <li>Oponerte al procesamiento de tus datos</li>
                  <li>Solicitar la portabilidad de tus datos</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Retención de Datos</h2>
                <p className="mb-4">
                  Conservamos tu información personal solo durante el tiempo necesario para
                  proporcionar nuestros servicios y cumplir con nuestras obligaciones legales.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cambios a esta Política</h2>
                <p className="mb-4">
                  Podemos actualizar esta política de privacidad periódicamente. Te notificaremos
                  sobre cambios significativos a través de la plataforma o por correo electrónico.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contacto</h2>
                <p className="mb-4">
                  Si tienes preguntas sobre esta política de privacidad, puedes contactarnos:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Email: privacidad@duvyclass.com</li>
                  <li>Teléfono: +57 XXX XXX XXXX</li>
                </ul>
              </section>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <p className="text-sm text-gray-500 mb-4 sm:mb-0">
                  © 2025 DuvyClass. Desarrollado por Bryan Muñoz.
                </p>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-purple-600 bg-purple-50 hover:bg-purple-100 transition-colors"
                >
                  Volver al Registro
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
