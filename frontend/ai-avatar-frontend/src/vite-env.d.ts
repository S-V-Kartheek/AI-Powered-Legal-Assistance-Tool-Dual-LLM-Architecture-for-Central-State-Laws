/// <reference types="vite/client" />

declare interface ImportMetaEnv {
  readonly VITE_CHAT_API_URL: string;
  readonly VITE_PROJECT_API_URL: string;
  readonly VITE_LAW_API_URL: string;
  readonly VITE_STEGO_API_URL: string;
  readonly VITE_BHASHINI_API_URL: string;
  readonly VITE_LOGIN_API_URL: string;
  // add more as needed
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
} 