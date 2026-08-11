const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const regex = /const response = await ai\.models\.generateContent\(\{\s*model: 'gemini-3\.6-flash',\s*contents: prompt,\s*config: \{\s*responseMimeType: 'application\/json',\s*responseSchema\s*\}\s*\}\);\s*const text = response\.text;/;

const replacement = `
      const modelsToTry = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-1.5-flash', 'gemini-1.5-pro'];
      let text = null;
      let lastError = null;

      for (const modelName of modelsToTry) {
        try {
          console.log(\`Attempting generation with model: \${modelName}\`);
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              responseSchema
            }
          });
          text = response.text;
          if (text) {
            console.log(\`Successfully generated content with \${modelName}\`);
            break;
          }
        } catch (error: any) {
          console.warn(\`Model \${modelName} failed:\`, error.message || error);
          lastError = error;
        }
      }

      if (!text) {
        throw lastError || new Error("All fallback models failed to generate content.");
      }
`;

if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync('server.ts', content);
    console.log("Successfully added fallback logic");
} else {
    console.log("Regex didn't match!");
}
