import React, { useState, useEffect } from 'react';
import { ChainStep } from '../types';
import { Trash2, MoveUp, MoveDown, Save, Edit3, X } from 'lucide-react';

interface StepEditorProps {
  step: ChainStep;
  index: number;
  totalSteps: number;
  onUpdate: (updatedStep: ChainStep) => void;
  onDelete: (id: string) => void;
  onMove: (index: number, direction: 'up' | 'down') => void;
}

export const StepEditor: React.FC<StepEditorProps> = ({
  step,
  index,
  totalSteps,
  onUpdate,
  onDelete,
  onMove,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localStep, setLocalStep] = useState<ChainStep>(step);

  useEffect(() => {
    setLocalStep(step);
  }, [step]);

  const handleSave = () => {
    onUpdate(localStep);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalStep(step);
    setIsEditing(false);
  };

  const extractVariables = (template: string) => {
    const matches = template.match(/{(\w+)}/g);
    return matches ? matches.map(m => m.replace(/[{}]/g, '')) : [];
  };

  const variables = extractVariables(localStep.promptTemplate);

  if (isEditing) {
    return (
      <div className="bg-slate-800 border border-indigo-500/50 rounded-lg p-4 mb-4 shadow-lg animate-fade-in">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-indigo-400">Edit Step {index + 1}</h3>
          <button onClick={handleCancel} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase text-slate-400 font-bold mb-1">Step Name</label>
            <input
              type="text"
              value={localStep.name}
              onChange={(e) => setLocalStep({ ...localStep, name: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs uppercase text-slate-400 font-bold mb-1">Prompt Template</label>
            <p className="text-xs text-slate-500 mb-2">Use {'{variableName}'} to insert values from previous steps.</p>
            <textarea
              value={localStep.promptTemplate}
              onChange={(e) => setLocalStep({ ...localStep, promptTemplate: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white font-mono text-sm h-32 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs uppercase text-slate-400 font-bold mb-1">Output Variable Key</label>
            <p className="text-xs text-slate-500 mb-2">The result of this step will be stored in this variable.</p>
            <input
              type="text"
              value={localStep.outputKey}
              onChange={(e) => setLocalStep({ ...localStep, outputKey: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-green-400 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
             <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded font-medium transition-colors"
            >
              <Save size={16} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-4 shadow-md hover:border-slate-600 transition-colors group">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-slate-700 text-slate-300 text-xs font-mono px-2 py-0.5 rounded">Step {index + 1}</span>
            <h3 className="font-semibold text-white">{step.name}</h3>
          </div>
          <div className="text-sm text-slate-400 font-mono bg-slate-900/50 p-2 rounded mb-2 border-l-2 border-indigo-500/50 truncate">
            {step.promptTemplate}
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {variables.map(v => (
               <span key={v} className="bg-blue-900/30 text-blue-300 px-2 py-0.5 rounded border border-blue-900/50">
                 In: {v}
               </span>
            ))}
            <span className="bg-green-900/30 text-green-300 px-2 py-0.5 rounded border border-green-900/50">
              Out: {step.outputKey}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onMove(index, 'up')}
            disabled={index === 0}
            className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 hover:bg-slate-700 rounded"
          >
            <MoveUp size={16} />
          </button>
          <button
            onClick={() => onMove(index, 'down')}
            disabled={index === totalSteps - 1}
            className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 hover:bg-slate-700 rounded"
          >
            <MoveDown size={16} />
          </button>
          <div className="w-px h-4 bg-slate-600 mx-1"></div>
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => onDelete(step.id)}
            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};