import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { analyze, introduced } from './code-rules.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
try {
  const args = process.argv.slice(2);
  const baseIndex = args.indexOf('--base');
  if (args.some((arg, i) => arg !== '--all' && arg !== '--base' && !(baseIndex >= 0 && i === baseIndex + 1)) || baseIndex >= 0 && !args[baseIndex + 1]) throw Error('Usage: node scripts/verify-code-rules.mjs [--base REV] [--all]');
  const base = git('rev-parse', '--verify', `${baseIndex >= 0 ? args[baseIndex + 1] : 'HEAD'}^{commit}`).trim();
  const all = args.includes('--all');
  const tracked = (all ? git('ls-files', '-z') : git('diff', '--name-only', '-z', base, '--', 'frontend')).split('\0').filter(Boolean);
  const untracked = git('ls-files', '--others', '--exclude-standard', '-z').split('\0').filter(Boolean);
  const baseFiles = new Set(git('ls-tree', '-r', '--name-only', '-z', base).split('\0'));
  const renameTokens = all ? [] : git('diff', '--name-status', '-M', '-z', base, '--', 'frontend').split('\0').filter(Boolean);
  const renamedFrom = new Map();
  for (let index = 0; index < renameTokens.length; index += 1) {
    const status = renameTokens[index];
    if (!status.startsWith('R')) continue;
    const previousPath = renameTokens[index + 1];
    const currentPath = renameTokens[index + 2];
    if (previousPath && currentPath) renamedFrom.set(currentPath, previousPath);
    index += 2;
  }
  const files = [...new Set([...tracked, ...untracked])].filter((file) => file.startsWith('frontend/') && /\.(?:[cm]?[jt]sx?|css)$/.test(file) && existsSync(path.join(root, file)));
  const errors = [];
  let checked = 0;
  let legacy = 0;
  for (const file of files) {
    const source = readFileSync(path.join(root, file), 'utf8');
    const previousPath = baseFiles.has(file) ? file : renamedFrom.get(file);
    const previous = !all && previousPath ? git('show', `${base}:${previousPath}`) : '';
    if (!all && source.replaceAll('\r\n', '\n') === previous.replaceAll('\r\n', '\n')) continue;
    checked++;
    const current = analyze(file, source);
    const added = all ? current : introduced(analyze(file, previous), current);
    legacy += current.length - added.length;
    errors.push(...added);
  }
  for (const error of errors) console.error(`${error.file}:${error.line} [${error.rule}] ${error.message}`);
  console.log(`Code rules: ${checked} files checked; ${errors.length} violations; ${legacy} unchanged legacy findings. Base: ${base.slice(0, 12)}`);
  if (errors.length) process.exitCode = 1;
} catch (error) {
  console.error(`Code rules failed: ${error.message}`);
  process.exitCode = 2;
}
