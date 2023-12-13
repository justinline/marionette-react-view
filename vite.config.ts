/// <reference types="vitest" />

import { defineConfig } from "vite";

export default defineConfig({
  root: "demo",
  test: {
    environment: "happy-dom",
  },
});
