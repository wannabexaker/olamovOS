import { useEffect, useState } from "react";
import StyledNotepad from "components/apps/Notepad/StyledNotepad";
import { type ComponentProcessProps } from "components/system/Apps/RenderComponent";
import { useFileSystemActions } from "contexts/fileSystem";
import { useProcess } from "contexts/process";

const Notepad: FC<ComponentProcessProps> = ({ id }) => {
  const { readFile } = useFileSystemActions();
  const { url = "" } = useProcess(id);
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

export default Notepad;
