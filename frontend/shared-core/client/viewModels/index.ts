import contentManifest from "../manifest/content.manifest.json";

export function getAvailablePlans() {
  return contentManifest.plans;
}
