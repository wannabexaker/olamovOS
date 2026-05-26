# Olamov OS Filesystem And Content Strategy

## Summary

Olamov OS inherits the daedalOS browser filesystem model:

- `public/` is the static HTTP filesystem source.
- `public/.index/fs.9p.json` is a generated file tree index.
- BrowserFS mounts that index as a read-only HTTP filesystem.
- BrowserFS overlays writable browser storage on top of it with IndexedDB.
- User-added files can exist locally in the browser without being deployed.

The important consequence is that the live site can show files that are not in
the public GitHub repository if the deployment machine had ignored local files
inside `public/Users/Public/**` when it generated `public/.index/fs.9p.json`.

This is what appears to happen on `dustinbrett.com`.

## Evidence From The Codebase

The default filesystem is configured in:

- `contexts/fileSystem/FileSystemConfig.ts`
- `contexts/fileSystem/core.ts`
- `contexts/fileSystem/useAsyncFs.ts`
- `scripts/fs2json.js`

The runtime config mounts:

- readable layer: BrowserFS `HTTPRequest`
- writable layer: BrowserFS `IndexedDB`
- wrapper: BrowserFS `OverlayFS`

The generated static index is produced by:

```sh
yarn build:fs:public
```

That runs:

```sh
node scripts/fs2json.js --exclude .index,private --out public/.index/fs.9p.json ./public
```

Full prebuild generation runs:

```sh
yarn build:prebuild
```

That also regenerates:

- `public/.index/fs.9p.json`
- `public/.index/desktopIcons.json`
- `public/.index/startMenuIcons.json`
- `public/.index/iniIcons.json`
- search/rss/robots files

## Why Dustin's Live Files Are Not In The GitHub Fork

The upstream daedalOS `.gitignore` ignores almost all public user files:

```gitignore
public/private
public/.index/*
public/Users/Public/**
```

It then allowlists only a small shell of public folders and a few default
shortcuts:

```gitignore
!public/Users/Public/Desktop
!public/Users/Public/Desktop/My PC.url
!public/Users/Public/Desktop/Public.url
!public/Users/Public/Documents
!public/Users/Public/Music
!public/Users/Public/Pictures
!public/Users/Public/Start Menu
!public/Users/Public/Videos
```

The upstream GitHub tree only contains the public filesystem skeleton, not the
creator's full personal content.

The live `dustinbrett.com` filesystem index does contain personal desktop
shortcuts and content paths. Observed live paths include:

- `/Users/Public/Desktop/Feature Review.url`
- `/Users/Public/Desktop/Day in My Life.url`
- `/Users/Public/Desktop/My Travel Story.url`
- `/Users/Public/Desktop/Live Well, Live Twice.url`
- `/Users/Public/Documents/Blog Posts/*.whtml`
- `/Users/Public/Pictures/Dustin`
- `/Users/Public/Pictures/Travel`
- `/Users/Public/Icons/Cache/YouTube/*.cache`

This means the live deployment was generated from a working copy that had
ignored local assets available at build time, or from a deploy pipeline that
injects those assets before `build:prebuild`.

Those files are not expected to appear after a normal fork/clone.

## How The Live Desktop Video Shortcuts Work

The video desktop items are not stored as big video files in the repo. They are
small `.url` shortcut files that open YouTube links with the `VideoPlayer`
process.

Example observed from `dustinbrett.com`:

```ini
[InternetShortcut]
BaseURL=VideoPlayer
Comment=I discuss my years of world travels and experiences
IconFile=/Users/Public/Icons/Cache/YouTube/nnQLHDmJSic.cache
URL=https://youtu.be/nnQLHDmJSic
```

Another example:

```ini
[InternetShortcut]
BaseURL=VideoPlayer
Comment=Reviewing the Features of my Desktop Environment in the Browser
IconFile=/Users/Public/Icons/Cache/YouTube/djCqHH0SCmA.cache
URL=https://youtu.be/djCqHH0SCmA
```

`BaseURL=VideoPlayer` selects the app from `contexts/process/directory.ts`.
`URL=https://youtu.be/...` is the actual media source.
`IconFile` points to a cached thumbnail-like icon when present.

If no cached icon exists, the code can fall back to:

```txt
https://i.ytimg.com/vi/<youtube-id>/mqdefault.jpg
```

Relevant code:

- `scripts/preloadIcons.js`
- `components/system/Files/FileEntry/functions.ts`
- `components/apps/VideoPlayer/useVideoPlayer.ts`

## Local-Only User Files

The OS already supports local user files without hosting them publicly.

Ways to add local-only files:

- Right-click in a folder or desktop and use `Add file(s)`.
- Right-click `My PC` and use `Map directory`.
- Use terminal `mount` for an HTTPRequest filesystem index.

These files are stored or mounted in the browser through IndexedDB and the File
System Access API. They are visible only to that browser/profile/device. They do
not become part of the deployed website.

Relevant code:

- `components/system/Files/FileManager/useFolderContextMenu.ts`
- `components/system/Files/FileEntry/useFileContextMenu.ts`
- `contexts/fileSystem/useFileSystemContextState.ts`

## Permanent Public Olamov Files

For content that should appear for every visitor, add files under `public/`.

Recommended public content locations:

- Desktop shortcuts: `public/Users/Public/Desktop/*.url`
- Blog posts: `public/Users/Public/Documents/Blog Posts/*.whtml`
- Documents: `public/Users/Public/Documents/**`
- Images/wallpapers: `public/Users/Public/Pictures/**`
- Icons/cache: `public/Users/Public/Icons/Cache/**`
- Small downloadable files: `public/Users/Public/Downloads/**`

After adding files:

```sh
corepack yarn build:prebuild
corepack yarn build
```

If the files must be committed, update `.gitignore` allowlist rules. The current
repo intentionally ignores most of `public/Users/Public/**`, so new content can
exist locally but remain invisible to Git unless explicitly allowlisted.

## Shortcut Templates

### YouTube Video Shortcut

```ini
[InternetShortcut]
BaseURL=VideoPlayer
Comment=Short description shown in properties/search
URL=https://youtu.be/VIDEO_ID
```

Optional cached thumbnail:

```ini
IconFile=/Users/Public/Icons/Cache/YouTube/VIDEO_ID.cache
```

Use this for Olamov videos instead of hosting `.mp4` files in Cloudflare Pages.

### Blog Post Shortcut

```ini
[InternetShortcut]
BaseURL=TinyMCE
Comment=Latest Olamov post
URL=/Users/Public/Documents/Blog Posts/Post Title.whtml
```

Optional cached document preview:

```ini
IconFile=/Users/Public/Icons/Cache/Users/Public/Documents/Blog Posts/Post Title.whtml.cache
```

### Folder Shortcut

```ini
[InternetShortcut]
BaseURL=FileExplorer
Comment=Open Olamov documents
IconFile=/System/Icons/olamov-documents.png
Type=System
URL=/Users/Public/Documents
```

## Cheap Hosting Strategy

### Best Default

Keep the public repo small and static:

- Commit small `.url`, `.whtml`, `.md`, `.txt`, `.png`, `.webp`, `.json` files.
- Put videos on YouTube and expose them as `VideoPlayer` shortcuts.
- Put large binary assets behind redirects only when truly needed.
- Keep generated `public/.index/*` out of Git.

This matches the original project model and works well with Cloudflare Pages.

### Cloudflare Pages Limits

Cloudflare Pages has a single-file upload limit. Olamov already handles this by
deleting oversized exported files in `build:cloudflare` and redirecting selected
large assets through `public/_redirects`.

Official limits reference:

- Cloudflare Pages limits: https://developers.cloudflare.com/pages/platform/limits/
- Cloudflare R2 pricing: https://developers.cloudflare.com/r2/pricing/
- Cloudflare R2 limits: https://developers.cloudflare.com/r2/platform/limits/

As of the checked documentation, Pages Free supports up to 20,000 files per site
and a maximum single asset size of 25 MiB. R2 Standard storage has a free tier
of 10 GB-month storage, 1 million Class A operations, 10 million Class B
operations, and free egress, but high read traffic can still create operation
costs.

Current redirected assets:

```txt
/Program Files/BoxedWine/fullWine1.7.55-v8.zip
/Program Files/Quake3/Quake3Game.pk3
/System/ffmpeg/ffmpeg-core.wasm
```

Those point to Cloudflare R2 public URLs.

### Without Paid Cloudflare

Use this order:

1. YouTube for videos.
2. Static Cloudflare Pages files for small public content.
3. GitHub Releases or another external free host for occasional large binaries.
4. R2 only for large app/runtime assets that must behave like files.

R2 is useful, but it may require account billing setup even when usage is inside
free-tier allowances. Avoid using R2 for normal content until the project needs
large binary files.

## Private Files Warning

`public/private` and `public/.index/fs.private.9p.json` are not secure secrets.
If deployed publicly, users can request them directly if they know the path.

Use `public/private` only for non-sensitive optional assets, demos, or mounts.
Do not store passwords, private keys, customer data, or personal private
documents there.

## Recommended Olamov Policy

For Olamov OS:

1. Keep Git-tracked desktop content intentional and small.
2. Add a dedicated allowlisted content area, for example:

   ```txt
   public/Users/Public/Documents/Olamov/**
   public/Users/Public/Documents/Blog Posts/**
   public/Users/Public/Desktop/*.url
   public/Users/Public/Icons/Cache/**
   ```

3. Use `.url` shortcuts for app-like desktop entries.
4. Use YouTube links for video entries.
5. Use static `.whtml` or `.md` for posts and notes.
6. Use R2 or external redirects only for files above Cloudflare Pages limits.
7. Run `corepack yarn build:prebuild` after any public filesystem change.

This gives Olamov its own visible content without copying Dustin's private
assets and without depending on paid hosting for normal media.
