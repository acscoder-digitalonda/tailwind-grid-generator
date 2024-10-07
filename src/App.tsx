import React, { useState, useRef, useEffect } from 'react';
import { Grid, Plus, Copy } from 'lucide-react';
import GridItem from './components/GridItem';
import { GridItemType } from './types';

function App() {
  const [columns, setColumns] = useState(3);
  const [rows, setRows] = useState(3);
  const [gap, setGap] = useState(4);
  const [gridItems, setGridItems] = useState<GridItemType[]>([]);
  const [nextId, setNextId] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);

  const addGridItem = () => {
    const newItem: GridItemType = {
      id: nextId,
      x: 1,
      y: 1,
      w: 1,
      h: 1,
    };
    setGridItems([...gridItems, newItem]);
    setNextId(nextId + 1);
  };

  const updateGridItem = (id: number, updates: Partial<GridItemType>) => {
    setGridItems(gridItems.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const removeGridItem = (id: number) => {
    setGridItems(gridItems.filter(item => item.id !== id));
  };

  const generateHTML = () => {
    const gridStyle = `grid-cols-${columns} grid-rows-${rows} gap-${gap}`;
    const itemsHTML = gridItems.map(item => {
      return `<div class="col-start-${item.x} col-span-${item.w} row-start-${item.y} row-span-${item.h}"></div>`;
    }).join('\n  ');

    return `<div class="grid ${gridStyle}">\n  ${itemsHTML}\n</div>`;
  };

  const copyToClipboard = () => {
    const html = generateHTML();
    navigator.clipboard.writeText(html).then(() => {
      alert('HTML copied to clipboard!');
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Tailwind CSS Grid Generator</h1>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex gap-4 mb-4">
          <div>
            <label htmlFor="columns" className="block text-sm font-medium text-gray-700">Columns</label>
            <input
              type="number"
              id="columns"
              value={columns}
              onChange={(e) => setColumns(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="rows" className="block text-sm font-medium text-gray-700">Rows</label>
            <input
              type="number"
              id="rows"
              value={rows}
              onChange={(e) => setRows(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="gap" className="block text-sm font-medium text-gray-700">Gap</label>
            <input
              type="number"
              id="gap"
              value={gap}
              onChange={(e) => setGap(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
        </div>
        <div className="mb-4">
          <button
            onClick={addGridItem}
            className="flex items-center justify-center w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="mr-2" size={16} /> Add Grid Item
          </button>
        </div>
        <div
          ref={gridRef}
          className={`grid grid-cols-${columns} grid-rows-${rows} gap-${gap} bg-gray-200 p-4 mb-4`}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          }}
        >
          {gridItems.map((item) => (
            <GridItem
              key={item.id}
              item={item}
              updateItem={updateGridItem}
              removeItem={removeGridItem}
              gridRef={gridRef}
              columns={columns}
              rows={rows}
            />
          ))}
        </div>
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Generated HTML</h2>
          <button
            onClick={copyToClipboard}
            className="flex items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Copy className="mr-2" size={16} /> Copy HTML
          </button>
        </div>
        <pre className="bg-gray-100 p-4 rounded-md mt-2 overflow-x-auto">
          <code>{generateHTML()}</code>
        </pre>
      </div>
    </div>
  );
}

export default App;