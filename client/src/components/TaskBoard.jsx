import React, { useEffect } from 'react';
import { MoreVertical, Calendar, User as UserIcon } from 'lucide-react';
import useTaskStore from '../store/taskStore';

const TaskColumn = ({ title, tasks, status, onDropTask }) => (
  <div className="flex-1 min-w-[300px] flex flex-col h-full">
    {/* Column Header */}
    <div className="flex items-center justify-between mb-4 px-1">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full 
          ${status === 'todo' ? 'bg-gray-400' : 
            status === 'in_progress' ? 'bg-blue-500' : 'bg-green-500'}`} 
        />
        <h3 className="font-semibold text-gray-700 text-sm">{title}</h3>
        <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full font-medium">
          {tasks.length}
        </span>
      </div>
    </div>

    {/* Task List */}
    <div className="flex-1 bg-gray-50/50 rounded-xl p-3 space-y-3 overflow-y-auto">
      {tasks.length === 0 ? (
        <div className="h-20 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
          <span className="text-gray-400 text-xs">No tasks</span>
        </div>
      ) : (
        tasks.map((task) => (
          <div 
            key={task._id} 
            className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-move group"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('taskId', task._id);
            }}
          >
            {/* Priority Badge */}
            <div className="flex justify-between items-start mb-2">
              <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider
                ${task.priority === 'high' ? 'bg-red-50 text-red-600' : 
                  task.priority === 'medium' ? 'bg-orange-50 text-orange-600' : 
                  'bg-green-50 text-green-600'}`}>
                {task.priority || 'medium'}
              </span>
              <button className="text-gray-300 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical size={14} />
              </button>
            </div>

            {/* Content */}
            <h4 className="text-sm font-semibold text-gray-800 mb-1 leading-snug">{task.title}</h4>
            {task.description && (
              <p className="text-xs text-gray-500 line-clamp-2 mb-3">{task.description}</p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-50">
              <div className="flex items-center gap-1 text-xs text-gray-400">
                {task.assigneeId ? (
                   <span className="flex items-center gap-1 text-gray-600 font-medium" title={task.assigneeId.email}>
                     <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-[10px] font-bold">
                       {task.assigneeId.name?.[0] || 'U'}
                     </div>
                     {task.assigneeId.name?.split(' ')[0]}
                   </span>
                ) : (
                   <span className="flex items-center gap-1">
                     <UserIcon size={12} /> <span className="italic">Unassigned</span>
                   </span>
                )}
              </div>
              
              {task.dueDate && (
                <div className="flex items-center gap-1 text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                  <Calendar size={10} />
                  {new Date(task.dueDate).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

const TaskBoard = ({ projectId }) => {
  const { tasks, fetchTasks, updateTask } = useTaskStore();

  useEffect(() => {
    if(projectId) fetchTasks(projectId);
  }, [projectId]);

  const onDrop = async (e, status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      await updateTask(taskId, { status });
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const doneTasks = tasks.filter(t => t.status === 'done');

  return (
    <div className="flex h-full gap-6 overflow-x-auto p-2 pb-6">
      <div 
        className="flex-1 min-w-[300px]"
        onDrop={(e) => onDrop(e, 'todo')}
        onDragOver={onDragOver}
      >
        <TaskColumn title="To Do" status="todo" tasks={todoTasks} />
      </div>
      <div 
        className="flex-1 min-w-[300px]"
        onDrop={(e) => onDrop(e, 'in_progress')}
        onDragOver={onDragOver}
      >
        <TaskColumn title="In Progress" status="in_progress" tasks={inProgressTasks} />
      </div>
      <div 
        className="flex-1 min-w-[300px]"
        onDrop={(e) => onDrop(e, 'done')}
        onDragOver={onDragOver}
      >
        <TaskColumn title="Done" status="done" tasks={doneTasks} />
      </div>
    </div>
  );
};

export default TaskBoard;
