import { resolve } from "node:path";

import { validatePublicBoundary } from "./public-boundary-core.mjs";

const root = resolve(process.cwd());
const findings = validatePublicBoundary(root);

if (findings.length > 0) {
  console.error(`Public boundary validation failed with ${findings.length} finding(s):`);
  for (const finding of findings) {
    console.error(`- ${finding.file} [${finding.rule}]: ${finding.detail}`);
  }
  process.exitCode = 1;
} else {
  console.log("Public boundary validation passed: no forbidden paths, imports, dependencies, secrets, remote assets, premium fields, or wallet transaction code detected.");
}
