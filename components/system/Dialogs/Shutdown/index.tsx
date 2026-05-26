import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import useCloseOnEscape from "components/system/Dialogs/useCloseOnEscape";
import { type ComponentProcessProps } from "components/system/Apps/RenderComponent";
import StyledButton from "components/system/Dialogs/StyledButton";
import StyledShutdown from "components/system/Dialogs/Shutdown/StyledShutdown";
import { useFileSystem } from "contexts/fileSystem";
import { useProcesses } from "contexts/process";
import { useSession } from "contexts/session";
import Icon from "styles/common/Icon";
import { PREVENT_SCROLL } from "utils/constants";
import { haltEvent } from "utils/functions";

const SHUTDOWN_OPTIONS = [
  {
    description: "Ends your Olamov OS session and clears local session data.",
    label: "Shut down",
    value: "shutdown",
  },
  {
    description: "Closes this session and starts Olamov OS again.",
    label: "Restart",
    value: "restart",
  },
  {
    description: "Keeps your session available and starts the screen saver.",
    label: "Stand by",
    value: "standby",
  },
  {
    description: "Keeps your current browser storage and suspends the shell.",
    label: "Hibernate",
    value: "hibernate",
  },
] as const;

type ShutdownAction = (typeof SHUTDOWN_OPTIONS)[number]["value"];

const Shutdown: FC<ComponentProcessProps> = ({ id }) => {
  const { rootFs } = useFileSystem();
  const { closeWithTransition, open } = useProcesses();
  const { setHaltSession } = useSession();
  const shutdownRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);
  const [action, setAction] = useState<ShutdownAction>("shutdown");
  const selectedOption = useMemo(
    () => SHUTDOWN_OPTIONS.find(({ value }) => value === action),
    [action]
  );
  const closeOnEscape = useCloseOnEscape(id);
  const restart = useCallback((): void => {
    closeWithTransition(id);
    window.setTimeout(() => window.location.reload(), 250);
  }, [closeWithTransition, id]);
  const shutdown = useCallback((): void => {
    setHaltSession(true);

    import("contexts/fileSystem/functions").then(({ resetStorage }) =>
      resetStorage(rootFs).finally(() => window.location.reload())
    );
  }, [rootFs, setHaltSession]);
  const suspend = useCallback((): void => {
    closeWithTransition(id);
    open("ScreenSaver");
  }, [closeWithTransition, id, open]);
  const runSelectedAction = useCallback((): void => {
    if (action === "shutdown") shutdown();
    else if (action === "restart") restart();
    else suspend();
  }, [action, restart, shutdown, suspend]);

  useEffect(() => {
    window.dispatchEvent(new Event("olamov:close-start-menu"));
    shutdownRef.current?.focus(PREVENT_SCROLL);
    selectRef.current?.focus(PREVENT_SCROLL);
  }, []);

  return (
    <StyledShutdown
      ref={shutdownRef}
      onContextMenu={haltEvent}
      {...closeOnEscape}
    >
      <figure>
        <Icon
          alt="Shut Down Windows"
          imgSize={32}
          src="/System/Icons/olamov-shutdown.png"
        />
        <figcaption>
          <label htmlFor="shutdown-action">
            What do you want Olamov OS to do?
          </label>
          <select
            ref={selectRef}
            id="shutdown-action"
            onChange={({ currentTarget }) =>
              setAction(currentTarget.value as ShutdownAction)
            }
            value={action}
          >
            {SHUTDOWN_OPTIONS.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </figcaption>
      </figure>
      <p>{selectedOption?.description}</p>
      <nav>
        <StyledButton onClick={runSelectedAction}>OK</StyledButton>
        <StyledButton onClick={() => closeWithTransition(id)}>
          Cancel
        </StyledButton>
      </nav>
    </StyledShutdown>
  );
};

export default memo(Shutdown);
