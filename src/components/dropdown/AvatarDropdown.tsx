import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
const AvatarDropdown = () => {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div ref={dropdownRef}>
      <img
        id="avatarButton"
        onClick={toggleDropdown}
        className="w-14 h-14 rounded-full cursor-pointer"
        src="/profile.webp"
        alt="User dropdown"
      />
      {isDropdownOpen && (
        <div
          id="userDropdown"
          className="z-10 absolute mt-1 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600"
        >
          <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
            <div>{session?.user?.name || "Bonnie Green"}</div>
            <div className="font-medium truncate">
              {session?.user?.email || "name@flowbite.com"}
            </div>
          </div>
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="avatarButton"
          >
            <li>
              <a
                href="/profile"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Profile
              </a>
            </li>
          </ul>
          <div className="py-1">
            <a
              href="#"
              onClick={() => {
                signOut({ callbackUrl: "/" });
                console.log("Sign out clicked");
              }}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
            >
              Sign out
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarDropdown;