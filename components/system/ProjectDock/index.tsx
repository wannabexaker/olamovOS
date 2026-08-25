import { memo } from "react";
import { type Project, PROJECTS } from "components/apps/MyProjects/projects";
import StyledProjectDock, {
  DockButton,
} from "components/system/ProjectDock/StyledProjectDock";
import { useProcesses } from "contexts/process";

// A discreet macOS-style icon dock on the right edge. Click a tile to open the
// project — embedded in-OS, or in a new tab for external / store links.
// Extensible: add an entry to PROJECTS and it shows up here automatically.
const ProjectDock: FC = () => {
  const { open } = useProcesses();

  const launch = (project: Project): void => {
    if (project.embeddable) {
      open(project.appId);
    } else {
      window.open(project.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <StyledProjectDock>
      {PROJECTS.map((project) => (
        <DockButton
          key={project.appId}
          $accent={project.accent}
          aria-label={project.name}
          onClick={() => launch(project)}
          title={project.name}
          type="button"
        >
          <img
            alt=""
            height={30}
            src={project.icon.replace("/System/Icons/", "/System/Icons/96x96/")}
            width={30}
          />
          <span className="tip">{project.name}</span>
        </DockButton>
      ))}
    </StyledProjectDock>
  );
};

export default memo(ProjectDock);
