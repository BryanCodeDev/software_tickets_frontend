import React, { useState } from 'react';
import { FaQuestionCircle, FaBook, FaVideo, FaEnvelope, FaPhone } from 'react-icons/fa';

const Help = () => {
  const [activeTab, setActiveTab] = useState('faq');

  const faqs = [
    {
      question: '¿Cómo crear un nuevo ticket?',
      answer: 'Para crear un nuevo ticket, ve a la sección de Tickets y haz clic en "Nuevo Ticket". Completa la información requerida como título, descripción, prioridad y categoría.'
    },
    {
      question: '¿Cómo gestionar el inventario?',
      answer: 'En la sección de Inventario puedes agregar, editar y eliminar activos. Cada activo debe tener un código único, descripción y ubicación.'
    },
    {
      question: '¿Cómo subir documentos?',
      answer: 'Ve a la sección de Documentos y haz clic en "Subir Documento". Selecciona el archivo, añade una descripción y clasifícalo por categoría.'
    },
    {
      question: '¿Cómo acceder al repositorio?',
      answer: 'La sección de Repositorio contiene archivos compartidos. Puedes buscar por nombre, filtrar por categoría y descargar los archivos necesarios.'
    },
    {
      question: '¿Cómo cambiar mi contraseña?',
      answer: 'Ve a Configuración > Seguridad y haz clic en "Cambiar Contraseña". Ingresa tu contraseña actual y la nueva contraseña.'
    }
  ];

  const guides = [
    {
      title: 'Guía de Inicio Rápido',
      description: 'Aprende los conceptos básicos de la plataforma en 5 minutos.',
      icon: <FaBook className="text-purple-600 text-2xl" />
    },
    {
      title: 'Gestión de Tickets',
      description: 'Tutorial completo sobre cómo crear y gestionar tickets de soporte.',
      icon: <FaVideo className="text-purple-600 text-2xl" />
    },
    {
      title: 'Administración de Inventario',
      description: 'Cómo mantener actualizado el inventario de activos IT.',
      icon: <FaBook className="text-purple-600 text-2xl" />
    },
    {
      title: 'Sistema de Documentos',
      description: 'Guía para subir, organizar y compartir documentos.',
      icon: <FaVideo className="text-purple-600 text-2xl" />
    }
  ];

  const contactInfo = [
    {
      type: 'Email',
      value: 'soporte@duvyclass.com',
      icon: <FaEnvelope className="text-purple-600" />,
      description: 'Envíanos un correo para soporte técnico'
    },
    {
      type: 'Teléfono',
      value: '+57 300 123 4567',
      icon: <FaPhone className="text-purple-600" />,
      description: 'Llámanos para asistencia inmediata'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Centro de Ayuda</h1>
        <p className="text-base sm:text-lg text-gray-600">Encuentra respuestas y recursos para usar la plataforma</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('faq')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'faq'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Preguntas Frecuentes
            </button>
            <button
              onClick={() => setActiveTab('guides')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'guides'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Guías y Tutoriales
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'contact'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Contacto
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div className="space-y-4">
              <div className="flex items-center mb-6">
                <FaQuestionCircle className="text-purple-600 text-2xl mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Preguntas Frecuentes</h2>
              </div>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <details key={index} className="bg-gray-50 rounded-lg p-4">
                    <summary className="font-medium text-gray-900 cursor-pointer hover:text-purple-600">
                      {faq.question}
                    </summary>
                    <p className="mt-2 text-gray-600">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          )}

          {/* Guides Tab */}
          {activeTab === 'guides' && (
            <div className="space-y-4">
              <div className="flex items-center mb-6">
                <FaBook className="text-purple-600 text-2xl mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Guías y Tutoriales</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {guides.map((guide, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="flex items-start">
                      <div className="mr-3">{guide.icon}</div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">{guide.title}</h3>
                        <p className="text-sm text-gray-600">{guide.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div className="flex items-center mb-6">
                <FaPhone className="text-purple-600 text-2xl mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Contacto y Soporte</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contactInfo.map((contact, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      {contact.icon}
                      <h3 className="font-medium text-gray-900 ml-2">{contact.type}</h3>
                    </div>
                    <p className="text-purple-600 font-medium mb-1">{contact.value}</p>
                    <p className="text-sm text-gray-600">{contact.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-purple-50 rounded-lg p-6">
                <h3 className="font-medium text-gray-900 mb-2">¿No encuentras lo que buscas?</h3>
                <p className="text-gray-600 mb-4">
                  Si tienes alguna pregunta específica o necesitas ayuda con algo en particular,
                  no dudes en contactarnos. Nuestro equipo de soporte está aquí para ayudarte.
                </p>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  Crear Ticket de Soporte
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Help;