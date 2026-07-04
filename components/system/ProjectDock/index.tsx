import { memo } from "react";
import { PROJECTS } from "components/apps/MyProjects/projects";
import StyledProjectDock, {
  DockButton,
} from "components/system/ProjectDock/StyledProjectDock";
import { useProcesses } from "contexts/process";

// A discreet macOS-style icon dock on the right edge. Click an icon to open the
// project. Extensible: add an entry to PROJECTS and it shows up here.
const ProjectDock: FC = () => {
  const { open } = useProcesses();

  return (
    <StyledProjectDock>
      {PROJECTS.map((project) => (
        <DockButton
          key={project.appId}
          $accent={project.accent}
          aria-label={project.name}
          onClick={() => open(project.appId)}
          title={project.name}
          type="button"
        >
          {/* Plain img (not the Icon component) so the tile is never hidden by
              Icon's load-gated visibility, which can stay hidden for cached
              images. Uses the 96x96 variant, shown at 30px, so it stays crisp. */}
          { }
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
