const esbuild = require('esbuild');
try {
  esbuild.buildSync({
    entryPoints: ['src/pages/UserProfile.tsx'],
    bundle: false,
    outfile: 'out.js',
    logLevel: 'silent',
  });
} catch (e) {
  console.log(e.message);
}
