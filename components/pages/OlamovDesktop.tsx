import AppsLoader from "components/system/Apps/AppsLoader";
import Desktop from "components/system/Desktop";
import ProjectDock from "components/system/ProjectDock";
import Taskbar from "components/system/Taskbar";
import useGlobalErrorHandler from "hooks/useGlobalErrorHandler";
import useGlobalKeyboardShortcuts from "hooks/useGlobalKeyboardShortcuts";
import useIFrameFocuser from "hooks/useIFrameFocuser";
import useUrlLoader from "hooks/useUrlLoader";
import { keepCanvasesReadable } from "utils/readableCanvas";

// Before any app creates a canvas context
if (typeof window !== "undefined") keepCanvasesReadable(window);

// Shared desktop shell used by the home page and every SEO landing route, so
// each clean URL renders the full Olamov OS desktop with identical behavior.
const OlamovDesktop: FC = () => {
  useIFrameFocuser();
  useUrlLoader();
  useGlobalKeyboardShortcuts();
  useGlobalErrorHandler();

  return (
    <Desktop>
      <Taskbar />
      <AppsLoader />
      <ProjectDock />
    </Desktop>
  );
};

export default OlamovDesktop;
