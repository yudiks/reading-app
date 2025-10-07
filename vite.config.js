import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
  const isGitHubActions = process.env.GITHUB_ACTIONS === "true";
  const repository = process.env.GITHUB_REPOSITORY ?? "";
  const repoName = repository.split("/")[1] ?? "";

  return {
    base: isGitHubActions && repoName ? `/${repoName}/` : "/",
    plugins: [react()],
    server: {
      open: true
    }
  };
});
