export type StreamProvider = "youtube" | "twitch";

export type ParsedStream =
  | { embedUrl: string; provider: StreamProvider; raw: string }
  | { raw: string };

const PLAYLIST_PREFIXES = ["PL", "UU", "FL", "LL", "OL", "RD"] as const;
const YOUTUBE_ID_PATTERN = /^[\w-]{11}$/;
const YOUTUBE_PLAYLIST_PATTERN = /^[\w-]+$/;

const parseUrl = (input: string): URL | undefined => {
  try {
    return new URL(input);
  } catch {
    try {
      return new URL(`https://${input}`);
    } catch {
      return undefined;
    }
  }
};

const getYouTubeId = (value = ""): string | undefined =>
  YOUTUBE_ID_PATTERN.exec(value)?.[0];

const extractYouTubeId = (input: string): string | undefined => {
  const rawId = getYouTubeId(input);

  if (rawId) return rawId;

  const url = parseUrl(input);

  if (!url) return undefined;

  const hostname = url.hostname.replace(/^www\./, "");
  const pathParts = url.pathname.split("/").filter(Boolean);

  if (hostname === "youtu.be") return getYouTubeId(pathParts[0]);

  if (hostname !== "youtube.com" && !hostname.endsWith(".youtube.com")) {
    return undefined;
  }

  if (pathParts[0] === "watch") {
    return getYouTubeId(url.searchParams.get("v") || "");
  }

  if (["embed", "live", "shorts"].includes(pathParts[0])) {
    return getYouTubeId(pathParts[1]);
  }

  return undefined;
};

const extractYouTubePlaylistId = (input: string): string | undefined => {
  const playlistId = parseUrl(input)?.searchParams.get("list") || "";
  const hasSupportedPrefix = PLAYLIST_PREFIXES.some((prefix) =>
    playlistId.startsWith(prefix)
  );

  return hasSupportedPrefix && YOUTUBE_PLAYLIST_PATTERN.exec(playlistId)?.[0]
    ? playlistId
    : undefined;
};

const buildYouTubeEmbedUrl = (
  videoId: string,
  playlistId: string | undefined
): string => {
  const params = new URLSearchParams({ rel: "0" });

  if (playlistId) params.set("list", playlistId);

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
};

export const parseStreamUrl = (input: string): ParsedStream => {
  const trimmed = input.trim();

  if (!trimmed) return { raw: input };

  const ytId = extractYouTubeId(trimmed);

  if (ytId) {
    const playlistId = extractYouTubePlaylistId(trimmed);

    return {
      embedUrl: buildYouTubeEmbedUrl(ytId, playlistId),
      provider: "youtube",
      raw: input,
    };
  }

  return { raw: input };
};
