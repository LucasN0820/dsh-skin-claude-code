#!/usr/bin/env node
// One-click installer for dsh-skin-claude-code.
//
// Usage: node scripts/install.mjs [profileName]   (profileName defaults to "web")
//
// Does two things, both idempotent:
//   1. Installs the package into the profile via `dsh plugin add`.
//   2. Appends the enable row to the profile's cordis.patch.yml.

import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

const PACKAGE = 'dsh-skin-claude-code';
const ROW_ID = 'claude-code-skin';

const args = process.argv.slice(2);
const profileName = args[0] && !args[0].startsWith('-') ? args[0] : 'web';
const dshHome = process.env.DSH_HOME || join(homedir(), '.dsh');
const patchFile = join(dshHome, 'profiles', profileName, 'cordis.patch.yml');

function run(cmd, cmdArgs) {
  return spawnSync(cmd, cmdArgs, {
    stdio: 'inherit',
    // On Windows `dsh` is a .cmd/.ps1 shim; a plain spawn cannot exec it.
    shell: process.platform === 'win32',
  });
}

// 1. Install the package into the profile.
console.log(`\n[1/2] Installing ${PACKAGE} into profile "${profileName}"...`);
const install = run('dsh', ['plugin', '--profile', profileName, 'add', PACKAGE]);
if (install.error || install.status !== 0) {
  console.error('\nCould not run `dsh`. Is it on PATH? Or run manually:');
  console.error(`  dsh plugin --profile ${profileName} add ${PACKAGE}`);
  process.exit(install.status ?? 1);
}

// 2. Idempotently add the enable row to cordis.patch.yml.
console.log(`\n[2/2] Enabling "${ROW_ID}" in ${patchFile}...`);

let existing = '';
try {
  existing = await readFile(patchFile, 'utf8');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

if (existing.includes(`id: ${ROW_ID}`)) {
  console.log(`Row "${ROW_ID}" already present — nothing to change.`);
} else {
  const block = [
    '- insert:',
    `    - id: ${ROW_ID}`,
    `      name: ${PACKAGE}`,
    '',
  ].join('\n');

  await mkdir(dirname(patchFile), { recursive: true });
  const next = existing ? existing.replace(/\s*$/, '\n') + block : block;
  await writeFile(patchFile, next, 'utf8');
  console.log(`Added the enable row to ${patchFile}.`);
}

console.log('\nDone. Restart the harness to load the skin:');
console.log('  dsh web');
console.log(
  `\nTo remove later: dsh plugin --profile ${profileName} remove ${PACKAGE}` +
    `\nand delete the "${ROW_ID}" row from ${patchFile}`,
);
