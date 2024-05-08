import { exec as executeCommand } from "child_process";

export async function exec(command: string, verbose = false) {
  console.log(`Executing: ${command}`);

  return new Promise<{ success: boolean }>((resolve, reject) => {
    const result = executeCommand(command);

    if (verbose) {
      result.stdout?.on("data", console.log);
      result.stderr?.on("data", console.error);
    }

    result.on("error", (error) => {
      console.error(error);
      reject(error);
    });

    result.on("close", (code) => {
      console.log(`Command exited with code ${code}`);
      resolve({
        success: code === 0,
      });
    });
  });
}
