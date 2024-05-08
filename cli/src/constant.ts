export enum Target {
  macos = "macos",
  windows = "windows",
  linux = "linux",
}

/**
 * CLI constants
 */
export const DEFAULT_OUTPUT_PATH = "Builds";
export const DEFAULT_OUTPUT_FILE = {
  [Target.macos]: { name: "Demo", extension: ".app" },
  [Target.windows]: { name: "Demo", extension: ".exe" },
  [Target.linux]: { name: "Demo", extension: "" },
};

/**
 * Unity constants
 */
export const DEFAULT_VERSION = "2021.3.8f1";
export const UNITY_EXECUTABLE_PATH = {
  [Target.linux]:
    "/Applications/Unity/Hub/Editor/<version>/Unity.app/Contents/Linux/Unity -projectPath <project path>",
  [Target.windows]:
    "C:\\Program Files\\Unity\\Hub\\Editor\\<version>\\Editor\\Unity.exe",
  [Target.macos]:
    "/Applications/Unity/Hub/Editor/<version>/Unity.app/Contents/MacOS/Unity",
};
