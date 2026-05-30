import { useEffect } from "react";
import {
  patchAudioContextOnce,
  setMasterAudio,
} from "components/system/Taskbar/Volume/audioContextPatch";
import { useSession } from "contexts/session";

const setMediaVolume = (el: HTMLMediaElement, v: number, m: boolean): void => {
  try {
    Object.assign(el, { muted: m, volume: v });
  } catch {
    // Cross-origin or protected elements may reject writes
  }
};

const applyToAll = (volume: number, muted: boolean): void => {
  document
    .querySelectorAll<HTMLMediaElement>("audio, video")
    .forEach((el) => setMediaVolume(el, volume, muted));
};

const useGlobalVolume = (): void => {
  const { audioMuted, audioVolume } = useSession();

  useEffect(() => {
    patchAudioContextOnce();
  }, []);

  useEffect(() => {
    applyToAll(audioVolume, audioMuted);
    setMasterAudio(audioVolume, audioMuted);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLMediaElement) {
            setMediaVolume(node, audioVolume, audioMuted);
          } else if (node instanceof HTMLElement) {
            node
              .querySelectorAll<HTMLMediaElement>("audio, video")
              .forEach((el) => setMediaVolume(el, audioVolume, audioMuted));
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [audioMuted, audioVolume]);
};

export default useGlobalVolume;
