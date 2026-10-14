import type { ProjectRecord } from '../shared/contracts';
export function ProjectCard({ project }: { project: ProjectRecord }) {
  return (
    <section className="project-card" aria-label={project.name + ' project'}>
      <h3>{project.name}</h3>
      <p>
        {project.status} · {project.ownerTeam} · {project.openItems} open items
      </p>
      <p>{project.summary}</p>
    </section>
  );
}
