import React, { useRef } from 'react';
import { FaTimes, FaEdit, FaTrash, FaClipboardList, FaImage, FaComment, FaUserCircle, FaClock, FaPaperPlane } from 'react-icons/fa';
import { SERVER_BASE_URL } from '../../../utils/constants';
import { useThemeClasses } from '../../../hooks/useThemeClasses';

const TicketDetailModal = ({
  showDetailModal,
  setShowDetailModal,
  selectedTicket,
  comments,
  messages,
  newMessage,
  setNewMessage,
  handleSendMessage,
  handleViewDetail,
  handleEdit,
  handleDelete,
  canEditTicket,
  canDeleteTicket,
  canSendMessage,
  user
}) => {
  const { conditionalClasses } = useThemeClasses();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getStatusColor = (status) => {
    const colors = {
      'abierto': conditionalClasses({
        light: 'bg-[#f3ebf9] text-[#662d91] border-[#e8d5f5]',
        dark: 'bg-gray-700 text-gray-200 border-gray-600'
      }),
      'en progreso': conditionalClasses({
        light: 'bg-blue-100 text-blue-700 border-blue-200',
        dark: 'bg-blue-900 text-blue-200 border-blue-700'
      }),
      'cerrado': conditionalClasses({
        light: 'bg-gray-200 text-gray-700 border-gray-300',
        dark: 'bg-gray-600 text-gray-200 border-gray-500'
      }),
      'resuelto': conditionalClasses({
        light: 'bg-green-100 text-green-700 border-green-200',
        dark: 'bg-green-900 text-green-200 border-green-700'
      })
    };
    return colors[status?.toLowerCase()] || conditionalClasses({
      light: 'bg-gray-100 text-gray-600 border-gray-200',
      dark: 'bg-gray-700 text-gray-300 border-gray-600'
    });
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'alta': conditionalClasses({
        light: 'bg-red-100 text-red-700 border-red-200',
        dark: 'bg-red-900 text-red-200 border-red-700'
      }),
      'media': conditionalClasses({
        light: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        dark: 'bg-yellow-900 text-yellow-200 border-yellow-700'
      }),
      'baja': conditionalClasses({
        light: 'bg-green-100 text-green-700 border-green-200',
        dark: 'bg-green-900 text-green-200 border-green-700'
      })
    };
    return colors[priority?.toLowerCase()] || conditionalClasses({
      light: 'bg-gray-100 text-gray-600 border-gray-200',
      dark: 'bg-gray-700 text-gray-300 border-gray-600'
    });
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Hace un momento';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Hace ${minutes}min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Hace ${hours}h`;
    const days = Math.floor(hours / 24);
    return `Hace ${days}d`;
  };

  if (!showDetailModal || !selectedTicket) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fade-in">
      <div className={conditionalClasses({
        light: 'bg-white rounded-xl lg:rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] lg:max-h-[90vh] overflow-y-auto border-2 border-gray-200 animate-scale-in',
        dark: 'bg-gray-800 rounded-xl lg:rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] lg:max-h-[90vh] overflow-y-auto border-2 border-gray-600 animate-scale-in'
      })}>
        <div className="sticky top-0 bg-linear-to-r from-[#662d91] to-[#8e4dbf] p-4 lg:p-6 z-10">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <h2 className="text-xl lg:text-2xl font-bold text-white mb-2 truncate">{selectedTicket.title}</h2>
              <div className="flex flex-wrap gap-2">
                <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white`}>
                  Ticket #{selectedTicket.id}
                </span>
                <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(selectedTicket.status)}`}>
                  {selectedTicket.status}
                </span>
                <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(selectedTicket.priority)}`}>
                  Prioridad {selectedTicket.priority}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowDetailModal(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-all text-white shrink-0"
            >
              <FaTimes className="w-5 h-5 lg:w-6 lg:h-6" />
            </button>
          </div>
        </div>

        <div className="p-4 lg:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4 lg:space-y-6">
              {/* Description */}
              <div className={conditionalClasses({
                light: 'bg-gray-50 rounded-xl p-4 lg:p-5 border-2 border-gray-200',
                dark: 'bg-gray-700 rounded-xl p-4 lg:p-5 border-2 border-gray-600'
              })}>
                <h3 className={conditionalClasses({
                  light: 'text-base lg:text-lg font-bold text-gray-900 mb-3 flex items-center gap-2',
                  dark: 'text-base lg:text-lg font-bold text-white mb-3 flex items-center gap-2'
                })}>
                  <FaClipboardList className="text-[#662d91] w-4 h-4 lg:w-5 lg:h-5" />
                  Descripción del Problema
                </h3>
                <p className={conditionalClasses({
                  light: 'text-sm lg:text-base text-gray-700 leading-relaxed',
                  dark: 'text-sm lg:text-base text-gray-200 leading-relaxed'
                })}>{selectedTicket.description}</p>
              </div>

              {/* Attachments */}
              {selectedTicket.TicketAttachments && selectedTicket.TicketAttachments.length > 0 && (
                <div className={conditionalClasses({
                  light: 'bg-gray-50 rounded-xl p-4 lg:p-5 border-2 border-gray-200',
                  dark: 'bg-gray-700 rounded-xl p-4 lg:p-5 border-2 border-gray-600'
                })}>
                  <h3 className={conditionalClasses({
                    light: 'text-base lg:text-lg font-bold text-gray-900 mb-3 flex items-center gap-2',
                    dark: 'text-base lg:text-lg font-bold text-white mb-3 flex items-center gap-2'
                  })}>
                    <FaImage className="text-[#662d91] w-4 h-4 lg:w-5 lg:h-5" />
                    Archivos Adjuntos
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedTicket.TicketAttachments.map((attachment) => (
                      <div key={attachment.id} className={conditionalClasses({
                        light: 'bg-white rounded-lg p-3 border border-gray-200',
                        dark: 'bg-gray-600 rounded-lg p-3 border border-gray-500'
                      })}>
                        {attachment.type.startsWith('image/') ? (
                          <img
                            src={`${SERVER_BASE_URL}/uploads/tickets/${attachment.filename}`}
                            alt={attachment.originalName}
                            className="w-full h-32 object-cover rounded-lg mb-2 cursor-pointer"
                            onClick={() => window.open(`${SERVER_BASE_URL}/uploads/tickets/${attachment.filename}`, '_blank')}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : attachment.type.startsWith('video/') ? (
                          <video
                            controls
                            className="w-full h-32 object-cover rounded-lg mb-2"
                          >
                            <source src={`${SERVER_BASE_URL}/uploads/tickets/${attachment.filename}`} type={attachment.type} />
                            Tu navegador no soporta el elemento de video.
                          </video>
                        ) : (
                          <div className={conditionalClasses({
                            light: 'w-full h-32 bg-gray-100 rounded-lg mb-2 flex items-center justify-center',
                            dark: 'w-full h-32 bg-gray-500 rounded-lg mb-2 flex items-center justify-center'
                          })}>
                            <FaImage className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                        <p className={conditionalClasses({
                          light: 'text-sm font-medium text-gray-900 truncate',
                          dark: 'text-sm font-medium text-white truncate'
                        })}>{attachment.originalName}</p>
                        <p className={conditionalClasses({
                          light: 'text-xs text-gray-500',
                          dark: 'text-xs text-gray-300'
                        })}>
                          {(attachment.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        {attachment.type.startsWith('image/') && (
                          <button
                            onClick={() => window.open(`${SERVER_BASE_URL}/uploads/tickets/${attachment.filename}`, '_blank')}
                            className="text-xs text-[#662d91] hover:text-[#662d91] mt-1"
                          >
                            Ver imagen completa
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Section */}
              <div className={conditionalClasses({
                light: 'bg-white rounded-xl border-2 border-gray-200 overflow-hidden',
                dark: 'bg-gray-700 rounded-xl border-2 border-gray-600 overflow-hidden'
              })}>
                <div className={conditionalClasses({
                  light: 'bg-linear-to-r from-[#f3ebf9] to-[#e8d5f5] px-4 lg:px-5 py-3 border-b-2 border-gray-200',
                  dark: 'bg-linear-to-r from-gray-700 to-gray-600 px-4 lg:px-5 py-3 border-b-2 border-gray-600'
                })}>
                  <h3 className={conditionalClasses({
                    light: 'text-base lg:text-lg font-bold text-gray-900 flex items-center gap-2',
                    dark: 'text-base lg:text-lg font-bold text-white flex items-center gap-2'
                  })}>
                    <FaComment className="text-[#662d91] w-4 h-4 lg:w-5 lg:h-5" />
                    Conversación del Ticket ({messages.length})
                  </h3>
                </div>

                <div className="p-4 lg:p-5">
                  <div className="space-y-3 lg:space-y-4 max-h-80 lg:max-h-96 overflow-y-auto mb-4">
                    {messages.length === 0 ? (
                      <div className="text-center py-6 lg:py-8">
                        <div className={conditionalClasses({
                          light: 'w-12 h-12 lg:w-16 lg:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3',
                          dark: 'w-12 h-12 lg:w-16 lg:h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-3'
                        })}>
                          <FaComment className="w-6 h-6 lg:w-8 lg:h-8 text-gray-400" />
                        </div>
                        <p className={conditionalClasses({
                          light: 'text-sm text-gray-500',
                          dark: 'text-sm text-gray-300'
                        })}>
                          No hay mensajes aún. ¡Inicia la conversación!
                        </p>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div key={message.id} className={`flex ${message.sender?.id === user?.id ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs lg:max-w-md px-3 lg:px-4 py-2 lg:py-3 rounded-2xl ${
                            message.sender?.id === user?.id
                              ? 'bg-linear-to-r from-[#662d91] to-[#8e4dbf] text-white'
                              : conditionalClasses({
                                  light: 'bg-gray-100 border-2 border-gray-200 text-gray-900',
                                  dark: 'bg-gray-600 border-2 border-gray-500 text-white'
                                })
                          }`}>
                            <div className="flex items-center justify-between mb-1 lg:mb-2">
                              <span className={`text-xs font-bold ${
                                message.sender?.id === user?.id ? 'text-[#e8d5f5]' : conditionalClasses({
                                  light: 'text-gray-600',
                                  dark: 'text-gray-300'
                                })
                              }`}>
                                {message.sender?.name || 'Usuario'}
                              </span>
                              <span className={`text-xs ${
                                message.sender?.id === user?.id ? 'text-[#e8d5f5]' : conditionalClasses({
                                  light: 'text-gray-400',
                                  dark: 'text-gray-400'
                                })
                              }`}>
                                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-sm leading-relaxed">{message.content}</p>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Send Message Form */}
                  {canSendMessage(selectedTicket) ? (
                    <form onSubmit={handleSendMessage} className="flex gap-2 lg:gap-3">
                      <input
                        type="text"
                        placeholder="Escribe un mensaje..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className={conditionalClasses({
                          light: 'flex-1 px-3 lg:px-4 py-2 lg:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base',
                          dark: 'flex-1 px-3 lg:px-4 py-2 lg:py-3 border-2 border-gray-600 bg-gray-600 text-white rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base'
                        })}
                      />
                      <button
                        type="submit"
                        className="px-4 lg:px-5 py-2 lg:py-3 bg-linear-to-r from-[#662d91] to-[#8e4dbf] hover:from-[#7a3da8] hover:to-violet-700 text-white font-bold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
                        disabled={!newMessage.trim()}
                      >
                        <FaPaperPlane className="w-3 h-3 lg:w-4 lg:h-4" />
                      </button>
                    </form>
                  ) : (
                    <div className="text-center py-3 lg:py-4">
                      <p className={conditionalClasses({
                        light: 'text-sm text-gray-500',
                        dark: 'text-sm text-gray-300'
                      })}>
                        No tienes permisos para enviar mensajes en este ticket
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4 lg:space-y-6">
              {/* Ticket Info Card */}
              <div className={conditionalClasses({
                light: 'bg-linear-to-br from-[#f3ebf9] to-[#e8d5f5] rounded-xl p-4 lg:p-5 border-2 border-[#e8d5f5]',
                dark: 'bg-linear-to-br from-gray-700 to-gray-600 rounded-xl p-4 lg:p-5 border-2 border-gray-500'
              })}>
                <h4 className={conditionalClasses({
                  light: 'font-bold text-gray-900 mb-4 flex items-center gap-2 text-sm lg:text-base',
                  dark: 'font-bold text-white mb-4 flex items-center gap-2 text-sm lg:text-base'
                })}>
                  <FaClipboardList className="text-[#662d91] w-4 h-4 lg:w-5 lg:h-5" />
                  Información del Ticket
                </h4>
                <div className="space-y-3 text-sm">
                  <div className={conditionalClasses({
                    light: 'bg-white rounded-lg p-3 border border-[#e8d5f5]',
                    dark: 'bg-gray-600 rounded-lg p-3 border border-gray-500'
                  })}>
                    <p className={conditionalClasses({
                      light: 'text-xs text-gray-500 font-medium mb-1',
                      dark: 'text-xs text-gray-300 font-medium mb-1'
                    })}>Creado por</p>
                    <p className={conditionalClasses({
                      light: 'font-bold text-gray-900 flex items-center gap-2',
                      dark: 'font-bold text-white flex items-center gap-2'
                    })}>
                      <FaUserCircle className="text-[#662d91] w-4 h-4 lg:w-5 lg:h-5" />
                      <span className="truncate">{selectedTicket.creator?.name || 'Usuario'}</span>
                    </p>
                  </div>

                  <div className={conditionalClasses({
                    light: 'bg-white rounded-lg p-3 border border-[#e8d5f5]',
                    dark: 'bg-gray-600 rounded-lg p-3 border border-gray-500'
                  })}>
                    <p className={conditionalClasses({
                      light: 'text-xs text-gray-500 font-medium mb-1',
                      dark: 'text-xs text-gray-300 font-medium mb-1'
                    })}>Asignado a</p>
                    <p className={conditionalClasses({
                      light: 'font-bold text-gray-900 flex items-center gap-2',
                      dark: 'font-bold text-white flex items-center gap-2'
                    })}>
                      <FaUserCircle className="text-blue-600 w-4 h-4 lg:w-5 lg:h-5" />
                      <span className="truncate">{selectedTicket.assignee?.name || 'Sin asignar'}</span>
                    </p>
                  </div>

                  <div className={conditionalClasses({
                    light: 'bg-white rounded-lg p-3 border border-[#e8d5f5]',
                    dark: 'bg-gray-600 rounded-lg p-3 border border-gray-500'
                  })}>
                    <p className={conditionalClasses({
                      light: 'text-xs text-gray-500 font-medium mb-1',
                      dark: 'text-xs text-gray-300 font-medium mb-1'
                    })}>Fecha de creación</p>
                    <p className={conditionalClasses({
                      light: 'font-bold text-gray-900 flex items-center gap-2',
                      dark: 'font-bold text-white flex items-center gap-2'
                    })}>
                      <FaClock className="text-green-600 w-4 h-4 lg:w-5 lg:h-5" />
                      <span className="text-xs lg:text-sm">
                        {new Date(selectedTicket.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </p>
                  </div>

                  <div className={conditionalClasses({
                    light: 'bg-white rounded-lg p-3 border border-[#e8d5f5]',
                    dark: 'bg-gray-600 rounded-lg p-3 border border-gray-500'
                  })}>
                    <p className={conditionalClasses({
                      light: 'text-xs text-gray-500 font-medium mb-1',
                      dark: 'text-xs text-gray-300 font-medium mb-1'
                    })}>Última actualización</p>
                    <p className={conditionalClasses({
                      light: 'font-bold text-gray-900 flex items-center gap-2',
                      dark: 'font-bold text-white flex items-center gap-2'
                    })}>
                      <FaClock className="text-orange-600 w-4 h-4 lg:w-5 lg:h-5" />
                      {getTimeAgo(selectedTicket.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className={conditionalClasses({
                light: 'bg-white rounded-xl p-4 lg:p-5 border-2 border-gray-200',
                dark: 'bg-gray-700 rounded-xl p-4 lg:p-5 border-2 border-gray-600'
              })}>
                <h4 className={conditionalClasses({
                  light: 'font-bold text-gray-900 mb-4 text-sm lg:text-base',
                  dark: 'font-bold text-white mb-4 text-sm lg:text-base'
                })}>Acciones Rápidas</h4>
                <div className="space-y-2">
                  {canEditTicket(selectedTicket) && (
                    <button
                      onClick={() => {
                        setShowDetailModal(false);
                        handleEdit(selectedTicket);
                      }}
                      className={conditionalClasses({
                        light: 'w-full px-3 lg:px-4 py-2 lg:py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-xl transition-all flex items-center gap-2 text-sm lg:text-base',
                        dark: 'w-full px-3 lg:px-4 py-2 lg:py-3 bg-blue-900 hover:bg-blue-800 text-blue-200 font-semibold rounded-xl transition-all flex items-center gap-2 text-sm lg:text-base'
                      })}
                    >
                      <FaEdit className="w-3 h-3 lg:w-4 lg:h-4" />
                      Editar Ticket
                    </button>
                  )}

                  {canDeleteTicket(selectedTicket) && (
                    <button
                      onClick={() => {
                        setShowDetailModal(false);
                        handleDelete(selectedTicket);
                      }}
                      className={conditionalClasses({
                        light: 'w-full px-3 lg:px-4 py-2 lg:py-3 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-xl transition-all flex items-center gap-2 text-sm lg:text-base',
                        dark: 'w-full px-3 lg:px-4 py-2 lg:py-3 bg-red-900 hover:bg-red-800 text-red-200 font-semibold rounded-xl transition-all flex items-center gap-2 text-sm lg:text-base'
                      })}
                    >
                      <FaTrash className="w-3 h-3 lg:w-4 lg:h-4" />
                      Eliminar Ticket
                    </button>
                  )}

                  <button
                    onClick={() => setShowDetailModal(false)}
                    className={conditionalClasses({
                      light: 'w-full px-3 lg:px-4 py-2 lg:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all flex items-center gap-2 text-sm lg:text-base',
                      dark: 'w-full px-3 lg:px-4 py-2 lg:py-3 bg-gray-600 hover:bg-gray-500 text-gray-200 font-semibold rounded-xl transition-all flex items-center gap-2 text-sm lg:text-base'
                    })}
                  >
                    <FaTimes className="w-3 h-3 lg:w-4 lg:h-4" />
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailModal;
