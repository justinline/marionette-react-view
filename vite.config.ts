/// <reference types="vitest" />

import { defineConfig } from "vite";

export default defineConfig({
  root: "demo",
  test: {
    root: "src",
    environment: "happy-dom",
  },
});
