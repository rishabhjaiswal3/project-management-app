import React, { useState, useEffect } from "react";
import { api } from "@/utils/api";

interface User {
  id?: string;
  name?: string | null;
  email: string;
  image?: string | null;
}

interface AddMemberProps {
  selectedUsers: User[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const AddMember: React.FC<AddMemberProps> = ({
  selectedUsers,
  setSelectedUsers,
}) => {
  const [searchString, setSearchString] = useState<string>("");
  const [debouncedSearchString, setDebouncedSearchString] =
    useState<string>("");

  // Debounce the search input
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setDebouncedSearchString(searchString.trim());
    }, 500);

    return () => clearTimeout(delayDebounceFn); // Cleanup timeout
  }, [searchString]);

  // Fetch users based on the debounced search string
  const { data: searchResults = [], isLoading: isSearching } =
    api.user.getUsersBySearchString.useQuery(
      { searchString: debouncedSearchString },
      {
        enabled: debouncedSearchString !== "", // Only fetch when searchString is not empty
      },
    ) as { data: User[]; isLoading: boolean };;

  // Toggle user selection
  const toggleUserSelection = (user: User) => {
    if (selectedUsers.some((selected) => selected.id === user.id)) {
      // Remove user if already selected
      setSelectedUsers((prev) =>
        prev.filter((selected) => selected.id !== user.id),
      );
    } else {
      // Add user if not already selected
      setSelectedUsers((prev) => [...prev, user]);
    }
  };

  return (
    <div>

  <p className="bold display-flex p-2 text-center text-xl text-blue-600">
    Add Team Members
  </p>

  <form className="mx-auto max-w-md">
    <label className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white">
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

  {/* Search Results */}
  <div className="mt-4 px-4 h-48 overflow-y-auto border rounded">
    {isSearching ? (
      <p>Searching...</p>
    ) : searchResults.length > 0 ? (
      <ul>
        {searchResults.map((user: User) => {
          return (
            <li
              key={user.id}
              className={`mb-2 flex cursor-pointer items-center space-x-2 border-b pb-2 ${
                selectedUsers.some((selected) => selected.id === user.id)
                  ? "bg-blue-100"
                  : ""
              }`}
              onClick={() => toggleUserSelection(user)}
            >
              <img
                src={user.image || "/profile.webp"}
                alt={user.name ?? "profile picture "}
                className="h-8 w-8 rounded-full"
              />
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </li>
          );
        })}
      </ul>
    ) : (
      <p>No users found.</p>
    )}
  </div>

  {/* Selected Items */}
  <div className="mt-4 px-4 h-72 overflow-y-auto border rounded">
    <p className="mb-2 text-sm font-medium text-gray-700">Selected Members:</p>
    {selectedUsers.length > 0 ? (
      <ul>
        {selectedUsers.map((user: User) => (
          <li
            key={user.id}
            className="mb-2 flex items-center space-x-2 border-b pb-2"
          >
            <img
              src={user.image || "/profile.webp"}
              alt={user.name || "profile picture"}
              className="h-8 w-8 rounded-full"
            />
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <button
              onClick={() => toggleUserSelection(user)}
              className="ml-auto text-red-500 hover:underline"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-sm text-gray-500">No members selected.</p>
    )}
  </div>
</div>
  );
};

export default AddMember;
