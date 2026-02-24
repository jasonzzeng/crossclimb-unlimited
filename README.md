# Crossclimb Unlimited

A web game inspired by LinkedIn's Crossclimb word ladder puzzle.

## Features
- 3 difficulties (Easy, Medium, Hard)
- Local puzzle bank with 40+ puzzles
- Drag-and-drop row reordering
- Hint and Reveal mechanics with time penalties
- Best time tracking via localStorage

## Tech Stack
- React 19
- TypeScript
- Vite
- Tailwind CSS

## Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

## GitHub Pages Deployment

This project is configured to be easily deployable to GitHub Pages.

1. In `vite.config.ts`, ensure the `base` property matches your repository name:
   ```typescript
   export default defineConfig({
     base: '/crossclimb-unlimited/', // Change this to your repo name
     // ...
   })
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Deploy the `dist` folder to your `gh-pages` branch. You can use the `gh-pages` npm package:
   ```bash
   npx gh-pages -d dist
   ```
   Or set up a GitHub Action to deploy the `dist` folder automatically on push to `main`.

## Adding More Puzzles

To add more puzzles, edit the files in `src/game/puzzleBank/`.
Each puzzle must follow the `Puzzle` interface defined in `src/game/types.ts`.
Ensure that the `middleRungs` can be reordered to form a valid word ladder (where each adjacent word differs by exactly one letter) connecting the `topAnswer` and `bottomAnswer`.
