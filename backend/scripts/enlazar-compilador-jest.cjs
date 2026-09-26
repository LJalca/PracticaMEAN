const fs = require('fs');
const path = require('path');

const destino = path.join(
  __dirname,
  '..',
  'node_modules',
  'ts-jest',
  'node_modules',
  'typescript'
);
const origen = path.join(__dirname, '..', 'node_modules', 'typescript-jest');

if (!fs.existsSync(origen)) {
  process.exit(0);
}

fs.mkdirSync(path.dirname(destino), { recursive: true });

if (!fs.existsSync(destino)) {
  fs.symlinkSync(origen, destino, 'junction');
}
