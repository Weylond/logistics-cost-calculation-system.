import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import { VitePWA } from "vite-plugin-pwa";
import viteCompression from "vite-plugin-compression";
import zlib from "zlib";
import eslint from 'vite-plugin-eslint'

// import devtools from 'solid-devtools/vite';

export default defineConfig({
  plugins: [
    /* 
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
    // devtools(),
    eslint(),
    solidPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: null,
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /https?:\/\/.*\.woff2/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'fonts'
            }
          }
        ]
      },
      manifest: {
        name: "SVLZ",
        short_name: "SVLZ",
        id: "/",
        start_url: "/?from=homescreen",
        display: "standalone",
        orientation: "portrait-primary",
        lang: "en",
        dir: "ltr",
        display_override: [
          "standalone",
          "minimal-ui",
          "window-controls-overlay",
        ],
        prefer_related_applications: false,
      },
    }),
    viteCompression({
      algorithm: "brotliCompress",
      filter: /\.(js|mjs|png|webmanifest|json|txt|css|html|svg|woff2)$/i,
      threshold: 512,
      compressionOptions: {
        params: {
          [zlib.constants.BROTLI_PARAM_QUALITY]:
            zlib.constants.BROTLI_MAX_QUALITY,
          [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
        },
      },
    }),
  ],
  build: {
    target: "esnext",
  },
});
