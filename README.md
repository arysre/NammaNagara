# NammaNagara

A frontend-only civic grievance prototype for Bengaluru, built with React, Vite, React Router and Tailwind CSS.

## Run locally

```sh
npm install
npm run dev
```

Vite prints a local URL after the development server starts. To create a production bundle, run `npm run build`.

## Publish on GitHub Pages

This project includes a GitHub Actions workflow that builds and publishes the site to GitHub Pages whenever changes are pushed to the `main` branch.

1. Create a GitHub repository for this project (for example, `NammaNagara`) and push the project files to its `main` branch.
2. In the repository, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**.
3. Open the **Actions** tab and wait for the **Deploy to GitHub Pages** workflow to finish. The published URL will be shown in the workflow run and in **Settings → Pages**.

The site uses hash-based routes, so links to its screens also work when hosted on GitHub Pages. The site is a frontend-only demo; its sample data and interactions are not connected to a backend.

## Folder structure

```text
src/
  components/   Shared navigation, cards, filters, forms, dialogs and helper chat
  context/      App-wide mock report and interaction state
  data/         Bengaluru ward labels and 20 mock reports
  screens/      Feed, map, trending, analytics, officials' desk and profile views
  App.jsx       Routes, responsive application shell and shared dialogs
  index.css     Design tokens, component styles and responsive rules
  main.jsx      React entry point
```

## What is mocked

- All resident reports, users, wards, locations, status history, counts and charts are sample data. Ward names and numbers are illustrative and not official.
- Amplify, affected-by, comments and officials' status updates change the local interface only. They reset when the page is refreshed.
- Grievance submission is local. The moderation check uses a short demo word list; it is not AI or a safety service.
- The chatbot performs a simple local text match against the sample reports.
- The map uses OpenStreetMap tiles and approximate Bengaluru coordinates. It is not an official issue map.
- The helpline numbers are explicitly labelled placeholders and must not be used to request real assistance.
- There is no backend, authentication, official government connection or real AI service.
- The Government Desk has a demo-only `.gov.in` email-format gate to showcase the employee view. It does not verify identity or secure the route; real staff-only access requires server-verified authentication and backend authorization.
- Resident navigation includes feature suggestions and omits the Government Desk. After entering a `.gov.in` address in the demo employee sign-in, the employee navigation shows the Government Desk and hides feature suggestions and the resident posting controls.

Design tokens live together at the top of `src/index.css`; Tailwind color and font aliases are defined in `tailwind.config.js`.

Scrolling uses the browser's native refresh-rate-aware compositor path. Browsers supporting CSS scroll-driven animations reveal feed cards as they enter the viewport; older browsers show cards without the reveal. No JavaScript scroll loop or motion blur is applied.

Feed card movement follows the native CSS view timeline with no per-frame JavaScript animation. Smooth programmatic scrolling follows native browser behavior. Both motion effects honor the reduced-motion preference.
