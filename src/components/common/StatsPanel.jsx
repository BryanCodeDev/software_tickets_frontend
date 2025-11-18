import React from 'react';

const StatsPanel = React.memo(({ stats, showStats, onToggleStats, title, statsConfig }) => {
  if (!showStats) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 animate-fade-in">
      {statsConfig.map((stat, index) => {
        const value = stats[stat.key];
        const isLastItem = index === statsConfig.length - 1;
        const colSpan = isLastItem && statsConfig.length % 2 !== 0 ? 'col-span-2 sm:col-span-2 lg:col-span-1' : '';

        return (
          <div
            key={stat.key}
            className={`bg-linear-to-br ${stat.gradient} rounded-xl lg:rounded-2xl p-3 lg:p-5 text-white shadow-lg ${colSpan}`}
          >
            <div className="flex items-center justify-between mb-1 lg:mb-2">
              <stat.icon className="w-6 h-6 lg:w-8 lg:h-8 opacity-80" />
              <span className="text-xl lg:text-3xl font-bold">
                {stat.loading ? '...' : stat.formatter ? stat.formatter(value) : value}
              </span>
            </div>
            <p className="text-xs lg:text-sm font-medium opacity-90">{stat.label}</p>
            {stat.description && (
              <p className="text-xs opacity-75 mt-1 hidden sm:block">{stat.description}</p>
            )}
          </div>
        );
      })}
    </div>
  );
});

StatsPanel.displayName = 'StatsPanel';

export default StatsPanel;