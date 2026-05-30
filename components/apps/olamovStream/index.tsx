import {
  type FormEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import StyledOlamovStream from "components/apps/olamovStream/StyledOlamovStream";
import {
  parseStreamUrl,
  type StreamProvider,
} from "components/apps/olamovStream/functions";
import { type ComponentProcessProps } from "components/system/Apps/RenderComponent";
import { useSession } from "contexts/session";

declare module "react" {
  interface IframeHTMLAttributes<T> extends React.HTMLAttributes<T> {
    credentialless?: "credentialless";
  }
}

const IFRAME_ALLOW =
  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

const YOUTUBE_SEARCH_URL = "https://www.youtube.com/results?search_query=";

const YOUTUBE_EMBED_ORIGIN = "https://www.youtube-nocookie.com";

type LoopMode = "all" | "none" | "one";

type QueueItem = {
  embedUrl: string;
  id: string;
  provider: StreamProvider;
  raw: string;
};

type YouTubeMessage = {
  event?: string;
  info?: number;
};

const LOOP_LABEL: Record<LoopMode, string> = {
  all: "🔁 All",
  none: "🔁 Off",
  one: "🔂 One",
};

const NEXT_LOOP_MODE: Record<LoopMode, LoopMode> = {
  all: "one",
  none: "all",
  one: "none",
};

const shortLabel = (item: QueueItem): string =>
  item.raw.replace(/^https?:\/\/(?:www\.)?/, "").slice(0, 38);

const OlamovStream: FC<ComponentProcessProps> = () => {
  const { audioMuted, audioVolume } = useSession();
  const [input, setInput] = useState("");
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [loopMode, setLoopMode] = useState<LoopMode>("none");
  const [error, setError] = useState<string | undefined>();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const supportsCredentialless = useMemo(
    () =>
      typeof window !== "undefined" &&
      "credentialless" in HTMLIFrameElement.prototype,
    []
  );

  const current = currentIndex >= 0 ? queue[currentIndex] : undefined;

  const postToYouTube = useCallback(
    (func: string, args: readonly (boolean | number)[]): void => {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ args, event: "command", func }),
        YOUTUBE_EMBED_ORIGIN
      );
    },
    []
  );

  // A web page can't touch a cross-origin iframe's audio directly, but the
  // YouTube IFrame API accepts setVolume/mute over postMessage (embed has
  // enablejsapi=1). Twitch keeps its own on-screen volume.
  const applyYouTubeVolume = useCallback((): void => {
    if (current?.provider !== "youtube") return;
    postToYouTube("setVolume", [Math.round(audioVolume * 100)]);
    postToYouTube(audioMuted || audioVolume === 0 ? "mute" : "unMute", []);
  }, [audioMuted, audioVolume, current, postToYouTube]);

  useEffect(() => {
    applyYouTubeVolume();
  }, [applyYouTubeVolume]);

  const replayCurrent = useCallback((): void => {
    postToYouTube("seekTo", [0, true]);
    postToYouTube("playVideo", []);
  }, [postToYouTube]);

  const handleEnded = useCallback((): void => {
    if (queue.length === 0) return;
    if (loopMode === "one") {
      replayCurrent();
      return;
    }
    if (currentIndex < queue.length - 1) {
      setCurrentIndex(currentIndex + 1);
      return;
    }
    if (loopMode === "all") {
      if (queue.length === 1) replayCurrent();
      else setCurrentIndex(0);
    }
  }, [currentIndex, loopMode, queue.length, replayCurrent]);

  // Listen for YouTube player state events (info === 0 means "ended").
  useEffect(() => {
    const onMessage = (event: MessageEvent): void => {
      if (event.origin !== YOUTUBE_EMBED_ORIGIN) return;
      let data: YouTubeMessage;
      try {
        data = JSON.parse(event.data as string) as YouTubeMessage;
      } catch {
        return;
      }
      if (data.event === "onStateChange" && data.info === 0) handleEnded();
    };

    window.addEventListener("message", onMessage);

    return () => window.removeEventListener("message", onMessage);
  }, [handleEnded]);

  // Start playback automatically once the first item is queued.
  useEffect(() => {
    if (currentIndex === -1 && queue.length > 0) setCurrentIndex(0);
  }, [currentIndex, queue.length]);

  const onIframeLoad = useCallback((): void => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "listening" }),
      YOUTUBE_EMBED_ORIGIN
    );
    window.setTimeout(applyYouTubeVolume, 600);
  }, [applyYouTubeVolume]);

  const onAdd = useCallback(
    (event: FormEvent<HTMLFormElement>): void => {
      event.preventDefault();
      const trimmed = input.trim();
      if (!trimmed) return;

      const parent =
        typeof window === "undefined" ? "localhost" : window.location.hostname;
      const parsed = parseStreamUrl(trimmed, parent);

      if (!parsed.embedUrl || !parsed.provider) {
        setError(
          "That doesn't look like a YouTube or Twitch link. Paste a full video URL."
        );
        return;
      }

      setQueue((currentQueue) => [
        ...currentQueue,
        {
          embedUrl: parsed.embedUrl as string,
          id: `${Date.now()}-${currentQueue.length}`,
          provider: parsed.provider as StreamProvider,
          raw: trimmed,
        },
      ]);
      setInput("");
      setError(undefined);
    },
    [input]
  );

  const goNext = useCallback((): void => {
    setCurrentIndex((index) => {
      if (queue.length === 0) return index;
      if (index < queue.length - 1) return index + 1;
      return loopMode === "all" ? 0 : index;
    });
  }, [loopMode, queue.length]);

  const goPrev = useCallback((): void => {
    setCurrentIndex((index) => {
      if (queue.length === 0) return index;
      if (index > 0) return index - 1;
      return loopMode === "all" ? queue.length - 1 : index;
    });
  }, [loopMode, queue.length]);

  const removeItem = useCallback(
    (id: string): void => {
      const removeIndex = queue.findIndex((item) => item.id === id);
      if (removeIndex === -1) return;
      setQueue((currentQueue) => currentQueue.filter((item) => item.id !== id));
      setCurrentIndex((index) => {
        if (removeIndex < index) return index - 1;
        if (removeIndex === index) return Math.min(index, queue.length - 2);
        return index;
      });
    },
    [queue]
  );

  const cycleLoop = useCallback(
    (): void => setLoopMode((mode) => NEXT_LOOP_MODE[mode]),
    []
  );

  const openYouTubeSearch = useCallback((): void => {
    const query = input.trim();
    window.open(
      query
        ? `${YOUTUBE_SEARCH_URL}${encodeURIComponent(query)}`
        : "https://www.youtube.com",
      "_blank",
      "noopener,noreferrer"
    );
  }, [input]);

  const hasQueue = queue.length > 0;

  return (
    <StyledOlamovStream>
      <form className="url-bar" onSubmit={onAdd}>
        <input
          aria-label="Paste a YouTube or Twitch link"
          onChange={(event) => setInput(event.target.value)}
          placeholder="Paste a YouTube or Twitch link, then Add…"
          spellCheck={false}
          type="text"
          value={input}
        />
        <button className="play" type="submit">
          ＋ Add
        </button>
        <button className="search" onClick={openYouTubeSearch} type="button">
          Search YouTube ↗
        </button>
      </form>

      {error ? <div className="error">{error}</div> : undefined}

      {current ? (
        <iframe
          ref={iframeRef}
          allow={IFRAME_ALLOW}
          className="player"
          credentialless={supportsCredentialless ? "credentialless" : undefined}
          onLoad={onIframeLoad}
          referrerPolicy="strict-origin-when-cross-origin"
          src={current.embedUrl}
          title="olamovStream player"
          allowFullScreen
        />
      ) : (
        <div className="empty">
          <p>Paste a YouTube or Twitch link above, then press Add.</p>
          <p className="hint">
            Add as many links as you like — they queue up and play in order. Use
            ⏮ ⏭ to skip and the loop button for repeat.
          </p>
          <p className="hint">
            Need to find something? Click &quot;Search YouTube ↗&quot; — copy a
            link, paste it here, and Add. The taskbar volume controls YouTube
            playback; Twitch uses its own on-screen volume.
          </p>
        </div>
      )}

      {hasQueue ? (
        <div className="controls">
          <button
            aria-label="Previous"
            onClick={goPrev}
            title="Previous"
            type="button"
          >
            ⏮
          </button>
          <button aria-label="Next" onClick={goNext} title="Next" type="button">
            ⏭
          </button>
          <button
            aria-label="Loop mode"
            className="loop"
            onClick={cycleLoop}
            title="Loop mode"
            type="button"
          >
            {LOOP_LABEL[loopMode]}
          </button>
          <span className="position">
            {currentIndex + 1} / {queue.length}
          </span>
        </div>
      ) : undefined}

      {hasQueue ? (
        <ol className="queue">
          {queue.map((item, index) => (
            <li
              key={item.id}
              className={index === currentIndex ? "active" : undefined}
            >
              <button
                className="queue-play"
                onClick={() => setCurrentIndex(index)}
                title={item.raw}
                type="button"
              >
                <span className="badge">{item.provider}</span>
                {shortLabel(item)}
              </button>
              <button
                aria-label="Remove"
                className="queue-remove"
                onClick={() => removeItem(item.id)}
                title="Remove"
                type="button"
              >
                ✕
              </button>
            </li>
          ))}
        </ol>
      ) : undefined}
    </StyledOlamovStream>
  );
};

export default memo(OlamovStream);
