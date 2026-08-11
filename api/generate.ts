import { GoogleGenAI, Type } from '@google/genai';
import { YoutubeTranscript } from 'youtube-transcript';

export default async function handler(req: any, res: any) {
  // Add CORS headers for Vercel
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { content, contentType } = req.body;
    
    if (!content || !contentType) {
      return res.status(400).json({ error: 'Missing content or contentType' });
    }

    let contentToAnalyze = content;
    let hasTranscript = true;
    let isYoutube = false;
    
    // Attempt to fetch transcript if the content is a youtube URL
    if (content.includes('youtube.com/watch') || content.includes('youtu.be/')) {
      isYoutube = true;
      try {
        console.log("Fetching YouTube transcript for:", content);
        const transcript = await YoutubeTranscript.fetchTranscript(content);
        contentToAnalyze = transcript.map(t => t.text).join(' ');
        console.log("Transcript fetched successfully, length:", contentToAnalyze.length);
      } catch (e: any) {
        console.warn("YouTube captions disabled, trying fallback...");
        const match = content.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/))([\w-]+)/);
        const videoId = match ? match[1] : null;

        if (videoId) {
          try {
            const supadataKey = process.env.SUPADATA_API_KEY || 'sd_b188aefbdb4e624f24d34c3d3f5deb13';
            const supadataResponse = await fetch(
              `https://api.supadata.ai/v1/youtube/transcript?videoId=${videoId}`,
              {
                headers: {
                  'X-API-Key': supadataKey,
                },
              }
            );
            
            if (supadataResponse.ok) {
              const data = await supadataResponse.json();
              if (data.content && Array.isArray(data.content)) {
                contentToAnalyze = data.content.map((t: any) => t.text).join(' ');
                console.log("Supadata Transcript fetched successfully, length:", contentToAnalyze.length);
                hasTranscript = true;
              } else if (data.transcript) {
                contentToAnalyze = data.transcript;
                console.log("Supadata Transcript fetched successfully, length:", contentToAnalyze.length);
                hasTranscript = true;
              } else {
                throw new Error("Invalid Supadata response format");
              }
            } else {
              throw new Error("Supadata API failed");
            }
          } catch (supaError: any) {
            console.log("Supadata failed, trying Turnscribe...");
            try {
              const turnscribeResponse = await fetch('https://api.turnscribe.com/transcribe', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  url: content,
                  format: 'text',
                }),
              });
              
              if (turnscribeResponse.ok) {
                const data = await turnscribeResponse.json();
                contentToAnalyze = data.transcript;
                console.log("Turnscribe Transcript fetched successfully");
                hasTranscript = true;
              } else {
                throw new Error("Turnscribe API failed");
              }
            } catch (turnscribeError: any) {
              console.warn("All transcript methods failed.");
              hasTranscript = false;
              contentToAnalyze = content; // Fallback to passing the URL itself
            }
          }
        } else {
          console.warn("Could not extract videoId. All transcript methods failed.");
          hasTranscript = false;
          contentToAnalyze = content;
        }
      }
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const prompt = `
      You are an expert content strategist and copywriter. 
      Input type: ${contentType}
      
      Content to analyze:
      ${contentToAnalyze}

      ${isYoutube && !hasTranscript ? 'Note: This is a YouTube video URL, but its transcript was disabled by the creator so we cannot provide the spoken text. Please generate the social posts based on any information you might know about this video URL or general context.' : ''}
      
      Analyze this content and extract:
      - 10 key insights or main points
      - 5 controversial or thought-provoking statements
      - 3 actionable tips or takeaways
      - 2 storytelling moments or examples
      
      Then generate the following content pieces:
      
      LINKEDIN POSTS (5 posts):
      - Professional tone
      - 200-300 words each
      - Include hook, value, and call-to-action
      - Format with line breaks for readability
      
      TWITTER/X THREADS (10 tweets):
      - Engaging, conversational tone
      - Under 280 characters each
      - Use emojis sparingly
      - Include relevant hashtags (2-3 per tweet)
      
      INSTAGRAM CAPTIONS (3 captions):
      - Casual, friendly tone
      - 100-150 words each
      - Include 5-7 relevant hashtags
      - Add 3-5 emojis
      
      BLOG SUMMARY (1 post):
      - 400-500 words
      - SEO-friendly with natural keyword usage
      - Include introduction, body, conclusion
      - Add 3-5 bullet points for key takeaways
      
      EMAIL NEWSLETTER (1 snippet):
      - 150-200 words
      - Friendly, personal tone
      - Include subject line suggestion
      - Add clear call-to-action
    `;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        linkedin_posts: { type: Type.ARRAY, items: { type: Type.STRING } },
        twitter_tweets: { type: Type.ARRAY, items: { type: Type.STRING } },
        instagram_captions: { type: Type.ARRAY, items: { type: Type.STRING } },
        blog_summary: { type: Type.STRING },
        email_newsletter: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            body: { type: Type.STRING }
          },
          required: ["subject", "body"]
        },
        key_insights: { type: Type.ARRAY, items: { type: Type.STRING } },
        actionable_tips: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: [
        "linkedin_posts",
        "twitter_tweets",
        "instagram_captions",
        "blog_summary",
        "email_newsletter",
        "key_insights",
        "actionable_tips"
      ]
    };

    
    const modelsToTry = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-1.5-flash', 'gemini-1.5-pro'];
    let text = null;
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`Attempting generation with model: \${modelName}`);
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
          console.log(`Successfully generated content with \${modelName}`);
          break;
        }
      } catch (error: any) {
        console.warn(`Model \${modelName} failed:`, error.message || error);
        lastError = error;
      }
    }

    if (!text) {
      throw lastError || new Error("All fallback models failed to generate content.");
    }

    if (!text) throw new Error("Empty response from AI");
    const data = JSON.parse(text);

    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate content' });
  }
}
