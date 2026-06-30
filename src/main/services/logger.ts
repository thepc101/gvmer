import log from "electron-log";
import path from "path";
import { app } from "electron";

export function initLogger() {
  const logsPath = path.join(app.getPath("userData"), "logs");
  log.transports.file.resolvePathFn = () => path.join(logsPath, `gvmer-${formatDate()}.log`);
  log.transports.file.maxSize = 5 * 1024 * 1024; // 5MB per file
  log.transports.file.appName = "gvmer";
  log.transports.console.level = process.env.NODE_ENV === "production" ? "warn" : "debug";
  log.transports.file.level = "debug";

  // Catch unhandled errors
  process.on("uncaughtException", (err) => {
    log.error("[CRASH] Uncaught exception:", err);
    log.error("[CRASH] Stack:", err.stack);
  });

  process.on("unhandledRejection", (reason) => {
    log.error("[CRASH] Unhandled rejection:", reason);
  });

  log.info("========================================");
  log.info(`gvmer v${app.getVersion()}`);
  log.info(`Platform: ${process.platform} ${process.arch}`);
  log.info(`Electron: ${process.versions.electron}`);
  log.info(`Node: ${process.versions.node}`);
  log.info(`UserData: ${app.getPath("userData")}`);
  log.info("========================================");

  return log;
}

function formatDate(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function getLogger() {
  return log;
}
