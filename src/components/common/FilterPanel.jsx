import React from 'react';
import { FaSearch, FaFilter, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';

const FilterPanel = React.memo(({
  searchTerm,
  onSearchChange,
  showFilters,
  onToggleFilters,
  filters = [],
  sortBy,
  sortOrder,
  onSortChange,
  onSortOrderChange,
  sortOptions = []
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all text-gray-700 font-medium text-xs sm:text-sm lg:text-base"
            />
          </div>

          <button
            onClick={onToggleFilters}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition-all duration-200 min-w-[100px] sm:min-w-[120px] ${
              showFilters
                ? 'bg-[#662d91] text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaFilter className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm">Filtros</span>
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-4 sm:pt-6 border-t-2 border-gray-100 animate-fade-in">
            {filters.map((filter, index) => (
              <div key={index}>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  {filter.label}
                </label>
                {filter.type === 'select' ? (
                  <select
                    value={filter.value}
                    onChange={(e) => filter.onChange(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-xs sm:text-sm"
                  >
                    <option value="all">{filter.placeholder || 'Todos'}</option>
                    {filter.options?.map((option, idx) => (
                      <option key={idx} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : filter.type === 'multiselect' ? (
                  <select
                    value={filter.value}
                    onChange={(e) => filter.onChange(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-xs sm:text-sm bg-white"
                  >
                    <option value="all">{filter.placeholder || 'Todos'}</option>
                    {filter.optgroups?.map((optgroup, idx) => (
                      <optgroup key={idx} label={optgroup.label}>
                        {optgroup.options.map((option, optIdx) => (
                          <option key={optIdx} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                ) : null}
              </div>
            ))}

            {sortOptions.length > 0 && (
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Ordenar por</label>
                <div className="flex gap-1.5 sm:gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => onSortChange(e.target.value)}
                    className="flex-1 px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-xs sm:text-sm"
                  >
                    {sortOptions.map((option, idx) => (
                      <option key={idx} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                  >
                    {sortOrder === 'asc' ? <FaSortAmountDown className="w-3 h-3 sm:w-4 lg:w-5 lg:h-5" /> : <FaSortAmountUp className="w-3 h-3 sm:w-4 lg:w-5 lg:h-5" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

FilterPanel.displayName = 'FilterPanel';

export default FilterPanel;

