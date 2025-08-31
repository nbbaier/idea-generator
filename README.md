# AI Project Idea Generator

A beautiful web application that generates creative web development project ideas using AI. Built with React, Vite, Tailwind CSS, and OpenAI.

## Features

- **AI-Powered Generation**: Uses OpenAI's GPT model to create diverse, creative project ideas
- **Streaming Text Effect**: Real-time progressive text display for an engaging user experience
- **Copy to Markdown**: One-click copying of project ideas in properly formatted Markdown
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **Modern UI**: Clean, minimal design using shadcn/ui components
- **Error Handling**: Comprehensive error handling with user-friendly messages

## Setup Instructions

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager
- OpenAI API key

### Installation

1. Clone the repository and navigate to the project directory

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. Add your OpenAI API key to the `.env` file:
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key_here
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
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Usage

1. **Generate Ideas**: The app automatically generates a project idea when loaded
2. **Copy to Markdown**: Click the "Copy to Markdown" button to copy the current idea to your clipboard
3. **Get New Ideas**: Click "Regenerate" to generate a fresh project idea
4. **Watch the Magic**: Enjoy the streaming text effect as ideas are generated in real-time

## Project Structure

```
src/
├── components/
│   ├── ProjectIdeaDisplay.tsx    # Main display component with streaming effect
│   ├── ActionButtons.tsx         # Copy and regenerate buttons
│   └── ui/                       # shadcn/ui components
├── lib/
│   └── openai.ts                 # OpenAI API integration
├── types/
│   └── index.ts                  # TypeScript type definitions
├── App.tsx                       # Main application component
└── main.tsx                      # Application entry point
```

## Technologies Used

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and development server
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components
- **OpenAI API** - AI-powered content generation

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this project for personal or commercial purposes.