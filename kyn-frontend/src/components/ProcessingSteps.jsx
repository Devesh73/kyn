import React from 'react';
import { FiCheck, FiLoader, FiAlertTriangle, FiX } from 'react-icons/fi';

const ProcessingSteps = ({ steps }) => {
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing':
        return <FiLoader className="w-4 h-4 animate-spin text-blue-500" />;
      case 'completed':
        return <FiCheck className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <FiAlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <FiX className="w-4 h-4 text-red-500" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-300" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing':
        return 'border-blue-200 bg-blue-50';
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getStepTitle = (stepType) => {
    switch (stepType) {
      case 'analysis':
        return 'Query Analysis';
      case 'user_extraction':
        return 'User ID Extraction';
      case 'data_collection':
        return 'Data Collection';
      case 'processing':
        return 'Data Processing';
      case 'ai_analysis':
        return 'AI Analysis';
      case 'api_call':
        return 'Data API Call';
      case 'completion':
        return 'Completion';
      case 'error':
        return 'Error';
      default:
        return stepType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  if (!steps || steps.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 rounded-lg p-3 mb-3 border border-gray-200">
      <div className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
        <FiLoader className="w-3 h-3" />
        Processing Details
      </div>
      <div className="space-y-2">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex items-start gap-2 p-2 rounded border transition-all duration-200 ${getStatusColor(step.status)}`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {getStatusIcon(step.status)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-gray-800">
                {getStepTitle(step.step)}
              </div>
              <div className="text-xs text-gray-600 break-words">
                {step.message}
              </div>
              {step.data && (
                <div className="text-xs text-gray-500 mt-1">
                  {step.data.apis && (
                    <span>APIs: {step.data.apis.join(', ')}</span>
                  )}
                  {step.data.user_ids && (
                    <span>Users: {step.data.user_ids.join(', ')}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProcessingSteps; 