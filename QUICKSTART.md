# Quick Start Guide

## Setup

1. **Set up your API key:**

    ```bash
    cp .env.example .env
    # Edit .env and add your OpenAI API key
    ```

2. **Install dependencies** (already done):
    ```bash
    npm install
    ```

## Run Examples

### 1. Run with the included example:

```bash
npm start
```

This uses `example-article.md` and creates:

-   `podcast_script.json` - The conversational script
-   `podcast_episode.mp3` - The final podcast

### 2. Run with your own blog post:

```bash
npm start path/to/your-article.md
```

### 3. Custom output filename:

```bash
npm start example-article.md my-awesome-podcast.mp3
```

## What Happens

```
Input: Markdown blog post with code
   ↓
Agent 1 (Scriptwriter): Converts to conversation
   ↓
Agent 2 (Editor): Polishes and adds humor
   ↓
TTS: Generates audio (Alex = alloy voice, Sam = nova voice)
   ↓
Output: MP3 podcast file
```

## Expected Output

Console will show:

```
🎬 Step 1: Generating initial podcast script...
✅ Draft script created.
🎬 Step 2: Editing and polishing script...
✅ Script finalized.
📝 Script saved to podcast_script.json
🎙️ Step 3: Generating audio...
  → Generating intro...
  → Generating 12 dialogue segments...
    [1/12] Alex
    [2/12] Sam
    ...
  → Generating outro...
🎧 Podcast saved as podcast_episode.mp3

✨ Done! Your podcast is ready to play.
```

## Cost Estimation

Each run uses:

-   2 GPT-4o API calls (Scriptwriter + Editor)
-   Multiple TTS API calls (one per dialogue segment + intro + outro)

Typical cost: ~$0.10-0.50 per podcast depending on article length.

## Troubleshooting

**Error: Cannot find OPENAI_API_KEY**

-   Make sure you created `.env` from `.env.example`
-   Add your actual API key to the `.env` file

**JSON Parse Error**

-   The agents sometimes wrap JSON in markdown code blocks
-   The code handles this automatically, but if it fails, check `podcast_script.json`

**Audio quality issues**

-   TTS uses `tts-1` model (fast, cost-effective)
-   For higher quality, change to `tts-1-hd` in `index.ts`

## Customization Tips

1. **Change voices**: Edit the `generateVoiceLine` function
2. **Modify tone**: Edit agent instructions
3. **Add more speakers**: Extend the `PodcastScript` interface
4. **Different models**: Change `model: "gpt-4o"` to other models
