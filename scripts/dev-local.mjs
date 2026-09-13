import { execFileSync, spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mode = process.argv[2] || "all";

if (mode !== "all" && mode !== "client") {
  console.error("Uso: node scripts/dev-local.mjs [all|client]");
  process.exit(1);
}

const services = [
  ...(mode === "all"
    ? [{
        name: "backend",
        command: "cmd.exe",
        args: ["/d", "/c", "bats\\start-backend.bat"],
        cwd: rootDir
      }]
    : []),
  {
    name: "client",
    command: "cmd.exe",
    args: ["/d", "/c", "npm run dev:client"],
    cwd: rootDir
  },
  ...(mode === "all"
    ? [{
        name: "admin",
        command: "cmd.exe",
        args: ["/d", "/c", "npm run dev:admin"],
        cwd: rootDir
      }]
    : [])
];

const running = new Set();
let isStopping = false;
let shutdownTimer;

function releasePort(port) {
  const output = execFileSync("netstat.exe", ["-ano", "-p", "tcp"], {
    encoding: "utf8",
    windowsHide: true
  });
  const processIds = new Set();

  for (const line of output.split(/\r?\n/)) {
    const match = line.match(/^\s*TCP\s+\S+:(\d+)\s+\S+\s+LISTENING\s+(\d+)\s*$/i);
    if (match?.[1] === String(port)) processIds.add(match[2]);
  }

  for (const processId of processIds) {
    console.log(`[client] Liberando porta ${port} (PID ${processId})...`);
    execFileSync("taskkill.exe", ["/pid", processId, "/t", "/f"], {
      encoding: "utf8",
      stdio: "pipe",
      windowsHide: true
    });
  }
}

if (mode === "client" || mode === "all") {
  try {
    releasePort(3000);
  } catch (error) {
    console.error(`[client] Nao foi possivel liberar a porta 3000: ${error.message}`);
    process.exit(1);
  }
}

function write(service, chunk, target) {
  const prefix = `[${service.name}] `;
  const lines = chunk.toString().split(/\r?\n/);
  const completeLines = lines.slice(0, -1);
  const tail = lines.at(-1);

  for (const line of completeLines) target.write(`${prefix}${line}\n`);
  if (tail) target.write(`${prefix}${tail}\n`);
}

function stopProcessTree(child) {
  if (!child.pid) return;
  spawn("taskkill.exe", ["/pid", String(child.pid), "/t", "/f"], {
    stdio: "ignore",
    windowsHide: true
  });
}

function shutdown(reason) {
  if (isStopping) return;
  isStopping = true;
  console.log(`\nEncerrando ambiente local (${reason})...`);
  for (const child of running) stopProcessTree(child);
  shutdownTimer = setTimeout(() => process.exit(1), 5000);
}

for (const service of services) {
  const child = spawn(service.command, service.args, {
    cwd: service.cwd,
    env: process.env,
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true
  });

  running.add(child);
  child.stdout.on("data", (chunk) => write(service, chunk, process.stdout));
  child.stderr.on("data", (chunk) => write(service, chunk, process.stderr));
  child.on("error", (error) => {
    console.error(`[${service.name}] Nao foi possivel iniciar: ${error.message}`);
  });
  child.on("exit", (code, signal) => {
    running.delete(child);
    if (!isStopping) {
      console.error(`[${service.name}] encerrou (codigo ${code ?? "n/a"}, sinal ${signal ?? "n/a"}).`);
      shutdown(`${service.name} encerrado`);
    }
    if (isStopping && running.size === 0) {
      clearTimeout(shutdownTimer);
      process.exit(code || 0);
    }
  });
}

console.log("RoyalPrime local iniciado no terminal atual.");
if (mode === "all") console.log("Backend: http://127.0.0.1:8000");
console.log("Client:  http://localhost:3000");
if (mode === "all") console.log("Admin:   http://localhost:3001");
console.log("Use Ctrl+C para encerrar todos os processos.");

process.on("SIGINT", () => shutdown("Ctrl+C"));
process.on("SIGTERM", () => shutdown("sinal do sistema"));
