#!/usr/bin/env node

import { Command } from "commander";
import os from "os";
import { join } from "path";
import unity from "./unity";
import {
  DEFAULT_OUTPUT_PATH,
  DEFAULT_VERSION,
  Target,
  UNITY_EXECUTABLE_PATH,
} from "./constant";
import { getUnityExecutablePath } from "./utils";

const program = new Command();
program
  .option(
    "-t, --target <target>",
    `Specify the target. eg: ${Object.values(Target).join(", ")}`
  )
  .option("-p, --project <project>", "Specify the project path", ".")
  .option(
    "-o, --output <output>",
    `Specify the output path. (default: ${DEFAULT_OUTPUT_PATH}/<target>)`
  )
  .option(`-n, --name <name>`, `Specify the output name.`, "Demo")
  .option("-c, --clean", "Clean the project before building", false)
  .option("-v, --verbose", "Enable verbose mode", false)
  .option(
    "-up, --unity-path <unityPath>",
    `Specify the path to Unity executable. (default: ${
      UNITY_EXECUTABLE_PATH[Target.macos]
    })`
  )
  .option(
    "-uv, --unity-version <unityVersion>",
    "Specify the Unity version. Ignored if --unity-path is provided. replaces <version> in the path.",
    DEFAULT_VERSION
  )
  .option("-h, --help", "Display help message");

program.parse(process.argv);

const options = program.opts<{
  target: string;
  project: string;
  output: string;
  name: string;
  clean: boolean;
  verbose: boolean;
  unityPath: string;
  unityVersion: string;
  help: boolean;
}>();

if (options.help) {
  program.help();
  process.exit(0);
}

if (!options.target) {
  console.error("Please provide a target. Run with --help for more info.");
  process.exit(1);
}

let unityPath = options.unityPath;
if (!unityPath) {
  unityPath = getUnityExecutablePath(options.unityVersion, os.platform());
}

const projectPath = join(__dirname, options.project);

async function run(
  data: typeof options & { unityPath: string; projectPath: string }
) {
  await unity.build({
    target: data.target as Target,
    project: data.projectPath,
    outputPath: data.output,
    outputFileName: data.name,
    unityExecutablePath: data.unityPath,
    clean: !!data.clean,
    verbose: !!data.verbose,
  });
}

run({ ...options, unityPath, projectPath })
  .then(() => {
    console.log("Build completed");
  })
  .catch(console.error);
