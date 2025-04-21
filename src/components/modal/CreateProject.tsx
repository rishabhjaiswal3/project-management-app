import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";

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
  const [searchString, setSearchString] = useState("");
  const [debouncedSearchString, setDebouncedSearchString] = useState(""); 
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]); 

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setDebouncedSearchString(searchString.trim());
    }, 500);

    return () => clearTimeout(delayDebounceFn); 
  }, [searchString]);

  const { data: searchResults = [], isLoading: isSearching } =
    api.user.getUsersBySearchString.useQuery(
      { searchString: debouncedSearchString },
      {
        enabled: debouncedSearchString !== "", 
      }
    );

  const toggleUserSelection = (user: any) => {
    if (selectedUsers.some((selected) => selected.id === user.id)) {
      setSelectedUsers((prev) =>
        prev.filter((selected) => selected.id !== user.id)
      );
    } else {
      setSelectedUsers((prev) => [...prev, user]);
    }
  };

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
            <Button onClick={handleCreateProject}>Create</Button>
          </div>
        </div>
      </div>
      <div className="z-0 h-[660px] w-80 rounded bg-white">
        <p className="bold display-flex p-2 text-center text-xl text-blue-600">
          Add Team Members
        </p>

        <form className="mx-auto max-w-md">
          <label
            className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Search
          </label>
          <div className="relative">
            <input
              type="search"
              id="default-search"
              className="block w-full rounded-lg border border-gray-300 p-2 ps-2 text-sm text-gray-900"
              placeholder="Search Users"
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
            />
          </div>
        </form>
        <div className="mt-4 px-4">
          {isSearching ? (
            <p>Searching...</p>
          ) : searchResults.length > 0 ? (
            <ul>
              {searchResults.map((user: any) => (
                <li
                  key={user.id}
                  className={`mb-2 flex items-center space-x-2 border-b pb-2 cursor-pointer ${
                    selectedUsers.some((selected) => selected.id === user.id)
                      ? "bg-blue-100"
                      : ""
                  }`}
                  onClick={() => toggleUserSelection(user)}
                >
                  <img
                    src={user.image || "/profile.webp"}
                    alt={user.name}
                    className="h-8 w-8 rounded-full"
                  />
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateProject;