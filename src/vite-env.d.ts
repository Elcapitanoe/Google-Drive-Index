/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GDRIVE_API_KEY?: string;
  readonly VITE_GDRIVE_ROOT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
