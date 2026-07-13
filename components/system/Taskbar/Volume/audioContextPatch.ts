// Global Web Audio volume bridge.
//
// A page-level volume slider can natively control only HTML5 <audio>/<video>
// elements. Apps that use the Web Audio API directly (js-dos / emscripten
// games like Doom, Webamp, etc.) route their sound through an AudioContext and
// are invisible to a plain volume control.
//
// To make the master volume truly global we patch the AudioContext constructor
// once: every context created afterwards gets a master GainNode inserted
// between the app's graph and the real hardware output. `ctx.destination` is
// overridden to return that gain, so any `node.connect(ctx.destination)` flows
// through a node whose gain we own. Everything is wrapped in try/catch so a
// failure can never break an app's audio — at worst that app just won't be
// volume-controlled.

let masterVolume = 1;
let masterMuted = false;
let patched = false;

const masterGains = new Set<GainNode>();

const currentLevel = (): number => (masterMuted ? 0 : masterVolume);

export const setMasterAudio = (volume: number, muted: boolean): void => {
  masterVolume = volume;
  masterMuted = muted;

  const level = currentLevel();

  for (const gain of masterGains) {
    try {
      gain.gain.value = level;
    } catch {
      masterGains.delete(gain);
    }
  }
};

type AudioWindow = Window & {
  AudioContext?: typeof AudioContext;
  __olamovAudioPatched?: boolean;
  webkitAudioContext?: typeof AudioContext;
};

// Replace a window's AudioContext constructor with one that inserts a master
// GainNode we own. Shared by the main-window patch and per-iframe patches so
// every context — wherever it lives — routes through the same masterGains set.
const patchWindow = (win: AudioWindow): void => {
  const Original = win.AudioContext || win.webkitAudioContext;

  if (typeof Original !== "function") return;

  const Patched = function PatchedAudioContext(
    this: unknown,
    ...args: unknown[]
  ): AudioContext {
    const context = new (Original as new (
      ...ctorArgs: unknown[]
    ) => AudioContext)(...args);

    try {
      const realDestination = context.destination;
      const master = context.createGain();

      master.gain.value = currentLevel();
      master.connect(realDestination);
      masterGains.add(master);

      // Expose the destination-only property some audio engines read (e.g.
      // emscripten/SDL channel setup) so the gain node can stand in for it.
      Object.defineProperty(master, "maxChannelCount", {
        configurable: true,
        get: () => realDestination.maxChannelCount,
      });

      Object.defineProperty(context, "destination", {
        configurable: true,
        get: () => master,
      });
    } catch {
      // Leave the context untouched if anything goes wrong.
    }

    return context;
  } as unknown as typeof AudioContext;

  Patched.prototype = Original.prototype;

  try {
    // eslint-disable-next-line no-param-reassign
    if (win.AudioContext) win.AudioContext = Patched;
    // eslint-disable-next-line no-param-reassign
    if (win.webkitAudioContext) win.webkitAudioContext = Patched;
  } catch {
    // If the global is read-only, fall back to native (no global control).
  }
};

export const patchAudioContextOnce = (): void => {
  if (patched || typeof window === "undefined") return;
  patched = true;

  patchWindow(window as AudioWindow);
};

// Apps that render into an isolated <iframe> (EmulatorJS, Commodore 64) have
// their own window and therefore their own AudioContext, which the main-window
// patch never touches. Patch that window too — before the emulator boots — so
// the global volume slider reaches it. Guarded per-window so a reused frame is
// not double-patched.
export const patchAudioContextForWindow = (win: Window | undefined): void => {
  const frameWindow = win as AudioWindow | undefined;

  if (!frameWindow || frameWindow.__olamovAudioPatched) return;
  frameWindow.__olamovAudioPatched = true;

  patchWindow(frameWindow);
};
