import { defineConfig, UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "vite-plugin-fs";
import path from "path";

export default defineConfig(() => {
  const config: UserConfig = {
    plugins: [
      fs(),
      react({
        jsxImportSource: "@emotion/react",
        babel: {
          plugins: ["@emotion/babel-plugin"],
        },
      }),
    ],
    resolve: {
      // If you update aliases here, you need to update in tsconfig and jest config
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@lib": path.resolve(__dirname, "./src/lib"),
      },
    },
    esbuild: {
      logOverride: { "this-is-undefined-in-esm": "silent" },
    },
  };
  return config;
});
