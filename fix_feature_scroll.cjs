const fs = require('fs');
let code = fs.readFileSync('src/components/FeatureScrollReveal.tsx', 'utf-8');

if (!code.includes('isAr?: boolean')) {
  code = code.replace(
    'features: { title: string; desc: string }[];',
    'features: { title: string; desc: string }[];\n  isAr?: boolean;'
  );
  code = code.replace(
    'export function FeatureScrollReveal({ features }: FeatureScrollRevealProps) {',
    'export function FeatureScrollReveal({ features, isAr }: FeatureScrollRevealProps) {'
  );
  code = code.replace(
    'xPercent: -100 * (panels.length - 1),',
    'xPercent: (isAr ? 100 : -100) * (panels.length - 1),'
  );
  fs.writeFileSync('src/components/FeatureScrollReveal.tsx', code);
  console.log('Fixed RTL horizontal scroll');
}
