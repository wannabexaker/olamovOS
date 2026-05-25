import { memo, useEffect, useState } from "react";
import StyledNotepad from "components/apps/Notepad/StyledNotepad";
import { type ComponentProcessProps } from "components/system/Apps/RenderComponent";
import { useFileSystem } from "contexts/fileSystem";
import { useProcesses } from "contexts/process";

const Notepad: FC<ComponentProcessProps> = ({ id }) => {
  const { readFile } = useFileSystem();
  const {
    processes: { [id]: { url = "" } = {} },
  } = useProcesses();
  const [contents, setContents] = useState("");

  useEffect(() => {
    let cancelled = false;

    if (url) {
      readFile(url)
        .then((fileContents) => {
          if (!cancelled) setContents(fileContents.toString());
        })
        .catch(() => {
          if (!cancelled) setContents("Unable to read file.");
        });
    }

    return () => {
      cancelled = true;
    };
  }, [readFile, url]);

  return (
    <StyledNotepad>
      <menu>
        <li>File</li>
        <li>Edit</li>
        <li>Search</li>
        <li>Help</li>
      </menu>
      <textarea spellCheck={false} value={contents} readOnly />
    </StyledNotepad>
  );
};

export default memo(Notepad);
