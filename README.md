# 🚀 RepurposeAI - AI Content Repurposing Tool

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![Gemini API](https://img.shields.io/badge/Gemini-API-blue?logo=google)](https://ai.google.dev/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://vercel.com/)

**Turn 1 long-form content into 30+ social media posts in 2 minutes.**

RepurposeAI is a free AI-powered SaaS tool that helps content creators, marketers, and small businesses transform YouTube videos, podcasts, and blog posts into platform-optimized content for LinkedIn, Twitter/X, Instagram, and more.

![RepurposeAI Demo](./public/screenshot.png)

> **Live Demo:** [https://repurposeai.com](https://repurposeai.com)

## ✨ Features

- 🎯 **Multi-Platform Output**: Generate LinkedIn posts, Twitter threads, Instagram captions, blog summaries, and email newsletters from one input
- 🎬 **YouTube Integration**: Extract transcripts from YouTube videos (with fallback for disabled captions)
- 🎙️ **Audio/Video Upload**: Support for MP3/MP4 file uploads
- 📝 **Text Input**: Paste blog posts or transcripts directly
- 🤖 **AI-Powered**: Uses Google Gemini 2.5 Pro for intelligent content analysis and generation
- 💰 **Freemium Model**: Free tier with 3 jobs/month, Pro tier for unlimited usage
- 📊 **User Dashboard**: Track usage, save history, and export content
- 📱 **Mobile Responsive**: Works perfectly on all devices
- ⚡ **Fast & Optimized**: Core Web Vitals optimized (LCP < 2.5s, CLS < 0.1)

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **React 18**
- **Tailwind CSS**
- **TypeScript**

### Backend & AI
- **Google Gemini API** (Gemini 2.5 Pro)
- **Node.js** with Express
- **Firebase** (Authentication & Database)

### Hosting & Deployment
- **Vercel** (Frontend)
- **Google AI Studio** (AI Processing)

### Monetization
- **Google AdSense** (Free tier ads)
- **Stripe/Razorpay** (Pro subscriptions)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Google AI Studio account (free)
- Firebase account (free)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/repurpose-ai.git
   cd repurpose-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_ADSENSE_ID=your_adsense_id (optional)
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 How It Works

### 1. Input Content
Users can provide content in three ways:
- **YouTube URL**: Automatically extracts transcript (with fallback APIs for disabled captions)
- **File Upload**: Upload MP3/MP4 audio/video files (max 100MB)
- **Text Paste**: Directly paste blog posts or transcripts

### 2. AI Processing
The app sends content to Google Gemini API with a structured prompt that:
- Analyzes content and extracts key insights
- Identifies main points, quotes, and actionable tips
- Generates platform-specific content with appropriate tone and format

### 3. Output Generation
Users receive:
- 5 LinkedIn posts (professional, 250 words each)
- 10 Twitter tweets (engaging, under 280 characters)
- 3 Instagram captions (with emojis and hashtags)
- 1 blog summary (400-500 words)
- 1 email newsletter snippet (150-200 words)

### 4. Export & Share
- Copy individual posts with one click
- Export all content as CSV or TXT
- Save to dashboard for later use

## 🎯 Use Cases

- **Content Creators**: Turn YouTube videos into a week's worth of social posts
- **Podcasters**: Promote episodes across LinkedIn, Twitter, and Instagram
- **Marketing Agencies**: Scale content production for multiple clients
- **Small Businesses**: Create consistent social media presence on a budget
- **Freelance Writers**: Increase output without hiring more writers

## 📊 API Integration

### YouTube Transcript Extraction

The app uses a multi-fallback approach:

```javascript
// 1. Try YouTube's built-in captions
// 2. Fallback to Supadata API (has AI fallback)
// 3. Fallback to Turnscribe (free, Whisper-powered)
// 4. Show user-friendly error with manual alternatives
```

### Gemini API Prompt Structure

```javascript
const prompt = `
Analyze this content and extract:
- 10 key insights or main points
- 5 controversial or thought-provoking statements
- 3 actionable tips or takeaways
- 2 storytelling moments or examples

Then generate:
- 5 LinkedIn posts (professional tone, 250 words each)
- 10 tweets (engaging, under 280 characters)
- 3 Instagram captions (with emojis and 5-7 hashtags)
- 1 blog summary (400-500 words)
- 1 email newsletter (150-200 words with subject line)

Format as JSON with clear sections.
`;
```

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Click "Deploy"

### Environment Variables in Vercel

Add all `.env.local` variables to Vercel's environment settings.

## 📈 SEO Optimization

This project is optimized for both traditional search engines and AI search:

- ✅ **Technical SEO**: XML sitemap, robots.txt, canonical URLs
- ✅ **On-Page SEO**: Meta tags, schema markup, semantic HTML
- ✅ **AI Search (GEO)**: Q&A structure, concise answers, FAQ schema
- ✅ **Performance**: Core Web Vitals optimized (LCP < 2.5s, CLS < 0.1)
- ✅ **Mobile-First**: Responsive design, touch-friendly UI

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style (Prettier + ESLint)
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google AI Studio](https://aistudio.google.com/) for the Gemini API
- [Next.js](https://nextjs.org/) for the amazing framework
- [Vercel](https://vercel.com/) for hosting
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Firebase](https://firebase.google.com/) for authentication

## 📞 Support

- **Website**: [https://repurposeai.com](https://repurposeai.com)
- **Email**: support@repurposeai.com
- **Twitter**: [@RepurposeAI](https://twitter.com/RepurposeAI)
- **LinkedIn**: [RepurposeAI](https://linkedin.com/company/repurposeai)

## 🌟 Show Your Support

If this project helps you, please give it a ⭐ star on GitHub!

---

**Built with ❤️ for content creators everywhere**
