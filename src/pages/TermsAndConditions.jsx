import React from 'react';
import { Link } from 'react-router-dom';

const TermsAndConditions = () => {
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-white">Términos y Condiciones</h1>
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
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Aceptación de los Términos</h2>
                <p className="mb-4">
                  Al acceder y utilizar DuvyClass, aceptas estar sujeto a estos términos y condiciones de uso.
                  Si no estás de acuerdo con alguna parte de estos términos, no podrás acceder al servicio.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Descripción del Servicio</h2>
                <p className="mb-4">
                  DuvyClass es una plataforma de gestión IT que proporciona herramientas para:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Gestión de tickets de soporte técnico</li>
                  <li>Control de inventario IT</li>
                  <li>Repositorio de documentación técnica</li>
                  <li>Gestión de usuarios y roles</li>
                  <li>Comunicación en tiempo real</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Uso Aceptable</h2>
                <p className="mb-4">
                  Te comprometes a utilizar el servicio únicamente para fines legales y de acuerdo con estos términos.
                  No podrás:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Utilizar el servicio para actividades ilegales</li>
                  <li>Intentar acceder sin autorización a sistemas o datos</li>
                  <li>Distribuir malware o contenido dañino</li>
                  <li>Violar los derechos de propiedad intelectual</li>
                  <li>Interferir con el funcionamiento normal del servicio</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Privacidad y Protección de Datos</h2>
                <p className="mb-4">
                  Tu privacidad es importante para nosotros. Consulta nuestra Política de Privacidad para
                  entender cómo recopilamos, utilizamos y protegemos tu información personal.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Propiedad Intelectual</h2>
                <p className="mb-4">
                  Todo el contenido, características y funcionalidad de DuvyClass son propiedad de nuestros
                  desarrolladores y están protegidos por leyes de propiedad intelectual.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Limitación de Responsabilidad</h2>
                <p className="mb-4">
                  DuvyClass se proporciona "tal cual" sin garantías de ningún tipo. No seremos responsables
                  por daños directos, indirectos, incidentales o consecuentes.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Modificaciones</h2>
                <p className="mb-4">
                  Nos reservamos el derecho de modificar estos términos en cualquier momento.
                  Los cambios serán efectivos inmediatamente después de su publicación.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contacto</h2>
                <p className="mb-4">
                  Si tienes preguntas sobre estos términos, puedes contactarnos a través de:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Email: soporte@duvyclass.com</li>
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

export default TermsAndConditions;
