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
  "frontend/foundation/native/tokens.ts",
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
  "frontend/foundation/ui/Layout/Layout.tsx",
  "frontend/foundation/ui/core/layout.ts",
  "frontend/foundation/shells/app-shell/native/index.ts",
  "frontend/foundation/shells/app-shell/native/components.tsx",
  "frontend/foundation/shells/app-shell/native/resolver.ts",
  "frontend/foundation/shells/app-shell/native/types.ts",
].forEach(mustExist);

mustContain("frontend/foundation/index.ts", /export \* from "\.\/native";/, "Foundation root exports native bridge");
mustContain("frontend/foundation/index.ts", /export \* from "\.\/shells";/, "Foundation root exports shells");
mustContain("frontend/foundation/shells/app-shell/index.ts", /export \* from "\.\/native";/, "AppShell exports native bridge");
mustContain("frontend/foundation/shells/app-shell/index.ts", /export \* from "\.\/foundation";/, "AppShell exports foundation contract");
mustContain("frontend/foundation/shells/app-shell/index.ts", /AppShellRuntime/, "AppShell exports web runtime");
mustContain("frontend/foundation/tokens/resolver.ts", /prefix\.startsWith\("z-index"\).*String\(value\)/s, "Theme resolver keeps z-index tokens unitless");
mustContain("frontend/foundation/tokens/resolver.ts", /setScaleVariables\(root, "z-index", tokens\.zIndex\)/, "Theme resolver injects z-index tokens");
mustContain("frontend/foundation/ui/core/layout.ts", /resolveLayoutConfig/, "UI Layout core exposes ServiceOS-style config resolver");
mustContain("frontend/foundation/ui/core/layout.ts", /gridTemplates/, "UI Layout core supports responsive grid template recipes");
mustContain("frontend/foundation/ui/Layout/Layout.tsx", /useUiConfig/, "Web Layout consumes resolved UI config");
mustContain("frontend/foundation/ui/Layout/index.ts", /Layout/, "Web Layout exports Layout compatibility wrapper");
mustContain("frontend/foundation/shells/app-shell/foundation/types.ts", /currentLayout/, "AppShell model exposes resolved layout");
mustContain("frontend/foundation/shells/app-shell/foundation/resolver.ts", /resolveAppShellViewportLayout/, "AppShell resolver supports viewport layout");
mustContain("frontend/foundation/shells/app-shell/web/ScreenContent.tsx", /<Container/, "AppShell content consumes Layout Container");
mustContain("frontend/foundation/shells/app-shell/foundation/types.ts", /nativeTabBar/, "AppShell placement supports nativeTabBar");
mustContain("frontend/foundation/shells/app-shell/foundation/types.ts", /nativeTabItems/, "Resolved AppShell model exposes nativeTabItems");
mustContain("frontend/foundation/shells/app-shell/foundation/types.ts", /navigationPlacements/, "AppShell config supports central navigation placement rules");
mustContain("frontend/foundation/shells/app-shell/foundation/resolver.ts", /resolveAppShellPlacement\(item, "nativeTabBar", config\)/, "Resolver derives native tab items from shared navigation");
mustContain("frontend/foundation/shells/app-shell/foundation/resolver.ts", /inheritFrom/, "Resolver supports inherited navigation placement rules");
mustContain("frontend/foundation/shells/app-shell/native/resolver.ts", /resolveAppShellModel/, "Native AppShell reuses foundation resolver");
mustContain("frontend/foundation/shells/app-shell/native/resolver.ts", /nativeTabBarConfig/, "Native AppShell resolves nativeTabBar config");
mustContain("frontend/foundation/shells/app-shell/native/components.tsx", /NativeAppShell/, "Native AppShell exports runtime components");
mustContain("frontend/foundation/shells/app-shell/native/components.tsx", /resolveNativeAppShellModel/, "Native AppShell runtime consumes native resolver");
mustContain("frontend/foundation/shells/app-shell/native/components.tsx", /Pressable/, "Native AppShell runtime renders host pressable controls");
mustContain("frontend/foundation/native/ui.ts", /createNativeFoundationBridge/, "Native Foundation bridge is exported");
mustContain("frontend/foundation/native/ui.ts", /resolveNativeUiManifest/, "Native UI manifest resolver is exported");
mustContain("frontend/foundation/native/semi-composed.ts", /createNativeSemiComposedBridge/, "Native semi-composed bridge is exported");
mustContain("frontend/foundation/native/semi-composed.ts", /resolveNativeSemiComposedDescriptor/, "Native semi-composed descriptor resolver is exported");
mustContain("frontend/foundation/native/tokens.ts", /resolveNativeThemeTokens/, "Native theme token resolver is exported");
mustContain("frontend/foundation/shells/app-shell/native/resolver.ts", /resolveNativeUiManifest/, "Native AppShell consumes native UI manifest");
mustContain("frontend/foundation/shells/app-shell/native/resolver.ts", /resolveAppShellViewportLayout\(input\.config, "native"\)/, "Native AppShell resolves native viewport layout");
mustContain("frontend/foundation/shells/app-shell/native/types.ts", /designSystem/, "Native AppShell exposes design system descriptor");
mustContain("frontend/client/shared-core/navigation/client.navigation.ts", /nativeTabBar\?: boolean/, "Client navigation accepts nativeTabBar placement");
mustContain("frontend/admin/shared-core/navigation/admin.navigation.ts", /nativeTabBar: boolean/, "Admin navigation declares nativeTabBar placement");
mustContain("frontend/client/shared-core/manifest/portal/appshell.config.jsx", /nativeTabBar:\s*{\s*enabled: true/s, "Client portal manifest enables nativeTabBar");
mustContain("frontend/client/shared-core/manifest/portal/appshell.config.jsx", /navigationPlacements:\s*{[\s\S]*bottomTabBar:\s*{[\s\S]*routeKeys:/, "Client portal manifest declares bottom tab routes centrally");
mustContain("frontend/client/shared-core/manifest/portal/appshell.config.jsx", /viewports:\s*{[\s\S]*desktop:[\s\S]*mobile:[\s\S]*native:/, "Client portal AppShell declares layout by viewport");
mustContain("frontend/client/shared-core/manifest/portal/appshell.config.jsx", /nativeTabBar:\s*{[\s\S]*inheritFrom: "bottomTabBar"/, "Client portal native tabs inherit bottom tab routes");
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
