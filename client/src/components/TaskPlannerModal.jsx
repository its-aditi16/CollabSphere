import React, { useState } from 'react';
import { X, Check, Trash2, Edit2, Plus } from 'lucide-react';
import useTaskStore from '../store/taskStore';

const TaskPlannerModal = ({ isOpen, onClose, projectId }) => {
  const { draftTasks, createTask, removeDraft, clearDrafts } = useTaskStore();
  const [editingIndex, setEditingIndex] = useState(null);
  const [editForm, setEditForm] = useState({});

  if (!isOpen) return null;

  const handleApprove = async (task, index) => {
    try {
      await createTask({ ...task, projectId });
      removeDraft(index);
    } catch (error) {
      console.error("Failed to creat task", error);
    }
  };

  const handleApproveAll = async () => {
    for (const task of draftTasks) {
      try {
        await createTask({ ...task, projectId });
      } catch (error) {
        console.error("Failed to create task", error);
      }
    }
    clearDrafts();
    onClose();
  };

  const startEdit = (task, index) => {
    setEditingIndex(index);
    setEditForm({ ...task });
  };

  const saveEdit = (index) => {
    useTaskStore.setState((state) => {
      const newDrafts = [...state.draftTasks];
      newDrafts[index] = editForm;
      return { draftTasks: newDrafts };
    });
    setEditingIndex(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col font-sans">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span className="text-purple-600">✨</span> AI Task Planner
            </h2>
            <p className="text-sm text-gray-500 mt-1">Review and approve suggested tasks</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
          {draftTasks.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>No tasks generated yet. Ask the AI to plan this project!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {draftTasks.map((task, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow group">
                  {editingIndex === index ? (
                    // Edit Mode
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                        className="w-full font-semibold p-2 border rounded focus:ring-2 focus:ring-purple-500 outline-none"
                        placeholder="Task Title"
                      />
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                        className="w-full text-sm p-2 border rounded focus:ring-2 focus:ring-purple-500 outline-none"
                        placeholder="Description"
                        rows={2}
                      />
                      <div className="flex gap-2">
                         <select
                            value={editForm.priority}
                            onChange={(e) => setEditForm({...editForm, priority: e.target.value})}
                            className="text-xs p-1 border rounded bg-gray-50"
                         >
                            <option value="low">Low Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="high">High Priority</option>
                         </select>
                         <button 
                           onClick={() => saveEdit(index)}
                           className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 font-medium"
                         >
                           Save
                         </button>
                         <button 
                           onClick={() => setEditingIndex(null)}
                           className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded hover:bg-gray-200"
                         >
                           Cancel
                         </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-800">{task.title}</h3>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider
                            ${task.priority === 'high' ? 'bg-red-100 text-red-600' : 
                              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' : 
                              'bg-green-100 text-green-600'}`}>
                            {task.priority || 'medium'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{task.description}</p>
                        {task.assignee && (
                          <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                            <span className="font-medium">Assignee:</span> {task.assignee}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => startEdit(task, index)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => removeDraft(index)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Discard"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleApprove(task, index)}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Approve"
                        >
                          <Check size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 rounded-b-xl flex justify-between items-center">
          <button 
            onClick={clearDrafts}
            className="text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            Discard All
          </button>
          <div className="flex gap-3">
             <button
               onClick={onClose}
               className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
             >
               Close
             </button>
             <button
               onClick={handleApproveAll}
               disabled={draftTasks.length === 0}
               className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-black rounded-lg transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
             >
               <Check size={16} /> Approve All Tasks
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TaskPlannerModal;
