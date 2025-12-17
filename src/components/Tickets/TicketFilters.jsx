import React, { memo } from 'react';
import { FaSearch, FaFilter, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import { useThemeClasses } from '../../hooks/useThemeClasses';

const TicketFilters = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterPriority,
  setFilterPriority,
  titleFilter,
  setTitleFilter,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  showFilters,
  setShowFilters,
  standardizedTitles
}) => {
  const { conditionalClasses } = useThemeClasses();

  return (
    <div className={conditionalClasses({
      light: "bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-4 lg:p-6 mb-6",
      dark: "bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-700 p-4 lg:p-6 mb-6"
    })}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por título, descripción o creador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={conditionalClasses({
                light: "w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all text-gray-700 font-medium text-sm lg:text-base bg-white",
                dark: "w-full pl-12 pr-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all text-gray-200 font-medium text-sm lg:text-base bg-gray-700"
              })}
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={conditionalClasses({
              light: `flex items-center justify-center gap-2 px-4 lg:px-6 py-3 rounded-xl font-semibold transition-all duration-200 min-w-[120px] ${
                showFilters
                  ? 'bg-[#662d91] text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`,
              dark: `flex items-center justify-center gap-2 px-4 lg:px-6 py-3 rounded-xl font-semibold transition-all duration-200 min-w-[120px] ${
                showFilters
                  ? 'bg-[#662d91] text-white shadow-lg'
                  : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
              }`
            })}
          >
            <FaFilter className="w-4 h-4" />
            <span>Filtros</span>
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t-2 border-gray-100 animate-fade-in">
            <div>
              <label className={conditionalClasses({
                light: "block text-sm font-semibold text-gray-700 mb-2",
                dark: "block text-sm font-semibold text-gray-300 mb-2"
              })}>Estado</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm"
              >
                <option value="all">Todos los estados</option>
                <option value="abierto">Abierto</option>
                <option value="en progreso">En Progreso</option>
                <option value="resuelto">Resuelto</option>
                <option value="cerrado">Cerrado</option>
              </select>
            </div>

            <div>
              <label className={conditionalClasses({
                light: "block text-sm font-semibold text-gray-700 mb-2",
                dark: "block text-sm font-semibold text-gray-300 mb-2"
              })}>Prioridad</label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm"
              >
                <option value="all">Todas las prioridades</option>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>

            <div>
              <label className={conditionalClasses({
                light: "block text-sm font-semibold text-gray-700 mb-2",
                dark: "block text-sm font-semibold text-gray-300 mb-2"
              })}>Categoría</label>
              <select
                value={titleFilter}
                onChange={(e) => setTitleFilter(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm"
              >
                <option value="">Todas las categorías</option>
                {standardizedTitles.map((title, index) => (
                  <option key={index} value={title}>{title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={conditionalClasses({
                light: "block text-sm font-semibold text-gray-700 mb-2",
                dark: "block text-sm font-semibold text-gray-300 mb-2"
              })}>Ordenar por</label>
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 px-3 lg:px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm"
                >
                  <option value="createdAt">Fecha creación</option>
                  <option value="updatedAt">Última actualización</option>
                  <option value="priority">Prioridad</option>
                  <option value="status">Estado</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-3 lg:px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                >
                  {sortOrder === 'asc' ? <FaSortAmountDown className="w-4 h-4 lg:w-5 lg:h-5" /> : <FaSortAmountUp className="w-4 h-4 lg:w-5 lg:h-5" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Memoización para evitar re-renders innecesarios
const MemoizedTicketFilters = memo(TicketFilters);
MemoizedTicketFilters.displayName = 'TicketFilters';

export default MemoizedTicketFilters;