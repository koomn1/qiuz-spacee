const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// The correct closing sequence:
// </div> {/* Closes <div className="flex-1... */}
// </div></div></motion.div> {/* Closes <motion.div key="main-app"... */}
code = code.replace(
  '</div></div></div></motion.div> {/* Closes <motion.div key="main-app"',
  '</div></div></motion.div> {/* Closes <motion.div key="main-app"'
);

// We need to make sure there are no other extra closing divs.
// Let's also check line 1133 where the error first occurred.
code = code.replace(
  '</div></div></div></motion.div>\n          )}',
  '</motion.div>\n          )}'
);

fs.writeFileSync('src/App.tsx', code);
