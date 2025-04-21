import React, { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  React.useEffect(() => {
    if (session) {
      window.location.href = "/projects";
    } else {
      window.location.href = "/login";
    }
  }, []);

  return null;
}