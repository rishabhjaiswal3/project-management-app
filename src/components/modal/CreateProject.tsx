import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import AddMember from "../list/AddMember";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

interface CreateProjectProps {
  newProject: {
    title: string;
    description: string;
    status: string;
  };
  isEditMode?: boolean;
  setNewProject: React.Dispatch<
    React.SetStateAction<{
      title: string;
      description: string;
      status: string;
    }>
  >;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleCreateProject: () => void;
  selectedUsers: User[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const CreateProject: React.FC<CreateProjectProps> = ({
  newProject,
  setNewProject,
  setIsModalOpen,
  handleCreateProject,
  selectedUsers,
  setSelectedUsers,
  isEditMode = false
}) => {
  return (
    <div className="bg-opacity-50 fixed inset-0 flex items-center justify-center bg-black z-50">
      <div className="m-2 h-[660px] w-[660px] overflow-hidden rounded bg-white shadow-lg">
        <img
          className="z-100 h-60 w-full object-cover"
          src="project_bg.jpg"
          alt="Project"
        />

        <div className="px-4 py-3">
          <input
            type="text"
            placeholder="Project Title"
            value={newProject.title}
            onChange={(e) =>
              setNewProject({ ...newProject, title: e.target.value })
            }
            className="mb-4 w-full rounded border p-2"
          />
          <textarea
            placeholder="Project Description"
            value={newProject.description}
            onChange={(e) =>
              setNewProject({
                ...newProject,
                description: e.target.value,
              })
            }
            className="mb-4 h-[140px] w-full rounded border p-2"
          />

          <select
            id="countries"
            className="mb-20 block w-full rounded-lg border p-2.5 text-sm text-black"
            value={newProject.status}
            onChange={(e) =>
              setNewProject({ ...newProject, status: e.target.value })
            }
          >
            <option value="PENDING">PENDING</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
          <div className="flex justify-end space-x-2">
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateProject}>{isEditMode?"Update":"Create"}</Button>
          </div>
        </div>
      </div>
      <div className="z-100 h-[660px] w-80 rounded bg-white">
        <AddMember
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
        />
      </div>
    </div>
  );
};

export default CreateProject;
