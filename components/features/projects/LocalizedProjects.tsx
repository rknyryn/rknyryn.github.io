"use client";

import ProjectCard from "@components/features/projects/ProjectCard";

type Project = {
  id: string;
  title: string;
  description: string;
  tags?: string[];
  link?: string;
};

type Props = {
  projects: Project[];
  limit?: number;
};

export default function LocalizedProjects({ projects, limit }: Props) {
  const list = limit ? projects.slice(0, limit) : projects;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {list.map((project) => (
        <ProjectCard
          key={project.id}
          title={project.title}
          description={project.description}
          tags={project.tags}
          link={project.link}
        />
      ))}
    </div>
  );
}
