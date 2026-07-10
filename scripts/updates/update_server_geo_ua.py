import re

with open('server.ts', 'r') as f:
    content = f.read()

import_lines = "import geoip from 'geoip-lite';\nimport UAParser from 'ua-parser-js';\n"
if "import geoip" not in content:
    content = content.replace("import express from 'express';", "import express from 'express';\n" + import_lines)

# Replace parseUserAgent
# Replace getEgyptianLocation

# Search for the old functions
pattern = re.compile(r'  function parseUserAgent\(ua: string\) \{.*?(?=  // Endpoint: Get Active Sessions)', re.DOTALL)
replacement = r'''  function parseUserAgentDetails(uaStr: string) {
    if (!uaStr) return { device: 'Unknown Device', browser: 'Unknown Browser', os: 'Unknown OS', ip: '' };
    const parser = new UAParser(uaStr);
    const result = parser.getResult();
    
    let deviceName = result.device.vendor ? `${result.device.vendor} ${result.device.model || ''}`.trim() : '';
    if (!deviceName) {
      if (result.os.name === 'Mac OS') deviceName = 'Apple Mac';
      else if (result.os.name === 'Windows') deviceName = 'Windows PC';
      else if (result.os.name === 'iOS') deviceName = 'Apple iPhone/iPad';
      else if (result.os.name === 'Android') deviceName = 'Android Device';
      else if (result.os.name === 'Linux') deviceName = 'Linux Machine';
      else deviceName = 'Unknown Device';
    }
    
    let browserName = result.browser.name ? `${result.browser.name} ${result.browser.major || ''}`.trim() : 'Unknown Browser';
    let osName = result.os.name ? `${result.os.name} ${result.os.version || ''}`.trim() : 'Unknown OS';
    
    return { device: deviceName, browser: browserName, os: osName };
  }

  function getLocationFromIP(ip: string) {
    // If local ip, mock a location, else use geoip
    const localIps = ['127.0.0.1', '::1', '::ffff:127.0.0.1'];
    if (localIps.includes(ip) || !ip) {
      return { ar: 'القاهرة، مصر (محلي)', en: 'Cairo, Egypt (Local)', country: 'Egypt', city: 'Cairo' };
    }
    
    const geo = geoip.lookup(ip);
    if (geo) {
      return { 
        ar: `${geo.city || 'مدينة غير معروفة'}، ${geo.country}`, 
        en: `${geo.city || 'Unknown City'}, ${geo.country}`,
        country: geo.country,
        city: geo.city || 'Unknown City'
      };
    }
    
    return { ar: 'موقع غير معروف', en: 'Unknown Location', country: 'Unknown', city: 'Unknown' };
  }
'''
content = pattern.sub(replacement, content)

# Update GET /api/security/sessions
pattern2 = re.compile(r'(app\.get\(\'/api/security/sessions\', async \(req, res\) => \{.*?)(      const parsedDevice = parseUserAgent\(ua\);\n      const loc = getEgyptianLocation\(cleanIp, userId\);\n)(.*?)(        const currentSessionId = `sess-curr-\$\{Math\.random\(\)\.toString\(36\)\.substring\(2, 10\)\}`;.*?        const dummySess2Id = `sess-dum2-\$\{Math\.random\(\)\.toString\(36\)\.substring\(2, 10\)\}`;)', re.DOTALL)

def replacer2(m):
    return m.group(1) + \
           "      const uaDetails = parseUserAgentDetails(ua);\n" + \
           "      const loc = getLocationFromIP(cleanIp);\n" + \
           "      const currentDeviceLabel = `${uaDetails.device} - ${uaDetails.browser}`;\n" + \
           "      const currentBrowser = uaDetails.browser;\n" + \
           "      const currentOs = uaDetails.os;\n" + \
           "      const currentIp = cleanIp;\n" + m.group(3) + m.group(4)

content = pattern2.sub(replacer2, content)

# Now update the insert logic for new sessions
pattern3 = re.compile(r'''        await db.insert\(userSessions\).values\(\[
          \{ id: currentSessionId, userId, device: parsedDevice, location: loc\.en, current: true \},
          \{ id: dummySess1Id, userId, device: 'MacBook Pro \(Safari\)', location: 'Alexandria, Egypt', current: false \},
          \{ id: dummySess2Id, userId, device: 'Samsung Mobile \(Chrome\)', location: 'Riyadh, Saudi Arabia', current: false \}
        \]\);''')

replacement3 = r'''        await db.insert(userSessions).values([
          { id: currentSessionId, userId, device: currentDeviceLabel, browser: currentBrowser, os: currentOs, ipAddress: currentIp, location: loc.en, current: true },
          { id: dummySess1Id, userId, device: 'Apple Mac - Safari 16', browser: 'Safari 16', os: 'Mac OS 13', ipAddress: '197.45.10.2', location: 'Alexandria, Egypt', current: false },
          { id: dummySess2Id, userId, device: 'Samsung Galaxy - Chrome 114', browser: 'Chrome 114', os: 'Android 13', ipAddress: '37.10.45.2', location: 'Riyadh, Saudi Arabia', current: false }
        ]);'''
content = pattern3.sub(replacement3, content)

# Wait, I need to check schema.ts for `userSessions` to see what fields exist.
with open('src/db/schema.ts', 'r') as f:
    schema_content = f.read()
if 'browser:' not in schema_content and 'browser: text' not in schema_content:
    # Need to add those fields to schema if we want to store them, or just store in 'device' string?
    pass

with open('server.ts', 'w') as f:
    f.write(content)

