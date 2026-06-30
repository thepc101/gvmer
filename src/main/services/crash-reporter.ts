import { app, crashReporter } from "electron";
import { getLogger } from "./logger";

export function initCrashReporter() {
  const log = getLogger();

  crashReporter.start({
    productName: "gvmer",
    companyName: "gvmer Inc.",
    submitURL: "", // Replace with your crash reporting endpoint
    uploadToServer: true,
    ignoreSystemCrashHandler: false,
    compress: true,
    rateLimit: true,
    extra: {
      version: app.getVersion(),
      platform: process.platform,
      arch: process.arch,
    },
  });

  log.info("[crash] Crash reporter initialized");

  // Handle renderer process crashes
  app.on("renderer-process-crashed", (_event, _webContents, killed) => {
    log.error(`[crash] Renderer process crashed (killed: ${killed})`);
  });

  app.on("child-process-gone", (_event, details) => {
    log.error(`[crash] Child process gone: ${details.type} — ${details.reason}`);
  });
}
