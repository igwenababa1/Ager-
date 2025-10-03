
import React from 'react';
import { Task } from '../types';

interface ResultModalProps {
  task: Task;
  onClose: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ task, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-brand-surface border border-brand-border rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-brand-border">
          <h3 className="text-lg font-semibold text-gray-100">
            Result for <span className="font-mono text-brand-primary">{task.command}</span>
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono bg-brand-bg p-4 rounded-md">
            {task.result}
          </pre>
        </div>
        <div className="p-4 border-t border-brand-border text-right">
            <button
                onClick={onClose}
                className="py-2 px-4 border border-brand-border rounded-md shadow-sm text-sm font-medium text-gray-200 bg-brand-surface hover:bg-brand-border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-surface focus:ring-brand-primary"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;