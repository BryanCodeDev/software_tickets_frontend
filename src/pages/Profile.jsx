import React, { useContext, useState, useEffect, useCallback, useMemo } from 'react';
import AuthContext from '../context/AuthContext.jsx';
import { usersAPI, inventoryAPI } from '../api';
import { corporatePhoneAPI } from '../api';
import { FaCheck, FaTimes, FaUser, FaEnvelope, FaIdCard, FaPhone, FaShieldAlt, FaSave, FaSearch, FaMobile, FaTrash, FaExclamationCircle } from 'react-icons/fa';
import { onUserUpdated, offUserUpdated } from '../api/socket';
import { useThemeClasses } from '../hooks/useThemeClasses';
import { useNotifications } from '../hooks/useNotifications';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const { conditionalClasses } = useThemeClasses();
  const { notifySuccess, notifyError } = useNotifications();
   const [formData, setFormData] = useState({
     name: '',
     email: '',
     username: '',
     it: '',
     hasCorporatePhone: false,
     corporatePhone: ''
   });
   const [loading, setLoading] = useState(false);
   const [uniqueITs, setUniqueITs] = useState([]);
   const [availablePhones, setAvailablePhones] = useState([]);
   const [searchPhone, setSearchPhone] = useState('');
   const [showPhoneDropdown, setShowPhoneDropdown] = useState(false);
   const [errors, setErrors] = useState({});
   const [touched, setTouched] = useState({});

  const fetchUniqueITs = useCallback(async () => {
    try {
      const data = await inventoryAPI.fetchUniqueITs();
      setUniqueITs(data);
    } catch (err) {
      console.error('Error al cargar ITs:', err);
    }
  }, []);

  const fetchAvailablePhones = useCallback(async () => {
    try {
      const phones = await corporatePhoneAPI.fetchCorporatePhones();
      const activePhones = phones.filter(phone => phone.status === 'activo');
      setAvailablePhones(activePhones);
    } catch (err) {
      console.error('Error al cargar teléfonos corporativos:', err);
    }
  }, []);

  // Validaciones
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateUsername = (username) => {
    return username && username.length >= 3;
  };

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));

    const newErrors = { ...errors };

    if (name === 'name') {
      if (!value.trim()) {
        newErrors.name = 'El nombre es obligatorio';
      } else if (value.trim().length < 2) {
        newErrors.name = 'Mínimo 2 caracteres';
      } else {
        delete newErrors.name;
      }
    }

    if (name === 'email') {
      if (!value) {
        newErrors.email = 'El correo es obligatorio';
      } else if (!validateEmail(value)) {
        newErrors.email = 'Formato de correo inválido';
      } else {
        delete newErrors.email;
      }
    }

    if (name === 'username') {
      if (!value) {
        newErrors.username = 'El usuario es obligatorio';
      } else if (!validateUsername(value)) {
        newErrors.username = 'Mínimo 3 caracteres';
      } else {
        delete newErrors.username;
      }
    }

    setErrors(newErrors);
  }, [errors]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error al escribir
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

   // Cargar datos iniciales
   useEffect(() => {
     fetchUniqueITs();
     fetchAvailablePhones();
  }, [fetchUniqueITs, fetchAvailablePhones]);

  const selectedPhone = useMemo(() =>
    availablePhones.find(p => p.numero_celular === formData.corporatePhone) || null,
    [availablePhones, formData.corporatePhone]
  );

  const phonesFiltered = useMemo(() => {
    if (!searchPhone) return availablePhones;
    const q = searchPhone.toLowerCase();
    return availablePhones.filter(p =>
      p.numero_celular?.toLowerCase().includes(q) ||
      p.nombre?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    );
  }, [availablePhones, searchPhone]);

  // Inicializar formData con los datos del usuario actual
  useEffect(() => {
     if (user) {
       setFormData({
         name: user.name || user.username || '',
         email: user.email || '',
         username: user.username || '',
         it: user.it || '',
         hasCorporatePhone: user.hasCorporatePhone || false,
         corporatePhone: user.corporatePhone || ''
       });
     }
   }, [user]);

   useEffect(() => {
     const handleUserUpdated = (data) => {
      const { userId, user: updatedUser } = data;
      if (user && userId === user.id) {
        setFormData({
          name: updatedUser.name || updatedUser.username || '',
          email: updatedUser.email || '',
          username: updatedUser.username || '',
          it: updatedUser.it || '',
          hasCorporatePhone: updatedUser.hasCorporatePhone || false,
          corporatePhone: updatedUser.corporatePhone || ''
        });
        updateUser(updatedUser);
      }
    };

    onUserUpdated(handleUserUpdated);
    return () => offUserUpdated(handleUserUpdated);
  }, [user, updateUser]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setTouched({});

    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (!formData.email) {
      newErrors.email = 'El correo es obligatorio';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Formato de correo inválido';
    }

    if (!formData.username) {
      newErrors.username = 'El usuario es obligatorio';
    } else if (!validateUsername(formData.username)) {
      newErrors.username = 'Mínimo 3 caracteres';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const allTouched = Object.keys(newErrors).reduce((acc, key) => ({ ...acc, [key]: true }), {});
      setTouched(allTouched);
      setLoading(false);
      return;
    }

    try {
      const updatedUser = await usersAPI.updateProfile(formData);
      updateUser(updatedUser);
      notifySuccess('Perfil actualizado exitosamente');
      setTouched({});
      setErrors({});
    } catch (error) {
      const errorMsg = error?.response?.data?.error || 'Error al actualizar el perfil';
      notifyError(errorMsg);
      if (errorMsg.includes('correo') || errorMsg.includes('email')) {
        setErrors(prev => ({ ...prev, email: errorMsg }));
        setTouched(prev => ({ ...prev, email: true }));
      } else if (errorMsg.includes('usuario') || errorMsg.includes('username')) {
        setErrors(prev => ({ ...prev, username: errorMsg }));
        setTouched(prev => ({ ...prev, username: true }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={conditionalClasses({
      light: 'min-h-screen',
      dark: 'min-h-screen'
    })}>
      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        
        {/* Header Section */}
        <div className="mb-6 lg:mb-8">
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2.5 bg-linear-to-br from-[#662d91] to-[#8e4dbf] rounded-lg shadow-lg">
              <FaUser className="text-white text-xl sm:text-2xl" />
            </div>
            <div>
              <h1 className={conditionalClasses({
                light: 'text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900',
                dark: 'text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-100'
              })}>Mi Perfil</h1>
              <p className={conditionalClasses({
                light: 'text-sm sm:text-base text-gray-600 mt-0.5',
                dark: 'text-sm sm:text-base text-gray-300 mt-0.5'
              })}>Gestiona tu información personal y profesional</p>
            </div>
          </div>
        </div>

        {/* Main Profile Card */}
        <div className={conditionalClasses({
          light: 'bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden',
          dark: 'bg-gray-800 rounded-xl shadow-sm border border-gray-600 overflow-hidden'
        })}>
          
           {/* Role Badge Section */}
            <div className="bg-linear-to-r from-[#662d91] to-[#8e4dbf] px-4 sm:px-6 py-4">
             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 dark:bg-gray-700/50 backdrop-blur-sm rounded-lg">
                   <FaShieldAlt className="text-white text-lg" />
                 </div>
                 <div>
                   <p className="text-xs text-purple-200 font-medium">Rol del Sistema</p>
                   <p className="text-base sm:text-lg font-bold text-white">{user?.role?.name || 'N/A'}</p>
                 </div>
               </div>
               {(user?.role?.name === 'Coordinadora Administrativa' || user?.role?.name === 'Administrador') && (
                 <div className={conditionalClasses({
                   light: `px-3 py-1.5 rounded-full text-xs font-semibold w-fit ${
                     user?.role?.name === 'Administrador'
                       ? 'bg-yellow-100 text-yellow-700'
                       : 'bg-pink-100 text-pink-700'
                   }`,
                   dark: `px-3 py-1.5 rounded-full text-xs font-semibold w-fit ${
                     user?.role?.name === 'Administrador'
                       ? 'bg-yellow-900/50 text-yellow-300'
                       : 'bg-pink-900/50 text-pink-300'
                   }`
                 })}>
                   {user?.role?.name === 'Administrador' ? 'Acceso Total' : 'Gestión Administrativa'}
                 </div>
               )}
             </div>
           </div>

           {/* Form Section */}
          <div className="p-4 sm:p-6 lg:p-8">
            
            {/* Personal Information Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <div className={conditionalClasses({
                  light: 'h-px flex-1 bg-gray-200',
                  dark: 'h-px flex-1 bg-gray-600'
                })}></div>
                <h2 className={conditionalClasses({
                  light: 'text-base sm:text-lg font-bold text-gray-900 px-3',
                  dark: 'text-base sm:text-lg font-bold text-gray-100 px-3'
                })}>Información Personal</h2>
                <div className={conditionalClasses({
                  light: 'h-px flex-1 bg-gray-200',
                  dark: 'h-px flex-1 bg-gray-600'
                })}></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                 {/* Nombre Completo */}
                 <div className="space-y-2">
                   <label className={conditionalClasses({
                     light: 'flex items-center gap-2 text-sm font-semibold text-gray-700',
                     dark: 'flex items-center gap-2 text-sm font-semibold text-gray-300'
                   })}>
                     <FaUser className="text-[#662d91] text-xs" />
                     Nombre Completo
                   </label>
                   <input
                     type="text"
                     name="name"
                     value={formData.name}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     placeholder="Ingresa tu nombre completo"
                     className={conditionalClasses({
                       light: 'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7a3da8] focus:border-transparent transition-all text-sm sm:text-base hover:border-gray-400',
                       dark: 'w-full px-4 py-2.5 border border-gray-600 bg-gray-700 rounded-lg focus:ring-2 focus:ring-[#7a3da8] focus:border-transparent transition-all text-sm sm:text-base hover:border-gray-500 text-gray-100'
                     })}
                     required
                   />
                   {touched.name && errors.name && (
                     <p className={conditionalClasses({
                       light: 'text-xs text-red-600 mt-1 flex items-center gap-1',
                       dark: 'text-xs text-red-400 mt-1 flex items-center gap-1'
                     })}>
                       <FaExclamationCircle className="text-xs" />
                       {errors.name}
                     </p>
                   )}
                 </div>

                 {/* Correo Electrónico */}
                 <div className="space-y-2">
                   <label className={conditionalClasses({
                     light: 'flex items-center gap-2 text-sm font-semibold text-gray-700',
                     dark: 'flex items-center gap-2 text-sm font-semibold text-gray-300'
                   })}>
                     <FaEnvelope className="text-[#662d91] text-xs" />
                     Correo Electrónico
                   </label>
                   <input
                     type="email"
                     name="email"
                     value={formData.email}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     placeholder="correo@ejemplo.com"
                     className={conditionalClasses({
                       light: 'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7a3da8] focus:border-transparent transition-all text-sm sm:text-base hover:border-gray-400',
                       dark: 'w-full px-4 py-2.5 border border-gray-600 bg-gray-700 rounded-lg focus:ring-2 focus:ring-[#7a3da8] focus:border-transparent transition-all text-sm sm:text-base hover:border-gray-500 text-gray-100'
                     })}
                     required
                   />
                   {touched.email && errors.email && (
                     <p className={conditionalClasses({
                       light: 'text-xs text-red-600 mt-1 flex items-center gap-1',
                       dark: 'text-xs text-red-400 mt-1 flex items-center gap-1'
                     })}>
                       <FaExclamationCircle className="text-xs" />
                       {errors.email}
                     </p>
                   )}
                 </div>

                 {/* Nombre de Usuario */}
                 <div className="space-y-2">
                   <label className={conditionalClasses({
                     light: 'flex items-center gap-2 text-sm font-semibold text-gray-700',
                     dark: 'flex items-center gap-2 text-sm font-semibold text-gray-300'
                   })}>
                     <FaIdCard className="text-[#662d91] text-xs" />
                     Nombre de Usuario
                   </label>
                   <input
                     type="text"
                     name="username"
                     value={formData.username}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     placeholder="usuario123"
                     className={conditionalClasses({
                       light: 'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7a3da8] focus:border-transparent transition-all text-sm sm:text-base hover:border-gray-400',
                       dark: 'w-full px-4 py-2.5 border border-gray-600 bg-gray-700 rounded-lg focus:ring-2 focus:ring-[#7a3da8] focus:border-transparent transition-all text-sm sm:text-base hover:border-gray-500 text-gray-100'
                     })}
                     required
                   />
                   {touched.username && errors.username && (
                     <p className={conditionalClasses({
                       light: 'text-xs text-red-600 mt-1 flex items-center gap-1',
                       dark: 'text-xs text-red-400 mt-1 flex items-center gap-1'
                     })}>
                       <FaExclamationCircle className="text-xs" />
                       {errors.username}
                     </p>
                   )}
                 </div>

                 {/* Código IT */}
                 <div className="space-y-2">
                   <label className={conditionalClasses({
                     light: 'flex items-center gap-2 text-sm font-semibold text-gray-700',
                     dark: 'flex items-center gap-2 text-sm font-semibold text-gray-300'
                   })}>
                     <FaIdCard className="text-[#662d91] text-xs" />
                     Código IT (Equipo)
                   </label>
                  <select
                    name="it"
                    value={formData.it}
                    onChange={handleChange}
                    className={conditionalClasses({
                      light: 'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7a3da8] focus:border-transparent transition-all text-sm sm:text-base hover:border-gray-400 bg-white',
                      dark: 'w-full px-4 py-2.5 border border-gray-600 bg-gray-700 rounded-lg focus:ring-2 focus:ring-[#7a3da8] focus:border-transparent transition-all text-sm sm:text-base hover:border-gray-500 text-gray-100'
                    })}
                  >
                    <option value="" className={conditionalClasses({
                      light: 'text-gray-900',
                      dark: 'text-gray-100 bg-gray-700'
                    })}>Seleccionar código IT</option>
                    {uniqueITs.map((item) => (
                      <option key={item.it} value={item.it} className={conditionalClasses({
                        light: 'text-gray-900',
                        dark: 'text-gray-100 bg-gray-700'
                      })}>
                        {item.it} ({item.area})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Corporate Phone Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <div className={conditionalClasses({
                  light: 'h-px flex-1 bg-gray-200',
                  dark: 'h-px flex-1 bg-gray-600'
                })}></div>
                <h2 className={conditionalClasses({
                  light: 'text-base sm:text-lg font-bold text-gray-900 px-3',
                  dark: 'text-base sm:text-lg font-bold text-gray-100 px-3'
                })}>Teléfono Corporativo</h2>
                <div className={conditionalClasses({
                  light: 'h-px flex-1 bg-gray-200',
                  dark: 'h-px flex-1 bg-gray-600'
                })}></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* ¿Tiene teléfono corporativo? */}
                <div className="space-y-2">
                  <label className={conditionalClasses({
                    light: 'flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3',
                    dark: 'flex items-center gap-2 text-sm font-semibold text-gray-300 mb-3'
                  })}>
                    <FaPhone className="text-[#662d91] text-xs" />
                    ¿Tiene teléfono corporativo?
                  </label>
                  <div className="flex gap-3 flex-wrap">
                    <label className={conditionalClasses({
                      light: 'flex items-center gap-2 px-4 py-2.5 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50 has-checked:border-[#662d91] has-checked:bg-[#f3ebf9] has-checked:text-[#662d91] flex-1 min-w-25 border-gray-300',
                      dark: 'flex items-center gap-2 px-4 py-2.5 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-700 has-checked:border-[#662d91] has-checked:bg-[#f3ebf9]/20 has-checked:text-[#662d91] flex-1 min-w-25 border-gray-600'
                    })}>
                      <input
                        type="radio"
                        name="hasCorporatePhone"
                        checked={formData.hasCorporatePhone === true}
                        onChange={() => setFormData(prev => ({ ...prev, hasCorporatePhone: true }))}
                        className={conditionalClasses({
                          light: 'w-4 h-4 text-[#662d91] focus:ring-[#7a3da8]',
                          dark: 'w-4 h-4 text-[#662d91] focus:ring-[#7a3da8] bg-gray-800 border-gray-600'
                        })}
                      />
                      <span className={conditionalClasses({
                        light: 'text-sm font-medium text-gray-700',
                        dark: 'text-sm font-medium text-gray-300'
                      })}>Sí</span>
                    </label>
                    <label className={conditionalClasses({
                      light: 'flex items-center gap-2 px-4 py-2.5 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50 has-checked:border-[#662d91] has-checked:bg-[#f3ebf9] has-checked:text-[#662d91] flex-1 min-w-25 border-gray-300',
                      dark: 'flex items-center gap-2 px-4 py-2.5 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-700 has-checked:border-[#662d91] has-checked:bg-[#f3ebf9]/20 has-checked:text-[#662d91] flex-1 min-w-25 border-gray-600'
                    })}>
                      <input
                        type="radio"
                        name="hasCorporatePhone"
                        checked={formData.hasCorporatePhone === false}
                        onChange={() => {
                          setFormData(prev => ({ ...prev, hasCorporatePhone: false, corporatePhone: '' }));
                          setSearchPhone('');
                        }}
                        className={conditionalClasses({
                          light: 'w-4 h-4 text-[#662d91] focus:ring-[#7a3da8]',
                          dark: 'w-4 h-4 text-[#662d91] focus:ring-[#7a3da8] bg-gray-800 border-gray-600'
                        })}
                      />
                      <span className={conditionalClasses({
                        light: 'text-sm font-medium text-gray-700',
                        dark: 'text-sm font-medium text-gray-300'
                      })}>No</span>
                    </label>
                  </div>
                </div>

                {/* Número Corporativo */}
                {formData.hasCorporatePhone && (
                  <div className="space-y-2">
                    <label className={conditionalClasses({
                      light: 'flex items-center gap-2 text-sm font-semibold text-gray-700',
                      dark: 'flex items-center gap-2 text-sm font-semibold text-gray-300'
                    })}>
                      <FaMobile className="text-[#662d91] text-xs" />
                      Número Corporativo
                      <span className={conditionalClasses({
                        light: 'ml-auto text-xs font-normal text-gray-500',
                        dark: 'ml-auto text-xs font-normal text-gray-400'
                      })}>
                        {availablePhones.length} disponibles
                      </span>
                    </label>
                     <div className="relative">
                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                         <FaSearch className={conditionalClasses({
                           light: 'text-gray-400 text-sm',
                           dark: 'text-gray-500 text-sm'
                         })} />
                       </div>
                       <input
                         type="text"
                         placeholder="Buscar número, nombre o categoría..."
                         value={selectedPhone ? `${selectedPhone.numero_celular} - ${selectedPhone.nombre} (${selectedPhone.category})` : searchPhone}
                         onChange={(e) => {
                           setSearchPhone(e.target.value);
                           setFormData(prev => ({ ...prev, corporatePhone: '' }));
                           setShowPhoneDropdown(true);
                         }}
                         onFocus={() => setShowPhoneDropdown(true)}
                         onBlur={() => setTimeout(() => setShowPhoneDropdown(false), 200)}
                         className={conditionalClasses({
                           light: 'w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7a3da8] focus:border-transparent transition-all text-sm sm:text-base hover:border-gray-400',
                           dark: 'w-full pl-10 pr-10 py-2.5 border border-gray-600 bg-gray-700 rounded-lg focus:ring-2 focus:ring-[#7a3da8] focus:border-transparent transition-all text-sm sm:text-base hover:border-gray-500 text-gray-100'
                         })}
                       />
                       {selectedPhone && (
                         <button
                           type="button"
                           onClick={() => {
                             setFormData(prev => ({ ...prev, corporatePhone: '' }));
                             setSearchPhone('');
                           }}
                           className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                           title="Quitar selección"
                         >
                           <FaTimes className="text-sm" />
                         </button>
                       )}
                      
                      {/* Dropdown de teléfonos */}
                      {showPhoneDropdown && (
                        <div className={conditionalClasses({
                          light: 'absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-y-auto',
                          dark: 'absolute z-50 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-xl max-h-64 overflow-y-auto'
                        })}>
                          {phonesFiltered.length > 0 ? (
                            <div className="py-1">
                              {phonesFiltered.map(phone => (
                                <div
                                  key={phone.id}
                                  className={conditionalClasses({
                                    light: 'px-4 py-3 hover:bg-[#f3ebf9] cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors',
                                    dark: 'px-4 py-3 hover:bg-gray-700 cursor-pointer border-b border-gray-600 last:border-b-0 transition-colors'
                                  })}
                                  onClick={() => {
                                    setFormData(prev => ({ ...prev, corporatePhone: phone.numero_celular }));
                                    setSearchPhone('');
                                    setShowPhoneDropdown(false);
                                  }}
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className={conditionalClasses({
                                        light: 'font-semibold text-gray-900 text-sm',
                                        dark: 'font-semibold text-gray-100 text-sm'
                                      })}>{phone.numero_celular}</div>
                                      <div className={conditionalClasses({
                                        light: 'text-xs text-gray-600',
                                        dark: 'text-xs text-gray-400'
                                      })}>{phone.nombre}</div>
                                    </div>
                                    <div className={conditionalClasses({
                                      light: 'px-2 py-1 bg-[#f3ebf9] text-[#662d91] text-xs font-medium rounded',
                                      dark: 'px-2 py-1 bg-[#662d91]/30 text-purple-300 text-xs font-medium rounded'
                                    })}>
                                      {phone.category}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className={conditionalClasses({
                              light: 'px-4 py-8 text-center bg-white',
                              dark: 'px-4 py-8 text-center bg-gray-800'
                            })}>
                              <FaPhone className={conditionalClasses({
                                light: 'mx-auto text-gray-400 text-2xl mb-2',
                                dark: 'mx-auto text-gray-500 text-2xl mb-2'
                              })} />
                              <p className={conditionalClasses({
                                light: 'text-sm text-gray-500',
                                dark: 'text-sm text-gray-400'
                              })}>
                                {availablePhones.length === 0
                                  ? 'No hay teléfonos disponibles'
                                  : 'No se encontraron resultados'}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {selectedPhone && (
                      <div className={conditionalClasses({
                        light: 'mt-2 p-3 bg-green-50 border border-green-200 rounded-lg',
                        dark: 'mt-2 p-3 bg-green-900/40 border border-green-700 rounded-lg'
                      })}>
                        <div className="flex items-center gap-2">
                          <FaCheck className={conditionalClasses({
                            light: 'text-green-600 text-sm',
                            dark: 'text-green-400 text-sm'
                          })} />
                          <p className={conditionalClasses({
                            light: 'text-xs font-medium text-green-700',
                            dark: 'text-xs font-medium text-green-300'
                          })}>
                            Teléfono seleccionado correctamente
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Additional Info Card */}
            {(user?.role?.name === 'Coordinadora Administrativa' || user?.role?.name === 'Administrador') && (
              <div className={conditionalClasses({
                light: `mb-6 p-4 rounded-lg border-l-4 ${
                  user?.role?.name === 'Administrador'
                    ? 'bg-yellow-50 border-yellow-500'
                    : 'bg-pink-50 border-pink-500'
                }`,
                dark: `mb-6 p-4 rounded-lg border-l-4 ${
                  user?.role?.name === 'Administrador'
                    ? 'bg-yellow-900/30 border-yellow-600'
                    : 'bg-pink-900/30 border-pink-600'
                }`
              })}>
                <div className="flex items-start gap-3">
                  <FaShieldAlt className={conditionalClasses({
                    light: `mt-0.5 shrink-0 ${
                      user?.role?.name === 'Administrador' ? 'text-yellow-600' : 'text-pink-600'
                    }`,
                    dark: `mt-0.5 shrink-0 ${
                      user?.role?.name === 'Administrador' ? 'text-yellow-400' : 'text-pink-400'
                    }`
                  })} />
                  <div className="flex-1 min-w-0">
                    <p className={conditionalClasses({
                      light: `text-sm font-semibold mb-1 ${
                        user?.role?.name === 'Administrador' ? 'text-yellow-900' : 'text-pink-900'
                      }`,
                      dark: `text-sm font-semibold mb-1 ${
                        user?.role?.name === 'Administrador' ? 'text-yellow-200' : 'text-pink-200'
                      }`
                    })}>
                      Responsabilidades del Rol
                    </p>
                    <p className={conditionalClasses({
                      light: `text-xs ${
                        user?.role?.name === 'Administrador' ? 'text-yellow-700' : 'text-pink-700'
                      }`,
                      dark: `text-xs ${
                        user?.role?.name === 'Administrador' ? 'text-yellow-300' : 'text-pink-300'
                      }`
                    })}>
                      {user?.role?.name === 'Administrador'
                        ? 'Control total sobre el sistema, gestión de usuarios, roles, auditoría y configuración general.'
                        : 'Gestión administrativa de compras, actas de entrega y recursos corporativos.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className={conditionalClasses({
              light: 'flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200',
              dark: 'flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-600'
            })}>
              <div className={conditionalClasses({
                light: 'flex items-center gap-2 text-xs sm:text-sm text-gray-500',
                dark: 'flex items-center gap-2 text-xs sm:text-sm text-gray-400'
              })}>
                <div className={conditionalClasses({
                  light: 'w-2 h-2 bg-green-500 rounded-full animate-pulse',
                  dark: 'w-2 h-2 bg-green-400 rounded-full animate-pulse'
                })}></div>
                <span>Todos los cambios se guardan de forma segura</span>
              </div>

               <button
                 onClick={handleSubmit}
                 disabled={loading || Object.keys(errors).length > 0}
                 className={conditionalClasses({
                    light: 'w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-[#662d91] to-[#8e4dbf] text-white rounded-lg font-semibold hover:from-[#7a3da8] hover:to-[#662d91] focus:ring-4 focus:ring-[#e8d5f5] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl',
                    dark: 'w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-[#662d91] to-[#8e4dbf] text-white rounded-lg font-semibold hover:from-[#7a3da8] hover:to-[#662d91] focus:ring-4 focus:ring-[#e8d5f5]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl'
                 })}
               >
                 {loading ? (
                   <>
                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                     <span>Guardando...</span>
                   </>
                 ) : (
                   <>
                     <FaSave className="text-sm" />
                     <span>Guardar Cambios</span>
                   </>
                 )}
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
