// Try to import the local environment, fallback to default if not available
let localEnvironment;
try {
  localEnvironment = require('./environment.local').environment;
} catch (e) {
  localEnvironment = {
    production: false,
    deeplApiKey: 'YOUR_DEEPL_API_KEY_HERE' // Replace this with your actual API key for local development
  };
}

export const environment = localEnvironment; 