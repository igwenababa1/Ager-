
import { Implant, ImplantStatus, Task, TaskStatus, CommandType } from '../types';

const MOCK_IMPLANTS: Implant[] = [
  {
    id: 'a7c8e9b0-1d2f-4a5b-8c9d-0e1f2a3b4c5d',
    status: ImplantStatus.Online,
    lastCheckIn: new Date(Date.now() - 35 * 1000).toISOString(),
    firstSeen: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    os: 'Windows 11 Pro',
    ip: '192.168.1.101',
    hostname: 'DESKTOP-FINANCE',
  },
  {
    id: 'b3d4e5f6-7g8h-9i0j-k1l2-m3n4o5p6q7r8',
    status: ImplantStatus.Offline,
    lastCheckIn: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    firstSeen: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    os: 'Windows 10 Enterprise',
    ip: '10.0.5.23',
    hostname: 'CORP-LAPTOP-03',
  },
  {
    id: 'c9f8e7d6-c5b4-a321-fedc-ba9876543210',
    status: ImplantStatus.Online,
    lastCheckIn: new Date(Date.now() - 72 * 1000).toISOString(),
    firstSeen: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    os: 'Windows Server 2022',
    ip: '172.16.31.5',
    hostname: 'WEBSRV-DMZ-01',
  },
];

const MOCK_TASKS: { [key: string]: Task[] } = {
  'a7c8e9b0-1d2f-4a5b-8c9d-0e1f2a3b4c5d': [
    {
      id: 'task-1',
      implantId: 'a7c8e9b0-1d2f-4a5b-8c9d-0e1f2a3b4c5d',
      command: CommandType.SYSINFO,
      args: '',
      status: TaskStatus.Completed,
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      result: `Hostname: DESKTOP-FINANCE\nOS Name: Microsoft Windows 11 Pro\nOS Version: 10.0.22621 N/A Build 22621\nSystem Type: x64-based PC\nProcessor(s): 1 Processor(s) Installed.\n[01]: Intel64 Family 6 Model 158 Stepping 10 GenuineIntel ~2800 Mhz`,
    },
  ],
  'c9f8e7d6-c5b4-a321-fedc-ba9876543210': [],
  'b3d4e5f6-7g8h-9i0j-k1l2-m3n4o5p6q7r8': [],
};

export const fetchImplants = (): Promise<Implant[]> => {
  return new Promise(resolve => setTimeout(() => resolve(MOCK_IMPLANTS), 500));
};

export const fetchTasks = (implantId: string): Promise<Task[]> => {
  return new Promise(resolve => setTimeout(() => resolve(MOCK_TASKS[implantId] || []), 300));
};

export const sendCommand = (implantId: string, command: CommandType, args: string): Promise<Task> => {
  return new Promise(resolve => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      implantId,
      command,
      args,
      status: TaskStatus.Pending,
      timestamp: new Date().toISOString(),
    };
    
    setTimeout(() => {
      if (!MOCK_TASKS[implantId]) {
        MOCK_TASKS[implantId] = [];
      }
      MOCK_TASKS[implantId].unshift(newTask);
      resolve(newTask);
    }, 200);
  });
};

export const simulateTaskExecution = (task: Task, updateTask: (updatedTask: Task) => void) => {
    const implant = MOCK_IMPLANTS.find(i => i.id === task.implantId);
    if (!implant || implant.status === ImplantStatus.Offline) {
        setTimeout(() => {
            updateTask({ ...task, status: TaskStatus.Failed, result: 'Implant is offline. Command could not be delivered.' });
        }, 1000);
        return;
    }

    // Simulate "Executing" state
    setTimeout(() => {
        updateTask({ ...task, status: TaskStatus.Executing });
    }, 1000 + Math.random() * 1000);

    // Simulate "Completed" state
    setTimeout(() => {
        let result = '';
        switch (task.command) {
            case CommandType.SYSINFO:
                result = `Hostname: ${implant.hostname}\nOS Name: ${implant.os}\nOS Version: 10.0.22621\nSystem Type: x64-based PC`;
                break;
            case CommandType.FILE_FETCH:
                result = `Successfully exfiltrated file: ${task.args}\n\nFile Content:\n[+] Log entry: 2023-10-27 User 'admin' accessed sensitive_data.csv\n[+] VPN Connection from 8.8.8.8 established.`;
                break;
            case CommandType.PERSIST_USER:
                result = `Successfully created persistence mechanism.\nType: Scheduled Task\nName: AegisCoreUpdate\nTrigger: User Logon`;
                break;
            default:
                result = 'Unknown command executed.';
        }
        updateTask({ ...task, status: TaskStatus.Completed, result });
    }, 3000 + Math.random() * 3000);
};
