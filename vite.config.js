import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vite.dev/config/
export default defineConfig({
    base: '/ReactTypeScript/', // 🔹設定 GitHub Pages 子目錄
    plugins: [react()],
});
