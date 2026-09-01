# Google Drive Index

Client-side directory indexer and file browser for Google Drive built with React 19, TypeScript, and Vite.

## Architecture

The application interfaces directly with the Google Drive v3 REST API via client-side fetch requests. It eliminates backend runtime dependencies, server-side render overhead, and heavy UI framework runtimes in favor of scoped CSS variables and native browser APIs.

```
Client (Browser)
├── State Management (React 19 / Hooks)
├── LocalStorage Cache (Configuration & Token Persistence)
└── Google Drive v3 REST API (HTTPS / API Key auth)
    └── files.list endpoint (Filtering, Pagination, Metadata)
```

## Requirements

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher (or pnpm / yarn)
- Google Cloud Platform account with Google Drive API v3 enabled

## Google Cloud Setup

To index non-public files or connect to your own drive, configure an API key on Google Cloud Console:

1. Navigate to the Google Cloud Console (https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Open **APIs & Services** > **Library**.
4. Search for `Google Drive API` and click **Enable**.
5. Go to **APIs & Services** > **Credentials**.
6. Click **Create Credentials** > **API key**.
7. (Optional but recommended) Restrict the API key:
   - Under **API restrictions**, select **Restrict key** and choose **Google Drive API**.
   - Under **Application restrictions**, set appropriate HTTP referrer restrictions for your domain.
8. Ensure the Google Drive folder you intend to index has sharing permissions set to `Anyone with the link can view` (Viewer role).

## Installation

Clone the repository and install dependencies:

```bash
git clone git@github.com:Elcapitanoe/Google-Drive-Index.git
cd Google-Drive-Index
npm install
```

## Configuration

Credentials can be configured via environment variables or runtime configuration.

### 1. Environment Variables

Create a `.env` file in the project root:

```env
VITE_GDRIVE_API_KEY=AIzaSyYourApiKeyHere
VITE_GDRIVE_ROOT_ID=0B1234567890abcdef_FolderID
```

- `VITE_GDRIVE_API_KEY`: Google Drive API Key.
- `VITE_GDRIVE_ROOT_ID`: Target folder ID (defaults to `root` if omitted).

### 2. Runtime Configuration

If environment variables are omitted, configure credentials directly in the web interface via the **Configure** button. Settings are stored in the browser's `localStorage` under `gdrive_index_config`.

## Development

Start the Vite development server:

```bash
npm run dev
```

The application will be accessible at `http://localhost:3000`.

## Production Build

Typecheck and generate optimized static assets:

```bash
npm run build
```

The compiled output is located in the `dist/` directory.

### Preview Build

```bash
npm run preview
```

## Deployment

The `dist/` folder contains pure static assets compatible with any static hosting provider.

### Cloudflare Pages

```bash
npx wrangler pages deploy dist --project-name=google-drive-index
```

### Vercel

```bash
npx vercel deploy --prod
```

Set the build command to `npm run build` and the output directory to `dist`.

## Scripts

- `npm run dev`: Starts the local development server.
- `npm run build`: Compiles TypeScript and runs Vite production build.
- `npm run preview`: Locally previews the production build.
- `npm run lint`: Runs ESLint across all TypeScript and React source files.
