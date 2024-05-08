import { join } from "path";
import { exec } from "./exec";
import { DEFAULT_OUTPUT_FILE, DEFAULT_OUTPUT_PATH, Target } from "./constant";
import { cleanDirectory } from "./utils";

type BuildOptions = {
  target: Target;
  project: string;
  unityExecutablePath: string;
  outputPath?: string;
  outputFileName?: string;
  clean?: boolean;
  verbose?: boolean;
};

async function build(options: BuildOptions) {
  const args = ["-quit", "-batchmode", "-nographics"];

  args.push("-projectPath", options.project);
  args.push("-target", getUnityTarget(options.target));
  args.push("-executeMethod", "ProjectBuilder.BuildCLI");

  const outputFileName =
    options.outputFileName ?? DEFAULT_OUTPUT_FILE[options.target].name;
  const outputPath = options.outputPath
    ? join(options.project, options.outputPath)
    : join(options.project, DEFAULT_OUTPUT_PATH, options.target.toString());

  args.push("-output", join(outputPath, outputFileName));

  if (options.clean) {
    cleanDirectory(outputPath);
  }

  const command = `${options.unityExecutablePath} ${args.join(" ")}`;
  const result = await exec(command, !!options.verbose);

  if (!result.success) {
    throw new Error("Build failed");
  }
}

export default { build };

/**
 * Helpers
 */
function getUnityTarget(target: Target): string {
  switch (target) {
    case Target.macos:
      return "StandaloneOSX";
    case Target.windows:
      return "StandaloneWindows";
    case Target.linux:
      return "StandaloneLinux64";
    default:
      throw new Error("Invalid target");
  }
}
