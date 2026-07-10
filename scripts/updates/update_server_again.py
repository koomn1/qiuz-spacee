import re

with open('server.ts', 'r') as f:
    content = f.read()

# Fix the db.insert statement I broke earlier because I added browser and os to the values
pattern = re.compile(r'''        await db\.insert\(userSessions\)\.values\(\[
          \{ id: currentSessionId, userId, device: currentDeviceLabel, browser: currentBrowser, os: currentOs, ipAddress: currentIp, location: loc\.en, current: true \},
          \{ id: dummySess1Id, userId, device: 'Apple Mac - Safari 16', browser: 'Safari 16', os: 'Mac OS 13', ipAddress: '197\.45\.10\.2', location: 'Alexandria, Egypt', current: false \},
          \{ id: dummySess2Id, userId, device: 'Samsung Galaxy - Chrome 114', browser: 'Chrome 114', os: 'Android 13', ipAddress: '37\.10\.45\.2', location: 'Riyadh, Saudi Arabia', current: false \}
        \]\);''', re.DOTALL)

replacement = r'''        await db.insert(userSessions).values([
          { id: currentSessionId, userId, device: `${currentOs} • ${currentBrowser}`, ipAddress: currentIp, location: loc.en, lastActive: 'Active now', current: true },
          { id: dummySess1Id, userId, device: 'Mac OS 13 • Safari 16', ipAddress: '197.45.10.2', location: 'Alexandria, Egypt', lastActive: '2 hours ago', current: false },
          { id: dummySess2Id, userId, device: 'Android 13 • Chrome 114', ipAddress: '37.10.45.2', location: 'Riyadh, Saudi Arabia', lastActive: 'Yesterday', current: false }
        ]);'''

content = pattern.sub(replacement, content)

# Update the existing session check block to update current session if found
pattern2 = re.compile(r'''      if \(list\.length === 0\) \{.*?      \} else \{
        // Ensure one of them is marked current for this request
        // In a real app we would match by session cookie/token\. Here we just mark the newest as current
        let hasCurrent = list\.some\(s => s\.current\);
        if \(!hasCurrent\) \{
          await db\.update\(userSessions\)\.set\(\{ current: true \}\)\.where\(eq\(userSessions\.id, list\[0\]\.id\)\);
          list\[0\]\.current = true;
        \}
      \}''', re.DOTALL)

replacement2 = r'''      if (list.length === 0) {
        const currentSessionId = `sess-curr-${Math.random().toString(36).substring(2, 10)}`;
        const dummySess1Id = `sess-dum1-${Math.random().toString(36).substring(2, 10)}`;
        const dummySess2Id = `sess-dum2-${Math.random().toString(36).substring(2, 10)}`;
        await db.insert(userSessions).values([
          { id: currentSessionId, userId, device: `${currentOs} • ${currentBrowser}`, ipAddress: currentIp, location: loc.en, lastActive: 'Active now', current: true },
          { id: dummySess1Id, userId, device: 'Mac OS 13 • Safari 16', ipAddress: '197.45.10.2', location: 'Alexandria, Egypt', lastActive: '2 hours ago', current: false },
          { id: dummySess2Id, userId, device: 'Android 13 • Chrome 114', ipAddress: '37.10.45.2', location: 'Riyadh, Saudi Arabia', lastActive: 'Yesterday', current: false }
        ]);
        list = await db.select().from(userSessions).where(eq(userSessions.userId, userId));
      } else {
        // Find current session (or pick first one)
        let currentSess = list.find(s => s.current);
        if (!currentSess) {
          currentSess = list[0];
          await db.update(userSessions).set({ current: true }).where(eq(userSessions.id, currentSess.id));
          currentSess.current = true;
        }
        
        // Update current session with new IP and device details if changed
        const newDeviceStr = `${currentOs} • ${currentBrowser}`;
        if (currentSess.ipAddress !== currentIp || currentSess.device !== newDeviceStr || currentSess.location !== loc.en) {
           await db.update(userSessions)
             .set({ device: newDeviceStr, ipAddress: currentIp, location: loc.en, lastActive: 'Active now' })
             .where(eq(userSessions.id, currentSess.id));
           
           currentSess.device = newDeviceStr;
           currentSess.ipAddress = currentIp;
           currentSess.location = loc.en;
           currentSess.lastActive = 'Active now';
        }
      }'''

content = pattern2.sub(replacement2, content)

with open('server.ts', 'w') as f:
    f.write(content)

