import { exec } from "child_process";

exec("curl -X POST http://localhost:3000/api/generate-ai-quiz -H 'Content-Type: application/json' -d '{\"topic\":\"testing\",\"amount\":2}'", (err, stdout, stderr) => {
   console.log("Stdout:", stdout);
   console.log("Stderr:", stderr);
});
