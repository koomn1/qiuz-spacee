import fs from 'fs';
import path from 'path';

const pkgJsonPath = './node_modules/pdf-parse/package.json';
if (fs.existsSync(pkgJsonPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
  console.log('pdf-parse package.json name:', pkg.name);
  console.log('pdf-parse package.json main:', pkg.main);
  console.log('pdf-parse package.json exports:', pkg.exports);
} else {
  console.log('pdf-parse package.json not found!');
}
