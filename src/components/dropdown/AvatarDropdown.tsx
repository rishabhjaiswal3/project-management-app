import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Link from "next/link";
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
        className="h-14 w-14 cursor-pointer rounded-full"
        src="/profile.webp"
        alt="User dropdown"
      />
      {isDropdownOpen && (
        <div
          id="userDropdown"
          className="absolute z-10 mt-1 w-44 divide-y divide-gray-100 rounded-lg bg-white shadow-sm dark:divide-gray-600 dark:bg-gray-700"
        >
          <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
            <div>{session?.user?.name ?? "User"}</div>
            <div className="truncate font-medium">
              {session?.user?.email ?? "--"}
            </div>
          </div>
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="avatarButton"
          >
            <li>
              <Link
                href="/profile"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Profile
              </Link>
            </li>
          </ul>
          <div className="py-1">
            <button
              onClick={async () => {
                await signOut({ callbackUrl: "/" });
                console.log("Sign out clicked");
              }}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarDropdown;
