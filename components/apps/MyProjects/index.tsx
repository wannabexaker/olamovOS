import { memo, useCallback } from "react";
import StyledMyProjects, {
  ProjectCard,
} from "components/apps/MyProjects/StyledMyProjects";
import { type Project, PROJECTS } from "components/apps/MyProjects/projects";
import { type ComponentProcessProps } from "components/system/Apps/RenderComponent";
import { useProcesses } from "contexts/process";
import Icon from "styles/common/Icon";

const openExternal = (url: string): void => {
  window.open(url, "_blank", "noopener,noreferrer");
};

const MyProjects: FC<ComponentProcessProps> = () => {
  const { open } = useProcesses();
  const launch = useCallback(
    (project: Project): void => {
      if (project.embeddable) open(project.appId);
      else openExternal(project.url);
    },
    [open]
  );

  return (
    <StyledMyProjects>
      <header>
        <h1>My Projects</h1>
        <p>
          A showcase of things I&apos;ve built. Click Open to run each one right
          here inside Olamov OS, or ↗ to open it in a new browser tab.
        </p>
      </header>
      <ul>
        {PROJECTS.map((project) => (
          <ProjectCard key={project.appId} $accent={project.accent}>
            <Icon imgSize={64} src={project.icon} />
            <div className="meta">
              <h2>{project.name}</h2>
              <p>{project.description}</p>
              <div className="tags">
                {project.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
            <div className="actions">
              <button
                className="open"
                onClick={() => launch(project)}
                type="button"
              >
                Open
              </button>
              <button
                aria-label={`Open ${project.name} in a new tab`}
                className="ghost"
                onClick={() => openExternal(project.url)}
                title="Open in new tab"
                type="button"
              >
                ↗
              </button>
            </div>
          </ProjectCard>
        ))}
      </ul>
    </StyledMyProjects>
  );
};

export default memo(MyProjects);
