import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: "./src/setupTests.js",
        coverage: {
            provider: "istanbul", // or 'v8'
            reporter: ["text", "json", "html"], // Ajout de reporters
            all: true, // Inclure tous les fichiers sources, même ceux non couverts par les tests
            include: ["src/**/*.{js,jsx}"], // Spécifier les fichiers à inclure
            exclude: [
                "src/setupTests.js",
                "src/**/*.d.ts",
                "src/vite-env.d.ts",
            ], // Exclure les fichiers inutiles
            // threshold: { // Définir des seuils de couverture (facultatif)
            //   lines: 80,
            //   functions: 80,
            //   branches: 80,
            //   statements: 80,
            // },
        },
    },
});
