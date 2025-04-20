import React, { type FC } from 'react'

interface projectProps {
    project: {
        title:string,
        description:string,
        status:string,
    }
}

const ProjectCard: FC<projectProps> = ({project}) => {
  return (
    <div className="m-2 h-[300px] overflow-hidden rounded shadow-lg">
    <img
      className="h-30 w-full object-cover"
      src="project_bg.jpg"
      alt="Project"
    />
    <div className="px-3 py-3 h-[120px]">
      <div className="mb-1 text-lg font-bold">
        {(project?.title.length > 24 ? project?.title.slice(0,24)+'...' : project.title) ?? "No Title"}
      </div>
      <p className="text-sm text-gray-700">
        {(project?.description.length > 120 ? project?.description.slice(0,120)+'...' : project.description) ?? "No description available"}
      </p>
      
    </div>
    <div className="px-6 pt-4 pb-2">
      <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"># {project.status}</span>
    </div>
  </div>
  )
}

export default ProjectCard