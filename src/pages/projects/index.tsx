import { useEffect, useState } from "react";
import AvatarDropdown from "@/components/dropdown/AvatarDropdown";
import { api } from "@/utils/api";
import { TRPCClientError } from "@trpc/client";
import { Button } from "@/components/ui/button";
import CreateProject from "@/components/modal/CreateProject";
import ProjectCard from "@/components/card/ProjectCard";
import AuthWrapper from "@/wrapper/AuthWrapper";
export default function ProjectListPage() {
  const utils = api.useContext(); // Access tRPC's query utilities
  const { data: projects, isLoading } = api.project.getAllProjects.useQuery();
  const createProjectMutation = api.project.createProject.useMutation({
    onSuccess: () => {
      // Invalidate the getAllProjects query to refetch data
      utils.project.getAllProjects.invalidate();
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const initialProjectState = {
    title: "",
    description: "",
    status: "PENDING",
  };

  const [newProject, setNewProject] = useState(initialProjectState);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);

  const grouped = projects?.reduce(
    (acc, project) => {
      if (!project.id) return acc;
      acc[project.id] = acc[project.id] || [];
      (acc[project.id] as typeof projects)!.push(project);
      return acc;
    },
    {} as Record<string, (typeof projects)[number][]>,
  );

  const handleCreateProject = async () => {
    try {
      if (!newProject.title) return;
      console.log("my project to send is ", newProject,selectedUsers);
      let members = selectedUsers.map((user) => user.id);
      const newProjectWithMembers = {
        ...newProject,
        members: members,
      };
      await createProjectMutation.mutateAsync(newProjectWithMembers);
      setNewProject(initialProjectState);
      setSelectedUsers([]);
      setIsModalOpen(false);
    } catch (err) {
      if (err instanceof TRPCClientError) {
        const { message, data } = err;
        console.error("TRPC Error:", message, data);
      } else {
        console.error("Other error:", err);
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <AuthWrapper>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Projects</h1>
          <div className="flex items-center">
            <AvatarDropdown />
            <Button className="ml-6" onClick={() => setIsModalOpen(true)}>
              Create Project
            </Button>
          </div>
        </div>

        {isModalOpen && (
          <CreateProject
            newProject={newProject}
            setNewProject={setNewProject}
            setIsModalOpen={setIsModalOpen}
            handleCreateProject={handleCreateProject}
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
          />
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          {Object.entries(grouped ?? {}).map(([status, group]) => (
            <div
              key={status}
              className="mb-6"
              style={{ width: "300px", height: 300 }}
            >
              <ul
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
                {group.map((project) => (
                  <li key={project.id} className="w-[300px]">
                    <ProjectCard project={project} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </AuthWrapper>
  );
}
