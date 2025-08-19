import React from 'react';

export const TableSkeleton = ({ rows = 5, columns = 5 }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {Array.from({ length: columns }).map((_, index) => (
                <th key={index} className="px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
        <div className="flex space-x-2">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
          <div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
          <div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
        </div>
      </div>
    </div>
  );
};

export const FormSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
        </div>
      </div>
      
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="space-y-3">
            <div className="h-5 bg-gray-200 rounded animate-pulse w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse w-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const AnalyticsSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-64"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-96"></div>
          </div>
          <div className="flex space-x-3">
            <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                <div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
              </div>
              <div className="h-12 w-12 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="h-6 bg-gray-200 rounded animate-pulse w-48 mb-6"></div>
        <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
};
