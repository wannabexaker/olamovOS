import { memo, useCallback } from "react";
import {
  VolumeHigh,
  VolumeLow,
  VolumeMid,
  VolumeMuted,
} from "components/system/Taskbar/Volume/VolumeIcons";
import { StyledVolumeButton } from "components/system/Taskbar/Volume/StyledVolume";
import { useSession } from "contexts/session";

const VOLUME_STEP = 0.05;

const speakerIcon = (volume: number, muted: boolean): React.JSX.Element => {
  if (muted || volume === 0) return <VolumeMuted />;
  if (volume <= 0.33) return <VolumeLow />;
  if (volume <= 0.66) return <VolumeMid />;
  return <VolumeHigh />;
};

type VolumeButtonProps = {
  clockWidth: number;
  hasAI: boolean;
  toggleVolume: (show?: boolean) => void;
};

const VolumeButton: FC<VolumeButtonProps> = ({
  clockWidth,
  hasAI,
  toggleVolume,
}) => {
  const { audioMuted, audioVolume, setAudioMuted, setAudioVolume } =
    useSession();

  const onWheel = useCallback(
    (event: React.WheelEvent<HTMLButtonElement>): void => {
      const delta = event.deltaY < 0 ? VOLUME_STEP : -VOLUME_STEP;
      setAudioVolume((current) => Math.min(1, Math.max(0, current + delta)));
      if (audioMuted) setAudioMuted(false);
    },
    [audioMuted, setAudioMuted, setAudioVolume]
  );

  return (
    <StyledVolumeButton
      $clockWidth={clockWidth}
      $hasAI={hasAI}
      aria-label="Volume"
      onClick={() => toggleVolume()}
      onWheel={onWheel}
      title={audioMuted ? "Muted" : `Volume: ${Math.round(audioVolume * 100)}%`}
      type="button"
    >
      {speakerIcon(audioVolume, audioMuted)}
    </StyledVolumeButton>
  );
};

export default memo(VolumeButton);
