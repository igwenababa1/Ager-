
import React from 'react';
import { Task, TaskStatus, CommandType } from '../types';
import { TerminalIcon, FileIcon, PersistenceIcon } from './icons';

interface TaskHistoryProps {
  tasks: Task[];
  onViewResult: (task: Task) => void;
  isLoading: boolean;
  implantId: string | null;
}

const TaskHistory: React.FC<TaskHistoryProps> = ({ tasks, onViewResult, isLoading, implantId }) => {
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.Completed: return 'bg-brand-success/20 text-brand-success';
      case TaskStatus.Executing: return 'bg-brand-primary/20 text-brand-primary animate-pulse';
      case TaskStatus.Pending: return 'bg-brand-warning/20 text-brand-warning';
      case TaskStatus.Failed: return 'bg-brand-danger/20 text-brand-danger';
      default: return 'bg-gray-700 text-gray-300';
    }
  };

  const getCommandIcon = (command: CommandType) => {
      const className = "w-4 h-4 mr-2 inline-block";
      switch(command) {
          case CommandType.SYSINFO: return <TerminalIcon className={className} />;
          case CommandType.FILE_FETCH: return <FileIcon className={className} />;
          case CommandType.PERSIST_USER: return <PersistenceIcon className={className} />;
          default: return null;
      }
  }

  const formatTimestamp = (isoString: string) => {
    return new Date(isoString).toLocaleString();
  };

  return (
    <div className="bg-brand-surface border border-brand-border rounded-lg shadow-lg">
      <div className="p-4 border-b border-brand-border">
        <h2 className="text-lg font-semibold text-gray-100">Task History</h2>
        <p className="text-sm text-brand-secondary">Commands issued to the selected implant.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-brand-border">
          <thead className="bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-secondary uppercase tracking-wider">Command</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-secondary uppercase tracking-wider">Arguments</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-secondary uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-secondary uppercase tracking-wider">Timestamp</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-secondary uppercase tracking-wider">Result</th>
            </tr>
          </thead>
          <tbody className="bg-brand-surface divide-y divide-brand-border">
            {isLoading ? (
              <tr><td colSpan={5} className="text-center p-8 text-brand-secondary">Loading tasks...</td></tr>
            ) : !implantId ? (
              <tr><td colSpan={5} className="text-center p-8 text-brand-secondary">No implant selected.</td></tr>
            ) : tasks.length === 0 ? (
              <tr><td colSpan={5} className="text-center p-8 text-brand-secondary">No tasks for this implant yet.</td></tr>
            ) : tasks.map((task) => (
              <tr key={task.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-200">
                    {getCommandIcon(task.command)}
                    {task.command}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono truncate max-w-xs">{task.args || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{formatTimestamp(task.timestamp)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {task.result ? (
                    <button
                      onClick={() => onViewResult(task)}
                      className="text-brand-primary hover:underline"
                    >
                      View
                    </button>
                  ) : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskHistory;