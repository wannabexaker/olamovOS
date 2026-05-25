# Olamov OS

Olamov OS is a fictional retro Windows 98/99 desktop environment rendered in the browser. It is a local prototype for the Olamov Universe landing surface: folders, terminal, start menu, taskbar, wallpaper, and app windows should feel like a usable desktop rather than a static page.

## Current Scope

- Purple Windows 99-style theme and Olamov branding.
- Desktop icons for core folders and Olamov apps.
- Start Menu and taskbar shell.
- Olamov Terminal with basic branded commands.
- Readme.txt support through a Notepad-style app.
- User-provided wallpaper assets in `public/Users/Public/Pictures`.

## Stack

- Next.js
- React
- TypeScript
- styled-components
- BrowserFS-backed public filesystem

## Run Locally

```powershell
$env:NODE_OPTIONS="--openssl-legacy-provider"; corepack yarn install --frozen-lockfile
$env:NODE_OPTIONS="--openssl-legacy-provider"; corepack yarn dev -p 3001
```

Open: `http://localhost:3001`

## Build

```powershell
$env:NODE_OPTIONS="--openssl-legacy-provider"; corepack yarn build
```

## Project Notes

- The default wallpaper is `public/Users/Public/Pictures/olamov-default.png`.
- Public desktop/start menu files are indexed during `build:prebuild`.
- Generated files under `public/.index`, `.next`, and `out` are not committed.
- Legal/open-source attribution is kept in `LICENSE` and `public/CREDITS.md`.

## Direction

The next design pass should focus on pixel-accurate Windows 99 behavior: My Computer, folders, Start Menu, taskbar tray, classic window chrome, and a consistent Olamov visual language across every app surface.
