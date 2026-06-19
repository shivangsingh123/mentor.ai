import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON parser middleware
  app.use(express.json());

  // API Analyze - Secure Server Side Proxy
  app.post('/api/analyze', async (req, res) => {
    try {
      const { code, language, customApiKey } = req.body;

      if (!code || !code.trim()) {
        return res.status(400).json({ error: 'Source code input must not be empty.' });
      }

      // Identify which API Key to use (custom key supplied in UI or platform fallback secret)
      const activeApiKey = (customApiKey && customApiKey.trim()) || process.env.GEMINI_API_KEY;

      if (!activeApiKey) {
        return res.status(401).json({
          error: 'Gemini API credentials not active. Enter a personal key in the navigation header settings to begin.'
        });
      }

      // Initialize Google GenAI client securely using recommended User-Agent header
      const ai = new GoogleGenAI({
        apiKey: activeApiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      // System Mentor Prompt Instructions
      const systemInstruction = `You are a senior software engineer and elite coding mentor.
Analyze the submitted code block and provide strict comprehensive feedback following the specified output schema exactly.
Provide beginner-friendly, detailed, and highly constructive descriptions.
Output must match the schema criteria. No extra markdown wrapping keys in the root JSON.`;

      const prompt = `Analyze this ${language} code block:
\`\`\`${language}
${code}
\`\`\``;

      // Ask Gemini 3.5 Flash for high performance, smart structures, and safety
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              qualityScore: {
                type: Type.NUMBER,
                description: 'Code quality score between 0.0 and 10.0 representing algorithmic and syntactic stability.'
              },
              difficultyLevel: {
                type: Type.STRING,
                description: 'Difficulty rating matching Beginner, Intermediate, or Advanced.'
              },
              interviewScore: {
                type: Type.NUMBER,
                description: 'Estimated standard software engineering interview pass index from 0.0 to 10.0.'
              },
              bugs: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Detailed list of syntax problems, infinite iteration loops, memory leaks, or execution bugs.'
              },
              security: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Specific concerns regarding sanitization, authorization leakages, buffer runs, or private credential disclosures.'
              },
              performance: {
                type: Type.STRING,
                description: 'Explanations focused on algorithmic complexity, execution overhead, allocations, and optimal alternatives.'
              },
              optimizations: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Concrete optimizations mapping out how performance metrics can be optimized.'
              },
              bestPractices: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Stylistic review checks mapping variable spacing rules, comment rules, or naming consistency.'
              },
              learningResources: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING, description: 'Book, specification, or article title.' },
                    url: { type: Type.STRING, description: 'Direct search query URL or tutorial path.' },
                    description: { type: Type.STRING, description: 'Brief outline of what is taught.' }
                  },
                  required: ['title', 'url', 'description']
                },
                description: 'A curated set of reading reference sources for further study.'
              },
              refactoredCode: {
                type: Type.STRING,
                description: 'A fully corrected, refactored, and beautifully structured copy of the provided code block incorporating all suggests.'
              },
              explanation: {
                type: Type.STRING,
                description: 'Summarized description explaining the key modifications made in the refactored code.'
              }
            },
            required: [
              'qualityScore',
              'difficultyLevel',
              'interviewScore',
              'bugs',
              'security',
              'performance',
              'optimizations',
              'bestPractices',
              'learningResources',
              'refactoredCode',
              'explanation'
            ]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Empirical empty response returned from the AI model.');
      }

      // Return the validated analysis JSON payload directly
      const analysisData = JSON.parse(responseText.trim());
      res.json(analysisData);

    } catch (error: any) {
      console.error('[API ERROR]:', error);
      res.status(500).json({
        error: error.message || 'System failed to analyze the requested code block. Verify connectivity or credentials.'
      });
    }
  });

  // Serve static files / Vite middleware depending on node execution mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SERVER ACTIVE]: Listening securely at http://0.0.0.0:${PORT}`);
  });
}

startServer();
