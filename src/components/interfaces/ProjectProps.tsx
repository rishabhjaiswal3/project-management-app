import { ProjectStatus } from "@/components/modal/ProjectStatus";
export default interface ProjectProps {
  id?: string;
  title: string; // Made title required
  description: string; // Made description required
  status: ProjectStatus;
  teamMembers?: {
    user: {
      id: string;
      name?: string;
      email?: string;
      image?: string;
    };
  }[];
}
