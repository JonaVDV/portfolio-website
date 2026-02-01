import { defineConfig } from "tsdown";
import Icons from "unplugin-icons/rolldown";
import { FileSystemIconLoader } from "unplugin-icons/loaders";
export default defineConfig({
  exports: true,

  plugins: [
    Icons({
      compiler: "svelte",
      customCollections: {
        portfolio: FileSystemIconLoader("./src/icons/"),
      },
    }),
  ],
  // ...config options
});
