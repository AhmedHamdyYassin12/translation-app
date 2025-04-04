# Translation App

A simple translation application using the DeepL API.

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Get your DeepL API key from [DeepL's website](https://www.deepl.com/pro-api)
4. Configure your API key:
   - Open `src/environments/environment.ts` for development
   - Open `src/environments/environment.prod.ts` for production
   - Replace `'YOUR_DEEPL_API_KEY_HERE'` with your actual API key

## Development

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`.

## Production

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Security Note

Never commit your actual API key to the repository. The environment files are already set up with placeholders to prevent accidental exposure of your API key.
