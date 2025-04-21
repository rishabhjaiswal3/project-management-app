import React, { useState } from "react";
import { useRouter } from "next/router";
import { api } from "@/utils/api";

const Tasks = () => {
  const router = useRouter();
  const { projectId } = router.query;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

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

  const handleCreateTask = (taskData) => {
    createTaskMutation.mutate({
      ...taskData,
      projectId: projectId as string,
    });
  };

  const handleUpdateTask = (taskData) => {
    updateTaskMutation.mutate({
      ...taskData,
      taskId: currentTask.id,
    });
  };

  const handleDeleteTask = (taskId) => {
    deleteTaskMutation.mutate({ taskId });
  };

  const openCreateModal = () => {
    setCurrentTask(null);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setCurrentTask(task);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "LOW":
        return "bg-gray-300";
      case "MEDIUM":
        return "bg-orange-300";
      case "HIGH":
        return "bg-red-300";
      default:
        return "bg-gray-300";
    }
  };

  if (!tasks) return <div>Loading...</div>;

  // Filter tasks by status
  const todoTasks = tasks.filter((task) => task.status === "TODO");
  const inProgressTasks = tasks.filter((task) => task.status === "INPROCESS");
  const completedTasks = tasks.filter((task) => task.status === "COMPLETED");

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Project Tasks</h1>
        <button
          onClick={openCreateModal}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          + Create Task
        </button>
      </div>

      {/* Task Lists */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* TODO Tasks */}
        <div>
          <h2 className="mb-4 text-xl font-bold text-gray-800">TODO</h2>
          <div className="space-y-4">
            {todoTasks.map((task) => (
              <div
                key={task.id}
                className="rounded-lg border bg-white p-4 shadow hover:shadow-lg"
              >
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
                    onClick={() => openEditModal(task)}
                    className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* INPROGRESS Tasks */}
        <div>
          <h2 className="mb-4 text-xl font-bold text-gray-800">In Progress</h2>
          <div className="space-y-4">
            {inProgressTasks.map((task) => (
              <div
                key={task.id}
                className="rounded-lg border bg-white p-4 shadow hover:shadow-lg"
              >
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
                    onClick={() => openEditModal(task)}
                    className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COMPLETED Tasks */}
        <div>
          <h2 className="mb-4 text-xl font-bold text-gray-800">Completed</h2>
          <div className="space-y-4">
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className="rounded-lg border bg-white p-4 shadow hover:shadow-lg"
              >
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
                    onClick={() => openEditModal(task)}
                    className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-[400px] rounded bg-white p-6 shadow-lg">
            <h2 className="text-lg font-bold">
              {isEditMode ? "Edit Task" : "Create Task"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const taskData = {
                  title: formData.get("title"),
                  description: formData.get("description"),
                  tags: formData.get("tags").split(","),
                  priority: formData.get("priority"),
                  status: formData.get("status"), // Add status field
                  startDate: new Date(formData.get("startDate")),
                  endDate: new Date(formData.get("endDate")),
                };
                if (isEditMode) {
                  handleUpdateTask(taskData);
                } else {
                  handleCreateTask(taskData);
                }
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium">Title</label>
                <input
                  name="title"
                  defaultValue={currentTask?.title || ""}
                  className="w-full rounded border px-2 py-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  defaultValue={currentTask?.description || ""}
                  className="w-full rounded border px-2 py-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Tags (comma-separated)</label>
                <input
                  name="tags"
                  defaultValue={currentTask?.tags?.join(",") || ""}
                  className="w-full rounded border px-2 py-1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Priority</label>
                <select
                  name="priority"
                  defaultValue={currentTask?.priority || "LOW"}
                  className="w-full rounded border px-2 py-1"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Status</label>
                <select
                  name="status"
                  defaultValue={currentTask?.status || "TODO"}
                  className="w-full rounded border px-2 py-1"
                >
                  <option value="TODO">TODO</option>
                  <option value="INPROCESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
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
                  onClick={() => setIsModalOpen(false)}
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
      )}
    </div>
  );
};

export default Tasks;