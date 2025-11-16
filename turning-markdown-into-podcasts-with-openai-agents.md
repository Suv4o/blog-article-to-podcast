---
title: Turning Markdown into Podcasts with OpenAI Agents
description: Transform your Markdown blog posts into engaging, conversational podcasts using OpenAI’s Agents SDK. Discover how to automate every step - from scriptwriting and editing to voice generation - to produce natural-sounding MP3 episodes in minutes. Build your own AI-powered production pipeline and give your blog a real voice, no studio or audio expertise required.
image: https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1762858276/blog/turning-markdown-into-podcasts-with-openai-agents/turning-markdown-into-podcasts-with-openai-agents_aav3tt
keywords:
    - OpenAI Agents SDK
    - AI podcast generation
    - Markdown to podcast
    - text to speech
    - AI workflow automation
    - GPT-4o
    - TTS-1-HD
    - AI content creation
    - podcast automation
    - developer tools
    - blog to audio
    - OpenAI tutorials
type: page
blog: post
published: 13th November 2025
readTime: 6
author: Aleksandar Trpkovski
articleTags:
    - TypeScript
    - AI
    - Node.js
---

# Turning Markdown into Podcasts with OpenAI Agents

_{{$document.published}} • {{$document.readTime}} min read — by **[{{$document.author}}](/)**_

::tag-pills{:tags="articleTags"}
::

![Landing Image](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_850,e_sharpen:100/v1762858276/blog/turning-markdown-into-podcasts-with-openai-agents/turning-markdown-into-podcasts-with-openai-agents_aav3tt)

I've been writing my blog entirely in Markdown for years. It's perfect for me as a developer - it's something we're familiar with, and it works great with static site generators. But turning those posts into podcasts style audio always felt like starting a whole second project. That was true five years ago. Now, with the new wave of LLMs and generative AI and the rise of agentic frameworks - that manual work has become much easier. You can easily build your own little team of AI helpers, ones that handle scriptwriting, editing, and even voiceover work. The result? A system that transforms my Markdown articles into polished MP3 podcasts in just a few minutes.

There are a lot of agentic frameworks out there, but in this guide, I'll walk you through exactly how I built this pipeline using OpenAI's <a href="https://openai.github.io/openai-agents-js/" target="_blank" rel="noopener noreferrer">Agents SDK</a> - from Markdown to script to finished audio. You'll see how to set it up yourself, tweak it to match your style, and finally give your blog its own voice.

## How the Idea Came About

I write a lot of technical articles packed with code examples. They're helpful for developers who want to dig into the details, but I started noticing not everyone has time to sit down and read through long posts. Some might prefer to listen on the go. Others just want a quick, conversational summary - and if they're more interested, they can proceed to the full read.

So I built this AI-powered workflow proof of concept using a lot of vibe coding 🤓. You drop in a Markdown article, and out comes a **podcast-ready MP3** - complete with a friendly intro, natural pacing, and your choice of either a single host or a conversation between two hosts (I named them **Aleks** and **Nicole**) after me and my wife 🙂. And the whole process takes only a couple of minutes. Here's what these AI agents help us accomplish:

- They keep the tone **friendly**, **educational**, and genuinely **entertaining**.
- They never robotically read code blocks - instead, they explain what the code actually does in plain English.
- They add natural touches like **laughs**, **pauses**, or **excitement** to make it feel real. These vocal direction tags - `[laughs]`, `[pause]`, `[whispers]`, `[excited]`, `[angrily]`, `[softly]` - help the models add tonal expressions to the voice reading the script.

> For reference, running the dual-speaker flow costs approximately **$0.06 USD** per article.

## What You'll Need

Before we dive into the code, here's what you'll need to get started:

- **Node.js 22+** - The `tsx` runner needs modern ESM support.
- **An OpenAI API key** - with access to `gpt-4o` and `tts-1-hd`.
- **A Markdown file** - any blog post or article you want to convert.
- No prior experience with AI agents required - I'll walk you through everything.

## The Architecture: How It Works

Let me break down how this system works under the hood:

1. **Scriptwriter Agent** → Takes your Markdown and converts it into a natural-sounding podcast script.
2. **Editor Agent** → Polishes the script to improve tone, pacing, and conversational flow.
3. **Text-to-Speech Engine** → Transforms the polished script into actual audio.
4. **Output** → You get a shiny new `podcast_episode.mp3` ready to share with the world.

![Architecture](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_850,e_sharpen:100/v1762858306/blog/turning-markdown-into-podcasts-with-openai-agents/Architecture_obtmz8)

Think of it as your personal **AI production team** - where GPT handles the creative writing and storytelling, while the TTS model brings it to life with voice.

## Setting Up the Project

Let's get your environment ready. First, create a new project:

```bash
mkdir blog-article-to-podcast && cd $_
npm init -y
npm install openai @openai/agents tsx
```

Next, create a `.env` file and add your OpenAI key:

```
OPENAI_API_KEY=sk-...
```

Then update your `package.json` to use ES modules and automatically load the `.env` file:

```json
{
    "type": "module",
    "scripts": {
        "start": "tsx --env-file=.env ./index.ts"
    }
}
```

## Building the Agents

Now for my favourite part - giving each AI agent its specific role and personality.

### The Scriptwriters

I created two versions to give you flexibility:

- **Single-host mode (Aleks only)** - for a straightforward, solo narration
- **Dual-host mode (Aleks & Nicole)** - for a more dynamic, conversational feel

Both convert your Markdown into podcast-style narration, but the dual-host version adds a natural back-and-forth dialogue that makes technical content more engaging.

```ts
const scriptwriterSingle = new Agent({
    name: "ScriptwriterSingle",
    instructions: `
    You are a professional tech podcast writer.
    Convert a markdown blog article into an engaging single-speaker podcast script.
    The speaker is Aleks, hosting a solo tech podcast.
    Keep it friendly, educational, and conversational.
    DO NOT read code out loud — explain what it does.
    Include an intro and outro.
    Use markers like [pause], [excited], or [laughs] where natural.
    Format as JSON: { "intro": "...", "content": "...", "outro": "..." }
  `,
    model: "gpt-4o",
});
```

The **dual-host version** creates a conversation instead of narration:

```ts
const scriptwriterDual = new Agent({
    name: "ScriptwriterDual",
    instructions: `
    You are a witty tech podcast writer.
    Convert markdown into a conversation between Aleks and Nicole.
    Keep it educational, funny, and natural.
    Never read code verbatim — explain it.
    Include intro/outro and use emotional markers sparingly.
    Return JSON with intro, dialogue[], and outro.
  `,
    model: "gpt-4o",
});
```

### The Editor

Even the best AI scriptwriters need a good editor. This agent makes sure everything flows naturally and sounds like something _actual humans_ would say in a real conversation:

```ts
const editorDual = new Agent({
    name: "EditorDual",
    instructions: `
    You are a professional podcast editor.
    Make the dialogue natural and balanced.
    Keep voices distinct and add light humor.
    Return only JSON with the same structure.
  `,
    model: "gpt-4o",
});
```

### The Voice Generator

Once we have a polished script, the final step is giving each host their own distinct voice:

```ts
async function generateVoiceLine(speaker: "Aleks" | "Nicole", text: string) {
    const voice = speaker === "Aleks" ? "alloy" : "nova";
    const response = await client.audio.speech.create({
        model: "tts-1-hd",
        voice,
        input: text,
    });
    return Buffer.from(await response.arrayBuffer());
}
```

I'm using **OpenAI's high-definition text-to-speech** model here, which produces surprisingly natural audio - it sounds more like a studio recording than a robotic voice assistant.

## Putting It All Together

Now that we have our agents and voice generator ready, here's how I orchestrate the whole workflow:

1. Generate the first draft of the script using either the single or dual-host scriptwriter.
2. Pass it through the editor agent to refine the pacing and flow.
3. Parse the JSON output and save it to `podcast_script.json` so you can review it if needed.
4. Convert each line of the script to audio, one segment at a time.
5. Merge all the audio segments and save the final `podcast_episode.mp3`.

Here's the main function that handles everything:

````ts
import fs from "fs";

async function generatePodcastFromMarkdown(
    markdown: string,
    outputFileName = "podcast_episode.mp3",
    speakers: 1 | 2 = 1
) {
    const draft = await run(
        speakers === 1 ? scriptwriterSingle : scriptwriterDual,
        `Convert this markdown tech article into a podcast script:\n\n${markdown}`
    );
    const draftText = extractAllTextOutput(draft.newItems);

    const edited = await run(
        speakers === 1 ? editorSingle : editorDual,
        `Please edit and polish this podcast script:\n\n${draftText}`
    );
    let scriptText = extractAllTextOutput(edited.newItems);

    const match = scriptText.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
    if (match) scriptText = match[1];

    const script = JSON.parse(scriptText) as PodcastScript;
    fs.writeFileSync("podcast_script.json", JSON.stringify(script, null, 2));

    const chunks: Buffer[] = [];

    if (speakers === 1) {
        const solo = script as PodcastScriptSingle;
        chunks.push(await generateVoiceLine("Aleks", solo.intro));
        chunks.push(await generateVoiceLine("Aleks", solo.content));
        chunks.push(await generateVoiceLine("Aleks", solo.outro));
    } else {
        const duo = script as PodcastScriptDual;
        chunks.push(await generateVoiceLine("Aleks", duo.intro));
        for (const line of duo.dialogue) {
            chunks.push(await generateVoiceLine(line.speaker, line.text));
        }
        chunks.push(await generateVoiceLine("Nicole", duo.outro));
    }

    fs.writeFileSync(outputFileName, Buffer.concat(chunks));
}
````

And here's the CLI wrapper that makes it easy to use from the command line:

```ts
async function main() {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.error(`Usage:
  npm start <markdown-file> [output-file] [--speakers=1|2]`);
        process.exit(1);
    }

    const markdownFile = args[0];
    if (!fs.existsSync(markdownFile)) {
        console.error(`❌ File not found: ${markdownFile}`);
        process.exit(1);
    }

    const markdown = fs.readFileSync(markdownFile, "utf-8");

    // Check for --speakers flag first
    let speakers: 1 | 2 = 1; // Default to single speaker
    const speakersFlag = args.find((arg) => arg.startsWith("--speakers="));

    if (speakersFlag) {
        const speakersValue = speakersFlag.split("=")[1];
        if (speakersValue === "2") {
            speakers = 2;
        } else if (speakersValue === "1") {
            speakers = 1;
        } else {
            console.error(`❌ Invalid --speakers value. Use --speakers=1 or --speakers=2`);
            process.exit(1);
        }
    }

    // Get output file (args[1] if it's not the speakers flag)
    let outputFile = "podcast_episode.mp3";
    if (args[1] && !args[1].startsWith("--speakers=")) {
        outputFile = args[1];
    }

    await generatePodcastFromMarkdown(markdown, outputFile, speakers);
}

main().catch((error) => {
    console.error("❌ Error:", error.message);
    process.exit(1);
});
```

## Running the Generator

Once you've got everything set up, using it is super straightforward:

```bash
npm start -- <markdown-file> [output-file] [--speakers=1|2]
```

Here are a couple of examples:

```bash
npm start -- ./article.md
npm start -- ./article.md ./my-podcast.mp3 --speakers=2
```

- If you forget to include a file, you'll get a helpful usage message.
- The default is **single host** mode (`--speakers=1`).
- The output defaults to `podcast_episode.mp3`.

## Wrapping Up

With some TypeScript and OpenAI's Agents SDK, I've completely automated my podcast production workflow. And you can too.

But here's what really excites me about this: it's not just about saving time - it's about opening up new creative possibilities. You can fine-tune the tone for different topics, create distinct host personalities for different blog categories, or experiment with pacing and style. The line between written and spoken content is disappearing, and tools like this make it easy to be on both sides at once.

If your blog already tells great stories in text, now you can make it _tell_ those stories out loud too.

You can find the complete code in the following GitHub <a href="https://github.com/Suv4o/blog-article-to-podcast" target="_blank" rel="noopener noreferrer">link</a>. Feel free to clone and explore it.
