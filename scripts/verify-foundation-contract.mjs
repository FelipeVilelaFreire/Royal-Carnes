import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const checks = [];

const read = (path) => readFileSync(join(root, path), "utf8");

const mustExist = (path) => {
  checks.push([existsSync(join(root, path)), `${path} exists`]);
};

const mustContain = (path, pattern, label) => {
  const content = read(path);
  checks.push([pattern.test(content), label || `${path} contains ${pattern}`]);
};

[
  "frontend/foundation/index.ts",
  "frontend/foundation/native/index.ts",
  "frontend/foundation/native/ui.ts",
  "frontend/foundation/native/semi-composed.ts",
  "frontend/foundation/native/types.ts",
  "frontend/foundation/docs/NATIVE.md",
  "frontend/foundation/shells/index.ts",
  "frontend/foundation/shells/app-shell/index.ts",
  "frontend/foundation/shells/app-shell/foundation/index.ts",
  "frontend/foundation/shells/app-shell/foundation/resolver.ts",
  "frontend/foundation/shells/app-shell/foundation/types.ts",
  "frontend/foundation/shells/app-shell/web/index.ts",
  "frontend/foundation/shells/app-shell/web/AppShellRuntime.tsx",
  "frontend/foundation/shells/app-shell/native/index.ts",
  "frontend/foundation/shells/app-shell/native/resolver.ts",
  "frontend/foundation/shells/app-shell/native/types.ts",
].forEach(mustExist);

mustContain("frontend/foundation/index.ts", /export \* from "\.\/native";/, "Foundation root exports native bridge");
mustContain("frontend/foundation/index.ts", /export \* from "\.\/shells";/, "Foundation root exports shells");
mustContain("frontend/foundation/shells/app-shell/index.ts", /export \* from "\.\/native";/, "AppShell exports native bridge");
mustContain("frontend/foundation/shells/app-shell/index.ts", /export \* from "\.\/foundation";/, "AppShell exports foundation contract");
mustContain("frontend/foundation/shells/app-shell/index.ts", /AppShellRuntime/, "AppShell exports web runtime");
mustContain("frontend/foundation/shells/app-shell/foundation/types.ts", /nativeTabBar/, "AppShell placement supports nativeTabBar");
mustContain("frontend/foundation/shells/app-shell/foundation/types.ts", /nativeTabItems/, "Resolved AppShell model exposes nativeTabItems");
mustContain("frontend/foundation/shells/app-shell/foundation/resolver.ts", /resolveAppShellPlacement\(item, "nativeTabBar"\)/, "Resolver derives native tab items from shared navigation");
mustContain("frontend/foundation/shells/app-shell/native/resolver.ts", /resolveAppShellModel/, "Native AppShell reuses foundation resolver");
mustContain("frontend/foundation/shells/app-shell/native/resolver.ts", /nativeTabBarConfig/, "Native AppShell resolves nativeTabBar config");
mustContain("frontend/foundation/native/ui.ts", /createNativeFoundationBridge/, "Native Foundation bridge is exported");
mustContain("frontend/foundation/native/semi-composed.ts", /createNativeSemiComposedBridge/, "Native semi-composed bridge is exported");
mustContain("frontend/client/shared-core/navigation/client.navigation.ts", /nativeTabBar\?: boolean/, "Client navigation accepts nativeTabBar placement");
mustContain("frontend/admin/shared-core/navigation/admin.navigation.ts", /nativeTabBar: boolean/, "Admin navigation declares nativeTabBar placement");
mustContain("frontend/client/shared-core/manifest/portal/appshell.config.jsx", /nativeTabBar:\s*{\s*enabled: true/s, "Client portal manifest enables nativeTabBar");
mustContain("frontend/client/shared-core/manifest/landing/appshell.config.jsx", /nativeTabBar:\s*{\s*enabled: false/s, "Client landing manifest disables nativeTabBar");
mustContain("frontend/admin/shared-core/manifest/adminAppShell.config.jsx", /nativeTabBar:\s*{\s*enabled: true/s, "Admin AppShell manifest enables nativeTabBar");
mustContain("frontend/client/shared-core/manifest/capabilities/app-shell.ts", /platforms: \["web", "native"\]/, "Client AppShell capability is web/native");
mustContain("frontend/admin/shared-core/manifest/capabilities/app-shell.ts", /platforms: \["web", "native"\]/, "Admin AppShell capability is web/native");
mustContain("docs/architecture/DESIGN_SYSTEM_V1_TREE.md", /frontend\/foundation\/native/, "Design system docs include Foundation native bridge");
mustContain("docs/architecture/FRONTEND_TARGET_TREE_ROADMAP.md", /app-shell\/native|app-shell\/\s+foundation\/\s+web\/\s+native\//s, "Frontend roadmap includes AppShell native bridge");
mustContain("frontend/foundation/docs/NATIVE.md", /native-ready/, "Foundation native docs describe native-ready status");

const failures = checks.filter(([ok]) => !ok);

if (failures.length > 0) {
  console.error("Foundation contract verification failed:");
  failures.forEach(([, label]) => console.error(`- ${label}`));
  process.exit(1);
}

console.log(`Foundation contract verification passed (${checks.length} checks).`);
