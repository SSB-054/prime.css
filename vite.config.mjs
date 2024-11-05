// vite.config.js
import { defineConfig } from 'vite'
import { resolve } from 'path'
import fs from 'fs'
import path from 'path'
import data from './package.json';

// Helper function to ensure directory exists
function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

function updateHtmlWithCdnLinks(inputString, cdnBase) {
  // Update JS links
  // <!--REPLACE_START REPLACE_END-->
  const startPlaceholder = '<!--REPLACE_START ';
  const endPlaceholder = 'REPLACE_END-->';
  return inputString.split('\n').map((line) => {
    if(line.includes(startPlaceholder)){
      const startIndex = line.indexOf(startPlaceholder);
      const endIndex = line.indexOf(endPlaceholder, startIndex);
      if (startIndex !== -1 || endIndex !== -1) {
        return line.slice(startIndex + startPlaceholder.length, endIndex).replace('@main/', `@${data['version']}/`)
      }
    }
    return line
  }).join('\n');
}

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        base: resolve(__dirname, 'src/base/base.js'),
        theme: resolve(__dirname, 'src/theme/theme.scss'),
      },
      output: {
        entryFileNames: `[name]/bundle.min.js`,
        chunkFileNames: `[name]/bundle.min.js`,
        assetFileNames: `[name]/bundle.min.css`,
      }
    },

  },
  plugins: [{
    name: 'create-github-docs',
    closeBundle: async () => {
      // Read the source index.html
      const indexPath = resolve(__dirname, 'index.html');
      const outputDocsIndexPath = resolve(__dirname, 'docs/index.html');

      if (!fs.existsSync(indexPath)) {
        console.error('Source index.html not found!');
        return;
      }

      // Create docs directory if it doesn't exist
      ensureDirectoryExistence(outputDocsIndexPath);

      // Read the HTML content
      let htmlContent = fs.readFileSync(indexPath, 'utf-8');

      // Replace local paths with CDN paths
      // Replace this URL with your actual CDN base URL
      const cdnBaseUrl = 'https://cdn.jsdelivr.net/gh/surajsinghbisht054/prime.css@latest';
      htmlContent = updateHtmlWithCdnLinks(htmlContent, cdnBaseUrl);

      // Write the modified HTML to docs folder
      fs.writeFileSync(outputDocsIndexPath, htmlContent);
      console.log('Successfully copied and updated index.html to /docs folder');
    }
  }]
})