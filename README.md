# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## PWA Support

This app includes baseline Progressive Web App support:

- `public/manifest.webmanifest` provides install metadata and PNG app icons.
- `public/sw.js` caches app-shell assets and runtime GET requests.
- `src/main.jsx` registers the service worker in production builds.
- `index.html` includes manifest and mobile theme metadata.

### How to test

1. Build and preview the app:
	- `npm run build`
	- `npm run preview`
2. Open the preview URL in a Chromium browser.
3. In DevTools > Application, verify:
	- Manifest is detected
	- Service worker is active
	- Installability checks pass

Note: service workers are only registered in production mode (`import.meta.env.PROD`).
