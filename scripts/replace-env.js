const fs = require('fs');
const path = require('path');

// Get the API key from environment variable
const apiKey = process.env.DEEPL_API_KEY;
if (!apiKey) {
  console.error('DEEPL_API_KEY environment variable is not set');
  process.exit(1);
}

// Path to the production environment file
const envFile = path.resolve(process.cwd(), 'src/environments/environment.prod.ts');

// Read the environment file
let content = fs.readFileSync(envFile, 'utf8');

// Replace the API key placeholder
content = content.replace(
  /deeplApiKey:\s*['"].*['"]/,
  `deeplApiKey: '${apiKey}'`
);

// Write back to the file
fs.writeFileSync(envFile, content);
console.log('Environment file updated successfully'); 