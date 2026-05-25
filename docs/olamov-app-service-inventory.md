# Olamov OS App / Service Inventory

Status: initial audit after Olamov OS prototype cleanup.

## Current Stack

- Framework: Next.js pages router.
- Entry point: `pages/index.tsx`.
- Shell: `components/system/Desktop`, `Taskbar`, `StartMenu`, `Window`.
- App registry: `contexts/process/directory.ts`.
- Public shortcuts/assets: `public/Users/Public/**`.
- Generated filesystem cache: `public/.index/**` via `corepack yarn build:prebuild`.

## Core Olamov Shell To Keep

| Area | Status | Notes |
|---|---|---|
| Desktop | keep | Needs redesign toward left-column reference desktop icons. |
| Taskbar | keep | Needs system tray/volume polish and active window styling. |
| Start Menu | keep | Needs Windows 1999 vertical sidebar and separators. |
| Window Manager | keep | Existing draggable/resizable implementation is valuable. |
| FileExplorer | keep | Needed for folders and public filesystem navigation. |
| Terminal | keep | Rename/skin as Olamov Terminal; add Olamov commands. |
| Notepad | keep | Needed for Readme/sticky/lore files. |
| Properties | keep | Rework into Olamov System Properties. |
| Browser | keep/rework | Should become Olamov Universe browser-style landing window. |

## Apps Available In Registry

| App | Recommendation | Reason |
|---|---|---|
| Browser | keep/rework | Needed for Olamov Universe landing window. |
| FileExplorer | keep | Core OS folder behavior. |
| Terminal | keep/rework | Core Olamov command surface. |
| Notepad | keep | Lightweight text/lore viewer. |
| Properties | keep/rework | System dialog required by reference design. |
| Paint | optional keep | Retro OS credibility; hide from first desktop. |
| Photos | optional keep | Useful for wallpaper/images. |
| Marked | optional keep | Useful for docs/README preview. |
| MonacoEditor | optional keep | Developer-heavy; keep in Programs only. |
| PDF | optional keep | Useful utility; keep in Programs only. |
| TinyMCE | optional keep | Heavy; keep only if document editing matters. |
| VideoPlayer | optional keep | Useful utility; keep in Programs only. |
| Webamp | optional keep | Strong retro vibe but not MVP. |
| Chess, DXBall, SpaceCadet, ClassiCube, Quake3 | optional/games | Keep under Programs/Games, not desktop. |
| Emulator, JSDOS, Ruffle, V86, BoxedWine, Tic80 | disable by default | Heavy WASM/emulation stack; keep code, hide shortcuts unless needed. |
| DevTools | disable by default | Developer utility; not part of public Olamov vibe. |
| IRC, Messenger | disable by default | Network/social features not core landing page. |
| StableDiffusion | disable by default | Heavy/WebGPU; not MVP and can confuse the prototype. |
| OpenType | optional/internal | Only opens fonts; no Start shortcut needed. |
| OpenWith, Run, ScreenSaver, Transfer | system/internal | Keep as shell dialogs, not direct app focus. |

## Shortcut State

- Top-level Start Menu currently exposes: `Programs`, `Documents`, `Settings`, `Run...`, `Shut Down`.
- Inherited app shortcuts currently live under `public/Users/Public/Start Menu/Programs`.
- Heavy/optional inherited apps should be hidden from the public-first UX by removing/moving shortcuts, not by deleting implementation code.

## Next Configuration Pass

1. Build the five required Olamov windows: Universe, Projects, System Properties, Terminal, Note.
2. Decide which inherited app shortcuts stay in `Programs`.
3. Move heavy apps into a hidden `System Tools` or remove their shortcuts.
4. Add a real Olamov Projects window with links/status for SkyCode, NetSentry, Eye in the Sky, Olamov Lab, Future Project.
5. Update tests/smoke checks for icon count, Start Menu items, terminal commands, and no console errors.
