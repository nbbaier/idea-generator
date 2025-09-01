# AI Project Idea Generator

A beautiful web application that generates creative web development project ideas using AI. Built with Next.js, React, Tailwind CSS, and OpenAI.

## Features

-  **AI-Powered Generation**: Uses OpenAI's GPT model to create diverse, creative project ideas
-  **Streaming Text Effect**: Real-time progressive text display for an engaging user experience
-  **Copy to Markdown**: One-click copying of project ideas in properly formatted Markdown
-  **Responsive Design**: Optimized for mobile, tablet, and desktop devices
-  **Modern UI**: Clean, minimal design using shadcn/ui components
-  **Error Handling**: Comprehensive error handling with user-friendly messages

## Setup Instructions

### Prerequisites

-  Node.js (version 18 or higher) or Bun runtime
-  npm, yarn, or bun package manager
-  OpenAI API key

### Installation

1. Clone the repository and navigate to the project directory

2. Install dependencies:

   ```bash
   bun install
   # or
   npm install
   ```

3. Set up environment variables:

   Create a `.env.local` file in the root directory and add your OpenAI API key:

   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

### Getting Your OpenAI API Key

1. Visit [OpenAI's website](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to the API section
4. Create a new API key
5. Copy the key and add it to your `.env` file

### Development

Start the development server:

```bash
bun run dev
# or
npm run dev
```

The application will be available at `http://localhost:3000`

### Building for Production

Build the application:

```bash
bun run build
# or
npm run build
```

Start the production server:

```bash
bun run start
# or
npm run start
```

## Deployment

This application uses Next.js API routes and requires a platform that supports server-side rendering or serverless functions. Recommended deployment options:

### Vercel (Recommended)

-  Automatic deployment with zero configuration
-  Built-in support for Next.js API routes
-  Simply connect your GitHub repository to Vercel

### Other Platforms

-  Railway, Render, or any platform supporting Node.js applications
-  Ensure the platform can run both the static frontend and API routes

**Note**: The API routes (`/api/generate` and `/api/chat`) require server-side runtime and cannot be deployed as a purely static site. If you need static deployment, consider moving the AI functionality to a separate backend service.

## Usage

1. **Generate Ideas**: The app automatically generates a project idea when loaded
2. **Copy to Markdown**: Click the "Copy to Markdown" button to copy the current idea to your clipboard
3. **Get New Ideas**: Click "Regenerate" to generate a fresh project idea
4. **Watch the Magic**: Enjoy the streaming text effect as ideas are generated in real-time

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── generate/route.ts     # Project idea generation API
│   │   └── chat/route.ts         # Chat API (future use)
│   ├── layout.tsx                # Root layout component
│   └── page.tsx                  # Main application page
├── components/
│   ├── layouts/                  # Layout components (Header, Footer, etc.)
│   ├── response.tsx              # AI response display with streaming
│   └── ui/                       # shadcn/ui components
├── hooks/
│   └── use-toast.ts              # Toast notification hook
├── lib/
│   └── utils.ts                  # Utility functions
└── types/
    └── index.ts                  # TypeScript type definitions
```

## Technologies Used

-  **Next.js 15** - React framework with API routes and streaming
-  **React 18** - Modern React with hooks and Suspense
-  **TypeScript** - Type-safe development
-  **Tailwind CSS** - Utility-first CSS framework
-  **shadcn/ui** - High-quality UI components
-  **OpenAI API** - AI-powered content generation
-  **Vercel AI SDK** - Streaming AI responses

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this project for personal or commercial purposes.
