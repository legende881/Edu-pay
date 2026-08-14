import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';
import electron from 'vite-plugin-electron/simple';

// https://vite.dev/config/
export default defineConfig({
  base: './', // Important for electron production build
  plugins: [
    react(),
    electron({
      main: {
        entry: 'electron/main.js',
      },
    }),
    {
      name: 'remove-crossorigin',
      transformIndexHtml(html) {
        return html.replace(/crossorigin/g, '');
      }
    },
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo-pwa.jpg'],
      manifest: {
        name: 'EduPay',
        short_name: 'EduPay',
        description: 'Application de gestion scolaire',
        theme_color: '#059669',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'logo-pwa.jpg',
            sizes: '192x192',
            type: 'image/jpeg'
          },
          {
            src: 'logo-pwa.jpg',
            sizes: '512x512',
            type: 'image/jpeg'
          }
        ]
      }
    })
  ],
})
