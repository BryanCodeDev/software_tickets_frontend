import React, { useState, useEffect, useContext } from 'react';
import { documentsAPI } from '../../api';
import AuthContext from '../../context/AuthContext.jsx';
import { FaFile, FaUpload, FaDownload, FaEdit, FaTrash, FaCheck, FaTimes, FaFileAlt, FaTag, FaSearch, FaSortAmountDown, FaSortAmountUp, FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaFileArchive, FaClock, FaUser } from 'react-icons/fa';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [editingDocument, setEditingDocument] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', type: '', category: '', version: '1.0', file: null, isNewVersion: false, parentDocumentId: null, changeDescription: '' });
  const [editFormData, setEditFormData] = useState({ title: '', description: '', type: '', category: '', expiryDate: '' });
  const [notification, setNotification] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const { user } = useContext(AuthContext);

  // NUEVAS FUNCIONALIDADES: Estados para búsqueda, filtros y ordenamiento
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const data = await documentsAPI.fetchDocuments();
      setDocuments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrado y ordenamiento de documentos (solo versiones activas más recientes)
  const filterAndSortDocuments = () => {
    // Agrupar documentos por parentDocumentId o id si no tiene parent
    const grouped = documents.reduce((acc, doc) => {
      const key = doc.parentDocumentId || doc.id;
      if (!acc[key]) acc[key] = [];
      acc[key].push(doc);
      return acc;
    }, {});

    // Para cada grupo, tomar la versión activa más reciente
    let filtered = Object.values(grouped).map(group => {
      const activeVersions = group.filter(doc => doc.isActive !== false); // Asumir true si no definido
      if (activeVersions.length === 0) return group[0]; // Si ninguno activo, tomar el primero
      return activeVersions.sort((a, b) => parseFloat(b.version) - parseFloat(a.version))[0];
    });

    // Búsqueda por título, descripción, tipo o categoría
    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por tipo
    if (filterType !== 'all') {
      filtered = filtered.filter(doc => doc.type?.toLowerCase() === filterType.toLowerCase());
    }


    // Ordenamiento
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === 'createdAt') {
        aVal = new Date(aVal || 0);
        bVal = new Date(bVal || 0);
      } else if (sortBy === 'version') {
        aVal = parseFloat(aVal || 0);
        bVal = parseFloat(bVal || 0);
      } else if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal?.toLowerCase() || '';
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  };

  const filteredDocuments = filterAndSortDocuments();

  // Obtener tipos únicos para filtros
  const uniqueTypes = [...new Set(documents.map(doc => doc.type).filter(Boolean))];

  // Obtener icono según tipo de archivo
  const getFileIcon = (filePath) => {
    const extension = filePath?.split('.').pop().toLowerCase();
    switch(extension) {
      case 'pdf': return <FaFilePdf className="text-red-600 text-xl" />;
      case 'doc':
      case 'docx': return <FaFileWord className="text-blue-600 text-xl" />;
      case 'xls':
      case 'xlsx': return <FaFileExcel className="text-green-600 text-xl" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return <FaFileImage className="text-purple-600 text-xl" />;
      case 'zip':
      case 'rar': return <FaFileArchive className="text-yellow-600 text-xl" />;
      default: return <FaFileAlt className="text-purple-600 text-xl" />;
    }
  };


  // NUEVA FUNCIONALIDAD: Obtener tiempo relativo
  const getTimeAgo = (date) => {
    if (!date) return 'Desconocido';
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Hace un momento';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Hace ${minutes}min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Hace ${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `Hace ${days}d`;
    const months = Math.floor(days / 30);
    if (months < 12) return `Hace ${months}m`;
    return `Hace ${Math.floor(months / 12)}a`;
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploadLoading(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('type', formData.type);
    data.append('category', formData.category);
    data.append('version', formData.version);
    data.append('file', formData.file);
    data.append('isNewVersion', formData.isNewVersion);
    if (formData.isNewVersion) {
      data.append('parentDocumentId', formData.parentDocumentId);
      data.append('changeDescription', formData.changeDescription);
    }

    try {
      await documentsAPI.uploadDocument(data);
      fetchDocuments();
      setFormData({ title: '', description: '', type: '', category: '', version: '1.0', file: null, isNewVersion: false, parentDocumentId: null, changeDescription: '' });
      setShowUploadModal(false);
      showNotification('Documento subido exitosamente', 'success');
    } catch (err) {
      console.error(err);
      showNotification('Error al subir el documento. Por favor, inténtalo de nuevo.', 'error');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleEdit = (doc) => {
    setEditingDocument(doc);
    setEditFormData({
      title: doc.title,
      description: doc.description,
      type: doc.type,
      category: doc.category
    });
    setShowEditModal(true);
  };

  const handleViewHistory = (doc) => {
    const key = doc.parentDocumentId || doc.id;
    const versions = documents.filter(d => (d.parentDocumentId || d.id) === key).sort((a, b) => parseFloat(b.version) - parseFloat(a.version));
    setSelectedDocument({ ...doc, versions });
    setShowHistoryModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await documentsAPI.updateDocument(editingDocument.id, editFormData);
      fetchDocuments();
      setShowEditModal(false);
      showNotification('Documento actualizado exitosamente', 'success');
    } catch (err) {
      console.error(err);
      showNotification('Error al actualizar el documento. Por favor, inténtalo de nuevo.', 'error');
    }
  };

  const handleDelete = async (id) => {
    showConfirmDialog('¿Estás seguro de que deseas eliminar este documento?', async () => {
      try {
        await documentsAPI.deleteDocument(id);
        fetchDocuments();
        showNotification('Documento eliminado exitosamente', 'success');
      } catch (err) {
        console.error(err);
        showNotification('Error al eliminar el documento. Por favor, inténtalo de nuevo.', 'error');
      }
    });
  };

  const handleDeleteVersion = async (versionId) => {
    showConfirmDialog('¿Estás seguro de que deseas eliminar esta versión del documento?', async () => {
      try {
        await documentsAPI.deleteDocument(versionId);
        fetchDocuments();
        // Actualizar el historial si está abierto
        if (showHistoryModal && selectedDocument) {
          const key = selectedDocument.parentDocumentId || selectedDocument.id;
          const updatedVersions = documents.filter(d => (d.parentDocumentId || d.id) === key).sort((a, b) => parseFloat(b.version) - parseFloat(a.version));
          setSelectedDocument({ ...selectedDocument, versions: updatedVersions });
        }
        showNotification('Versión eliminada exitosamente', 'success');
      } catch (err) {
        console.error(err);
        showNotification('Error al eliminar la versión. Por favor, inténtalo de nuevo.', 'error');
      }
    });
  };

  const canEdit = (doc) => {
    return user?.role?.name === 'Administrador' || (user?.role?.name === 'Empleado' && doc.createdBy === user.id);
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const showConfirmDialog = (message, onConfirm) => {
    setConfirmDialog({ message, onConfirm });
  };

  const handleConfirm = () => {
    if (confirmDialog?.onConfirm) {
      confirmDialog.onConfirm();
    }
    setConfirmDialog(null);
  };

  const handleCancelConfirm = () => {
    setConfirmDialog(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-violet-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando documentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-violet-50 to-indigo-50">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 max-w-md animate-in slide-in-from-right">
          <div className={`flex items-center p-4 rounded-xl shadow-2xl transition-all duration-300 backdrop-blur-sm ${
            notification.type === 'success'
              ? 'bg-white border-l-4 border-green-500'
              : 'bg-white border-l-4 border-red-500'
          }`}>
            <div className="shrink-0">
              {notification.type === 'success' ? (
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <FaCheck className="w-5 h-5 text-green-600" />
                </div>
              ) : (
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <FaTimes className="w-5 h-5 text-red-600" />
                </div>
              )}
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-semibold text-gray-900">{notification.message}</p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-in zoom-in-95">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <FaTrash className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Confirmar Eliminación</h3>
              <p className="text-gray-600 text-center mb-6">{confirmDialog.message}</p>
              <div className="flex gap-3">
                <button
                  onClick={handleCancelConfirm}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-linear-to-br from-purple-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FaFileAlt className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Control de Versiones</h1>
                <p className="text-gray-600 mt-1">Gestiona versiones de políticas y documentos oficiales</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center space-x-2 bg-purple-50 px-4 py-2 rounded-xl">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">{filteredDocuments.length} documentos</span>
              </div>
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center px-5 py-2.5 bg-linear-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <FaUpload className="mr-2" />
                Nuevo Documento
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* Barra de búsqueda y filtros simplificados */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar documentos por título, descripción, tipo o categoría..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-700 font-medium"
              />
            </div>

            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium"
                >
                  <option value="all">Todos los tipos</option>
                  {uniqueTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ordenar por</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium"
                >
                  <option value="createdAt">Fecha de creación</option>
                  <option value="title">Título</option>
                  <option value="type">Tipo</option>
                  <option value="version">Versión</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Orden</label>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="w-full px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {sortOrder === 'asc' ? <FaSortAmountDown className="w-5 h-5" /> : <FaSortAmountUp className="w-5 h-5" />}
                  <span className="text-sm font-medium">{sortOrder === 'asc' ? 'Asc' : 'Desc'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600 font-medium">
            Mostrando <span className="font-bold text-purple-600">{filteredDocuments.length}</span> documentos
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-linear-to-r from-purple-50 to-violet-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FaFile className="text-purple-600 text-lg" />
                <h2 className="text-lg font-bold text-gray-900">Repositorio de Versiones de Documentos</h2>
              </div>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full">
                {filteredDocuments.length} total
              </span>
            </div>
          </div>

          <div className="p-6">
            {filteredDocuments.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaFileAlt className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchTerm || filterType !== 'all'
                    ? 'No se encontraron documentos'
                    : 'Sin documentos disponibles'}
                </h3>
                <p className="text-gray-600 max-w-sm mx-auto">
                  {searchTerm || filterType !== 'all'
                    ? 'Intenta ajustar los filtros de búsqueda'
                    : 'Comienza agregando tu primer documento utilizando el formulario de carga'}
                </p>
              </div>
            ) : (
              <>
                {/* NUEVA FUNCIONALIDAD: Vista de cuadrícula */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredDocuments.map((doc) => {
                      return (
                        <div
                          key={doc.id}
                          className="group bg-linear-to-r from-gray-50 to-white rounded-xl p-5 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-200"
                        >
                          {/* Document Header with Icon and Info */}
                          <div className="flex items-start space-x-4 mb-4">
                            <div className="w-12 h-12 bg-linear-to-br from-purple-100 to-violet-100 rounded-xl flex items-center justify-center shrink-0">
                              {getFileIcon(doc.filePath)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-900 mb-2 text-lg">{doc.title}</h3>
                              <div className="flex flex-wrap gap-2 mb-2">
                                {doc.type && (
                                  <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg">
                                    <FaTag className="mr-1.5 text-xs" />
                                    {doc.type}
                                  </span>
                                )}
                                {doc.category && (
                                  <span className="inline-flex items-center px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-lg">
                                    {doc.category}
                                  </span>
                                )}
                                {doc.version && (
                                  <span className="inline-flex items-center px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-lg">
                                    v{doc.version}
                                  </span>
                                )}
                              </div>
                              {doc.description && (
                                <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
                              )}
                              {/* NUEVA FUNCIONALIDAD: Información adicional */}
                              <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                                {doc.createdAt && (
                                  <span className="flex items-center gap-1">
                                    <FaClock className="w-3 h-3" />
                                    {getTimeAgo(doc.createdAt)}
                                  </span>
                                )}
                                {doc.createdByUser && (
                                  <span className="flex items-center gap-1">
                                    <FaUser className="w-3 h-3" />
                                    {doc.createdByUser.name || doc.createdByUser.username}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                            <a
                              href={`http://localhost:5000/${doc.filePath}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-4 py-2.5 bg-linear-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
                            >
                              <FaDownload className="mr-2" />
                              Descargar
                            </a>
                            <button
                              onClick={() => handleViewHistory(doc)}
                              className="inline-flex items-center px-4 py-2.5 bg-green-50 hover:bg-green-100 text-green-700 text-sm font-semibold rounded-lg transition-all"
                            >
                              <FaClock className="mr-2" />
                              Ver Versiones
                            </button>
                            {canEdit(doc) && (
                              <>
                                <button
                                  onClick={() => handleEdit(doc)}
                                  className="inline-flex items-center px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-semibold rounded-lg transition-all"
                                >
                                  <FaEdit className="mr-2" />
                                  Editar
                                </button>
                                <button
                                  onClick={() => handleDelete(doc.id)}
                                  className="inline-flex items-center px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-semibold rounded-lg transition-all"
                                >
                                  <FaTrash className="mr-2" />
                                  Eliminar
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden transform transition-all animate-in zoom-in-95">
            <div className="sticky top-0 bg-white px-6 py-5 border-b border-gray-200 rounded-t-2xl z-10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-linear-to-br from-purple-600 to-violet-600 rounded-xl flex items-center justify-center">
                  <FaUpload className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Nuevo Documento</h2>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <FaTimes className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-5rem)]">
              <div className="flex items-center space-x-4 mb-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="uploadType"
                    checked={!formData.isNewVersion}
                    onChange={() => setFormData({ ...formData, isNewVersion: false, parentDocumentId: null })}
                    className="mr-2"
                  />
                  Nuevo Documento
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="uploadType"
                    checked={formData.isNewVersion}
                    onChange={() => setFormData({ ...formData, isNewVersion: true })}
                    className="mr-2"
                  />
                  Nueva Versión
                </label>
              </div>

              {formData.isNewVersion && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Seleccionar Documento Existente <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.parentDocumentId || ''}
                    onChange={(e) => {
                      const selectedDoc = documents.find(doc => doc.id === parseInt(e.target.value));
                      setFormData({
                        ...formData,
                        parentDocumentId: e.target.value,
                        title: selectedDoc ? selectedDoc.title : '',
                        type: selectedDoc ? selectedDoc.type : '',
                        category: selectedDoc ? selectedDoc.category : '',
                        version: selectedDoc ? (parseFloat(selectedDoc.version) + 0.1).toFixed(1) : '1.0'
                      });
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required={formData.isNewVersion}
                  >
                    <option value="">Seleccionar documento...</option>
                    {documents.filter(doc => doc.isActive).map((doc) => (
                      <option key={doc.id} value={doc.id}>{doc.title} (v{doc.version})</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Título <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nombre del documento"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                    disabled={formData.isNewVersion}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Versión</label>
                  <input
                    type="text"
                    placeholder="Ej: 1.0"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo</label>
                  <input
                    type="text"
                    placeholder="Ej: Manual, Política"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    disabled={formData.isNewVersion}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Categoría</label>
                  <input
                    type="text"
                    placeholder="Ej: Recursos Humanos"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    disabled={formData.isNewVersion}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
                  <textarea
                    placeholder="Descripción del contenido del documento"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                    rows="3"
                  />
                </div>

                {formData.isNewVersion && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción de Cambios</label>
                    <textarea
                      placeholder="Describe los cambios en esta versión"
                      value={formData.changeDescription}
                      onChange={(e) => setFormData({ ...formData, changeDescription: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                      rows="2"
                    />
                  </div>
                )}

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Archivo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 file:cursor-pointer"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-linear-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  disabled={uploadLoading}
                >
                  {uploadLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Subiendo...
                    </>
                  ) : (
                    <>
                      <FaUpload className="mr-2" />
                      Subir Documento
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto transform transition-all animate-in zoom-in-95">
            <div className="sticky top-0 bg-white px-6 py-5 border-b border-gray-200 rounded-t-2xl z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-linear-to-br from-purple-600 to-violet-600 rounded-xl flex items-center justify-center">
                    <FaEdit className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Editar Documento</h2>
                </div>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <FaTimes className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Título <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nombre del documento"
                    value={editFormData.title}
                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo</label>
                  <input
                    type="text"
                    placeholder="Ej: Manual, Política"
                    value={editFormData.type}
                    onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Categoría</label>
                  <input
                    type="text"
                    placeholder="Ej: Recursos Humanos"
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
                  <textarea
                    placeholder="Descripción del contenido del documento"
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                    rows="4"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-linear-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Actualizar Documento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && selectedDocument && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all animate-in zoom-in-95">
            <div className="sticky top-0 bg-white px-6 py-5 border-b border-gray-200 rounded-t-2xl z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-linear-to-br from-purple-600 to-violet-600 rounded-xl flex items-center justify-center">
                    <FaClock className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Historial de Versiones: {selectedDocument.title}</h2>
                </div>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <FaTimes className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {selectedDocument.versions.map((version, index) => (
                  <div key={version.id} className={`p-4 rounded-xl border ${version.isActive ? 'border-purple-300 bg-purple-50' : 'border-gray-200 bg-gray-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg font-bold text-gray-900">Versión {version.version}</span>
                        {version.isActive && <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">Activa</span>}
                        <span className="text-sm text-gray-500">{getTimeAgo(version.createdAt)}</span>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={`http://localhost:5000/${version.filePath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-all"
                        >
                          <FaDownload className="mr-1" />
                          Descargar
                        </a>
                        {user.role?.name === 'Administrador' && (
                          <button
                            onClick={() => handleDeleteVersion(version.id)}
                            className="inline-flex items-center px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-all"
                          >
                            <FaTrash className="mr-1" />
                            Eliminar
                          </button>
                        )}
                      </div>
                    </div>
                    {version.changeDescription && (
                      <p className="text-sm text-gray-600 mb-2"><strong>Cambios:</strong> {version.changeDescription}</p>
                    )}
                    {version.description && (
                      <p className="text-sm text-gray-600"><strong>Descripción:</strong> {version.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;