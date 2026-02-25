import React from 'react';
import { FaSearch, FaFilter, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import { useThemeClasses } from '../../hooks/useThemeClasses';

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
  const { conditionalClasses } = useThemeClasses();

  return (
    <div className={`
      rounded-2xl shadow-lg border-2 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6
      ${conditionalClasses({
        light: 'bg-white border-gray-200',
        dark: 'bg-gray-800 border-gray-700'
      })}
    `}>
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <FaSearch className={`
              absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5
              ${conditionalClasses({
                light: 'text-gray-400',
                dark: 'text-gray-500'
              })}
            `} />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className={`
                w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium text-xs sm:text-sm lg:text-base
                ${conditionalClasses({
                  light: 'border-gray-200 text-gray-700 bg-white',
                  dark: 'border-gray-600 text-gray-100 bg-gray-700'
                })}
              `}
            />
          </div>

          <button
            onClick={onToggleFilters}
            className={`
              flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition-all duration-200 min-w-25 sm:min-w-30
              ${showFilters
                ? conditionalClasses({
                    light: 'bg-[#662d91] text-white shadow-lg',
                    dark: 'bg-purple-600 text-white shadow-lg'
                  })
                : conditionalClasses({
                    light: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                    dark: 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  })
              }
            `}
          >
            <FaFilter className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm">Filtros</span>
          </button>
        </div>

        {showFilters && (
          <div className={`
            grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-4 sm:pt-6 animate-fade-in
            ${conditionalClasses({
              light: 'border-t-2 border-gray-100',
              dark: 'border-t-2 border-gray-600'
            })}
          `}>
            {filters.map((filter, index) => (
              <div key={index}>
                <label className={`
                  block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2
                  ${conditionalClasses({
                    light: 'text-gray-700',
                    dark: 'text-gray-200'
                  })}
                `}>
                  {filter.label}
                </label>
                {filter.type === 'select' ? (
                  <select
                    value={filter.value}
                    onChange={(e) => filter.onChange(e.target.value)}
                    className={`
                      w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium text-xs sm:text-sm
                      ${conditionalClasses({
                        light: 'border-gray-200 bg-white text-gray-700',
                        dark: 'border-gray-600 bg-gray-700 text-gray-100'
                      })}
                    `}
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
                    className={`
                      w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium text-xs sm:text-sm
                      ${conditionalClasses({
                        light: 'border-gray-200 bg-white text-gray-700',
                        dark: 'border-gray-600 bg-gray-700 text-gray-100'
                      })}
                    `}
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
                <label className={`
                  block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2
                  ${conditionalClasses({
                    light: 'text-gray-700',
                    dark: 'text-gray-200'
                  })}
                `}>Ordenar por</label>
                <div className="flex gap-1.5 sm:gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => onSortChange(e.target.value)}
                    className={`
                      flex-1 px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium text-xs sm:text-sm
                      ${conditionalClasses({
                        light: 'border-gray-200 bg-white text-gray-700',
                        dark: 'border-gray-600 bg-gray-700 text-gray-100'
                      })}
                    `}
                  >
                    {sortOptions.map((option, idx) => (
                      <option key={idx} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className={`
                      px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 rounded-xl transition-all
                      ${conditionalClasses({
                        light: 'bg-gray-100 hover:bg-gray-200 text-gray-600',
                        dark: 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      })}
                    `}
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
