
import React, { useState, useEffect, useCallback } from 'react';
import { Implant, Task, CommandType, TaskStatus } from '../types';
import { fetchImplants, fetchTasks, sendCommand, simulateTaskExecution } from '../services/mockApi';
import ImplantTable from './ImplantTable';
import CommandPanel from './CommandPanel';
import TaskHistory from './TaskHistory';
import ResultModal from './ResultModal';

const Dashboard: React.FC = () => {
  const [implants, setImplants] = useState<Implant[]>([]);
  const [tasks, setTasks] = useState<Record<string, Task[]>>({});
  const [selectedImplantId, setSelectedImplantId] = useState<string | null>(null);
  const [isLoadingImplants, setIsLoadingImplants] = useState(true);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [modalTask, setModalTask] = useState<Task | null>(null);

  useEffect(() => {
    const loadImplants = async () => {
      setIsLoadingImplants(true);
      const fetchedImplants = await fetchImplants();
      setImplants(fetchedImplants);
      setIsLoadingImplants(false);
      if (fetchedImplants.length > 0) {
        handleSelectImplant(fetchedImplants[0].id);
      }
    };
    loadImplants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectImplant = useCallback(async (implantId: string) => {
    setSelectedImplantId(implantId);
    setIsLoadingTasks(true);
    const fetchedTasks = await fetchTasks(implantId);
    setTasks(prev => ({ ...prev, [implantId]: fetchedTasks }));
    setIsLoadingTasks(false);
  }, []);
  
  const updateTaskState = useCallback((updatedTask: Task) => {
    setTasks(prev => {
      const existingTasks = prev[updatedTask.implantId] || [];
      return {
        ...prev,
        [updatedTask.implantId]: existingTasks.map(t => t.id === updatedTask.id ? updatedTask : t),
      };
    });
  }, []);

  const handleSendCommand = async (command: CommandType, args: string) => {
    if (!selectedImplantId) return;

    const newTask = await sendCommand(selectedImplantId, command, args);
    setTasks(prev => ({
      ...prev,
      [selectedImplantId]: [newTask, ...(prev[selectedImplantId] || [])],
    }));
    simulateTaskExecution(newTask, updateTaskState);
  };

  const selectedImplant = implants.find(imp => imp.id === selectedImplantId);
  const selectedImplantTasks = selectedImplantId ? tasks[selectedImplantId] || [] : [];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ImplantTable
            implants={implants}
            selectedImplantId={selectedImplantId}
            onSelectImplant={handleSelectImplant}
            isLoading={isLoadingImplants}
          />
        </div>
        <div className="lg:col-span-1">
          <CommandPanel
            selectedImplant={selectedImplant}
            onSendCommand={handleSendCommand}
          />
        </div>
      </div>
      <div>
        <TaskHistory
          tasks={selectedImplantTasks}
          onViewResult={setModalTask}
          isLoading={isLoadingTasks}
          implantId={selectedImplantId}
        />
      </div>
      {modalTask && (
        <ResultModal task={modalTask} onClose={() => setModalTask(null)} />
      )}
    </div>
  );
};

export default Dashboard;