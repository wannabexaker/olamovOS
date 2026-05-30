import { memo, useCallback, useEffect, useRef } from "react";
import { StyledVolumePanel } from "components/system/Taskbar/Volume/StyledVolume";
import useTaskbarItemTransition from "components/system/Taskbar/useTaskbarItemTransition";
import { useSession } from "contexts/session";
import { FOCUSABLE_ELEMENT, PREVENT_SCROLL } from "utils/constants";
import { haltEvent } from "utils/functions";

const PANEL_HEIGHT = 200;

type VolumePanelProps = {
  clockWidth: number;
  hasAI: boolean;
  toggleVolume: (show?: boolean) => void;
};

const VolumePanel: FC<VolumePanelProps> = ({
  clockWidth,
  hasAI,
  toggleVolume,
}) => {
  const { audioMuted, audioVolume, setAudioMuted, setAudioVolume } =
    useSession();
  const panelRef = useRef<HTMLElement>(null);
  const volumeTransition = useTaskbarItemTransition(PANEL_HEIGHT, false);

  const onSliderChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      const value = Number(event.target.value) / 100;
      setAudioVolume(value);
      if (audioMuted && value > 0) setAudioMuted(false);
    },
    [audioMuted, setAudioMuted, setAudioVolume]
  );

  const onWheel = useCallback(
    (event: React.WheelEvent<HTMLElement>): void => {
      const delta = event.deltaY < 0 ? 0.05 : -0.05;
      setAudioVolume((current) => Math.min(1, Math.max(0, current + delta)));
      if (audioMuted && delta > 0) setAudioMuted(false);
    },
    [audioMuted, setAudioMuted, setAudioVolume]
  );

  useEffect(() => {
    const panelElement = panelRef.current;

    const onBlur = ({ relatedTarget }: FocusEvent): void => {
      if (
        relatedTarget instanceof HTMLElement &&
        panelElement?.contains(relatedTarget)
      ) {
        panelElement?.focus(PREVENT_SCROLL);
        return;
      }
      toggleVolume(false);
    };

    panelElement?.addEventListener("blur", onBlur);
    panelElement?.focus(PREVENT_SCROLL);

    return () => panelElement?.removeEventListener("blur", onBlur);
  }, [toggleVolume]);

  return (
    <StyledVolumePanel
      ref={panelRef}
      $clockWidth={clockWidth}
      $hasAI={hasAI}
      aria-label="Volume control"
      onContextMenu={haltEvent}
      onWheel={onWheel}
      {...volumeTransition}
      {...FOCUSABLE_ELEMENT}
    >
      <h4>Volume</h4>
      <div className="slider-well">
        <input
          aria-label="Volume level"
          className="volume-slider"
          max={100}
          min={0}
          onChange={onSliderChange}
          type="range"
          value={Math.round(audioVolume * 100)}
        />
      </div>
      <label className="mute-toggle">
        <input
          checked={audioMuted}
          onChange={(event) => setAudioMuted(event.target.checked)}
          type="checkbox"
        />
        Mute
      </label>
    </StyledVolumePanel>
  );
};

export default memo(VolumePanel);
