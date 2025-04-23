import React, { type ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";

interface AuthWrapperProps {
  children: ReactNode;
  isPublicPage?: boolean; // Add a flag to indicate if the page is public (e.g., login or signup)
}

const AuthWrapper = ({ children, isPublicPage = false }: AuthWrapperProps) => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && isPublicPage) {
      // Redirect to home page if authenticated and on a public page
      window.location.href = "/projects";
    }
  }, [status, isPublicPage]);

  // Show a loading state while checking the session
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // Redirect to login page if not authenticated and not on a public page
  if (!session && !isPublicPage) {
    window.location.href = "/login"; // Redirect to login page
    return null; // Prevent rendering children
  }

  // Render children if the user is authenticated or on a public page
  return <>{children}</>;
};

export default AuthWrapper;