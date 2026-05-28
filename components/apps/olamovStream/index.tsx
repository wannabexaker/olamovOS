import { type FormEvent, memo, useState } from "react";
import StyledOlamovStream from "components/apps/olamovStream/StyledOlamovStream";
import { parseStreamUrl } from "components/apps/olamovStream/functions";
import { type ComponentProcessProps } from "components/system/Apps/RenderComponent";

const ERROR_MESSAGE =
  "\u0394\u03B5\u03BD \u03B1\u03BD\u03B1\u03B3\u03BD\u03C9\u03C1\u03AF\u03C3\u03C4\u03B7\u03BA\u03B5 YouTube URL \u03AE video ID.";
const EMPTY_MESSAGE =
  "\u03A0\u03B1\u03C1\u03B1\u03BA\u03B1\u03BB\u03CE \u03B5\u03C0\u03B9\u03BA\u03CC\u03BB\u03BB\u03B7\u03C3\u03B5 \u03AD\u03BD\u03B1 YouTube link \u03B3\u03B9\u03B1 \u03BD\u03B1 \u03BE\u03B5\u03BA\u03B9\u03BD\u03AE\u03C3\u03B5\u03B9 \u03C4\u03BF video.";
const HINT_MESSAGE =
  "\u03A5\u03C0\u03BF\u03C3\u03C4\u03B7\u03C1\u03AF\u03B6\u03BF\u03BD\u03C4\u03B1\u03B9: watch?v=, youtu.be, shorts, live, playlists.";
const IFRAME_ALLOW =
  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
const PLAY_LABEL = "\u25B6 Play";
const URL_PLACEHOLDER =
  "https://youtube.com/watch?v=... \u03AE youtu.be/... \u03AE 11-char ID";

const OlamovStream: FC<ComponentProcessProps> = () => {
  const [input, setInput] = useState("");
  const [embedUrl, setEmbedUrl] = useState<string>();
  const [error, setError] = useState<string>();

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const parsed = parseStreamUrl(input.trim());

    if ("embedUrl" in parsed) {
      setEmbedUrl(parsed.embedUrl);
      setError(undefined);
    } else {
      setError(ERROR_MESSAGE);
    }
  };

  return (
    <StyledOlamovStream>
      <form className="url-bar" onSubmit={handleSubmit}>
        <input
          aria-label="YouTube URL or video ID"
          onChange={(event) => setInput(event.target.value)}
          placeholder={URL_PLACEHOLDER}
          spellCheck={false}
          type="text"
          value={input}
        />
        <button type="submit">{PLAY_LABEL}</button>
      </form>
      {error ? <div className="error">{error}</div> : undefined}
      {embedUrl ? (
        <iframe
          allow={IFRAME_ALLOW}
          className="player"
          src={embedUrl}
          title="olamovStream player"
          allowFullScreen
        />
      ) : (
        <div className="empty">
          <p>{EMPTY_MESSAGE}</p>
          <p className="hint">{HINT_MESSAGE}</p>
        </div>
      )}
    </StyledOlamovStream>
  );
};

export default memo(OlamovStream);
