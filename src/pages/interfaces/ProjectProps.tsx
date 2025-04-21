export interface ProjectProps {
    id?: string;
    title: string; // Made title required
    description: string; // Made description required
    status: "PENDING" | "ACTIVE" | "COMPLETED"; // Restricted status to specific values
    teamMembers?: {
      user: {
        id: string;
        name: string;
        email: string;
        image: string;
      };
    }[];
  }