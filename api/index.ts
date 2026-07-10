import express from 'express';

let handler: any;

try {
  // Try to import the full server app
  const serverModule = await import('../server.ts');
  handler = serverModule.app;
} catch (e: any) {
  // If server.ts crashes on import, create a diagnostic app that returns the error
  const diagnosticApp = express();
  diagnosticApp.all('*', (req, res) => {
    res.status(500).json({
      error: 'Server initialization failed',
      message: e?.message || String(e),
      stack: e?.stack || 'No stack trace available'
    });
  });
  handler = diagnosticApp;
}

export default handler;
