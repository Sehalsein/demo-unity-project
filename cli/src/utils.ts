import { DEFAULT_VERSION, Target, UNITY_EXECUTABLE_PATH } from "./constant";
import fs from "fs";

/**
 * Generated Unity executable path
 */
export function getUnityExecutablePath(
  version = DEFAULT_VERSION,
  os: string = Target.macos
) {
  const unityPath =
    UNITY_EXECUTABLE_PATH[os as keyof typeof UNITY_EXECUTABLE_PATH] ??
    UNITY_EXECUTABLE_PATH.macos;
  return unityPath.replace("<version>", version);
}

/**
 * Clean the directory
 */
export function cleanDirectory(directoryPath: string): void {
  try {
    fs.rmSync(directoryPath, { recursive: true, force: true });
  } catch (err) {
    console.error(`Error cleaning directory: ${directoryPath}`, err);
  }
}
