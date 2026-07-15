# QR Studio

A responsive QR toolkit built with React and Vite. It can generate QR codes, scan them with a device camera, and keep a private local history in the browser.

## Features

- Generate QR codes from links or text
- Download generated codes as SVG
- Scan QR codes with a phone or webcam
- Copy or open detected content
- Generated and scanned history stored in `localStorage`
- Responsive desktop and mobile navigation

## Local development

Install the exact dependency versions from the lock file:

```bash
npm ci
```

Start the development server:

```bash
npm run dev
```

Vite serves the app at `http://localhost:5173/QRgener/`.

## Checks

```bash
npm run lint
npm run build
```

The project uses hash-based routes so all screens continue to work when it is deployed to a static host such as GitHub Pages.
