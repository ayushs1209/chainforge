export interface ChainStep {
  id: string;
  name: string;
  description: string;
  promptTemplate: string;
  outputKey: string;
}

export interface ExecutionLog {
  stepId: string;
  stepName: string;
  inputContext: Record<string, string>;
  promptUsed: string;
  output: string;
  timestamp: number;
  status: 'pending' | 'running' | 'completed' | 'error';
  error?: string;
}

export type VariableContext = Record<string, string>;

export enum ChainStatus {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}