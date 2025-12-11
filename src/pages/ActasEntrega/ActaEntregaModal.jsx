import React, { useState } from 'react';
import { FaTimes, FaCheck, FaBox, FaUser, FaCalendarAlt, FaClipboardCheck, FaTimesCircle } from 'react-icons/fa';

const ActaEntregaModal = ({
  showModal,
  onClose,
  editingItem,
  formData,
  setFormData,
  formLoading,
  onSubmit,
  equiposDisponibles,
  usuarios
}) => {
  const [searchEquipo, setSearchEquipo] = useState('');
  const [showEquipoDropdown, setShowEquipoDropdown] = useState(false);
  const [searchUsuario, setSearchUsuario] = useState('');
  const [showUsuarioDropdown, setShowUsuarioDropdown] = useState(false);

  if (!showModal) return null;

  // Encontrar el equipo seleccionado
  const selectedEquipo = equiposDisponibles.find(equipo => equipo.id === formData.equipo_id);

  // Encontrar el usuario seleccionado
  const selectedUsuario = usuarios.find(user => user.id === formData.usuario_recibe_id);

  // Filtrar equipos por búsqueda y tipo
  const equiposFiltrados = equiposDisponibles
    .filter(equipo => equipo.tipo === formData.tipo_equipo)
    .filter(equipo =>
      searchEquipo === '' ||
      equipo.nombre.toLowerCase().includes(searchEquipo.toLowerCase())
    );

  // Filtrar usuarios por búsqueda
  const usuariosFiltrados = usuarios.filter(user =>
    searchUsuario === '' ||
    user.name.toLowerCase().includes(searchUsuario.toLowerCase()) ||
    user.email.toLowerCase().includes(searchUsuario.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] lg:max-h-[90vh] overflow-y-auto border-2 border-gray-200 animate-scale-in">
        <div className="sticky top-0 bg-linear-to-r from-[#662d91] to-[#8e4dbf] p-4 lg:p-6 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl lg:text-2xl font-bold text-white">
              {editingItem ? 'Editar Acta de Entrega' : 'Nueva Acta de Entrega'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-all text-white shrink-0"
            >
              <FaTimes className="w-5 h-5 lg:w-6 lg:h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="p-4 lg:p-6 space-y-4 lg:space-y-6">
          {/* Selección de Equipo */}
          <div>
            <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-[#f3ebf9] rounded-lg flex items-center justify-center">
                <FaBox className="w-3 h-3 lg:w-4 lg:h-4 text-[#662d91]" />
              </div>
              Selección de Equipo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tipo de Equipo *
                </label>
                <select
                  value={formData.tipo_equipo}
                  onChange={(e) => {
                    setFormData({ ...formData, tipo_equipo: e.target.value, equipo_id: '' });
                    setSearchEquipo('');
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
                  required
                >
                  <option value="inventory">Computadora/Laptop</option>
                  <option value="corporate_phone">Teléfono Celular</option>
                  <option value="tablet">Tablet</option>
                  <option value="pda">PDA</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Equipo Disponible *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder={`Buscar y seleccionar equipo... (${equiposDisponibles.filter(equipo => equipo.tipo === formData.tipo_equipo).length} disponibles)`}
                    value={selectedEquipo ? selectedEquipo.nombre : searchEquipo}
                    onChange={(e) => {
                      setSearchEquipo(e.target.value);
                      setFormData({ ...formData, equipo_id: '' });
                      setShowEquipoDropdown(true);
                    }}
                    onFocus={() => setShowEquipoDropdown(true)}
                    onBlur={() => setTimeout(() => setShowEquipoDropdown(false), 200)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
                    required
                  />
                  {showEquipoDropdown && (
                    <div className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                      {equiposFiltrados.length > 0 ? (
                        equiposFiltrados.map(equipo => (
                          <div
                            key={equipo.id}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            onClick={() => {
                              setFormData({ ...formData, equipo_id: equipo.id });
                              setSearchEquipo('');
                              setShowEquipoDropdown(false);

                              // Autollenar campos según el tipo de equipo seleccionado
                              if (equipo.tipo === 'inventory' && equipo.data) {
                                const inventoryData = equipo.data;
                                setFormData(prev => ({
                                  ...prev,
                                  marca: inventoryData.marca || '',
                                  modelo_equipo: inventoryData.it || '',
                                  serial_imei: inventoryData.serial || '',
                                  sistema_operativo: inventoryData.sistema_operativo || '',
                                  procesador: inventoryData.procesador || '',
                                  ram: inventoryData.ram || '',
                                  almacenamiento: inventoryData.almacenamiento || '',
                                  accesorio_cargador: true,
                                  accesorio_teclado: true,
                                  accesorio_office: true,
                                  accesorio_antivirus: true,
                                  accesorio_ssd: true,
                                  accesorio_hdd: true
                                }));
                              } else if (equipo.tipo === 'corporate_phone' && equipo.data) {
                                const phoneData = equipo.data;
                                setFormData(prev => ({
                                  ...prev,
                                  marca: phoneData.marca || '',
                                  modelo_equipo: phoneData.equipo_celular || '',
                                  serial_imei: phoneData.imei || '',
                                  linea_telefonica: phoneData.numero_celular || '',
                                  accesorio_cargador: true,
                                  accesorio_antivirus: true
                                }));
                              } else if (equipo.tipo === 'tablet' && equipo.data) {
                                const tabletData = equipo.data;
                                setFormData(prev => ({
                                  ...prev,
                                  marca: tabletData.marca || '',
                                  modelo_equipo: tabletData.modelo || '',
                                  serial_imei: tabletData.serial || '',
                                  almacenamiento: tabletData.capacidad_almacenamiento || '',
                                  ram: tabletData.ram || '',
                                  sistema_operativo: tabletData.sistema_operativo || '',
                                  accesorio_cargador: true,
                                  accesorio_antivirus: true
                                }));
                              } else if (equipo.tipo === 'pda' && equipo.data) {
                                const pdaData = equipo.data;
                                setFormData(prev => ({
                                  ...prev,
                                  marca: pdaData.marca || '',
                                  modelo_equipo: pdaData.modelo || '',
                                  serial_imei: pdaData.serial || '',
                                  almacenamiento: pdaData.almacenamiento || '',
                                  ram: pdaData.ram || '',
                                  sistema_operativo: pdaData.sistema_operativo || '',
                                  accesorio_cargador: true,
                                  accesorio_antivirus: true
                                }));
                              }
                            }}
                          >
                            <div className="font-medium text-gray-900">{equipo.nombre}</div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-gray-500 text-center">
                          {equiposDisponibles.filter(equipo => equipo.tipo === formData.tipo_equipo).length === 0
                            ? 'No hay equipos disponibles de este tipo'
                            : 'No se encontraron equipos con esa búsqueda'}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Información del Receptor */}
          <div className="pt-4 lg:pt-6 border-t-2 border-gray-100">
            <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaUser className="w-3 h-3 lg:w-4 lg:h-4 text-blue-600" />
              </div>
              Información del Receptor
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Usuario Receptor *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar y seleccionar usuario..."
                    value={selectedUsuario ? `${selectedUsuario.name} - ${selectedUsuario.email}` : searchUsuario}
                    onChange={(e) => {
                      setSearchUsuario(e.target.value);
                      setFormData({ ...formData, usuario_recibe_id: '' });
                      setShowUsuarioDropdown(true);
                    }}
                    onFocus={() => setShowUsuarioDropdown(true)}
                    onBlur={() => setTimeout(() => setShowUsuarioDropdown(false), 200)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
                    required
                  />
                  {showUsuarioDropdown && (
                    <div className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                      {usuariosFiltrados.length > 0 ? (
                        usuariosFiltrados.map(user => (
                          <div
                            key={user.id}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            onClick={() => {
                              setFormData({ ...formData, usuario_recibe_id: user.id });
                              setSearchUsuario('');
                              setShowUsuarioDropdown(false);
                            }}
                          >
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-600">{user.email}</div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-gray-500 text-center">
                          No se encontraron usuarios con esa búsqueda
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Área *
                </label>
                <select
                  value={formData.area_recibe}
                  onChange={(e) => setFormData({ ...formData, area_recibe: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
                  required
                >
                  <option value="">Seleccionar área</option>

                  {/* Producción y Operaciones */}
                  <optgroup label="Producción y Operaciones">
                    <option value="MATERIA PRIMA">Materia Prima</option>
                    <option value="PRODUCCION">Producción</option>
                    <option value="PRODUCTO TERMINADO">Producto Terminado</option>
                    <option value="DESPACHOS">Despachos</option>
                    <option value="DEVOLUCIONES">Devoluciones</option>
                    <option value="BODEGA">Bodega</option>
                    <option value="RECEPCION">Recepción</option>
                    <option value="ALMACENISTA">Almacenista</option>
                  </optgroup>
  
                  {/* Calidad y Laboratorio */}
                  <optgroup label="Calidad y Laboratorio">
                    <option value="CALIDAD">Calidad</option>
                    <option value="CALIDAD OROCCO">Calidad Orocco</option>
                    <option value="LABORATORIO">Laboratorio</option>
                    <option value="INVESTIGACION">Investigación</option>
                  </optgroup>
  
                  {/* Administración y Finanzas */}
                  <optgroup label="Administración y Finanzas">
                    <option value="CONTABILIDAD">Contabilidad</option>
                    <option value="COSTOS">Costos</option>
                    <option value="TESORERIA">Tesorería</option>
                    <option value="CARTERA">Cartera</option>
                    <option value="FACTURACION">Facturación</option>
                    <option value="COMPRAS">Compras</option>
                    <option value="JEFE COMPRAS">Jefe Compras</option>
                  </optgroup>
  
                  {/* Ventas y Mercadeo */}
                  <optgroup label="Ventas y Mercadeo">
                    <option value="VENTAS">Ventas</option>
                    <option value="MERCADEO">Mercadeo</option>
                    <option value="DIRECCION VENTAS">Dirección Ventas</option>
                    <option value="CALL CENTER">Call Center</option>
                    <option value="SAC">SAC</option>
                  </optgroup>
  
                  {/* Recursos Humanos */}
                  <optgroup label="Recursos Humanos">
                    <option value="RH">Recursos Humanos</option>
                    <option value="ADMINISTRATIVO">Administrativo</option>
                  </optgroup>
  
                  {/* Gerencia y Dirección */}
                  <optgroup label="Gerencia y Dirección">
                    <option value="GERENCIA">Gerencia</option>
                    <option value="SUB GERENCIA">Sub Gerencia</option>
                    <option value="EJECUTIVA">Ejecutiva</option>
                    <option value="COORDINADOR">Coordinador</option>
                    <option value="PLANEACION">Planeación</option>
                  </optgroup>
  
                  {/* Servicios Generales */}
                  <optgroup label="Servicios Generales">
                    <option value="MANTENIMIENTO">Mantenimiento</option>
                    <option value="REPARACION">Reparación</option>
                    <option value="SERVICIO GENERAL">Servicio General</option>
                    <option value="AMBIENTAL Y SST">Ambiental y SST</option>
                  </optgroup>
  
                  {/* Sistemas y Tecnología */}
                  <optgroup label="Sistemas y Tecnología">
                    <option value="SISTEMAS">Sistemas</option>
                    <option value="DESARROLLO">Desarrollo</option>
                  </optgroup>
  
                  {/* Control y Auditoría */}
                  <optgroup label="Control y Auditoría">
                    <option value="AUDITORIA">Auditoría</option>
                    <option value="ARCHIVO">Archivo</option>
                  </optgroup>
                </select>
              </div>
            </div>
          </div>

          {/* Detalles de la Entrega */}
          <div className="pt-4 lg:pt-6 border-t-2 border-gray-100">
            <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <FaCalendarAlt className="w-3 h-3 lg:w-4 lg:h-4 text-green-600" />
              </div>
              Detalles de la Entrega
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fecha de Entrega *
                </label>
                <input
                  type="date"
                  value={formData.fecha_entrega}
                  onChange={(e) => setFormData({ ...formData, fecha_entrega: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Motivo de Entrega *
                </label>
                <select
                  value={formData.motivo_entrega}
                  onChange={(e) => setFormData({ ...formData, motivo_entrega: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
                  required
                >
                  <option value="nuevo_empleado">Nuevo Empleado</option>
                  <option value="cambio_equipo">Cambio de Equipo</option>
                  <option value="mantenimiento">Mantenimiento</option>
                  <option value="fallas">Fallas</option>
                  <option value="otros">Otros</option>
                </select>
              </div>
            </div>

            {/* Información detallada del equipo */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-4">Información Detallada del Equipo</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Campos comunes para ambos tipos de dispositivos */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Marca
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: OPPO, Dell, HP"
                    value={formData.marca || ''}
                    onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Modelo
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: A40, CPH2669, XPS 15"
                    value={formData.modelo_equipo || ''}
                    onChange={(e) => setFormData({ ...formData, modelo_equipo: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
                  />
                </div>

                {/* Campos específicos según tipo de dispositivo */}
                {formData.tipo_equipo === 'inventory' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Serial
                      </label>
                      <input
                        type="text"
                        placeholder="Número de serie"
                        value={formData.serial_imei || ''}
                        onChange={(e) => setFormData({ ...formData, serial_imei: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Sistema Operativo
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Windows 11, macOS"
                        value={formData.sistema_operativo || ''}
                        onChange={(e) => setFormData({ ...formData, sistema_operativo: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Procesador
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Intel i7, AMD Ryzen"
                        value={formData.procesador || ''}
                        onChange={(e) => setFormData({ ...formData, procesador: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
                      />
                    </div>
                  </>
                )}

                {formData.tipo_equipo === 'corporate_phone' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        IMEI
                      </label>
                      <input
                        type="text"
                        placeholder="Número IMEI"
                        value={formData.serial_imei || ''}
                        onChange={(e) => setFormData({ ...formData, serial_imei: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Línea Telefónica
                      </label>
                      <input
                        type="text"
                        placeholder="Número de línea"
                        value={formData.linea_telefonica || ''}
                        onChange={(e) => setFormData({ ...formData, linea_telefonica: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Operador
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Claro, Movistar, Tigo"
                        value={formData.operador || ''}
                        onChange={(e) => setFormData({ ...formData, operador: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Plan de Datos
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: 10GB, Ilimitado"
                        value={formData.plan_datos || ''}
                        onChange={(e) => setFormData({ ...formData, plan_datos: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
                      />
                    </div>
                  </>
                )}

                {formData.tipo_equipo === 'tablet' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Serial
                      </label>
                      <input
                        type="text"
                        placeholder="Número de serie"
                        value={formData.serial_imei || ''}
                        onChange={(e) => setFormData({ ...formData, serial_imei: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Sistema Operativo
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Android 12, iPadOS"
                        value={formData.sistema_operativo || ''}
                        onChange={(e) => setFormData({ ...formData, sistema_operativo: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tamaño de Pantalla
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: 10.4 pulgadas"
                        value={formData.tamano_pantalla || ''}
                        onChange={(e) => setFormData({ ...formData, tamano_pantalla: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
                      />
                    </div>
                  </>
                )}

                {formData.tipo_equipo === 'pda' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Serial
                      </label>
                      <input
                        type="text"
                        placeholder="Número de serie"
                        value={formData.serial_imei || ''}
                        onChange={(e) => setFormData({ ...formData, serial_imei: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Sistema Operativo
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Windows Mobile, Android"
                        value={formData.sistema_operativo || ''}
                        onChange={(e) => setFormData({ ...formData, sistema_operativo: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tipo de Conectividad
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: WiFi, 4G, Bluetooth"
                        value={formData.tipo_conectividad || ''}
                        onChange={(e) => setFormData({ ...formData, tipo_conectividad: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Aplicaciones Instaladas
                      </label>
                      <textarea
                        placeholder="Ej: SAP, WMS, Scanner de códigos"
                        value={formData.aplicaciones_instaladas || ''}
                        onChange={(e) => setFormData({ ...formData, aplicaciones_instaladas: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base resize-none"
                        rows="2"
                      />
                    </div>
                  </>
                )}
                
                {/* Campos comunes para todos los tipos de dispositivos */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    RAM
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: 4GB, 8GB, 16GB"
                    value={formData.ram || ''}
                    onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Almacenamiento
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: 256GB, 512GB, 1TB"
                    value={formData.almacenamiento || ''}
                    onChange={(e) => setFormData({ ...formData, almacenamiento: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
                  />
                </div>
              </div>

              {/* Accesorios */}
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">Accesorios Incluidos</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {/* Accesorios comunes para ambos tipos */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="accesorio_cargador"
                      checked={formData.accesorio_cargador || false}
                      onChange={(e) => setFormData({ ...formData, accesorio_cargador: e.target.checked })}
                      className="w-4 h-4 text-[#662d91] focus:ring-[#662d91] border-gray-300 rounded"
                    />
                    <label htmlFor="accesorio_cargador" className="text-sm text-gray-700">Cargador</label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="accesorio_antivirus"
                      checked={formData.accesorio_antivirus || false}
                      onChange={(e) => setFormData({ ...formData, accesorio_antivirus: e.target.checked })}
                      className="w-4 h-4 text-[#662d91] focus:ring-[#662d91] border-gray-300 rounded"
                    />
                    <label htmlFor="accesorio_antivirus" className="text-sm text-gray-700">Antivirus</label>
                  </div>

                  {/* Accesorios específicos para computadora/laptop */}
                  {formData.tipo_equipo === 'inventory' && (
                    <>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="accesorio_teclado"
                          checked={formData.accesorio_teclado || false}
                          onChange={(e) => setFormData({ ...formData, accesorio_teclado: e.target.checked })}
                          className="w-4 h-4 text-[#662d91] focus:ring-[#662d91] border-gray-300 rounded"
                        />
                        <label htmlFor="accesorio_teclado" className="text-sm text-gray-700">Teclado</label>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="accesorio_office"
                          checked={formData.accesorio_office || false}
                          onChange={(e) => setFormData({ ...formData, accesorio_office: e.target.checked })}
                          className="w-4 h-4 text-[#662d91] focus:ring-[#662d91] border-gray-300 rounded"
                        />
                        <label htmlFor="accesorio_office" className="text-sm text-gray-700">Office</label>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="accesorio_ssd"
                          checked={formData.accesorio_ssd || false}
                          onChange={(e) => setFormData({ ...formData, accesorio_ssd: e.target.checked })}
                          className="w-4 h-4 text-[#662d91] focus:ring-[#662d91] border-gray-300 rounded"
                        />
                        <label htmlFor="accesorio_ssd" className="text-sm text-gray-700">SSD</label>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="accesorio_hdd"
                          checked={formData.accesorio_hdd || false}
                          onChange={(e) => setFormData({ ...formData, accesorio_hdd: e.target.checked })}
                          className="w-4 h-4 text-[#662d91] focus:ring-[#662d91] border-gray-300 rounded"
                        />
                        <label htmlFor="accesorio_hdd" className="text-sm text-gray-700">HDD</label>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Observaciones del Equipo
                </label>
                <textarea
                  placeholder="Observaciones específicas sobre el equipo"
                  value={formData.observaciones_equipo || ''}
                  onChange={(e) => setFormData({ ...formData, observaciones_equipo: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base resize-none"
                  rows="2"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Estado del Equipo al Entregar *
              </label>
              <textarea
                placeholder="Describa el estado físico del equipo (nuevo, usado, rayones, etc.)"
                value={formData.estado_equipo_entrega}
                onChange={(e) => setFormData({ ...formData, estado_equipo_entrega: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base resize-none"
                rows="3"
                required
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Observaciones
              </label>
              <textarea
                placeholder="Observaciones adicionales sobre la entrega"
                value={formData.observaciones_entrega}
                onChange={(e) => setFormData({ ...formData, observaciones_entrega: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base resize-none"
                rows="2"
              />
            </div>
          </div>

          {/* Políticas y Firmas */}
          <div className="pt-4 lg:pt-6 border-t-2 border-gray-100">
            <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <FaClipboardCheck className="w-3 h-3 lg:w-4 lg:h-4 text-amber-600" />
              </div>
              Políticas y Firmas
            </h3>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">Políticas de Uso del Equipo</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Usar el equipo exclusivamente para fines laborales</li>
                <li>• No instalar software malicioso sin autorización</li>
                <li>• Reportar inmediatamente pérdidas, daños o robos</li>
                <li>• Realizar copias de seguridad en rutas designadas</li>
                <li>• Navegar solo por sitios permitidos por la compañía</li>
                <li>• No compartir información confidencial</li>
              </ul>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <input
                type="checkbox"
                id="acepta_politica"
                checked={formData.acepta_politica}
                onChange={(e) => setFormData({ ...formData, acepta_politica: e.target.checked })}
                className="w-4 h-4 text-[#662d91] focus:ring-[#662d91] border-gray-300 rounded"
                required
              />
              <label htmlFor="acepta_politica" className="text-sm font-semibold text-gray-700">
                Acepto las políticas de uso del equipo *
              </label>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Firma del Receptor *
              </label>
              <input
                type="text"
                placeholder="Nombre completo del receptor"
                value={formData.firma_recibe}
                onChange={(e) => setFormData({ ...formData, firma_recibe: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
                required
              />
            </div>
          </div>

          {/* Sección de Devolución (solo para editar) */}
          {editingItem && (
            <div className="pt-4 lg:pt-6 border-t-2 border-gray-100">
              <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-6 h-6 lg:w-8 lg:h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <FaTimesCircle className="w-3 h-3 lg:w-4 lg:h-4 text-red-600" />
                </div>
                Devolución del Equipo (Opcional)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Fecha de Devolución
                  </label>
                  <input
                    type="date"
                    value={formData.fecha_devolucion}
                    onChange={(e) => setFormData({ ...formData, fecha_devolucion: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Estado del Equipo al Devolver
                  </label>
                  <input
                    type="text"
                    placeholder="Estado al momento de la devolución"
                    value={formData.estado_equipo_devolucion}
                    onChange={(e) => setFormData({ ...formData, estado_equipo_devolucion: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Observaciones de Devolución
                </label>
                <textarea
                  placeholder="Observaciones sobre la devolución del equipo"
                  value={formData.observaciones_devolucion}
                  onChange={(e) => setFormData({ ...formData, observaciones_devolucion: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base resize-none"
                  rows="2"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Firma del Entregador (Devolución)
                </label>
                <input
                  type="text"
                  placeholder="Nombre del entregador que recibe la devolución"
                  value={formData.firma_entrega_devolucion}
                  onChange={(e) => setFormData({ ...formData, firma_entrega_devolucion: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 lg:pt-6 border-t-2 border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 lg:px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all disabled:opacity-50 text-sm lg:text-base"
              disabled={formLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 lg:px-6 py-3 bg-linear-to-r from-[#662d91] to-[#8e4dbf] hover:from-[#7a3da8] hover:to-violet-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 text-sm lg:text-base"
              disabled={formLoading}
            >
              {formLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 lg:h-5 lg:w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {editingItem ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                <>
                  <FaCheck className="w-4 h-4 lg:w-5 lg:h-5" />
                  {editingItem ? 'Actualizar Acta' : 'Crear Acta'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActaEntregaModal;