# Google Drive Index

A fast, responsive, client-side directory indexer and download gateway for Google Drive, built with React 19, TypeScript, and Vite.

## Overview

Google Drive Index connects directly from the browser to the Google Drive v3 REST API. It serves one core purpose: indexing files from a configured Google Drive folder into a clean web interface where visitors can browse and download files directly.

Because it runs entirely client-side, the gateway requires no backend server, database, or container runtime. Static assets can be deployed to any static host or CDN edge.

### Architecture

```
Browser Client
├── State & Router (React 19 / Hooks / AbortController)
├── In-Memory LRU Cache (Instant back/forward folder navigation)
├── LocalStorage (Configuration & Dark/Light theme preferences)
└── Google Drive v3 REST API (HTTPS / Direct key query)
    └── files.list endpoint (Filtering, file metadata, download URLs)
```

## Features

- **Direct Download**: Single-click file downloads and instant download link copying with clipboard feedback.
- **Dual-Theme Engine**: Dark (default obsidian) and Light themes with system preference detection and local persistence.
- **In-Memory Cache**: Visited folders are cached in memory for zero-latency instant navigation.
- **Request Cancellation**: In-flight requests automatically abort via `AbortSignal` when navigating between folders to prevent race conditions.
- **Filter & Search**: Instant file filtering with shortcut support (press `/` to search, `Esc` to clear).
- **Dual View Modes**: Switch between tabular list view (with sortable columns) and responsive card grid view.
- **File Metadata Inspection**: Inspect exact file size, byte count, MIME type, modified timestamp, and Google Drive file ID.
- **Pixel-Perfect Responsiveness**: Tested across mobile (down to 320px), tablet, laptop, and ultra-wide viewports.
- **Demonstration Mode**: Works immediately out of the box with mock fixtures if no API key is provided.

## Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher (or pnpm / yarn / bun)
- Google Cloud Platform account with Google Drive API v3 enabled

## Google Cloud Setup

To index real Google Drive folders, generate an API key on Google Cloud Console:

1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or choose an existing project.
3. Navigate to **APIs & Services** > **Library**.
4. Search for `Google Drive API` and click **Enable**.
5. Navigate to **APIs & Services** > **Credentials**.
6. Click **Create Credentials** > **API key**.
7. Restrict the API key:
   - Under **API restrictions**, select **Restrict key** and choose **Google Drive API**.
   - Under **Application restrictions**, set appropriate HTTP referrer restrictions for your domain (e.g., `https://yourdomain.com/*`).
8. Share the target Google Drive folder:
   - In Google Drive, right-click the folder and select **Share** > **Share**.
   - Change General access to **Anyone with the link** and role set to **Viewer**.
   - Copy the folder ID from the URL: `https://drive.google.com/drive/folders/<FOLDER_ID>`.

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Elcapitanoe/Google-Drive-Index.git
cd Google-Drive-Index
npm install
```

## Configuration

Credentials can be configured through environment variables at build time or via the runtime settings modal.

### Option 1: Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_GDRIVE_API_KEY=AIzaSyYourApiKeyHere
VITE_GDRIVE_ROOT_ID=0B1234567890abcdef_FolderID
```

- `VITE_GDRIVE_API_KEY`: Google Cloud API key with Drive API v3 enabled.
- `VITE_GDRIVE_ROOT_ID`: Target folder ID (defaults to `root` if omitted).

### Option 2: Runtime Configuration

If environment variables are omitted, click the **Settings** button in the header to enter your API key and Root Folder ID. Settings are stored locally in the browser (`localStorage`).

## Development

Start the local development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## Production Build

Typecheck and compile optimized static assets:

```bash
npm run build
```

Built assets are generated in `dist/`.

To test the production build locally:

```bash
npm run preview
```

## Deployment

The output in `dist/` consists of static HTML, CSS, and JS bundles.

### Cloudflare Pages

```bash
npx wrangler pages deploy dist --project-name=google-drive-index
```

### Vercel

```bash
npx vercel deploy --prod
```

Configure build settings in the Vercel dashboard:

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

### Docker / Nginx Static Container

```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Keyboard Shortcuts

| Key     | Action                            |
| ------- | --------------------------------- |
| `/`     | Focus search filter input         |
| `Esc`   | Clear search filter / Close modal |
| `Enter` | Navigate into selected folder     |

## Codebase Structure

```
├── index.html               # Entry HTML shell with font preloads and metadata
├── vite.config.ts           # Vite build config with vendor chunk splitting
├── tsconfig.json            # Strict TypeScript compiler options
├── src/
│   ├── main.tsx             # Application bootstrap
│   ├── App.tsx              # Core explorer layout, state, and search logic
│   ├── FileIcon.tsx         # Categorized SVG file icon mapper
│   ├── FileDetailsModal.tsx # File inspection and download metadata dialog
│   ├── SettingsModal.tsx    # Drive API configuration modal
│   ├── api.ts               # Google Drive v3 REST fetcher with caching and abort
│   ├── types.ts             # Domain interfaces and type definitions
│   ├── utils.ts             # Byte and date formatting utilities
│   ├── vite-env.d.ts        # Typed environment variable definitions
│   └── index.css            # Scoped design system and responsive styles
└── .env.example             # Template for required environment variables
```

## License

MIT License. See [LICENSE](LICENSE) for details.
