export type StreamProvider = "youtube" | "twitch";

export type ParsedStream = {
  embedUrl: string | undefined;
  provider: StreamProvider | undefined;
  raw: string;
};

const PLAYLIST_PREFIXES = ["PL", "UU", "FL", "LL", "OL", "RD"] as const;
const YOUTUBE_ID_PATTERN = /^[\w-]{11}$/;
const YOUTUBE_PLAYLIST_PATTERN = /^[\w-]+$/;

const TWITCH_CHANNEL_PATTERN =
  /^https?:\/\/(?:www\.)?twitch\.tv\/(\w{3,25})(?:\/?$|\?)/;
const TWITCH_VIDEO_PATTERN = /^https?:\/\/(?:www\.)?twitch\.tv\/videos\/(\d+)/;
const TWITCH_CLIP_INLINE_PATTERN =
  /^https?:\/\/(?:www\.)?twitch\.tv\/\w+\/clip\/([\w-]+)/;
const TWITCH_CLIP_STANDALONE_PATTERN =
  /^https?:\/\/clips\.twitch\.tv\/([\w-]+)/;

type TwitchTarget =
  | { channel: string; kind: "channel" }
  | { kind: "clip"; slug: string }
  | { kind: "video"; videoId: string };

const extractTwitch = (input: string): TwitchTarget | undefined => {
  const v = TWITCH_VIDEO_PATTERN.exec(input);
  if (v) return { kind: "video", videoId: v[1] };
  const ci = TWITCH_CLIP_INLINE_PATTERN.exec(input);
  if (ci) return { kind: "clip", slug: ci[1] };
  const cs = TWITCH_CLIP_STANDALONE_PATTERN.exec(input);
  if (cs) return { kind: "clip", slug: cs[1] };
  const ch = TWITCH_CHANNEL_PATTERN.exec(input);
  if (ch) return { channel: ch[1], kind: "channel" };
  return undefined;
};

const buildTwitchEmbedUrl = (target: TwitchTarget, parent: string): string => {
  const p = `parent=${encodeURIComponent(parent)}`;
  if (target.kind === "channel") {
    return `https://player.twitch.tv/?channel=${target.channel}&${p}`;
  }
  if (target.kind === "video") {
    return `https://player.twitch.tv/?video=${target.videoId}&${p}`;
  }
  return `https://clips.twitch.tv/embed?clip=${target.slug}&${p}`;
};

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

const YOUTUBE_NOCOOKIE_EMBED_BASE = "https://www.youtube-nocookie.com/embed";

const buildYouTubeEmbedUrl = (
  videoId: string,
  playlistId: string | undefined
): string => {
  const params = new URLSearchParams({
    autoplay: "1",
    enablejsapi: "1",
    iv_load_policy: "3",
    modestbranding: "1",
    rel: "0",
  });
  if (playlistId) params.set("list", playlistId);
  return `${YOUTUBE_NOCOOKIE_EMBED_BASE}/${videoId}?${params.toString()}`;
};

export const parseStreamUrl = (
  input: string,
  parent = "localhost"
): ParsedStream => {
  const trimmed = input.trim();
  if (!trimmed) {
    return { embedUrl: undefined, provider: undefined, raw: input };
  }

  const ytId = extractYouTubeId(trimmed);
  if (ytId) {
    const playlistId = extractYouTubePlaylistId(trimmed);
    return {
      embedUrl: buildYouTubeEmbedUrl(ytId, playlistId),
      provider: "youtube",
      raw: input,
    };
  }

  const tw = extractTwitch(trimmed);
  if (tw) {
    return {
      embedUrl: buildTwitchEmbedUrl(tw, parent),
      provider: "twitch",
      raw: input,
    };
  }

  return { embedUrl: undefined, provider: undefined, raw: input };
};
