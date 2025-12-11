import React from 'react';
import { ExecutionLog, ChainStatus } from '../types';
import { CheckCircle2, Circle, Loader2, AlertCircle, Terminal, Play } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ExecutionViewProps {
  status: ChainStatus;
  logs: ExecutionLog[];
  onReset: () => void;
}

export const ExecutionView: React.FC<ExecutionViewProps> = ({ status, logs, onReset }) => {
  
  if (logs.length === 0 && status === ChainStatus.IDLE) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500 p-8 text-center border-2 border-dashed border-slate-800 rounded-xl">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <Play size={32} className="ml-1 opacity-50" />
        </div>
        <h3 className="text-lg font-medium text-slate-400 mb-2">Ready to Run</h3>
        <p className="max-w-xs text-sm">Configure your chain on the left, set your input variables, and click "Run Chain" to see the magic happen.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Terminal className="text-purple-400" />
          Execution Log
        </h2>
        {status === ChainStatus.COMPLETED && (
            <button 
                onClick={onReset}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded transition-colors"
            >
                Clear Logs
            </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-6">
        {logs.map((log, idx) => (
          <div key={idx} className="relative pl-8 pb-8 last:pb-0">
            {/* Timeline connector */}
            {idx !== logs.length - 1 && (
              <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-slate-800"></div>
            )}
            
            {/* Icon Status */}
            <div className="absolute left-0 top-1">
              {log.status === 'completed' ? (
                <CheckCircle2 className="text-green-500 bg-slate-900" size={24} />
              ) : log.status === 'running' ? (
                <Loader2 className="text-blue-500 bg-slate-900 animate-spin" size={24} />
              ) : log.status === 'error' ? (
                <AlertCircle className="text-red-500 bg-slate-900" size={24} />
              ) : (
                <Circle className="text-slate-600 bg-slate-900" size={24} />
              )}
            </div>

            <div className={`bg-slate-800/50 rounded-lg border ${log.status === 'running' ? 'border-blue-500/50' : 'border-slate-700'} overflow-hidden transition-all duration-300`}>
              <div className="px-4 py-3 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
                <span className="font-semibold text-slate-200">{log.stepName}</span>
                <span className="text-xs font-mono text-slate-500">
                   {log.status === 'completed' && log.timestamp ? `${new Date(log.timestamp).toLocaleTimeString()}` : ''}
                </span>
              </div>
              
              <div className="p-4 space-y-3">
                {/* Input Context Mini-view */}
                <div className="text-xs">
                    <span className="text-slate-500 font-bold uppercase tracking-wider block mb-1">Inputs Used</span>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(log.inputContext).map(([k, v]) => (
                             <div key={k} className="bg-slate-900 border border-slate-700 rounded px-2 py-1 max-w-full truncate" title={v as string}>
                                <span className="text-blue-400">{k}:</span> <span className="text-slate-400">{(v as string).substring(0, 30)}{(v as string).length > 30 ? '...' : ''}</span>
                             </div>
                        ))}
                    </div>
                </div>

                {/* Prompt Preview */}
                <div className="text-xs">
                    <span className="text-slate-500 font-bold uppercase tracking-wider block mb-1">Interpolated Prompt</span>
                    <div className="bg-slate-950 p-2 rounded text-slate-400 font-mono whitespace-pre-wrap max-h-24 overflow-y-auto custom-scrollbar border border-slate-800">
                        {log.promptUsed}
                    </div>
                </div>

                {/* Output */}
                {log.output && (
                    <div className="mt-2">
                        <span className="text-slate-500 font-bold uppercase tracking-wider block mb-1">Output</span>
                        <div className="prose prose-invert prose-sm max-w-none bg-slate-900/50 p-3 rounded border border-slate-700/50">
                            {/* We use a simple whitespace renderer if markdown is overkill or risky, but markdown is nice for AI output */}
                             <div className="whitespace-pre-wrap text-slate-200">
                                {log.output}
                             </div>
                        </div>
                    </div>
                )}
                
                {log.error && (
                    <div className="bg-red-900/20 text-red-300 p-3 rounded text-sm border border-red-900/50">
                        Error: {log.error}
                    </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {status === 'RUNNING' && logs.length > 0 && logs[logs.length-1].status === 'completed' && (
             <div className="flex items-center gap-2 pl-8 text-slate-500 animate-pulse">
                <div className="w-1.5 h-1.5 bg-slate-500 rounded-full"></div>
                <span className="text-sm">Preparing next step...</span>
             </div>
        )}
      </div>
    </div>
  );
};