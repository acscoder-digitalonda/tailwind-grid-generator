import React, { useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { GridItemType } from '../types';

interface GridItemProps {
  item: GridItemType;
  updateItem: (id: number, updates: Partial<GridItemType>) => void;
  removeItem: (id: number) => void;
  gridRef: React.RefObject<HTMLDivElement>;
  columns: number;
  rows: number;
}

const GridItem: React.FC<GridItemProps> = ({ item, updateItem, removeItem, gridRef, columns, rows }) => {
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (itemRef.current && gridRef.current) {
      const dragElement = (e: MouseEvent) => {
        e.preventDefault();
        const gridRect = gridRef.current!.getBoundingClientRect();
        const cellWidth = gridRect.width / columns;
        const cellHeight = gridRect.height / rows;

        const newX = Math.max(1, Math.min(columns, Math.round((e.clientX - gridRect.left) / cellWidth)));
        const newY = Math.max(1, Math.min(rows, Math.round((e.clientY - gridRect.top) / cellHeight)));

        updateItem(item.id, { x: newX, y: newY });
      };

      const stopDragging = () => {
        document.removeEventListener('mousemove', dragElement);
        document.removeEventListener('mouseup', stopDragging);
      };

      const startDragging = (e: MouseEvent) => {
        e.preventDefault();
        document.addEventListener('mousemove', dragElement);
        document.addEventListener('mouseup', stopDragging);
      };

      itemRef.current.addEventListener('mousedown', startDragging);

      return () => {
        itemRef.current?.removeEventListener('mousedown', startDragging);
      };
    }
  }, [item, updateItem, gridRef, columns, rows]);

  const handleResize = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = item.w;
    const startHeight = item.h;

    const onMouseMove = (e: MouseEvent) => {
      if (gridRef.current) {
        const gridRect = gridRef.current.getBoundingClientRect();
        const cellWidth = gridRect.width / columns;
        const cellHeight = gridRect.height / rows;

        const deltaX = Math.round((e.clientX - startX) / cellWidth);
        const deltaY = Math.round((e.clientY - startY) / cellHeight);

        const newWidth = Math.max(1, Math.min(columns - item.x + 1, startWidth + deltaX));
        const newHeight = Math.max(1, Math.min(rows - item.y + 1, startHeight + deltaY));

        updateItem(item.id, { w: newWidth, h: newHeight });
      }
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div
      ref={itemRef}
      className="bg-white border-2 border-indigo-500 rounded-md flex items-center justify-center relative cursor-move"
      style={{
        gridColumn: `${item.x} / span ${item.w}`,
        gridRow: `${item.y} / span ${item.h}`,
      }}
    >
      <button
        onClick={() => removeItem(item.id)}
        className="absolute top-1 right-1 text-red-500 hover:text-red-700 focus:outline-none"
      >
        <X size={16} />
      </button>
      <div
        className="absolute bottom-1 right-1 w-4 h-4 bg-indigo-500 rounded-full cursor-se-resize"
        onMouseDown={handleResize}
      ></div>
      <span className="text-gray-500 select-none">
        {item.x},{item.y} - {item.w}x{item.h}
      </span>
    </div>
  );
};

export default GridItem;