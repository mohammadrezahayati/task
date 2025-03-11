'use client';
import { fetchSubmittedApplications } from '@/utils/network';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from './context/createTheme';

const ApplicationList = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['submissions'],
    queryFn: fetchSubmittedApplications,
  });

  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { theme } = useTheme();

  const dragItem = useRef<any>(null);
  const dragOverItem = useRef<any>(null);

  useEffect(() => {
    if (data?.columns) {
      setSelectedColumns(data.columns);
    }
  }, [data]);

  const handleColumnToggle = (column: string) => {
    setSelectedColumns((prevColumns) =>
      prevColumns.includes(column)
        ? prevColumns.filter((col) => col !== column)
        : [...prevColumns, column]
    );
  };

  const handleSelectAllColumns = () => {
    if (selectedColumns.length === data?.columns.length) {
      setSelectedColumns([]);
    } else {
      setSelectedColumns(data?.columns || []);
    }
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const compareValues = (a: any, b: any, sortOrder: 'asc' | 'desc') => {
    if (typeof a === 'string' && typeof b === 'string') {
      return sortOrder === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
    }
    if (typeof a === 'number' && typeof b === 'number') {
      return sortOrder === 'asc' ? a - b : b - a;
    }
    if (a instanceof Date && b instanceof Date) {
      return sortOrder === 'asc'
        ? a.getTime() - b.getTime()
        : b.getTime() - a.getTime();
    }
    return 0;
  };

  const sortedData = Array.isArray(data?.data)
    ? data?.data.sort((a, b) => {
        if (!sortColumn) return 0;
        const valA = a[sortColumn];
        const valB = b[sortColumn];
        return compareValues(valA, valB, sortOrder);
      })
    : [];

  const dragStart = (e: React.DragEvent, index: number) => {
    dragItem.current = index;
    e.dataTransfer.effectAllowed = 'move';
  };

  const dragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    dragOverItem.current = index;
  };

  const dragEnd = () => {
    const draggedColumns = [...selectedColumns];
    const draggedItem = draggedColumns[dragItem.current];
    draggedColumns.splice(dragItem.current, 1);
    draggedColumns.splice(dragOverItem.current, 0, draggedItem);
    setSelectedColumns(draggedColumns);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  if (isLoading) return <p>Loading submissions...</p>;
  if (isError) return <p>Error loading submissions.</p>;

  return (
    <div
      className={`p-6 rounded-lg shadow-md transition-all ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}>
      <div className='mb-4'>
        <h3 className='font-semibold mb-2'>Select Columns to Display</h3>
        <div className='flex items-center space-x-2 flex-wrap'>
          <label className='flex w-full items-center space-x-2 cursor-pointer '>
            <input
              type='checkbox'
              checked={selectedColumns.length === data?.columns.length}
              onChange={handleSelectAllColumns}
              className='w-4 h-4'
            />
            <span>Select All</span>
          </label>
          {data?.columns.map((column: string) => (
            <label
              key={column}
              className='flex items-center space-x-2 cursor-pointer'>
              <input
                type='checkbox'
                checked={selectedColumns.includes(column)}
                onChange={() => handleColumnToggle(column)}
                className='w-4 h-4'
              />
              <span>{column}</span>
            </label>
          ))}
        </div>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full border rounded-lg shadow-md'>
          <thead
            className={`text-left font-semibold ${
              theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200'
            }`}>
            <tr>
              {selectedColumns.map((column, index) => (
                <th
                  key={column}
                  onClick={() => handleSort(column)}
                  draggable
                  onDragStart={(e) => dragStart(e, index)}
                  onDragOver={(e) => dragOver(e, index)}
                  onDragEnd={dragEnd}
                  className='cursor-pointer p-3 border-b dark:hover:bg-gray-700 hover:text-white transition'>
                  {column}{' '}
                  {sortColumn === column
                    ? sortOrder === 'asc'
                      ? '🔼' 
                      : '🔽'
                    : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData?.map((row, index) => (
              <tr
                key={row.id || index}
                className={`border-b transition ${
                  theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}>
                {selectedColumns.map((column) => (
                  <td key={column} className='p-3'>
                    {row[column]}
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

export default ApplicationList;
