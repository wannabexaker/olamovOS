const ICON_SIZE = 16;

export const VolumeHigh: FC = () => (
  <svg
    fill="currentColor"
    height={ICON_SIZE}
    viewBox="0 0 16 16"
    width={ICON_SIZE}
  >
    <path d="M2 5h2l4-3v12L4 11H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
    <path
      d="M11 3.3a6 6 0 0 1 0 9.4M9.5 5.5a3 3 0 0 1 0 5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.2"
    />
  </svg>
);

export const VolumeLow: FC = () => (
  <svg
    fill="currentColor"
    height={ICON_SIZE}
    viewBox="0 0 16 16"
    width={ICON_SIZE}
  >
    <path d="M2 5h2l4-3v12L4 11H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
    <path
      d="M9.5 5.5a3 3 0 0 1 0 5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.2"
    />
  </svg>
);

export const VolumeMid: FC = () => (
  <svg
    fill="currentColor"
    height={ICON_SIZE}
    viewBox="0 0 16 16"
    width={ICON_SIZE}
  >
    <path d="M2 5h2l4-3v12L4 11H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
    <path
      d="M10.5 4a5 5 0 0 1 0 8M9.5 5.5a3 3 0 0 1 0 5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.2"
    />
  </svg>
);

export const VolumeMuted: FC = () => (
  <svg
    fill="currentColor"
    height={ICON_SIZE}
    viewBox="0 0 16 16"
    width={ICON_SIZE}
  >
    <path d="M2 5h2l4-3v12L4 11H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
    <path
      d="M10 5.5l4 5M14 5.5l-4 5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.3"
    />
  </svg>
);
