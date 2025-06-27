import React, { useState } from 'react';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import ProcessingSteps from './ProcessingSteps';

const CollapsibleProcessingSteps = ({ steps }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!steps || steps.length === 0) {
    return null;
  }

  return (
    <div className="mb-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200 p-1 rounded hover:bg-gray-100"
      >
        {isExpanded ? (
          <FiChevronDown className="w-3 h-3" />
        ) : (
          <FiChevronRight className="w-3 h-3" />
        )}
        <span>Processing Details ({steps.length} steps)</span>
      </button>
      
      {isExpanded && (
        <div className="mt-2 animate-in slide-in-from-top-2 duration-200">
          <ProcessingSteps steps={steps} />
        </div>
      )}
    </div>
  );
};

export default CollapsibleProcessingSteps; 