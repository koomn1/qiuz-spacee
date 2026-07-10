with open('src/components/ExtraFeatures.tsx', 'r') as f:
    content = f.read()
import re
content = re.sub(r'import React, { useState, useEffect } from \'react\';', 'import React, { useState, useEffect, useRef } from \'react\';\nimport gsap from \'gsap\';\nimport { useGSAP } from \'@gsap/react\';', content)
with open('src/components/ExtraFeatures.tsx', 'w') as f:
    f.write(content)
