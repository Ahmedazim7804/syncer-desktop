import { defaultPlugins, defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "http://localhost:8000/openapi.json",
  output: {
    format: "prettier",
    path: "./src/lib/api/gen",
  },
  plugins: [
    ...defaultPlugins,
    "@hey-api/client-axios",
    "@tanstack/react-query",
  ],
});
