import React, { useState } from "react";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { type TaskData, priorityEnum, TaskStatus, type Task } from "@/components/modal/Task";

const Tasks: React.FC = () => {
  const router = useRouter();
  const { projectId } = router.query;

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  const { data: tasks, refetch } = api.task.getTasksByProjectId.useQuery(
    projectId as string,
    {
      enabled: !!projectId,
    }
  );

  const createTaskMutation = api.task.createTask.useMutation({
    onSuccess: () => {
      refetch();
      setIsModalOpen(false);
    },
  });

  const updateTaskMutation = api.task.updateTask.useMutation({
    onSuccess: () => {
      refetch();
      setIsModalOpen(false);
    },
  });

  const deleteTaskMutation = api.task.deleteTask.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleCreateTask = (formData: FormData) => {
    const taskData: TaskData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      tags: (formData.get("tags") as string).split(","),
      priority: (Object.values(priorityEnum).includes(formData.get("priority") as priorityEnum)
        ? (formData.get("priority") as priorityEnum)
        : priorityEnum.LOW), // Validate and cast
      status: formData.get("status") as TaskStatus,
      startDate: new Date(formData.get("startDate") as string),
      endDate: new Date(formData.get("endDate") as string),
      projectId: projectId as string,
    };

    createTaskMutation.mutate(taskData);
  };

  const handleUpdateTask = (formData: FormData) => {
    if (!currentTask?.id) return;

    const taskData: Task = {
      id: currentTask.id,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      tags: (formData.get("tags") as string).split(","),
      priority: (Object.values(priorityEnum).includes(formData.get("priority") as priorityEnum)
        ? (formData.get("priority") as priorityEnum)
        : priorityEnum.LOW), // Validate and cast
      status: formData.get("status") as TaskStatus,
      startDate: new Date(formData.get("startDate") as string),
      endDate: new Date(formData.get("endDate") as string),
      projectId: projectId as string,
    };

    updateTaskMutation.mutate(taskData);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTaskMutation.mutate({ id: taskId });
  };

  const openCreateModal = () => {
    setCurrentTask(null);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setCurrentTask(task);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const getPriorityColor = (priority: priorityEnum): string => {
    switch (priority) {
      case priorityEnum.LOW:
        return "bg-gray-300";
      case priorityEnum.MEDIUM:
        return "bg-orange-300";
      case priorityEnum.HIGH:
        return "bg-red-300";
      default:
        return "bg-gray-300";
    }
  };

  if (!tasks) return <div>Loading...</div>;

  const filteredTasks: Task[] = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    description: task?.description ?? "",
    tags: task?.tags ?? [],
    priority: (Object.values(priorityEnum).includes(task.priority as priorityEnum)
      ? task.priority
      : priorityEnum.LOW) as priorityEnum, // Validate and cast
    status: task?.status as TaskStatus,
    startDate: task?.startDate,
    endDate: task?.endDate,
    projectId: task.projectId,
  }));

  const todoTasks = filteredTasks.filter((task) => task.status === TaskStatus.TODO);
  const inProgressTasks = filteredTasks.filter((task) => task.status === TaskStatus.INPROCESS);
  const completedTasks = filteredTasks.filter((task) => task.status === TaskStatus.COMPLETED);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Project Tasks</h1>
        <button
          onClick={openCreateModal}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          + Create Task
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <TaskList title="TODO" tasks={todoTasks} onEdit={openEditModal} onDelete={handleDeleteTask} getPriorityColor={getPriorityColor} />
        <TaskList title="In Progress" tasks={inProgressTasks} onEdit={openEditModal} onDelete={handleDeleteTask} getPriorityColor={getPriorityColor} />
        <TaskList title="Completed" tasks={completedTasks} onEdit={openEditModal} onDelete={handleDeleteTask} getPriorityColor={getPriorityColor} />
      </div>

      {isModalOpen && (
        <TaskModal
          isEditMode={isEditMode}
          currentTask={currentTask}
          onClose={() => setIsModalOpen(false)}
          onSubmit={isEditMode ? handleUpdateTask : handleCreateTask}
        />
      )}
    </div>
  );
};

const TaskList: React.FC<{
  title: string;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  getPriorityColor: (priority: priorityEnum) => string;
}> = ({ title, tasks, onEdit, onDelete, getPriorityColor }) => (
  <div>
    <h2 className="mb-4 text-xl font-bold text-gray-800">{title}</h2>
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.title} className="rounded-lg border bg-white p-4 shadow hover:shadow-lg">
          <h3 className="mb-2 text-lg font-bold text-gray-800">{task.title}</h3>
          <p className="mb-2 text-sm text-gray-600">{task.description}</p>
          <span
            className={`inline-block rounded px-2 py-1 text-sm font-semibold text-white ${getPriorityColor(
              task.priority
            )}`}
          >
            {task.priority}
          </span>
          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => onEdit(task)}
              className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(task.id!)}
              className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const TaskModal: React.FC<{
  isEditMode: boolean;
  currentTask: Task | null;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
}> = ({ isEditMode, currentTask, onClose, onSubmit }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="w-[400px] rounded bg-white p-6 shadow-lg">
      <h2 className="text-lg font-bold">{isEditMode ? "Edit Task" : "Create Task"}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          onSubmit(formData);
        }}
      >
        <div className="mb-4">
          <label className="block text-sm font-medium">Title</label>
          <input
            name="title"
            defaultValue={currentTask?.title ?? ""}
            className="w-full rounded border px-2 py-1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            defaultValue={currentTask?.description ?? ""}
            className="w-full rounded border px-2 py-1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Tags (comma-separated)</label>
          <input
            name="tags"
            defaultValue={currentTask?.tags?.join(",") ?? ""}
            className="w-full rounded border px-2 py-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Priority</label>
          <select
            name="priority"
            defaultValue={currentTask?.priority ?? priorityEnum.LOW}
            className="w-full rounded border px-2 py-1"
          >
            <option value={priorityEnum.LOW}>Low</option>
            <option value={priorityEnum.MEDIUM}>Medium</option>
            <option value={priorityEnum.HIGH}>High</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Status</label>
          <select
            name="status"
            defaultValue={currentTask?.status ?? TaskStatus.TODO}
            className="w-full rounded border px-2 py-1"
          >
            <option value={TaskStatus.TODO}>TODO</option>
            <option value={TaskStatus.INPROCESS}>In Progress</option>
            <option value={TaskStatus.COMPLETED}>Completed</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Start Date</label>
          <input
            type="date"
            name="startDate"
            defaultValue={
              currentTask?.startDate
                ? new Date(currentTask.startDate).toISOString().split("T")[0]
                : ""
            }
            className="w-full rounded border px-2 py-1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">End Date</label>
          <input
            type="date"
            name="endDate"
            defaultValue={
              currentTask?.endDate
                ? new Date(currentTask.endDate).toISOString().split("T")[0]
                : ""
            }
            className="w-full rounded border px-2 py-1"
            required
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            {isEditMode ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  </div>
);

export default Tasks;