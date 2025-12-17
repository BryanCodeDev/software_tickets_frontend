import React from 'react';
import { FilterPanel } from '../../../components/common';

const FilterSection = ({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  sortBy,
  sortOrder,
  setSortBy,
  setSortOrder,
  uniqueTypes,
  filteredDocumentsList
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <FilterPanel
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={[
          {
            label: 'Tipo',
            value: filterType,
            onChange: setFilterType,
            type: 'select',
            options: uniqueTypes.map(type => ({ value: type, label: type }))
          }
        ]}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={setSortBy}
        onSortOrderChange={(order) => setSortOrder(order)}
        sortOptions={[
          { value: 'createdAt', label: 'Fecha de creación' },
          { value: 'title', label: 'Título' },
          { value: 'type', label: 'Tipo' },
          { value: 'version', label: 'Versión' }
        ]}
      />

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-600">
          Mostrando <span className="font-bold text-[#662d91]">{filteredDocumentsList.length}</span> documentos
        </p>
      </div>
    </div>
  );
};

export default FilterSection;