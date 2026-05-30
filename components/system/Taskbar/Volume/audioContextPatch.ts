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

export const patchAudioContextOnce = (): void => {
  if (patched || typeof window === "undefined") return;
  patched = true;

  const win = window as unknown as {
    AudioContext?: typeof AudioContext;
    webkitAudioContext?: typeof AudioContext;
  };
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
    if (win.AudioContext) win.AudioContext = Patched;
    if (win.webkitAudioContext) win.webkitAudioContext = Patched;
  } catch {
    // If the global is read-only, fall back to native (no global control).
  }
};
