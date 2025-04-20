import React from "react";
import { Button } from "@/components/ui/button";

interface CreateProjectProps {
  newProject: {
    title: string;
    description: string;
    status: string;
  };
  setNewProject: React.Dispatch<
    React.SetStateAction<{
      title: string;
      description: string;
      status: string;
    }>
  >;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleCreateProject: () => void;
}

const CreateProject: React.FC<CreateProjectProps> = ({
  newProject,
  setNewProject,
  setIsModalOpen,
  handleCreateProject,
}) => {
  return (
    <div className="bg-opacity-50 fixed inset-0 flex items-center justify-center bg-black">
      <div className="m-2 h-[660px] w-[660px] overflow-hidden rounded bg-white shadow-lg">
        <img
          className="z-10 h-60 w-full object-cover"
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
          >
            <option value="TODO">TODO</option>
            <option value="INPROGRESS">IN PROGRESS</option>
            <option value="END">END</option>
          </select>
          <div className="flex justify-end space-x-2">
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateProject}>Create</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
