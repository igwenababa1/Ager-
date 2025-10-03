
export enum ImplantStatus {
  Online = 'Online',
  Offline = 'Offline',
}

export interface Implant {
  id: string;
  status: ImplantStatus;
  lastCheckIn: string;
  firstSeen: string;
  os: string;
  ip: string;
  hostname: string;
}

export enum CommandType {
  SYSINFO = 'sysinfo',
  FILE_FETCH = 'file_fetch',
  PERSIST_USER = 'persist_user',
}

export enum TaskStatus {
  Pending = 'Pending',
  Executing = 'Executing',
  Completed = 'Completed',
  Failed = 'Failed',
}

export interface Task {
  id: string;
  implantId: string;
  command: CommandType;
  args: string;
  status: TaskStatus;
  timestamp: string;
  result?: string;
}
