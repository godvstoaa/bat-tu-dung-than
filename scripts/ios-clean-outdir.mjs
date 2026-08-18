import path from 'path';
import { fileURLToPath } from 'url';
import { rmrf } from './ios-artifacts.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
rmrf(path.join(ROOT, 'dist-ios'));
console.log('[ios-clean] đã xóa dist-ios (tránh chunk cũ vì emptyOutDir fail trên Windows)');
