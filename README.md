# Blog Article to Podcast Generator

Transform your technical blog articles (written in Markdown) into engaging, conversational podcasts with two speakers using AI agents and text-to-speech!

## 🎯 Features

-   **Multi-Agent System**: Uses two AI agents (Scriptwriter and Editor) to create natural conversations
-   **Two-Speaker Format**: Alex and Sam discuss your article in a fun, educational way
-   **Code Explanation**: Code snippets are explained conversationally, not read aloud
-   **Emotional Expression**: Includes markers like `[laughs]`, `[excited]`, etc.
-   **Complete Podcast**: Includes intro and outro segments
-   **TTS Generation**: Automatically generates audio with different voices for each speaker

## 🚀 How It Works

### The Pipeline

1. **Scriptwriter Agent** → Converts your markdown article into a conversational script between Alex and Sam
2. **Editor Agent** → Polishes the script for natural flow, pacing, and humor
3. **TTS Generation** → Creates audio for each speaker using OpenAI's text-to-speech API
4. **Output** → A complete podcast episode in MP3 format!

## 📦 Installation

```bash
npm install
```

## ⚙️ Configuration

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Add your OpenAI API key to `.env`:

```
OPENAI_API_KEY=your_api_key_here
```

## 🎬 Usage

### Run with the example article:

```bash
npm start
```

This will use the included `example-article.md` and create:

-   `podcast_script.json` - The generated conversational script
-   `podcast_episode.mp3` - The final podcast audio

### Run with your own article:

```bash
npm start path/to/your/article.md
```

### Specify custom output filename:

```bash
npm start path/to/your/article.md my-podcast.mp3
```

## 📝 Input Format

Your markdown file should be a standard tech blog article. The system works best with:

-   Technical explanations
-   Code snippets (they'll be explained conversationally)
-   Step-by-step guides
-   How-to articles

Example:

```markdown
# Your Article Title

Introduction text...

\`\`\`javascript
// Your code here
\`\`\`

More explanations...
```

## 🎙️ Output

### Script (`podcast_script.json`)

A JSON file containing:

-   `intro`: Opening segment
-   `dialogue`: Array of speaker turns with text
-   `outro`: Closing segment

Example:

```json
{
    "intro": "Welcome to Tech Talks...",
    "dialogue": [
        { "speaker": "Alex", "text": "Hey everyone!" },
        { "speaker": "Sam", "text": "Great to be here! [excited]" }
    ],
    "outro": "Thanks for listening..."
}
```

### Audio (`podcast_episode.mp3`)

A complete podcast episode with:

-   Alex voiced by OpenAI's "alloy" voice
-   Sam voiced by OpenAI's "nova" voice

## 🛠️ Technology Stack

-   **TypeScript/Node.js** - Runtime environment
-   **OpenAI Agents SDK** (`@openai/agents`) - Multi-agent orchestration
-   **OpenAI API** - Language models (GPT-4o) and Text-to-Speech
-   **tsx** - TypeScript execution

## 📚 Architecture

```
┌─────────────────┐
│ Markdown Article│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Scriptwriter   │ (GPT-4o)
│     Agent       │ → Creates conversational script
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Editor Agent   │ (GPT-4o)
│                 │ → Polishes & adds humor
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  TTS Generator  │
│                 │ → Creates audio for each speaker
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Podcast MP3    │
└─────────────────┘
```

## 🎨 Customization

### Change Speaker Voices

Edit the `generateVoiceLine` function in `index.ts`:

```typescript
const voice = speaker === "Alex" ? "alloy" : "nova";
```

Available voices: `alloy`, `echo`, `fable`, `onyx`, `nova`, `shimmer`

### Modify Agent Behavior

Edit the agent instructions:

-   `scriptwriter` - Controls how the initial script is created
-   `editor` - Controls how the script is polished

### Change Speaker Names

Update the `PodcastScript` interface and agent instructions to use different names.

## 🔍 Example Output

For a blog post about Homebrew migration, the agents might create:

```
Alex: "Hey folks! Welcome to Tech Unpacked! Today we're saving your
       sanity when moving to a new Mac."

Sam: "Finally! Because last time I reinstalled my dev tools one by
      one… I nearly cried. [laughs]"

Alex: "Been there! But Homebrew's got your back. Just one command,
       and poof — everything's restored."

Sam: "[excited] That's genius! Then you just reinstall everything
      with that file later?"
```

## 📄 License

ISC

## 🤝 Contributing

Feel free to open issues or submit pull requests!

## 💡 Tips

-   **Better results**: More detailed articles produce better podcasts
-   **Code snippets**: The agents will automatically explain code conversationally
-   **Cost**: Each run uses OpenAI API credits for both GPT-4o calls and TTS generation
-   **Quality**: The GPT-4o model provides the best conversational quality

---

Made with ❤️ using OpenAI Agents SDK
