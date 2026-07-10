import re

with open('server.ts', 'r') as f:
    content = f.read()

# Fix UAParser
content = content.replace("new UAParser(uaStr)", "new UAParser.UAParser(uaStr)")

# Fix parsedDevice
content = content.replace("device: parsedDevice", "device: currentDeviceLabel")

with open('server.ts', 'w') as f:
    f.write(content)

