import React, { useState } from 'react';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import ProcessingSteps from './ProcessingSteps';

const CollapsibleProcessingSteps = ({ steps, isDarkTheme }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!steps || steps.length === 0) {
    return null;
  }

  return (
    <div className="mb-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center gap-2 text-xs ${isDarkTheme ? 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'} transition-colors duration-200 p-1 rounded`}
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
          <ProcessingSteps steps={steps} isDarkTheme={isDarkTheme} />
        </div>
      )}
    </div>
  );
};

export default CollapsibleProcessingSteps; 