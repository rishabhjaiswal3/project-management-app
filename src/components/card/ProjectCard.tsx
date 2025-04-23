import React, { type FC } from "react";
import { type ProjectProps } from "@/pages/interfaces/ProjectProps";
import type { ProjectStatus } from "../modal/ProjectStatus";

interface projectItemProps {
  project: {
    id?: string;
    title: string;
    description: string;
    status: ProjectStatus;
    teamMembers: {
      user: {
        id: string;
        name: string;
        email: string;
        image: string;
      };
    }[];
  };
  onEdit: (value: ProjectProps) => void; // Callback for edit action
  onDelete: (value: ProjectProps) => void; // Callback for delete action
}

const ProjectCard: FC<projectItemProps> = ({ project, onEdit, onDelete }) => {

  const handleClick = (projectId: string | undefined) => {
    console.log("Project clicked:", projectId);
    location.href = `/tasks/${projectId}`;
  };
  return (
    <div className="relative m-2 h-[300px] overflow-hidden rounded shadow-lg z-6" onClick={()=>handleClick(project?.id)}>
      <img
        className="h-30 w-full object-cover"
        src="project_bg.jpg"
        alt="Project"
      />
      <div className="h-[120px] px-3 py-3">
        <div className="mb-1 text-lg font-bold">
          {(project?.title.length > 24
            ? project?.title.slice(0, 24) + "..."
            : project.title) ?? "No Title"}
        </div>
        <p className="text-sm text-gray-700">
          {(project?.description.length > 120
            ? project?.description.slice(0, 120) + "..."
            : project.description) ?? "No description available"}
        </p>
      </div>
      <div className="px-6 pt-4 pb-2">
        <span className="mr-2 mb-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700">
          # {project.status}
        </span>
      </div>
      {/* Icons for edit and delete */}
      <div className="absolute right-2 bottom-2 flex space-x-2">
        <button
          onClick={() => onEdit(project)}
          className="rounded-full bg-blue-500 p-1 text-white hover:bg-blue-600"
          title="Edit Project"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
          </svg>
        </button>
        <button
          onClick={()=>onDelete(project)}
          className="rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
          title="Delete Project"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
