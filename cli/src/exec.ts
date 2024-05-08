import { spawn } from "child_process";

export async function exec(command: string, verbose = false) {
  console.log(`Executing: ${command}`);

  return new Promise<{ success: boolean }>((resolve, reject) => {
    const cp = spawn(command, { shell: true });

    if (verbose) {
      cp.stdout?.on("data", (data) => console.log(data.toString()));
      cp.stderr?.on("data", (data) => console.error(data.toString()));
    }

    cp.on("error", (error) => {
      console.error(error);
      reject(error);
    });

    cp.on("exit", (code: number) => {
      console.log(`Command exited with code ${code}`);
      resolve({
        success: code === 0,
      });
    });

    cp.on("close", (code) => {
      console.log(`Command closed with code ${code}`);
      resolve({
        success: code === 0,
      });
    });
  });
}
