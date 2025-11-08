import fs from "fs";
import OpenAI from "openai";
import { Agent, run, extractAllTextOutput } from "@openai/agents";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Script structure returned by agents (one speaker)
 */
interface PodcastScriptSingle {
    intro: string;
    content: string;
    outro: string;
}

/**
 * Script structure returned by agents (two speakers)
 */
interface PodcastScriptDual {
    intro: string;
    dialogue: Array<{
        speaker: "Alex" | "Sam";
        text: string;
    }>;
    outro: string;
}

type PodcastScript = PodcastScriptSingle | PodcastScriptDual;

/**
 * 1️⃣ Scriptwriter Agent - Single Speaker
 * Turns a Markdown article into a single-speaker podcast script
 */
const scriptwriterSingle = new Agent({
    name: "ScriptwriterSingle",
    instructions: `
    You are a professional tech podcast writer.
    Convert a markdown blog article into an engaging single-speaker podcast script.
    The speaker is Alex, hosting a solo tech podcast.
    Keep it friendly, educational, and conversational.
    DO NOT read code out loud — instead, explain what it does conversationally.
    Include an intro and outro.
    Use markers like [pause], [excited], or [laughs] where it feels natural.
    
    Format the output as JSON with this structure:

    {
      "intro": "string",
      "content": "string",
      "outro": "string"
    }
  `,
    model: "gpt-4o",
});

/**
 * 1️⃣ Scriptwriter Agent - Dual Speakers
 * Turns a Markdown article into a 2-speaker conversation
 */
const scriptwriterDual = new Agent({
    name: "ScriptwriterDual",
    instructions: `
    You are a witty and smart tech podcast writer.
    Convert a markdown blog article into a natural conversation between two hosts: Alex and Sam.
    Keep it friendly, educational, and funny.
    DO NOT read code out loud — instead, explain what it does conversationally.
    Include an intro and outro.
    Use markers like [laughs], [excited], or [pause] where it feels natural.
    
    Format the output as JSON with this structure:

    {
      "intro": "string",
      "dialogue": [
        {"speaker": "Alex", "text": "string"},
        {"speaker": "Sam", "text": "string"}
      ],
      "outro": "string"
    }
  `,
    model: "gpt-4o",
});

/**
 * 2️⃣ Editor Agent
 * Polishes phrasing, adds humor & rhythm, ensures balance
 */
const editorSingle = new Agent({
    name: "EditorSingle",
    instructions: `
    You are a professional podcast editor.
    Take the raw single-speaker script and make it sound natural and entertaining.
    Ensure the flow is conversational and engaging.
    Add light humor or reactions where fitting.
    Return only valid JSON with the same structure as you received.
  `,
    model: "gpt-4o",
});

const editorDual = new Agent({
    name: "EditorDual",
    instructions: `
    You are a professional podcast editor.
    Take the raw script and make it sound natural and entertaining.
    Maintain both speakers' distinct voices.
    Add light humor or reactions where fitting.
    Ensure the conversation flows naturally with good pacing.
    Return only valid JSON with the same structure as you received.
  `,
    model: "gpt-4o",
});

/**
 * 3️⃣ TTS Agent
 * Converts the final script into audio for each speaker
 */
async function generateVoiceLine(speaker: "Alex" | "Sam", text: string): Promise<Buffer> {
    const voice = speaker === "Alex" ? "alloy" : "nova"; // Different voices for each speaker
    const response = await client.audio.speech.create({
        model: "tts-1",
        voice,
        input: text,
    });
    return Buffer.from(await response.arrayBuffer());
}

/**
 * MAIN PIPELINE
 */
async function generatePodcastFromMarkdown(
    markdown: string,
    outputFileName = "podcast_episode.mp3",
    speakers: 1 | 2 = 1
) {
    console.log(`🎬 Generating ${speakers}-speaker podcast...`);
    console.log("🎬 Step 1: Generating initial podcast script...");

    let scriptText: string;

    if (speakers === 1) {
        // Single speaker mode
        const draftResult = await run(
            scriptwriterSingle,
            `Convert this markdown tech article into an engaging single-speaker podcast:\n\n${markdown}`
        );

        const draftText = extractAllTextOutput(draftResult.newItems);
        console.log("✅ Draft script created.");

        console.log("🎬 Step 2: Editing and polishing script...");
        const finalResult = await run(editorSingle, `Please edit and polish this podcast script:\n\n${draftText}`);

        scriptText = extractAllTextOutput(finalResult.newItems);
    } else {
        // Dual speaker mode
        const draftResult = await run(
            scriptwriterDual,
            `Convert this markdown tech article into an engaging podcast conversation:\n\n${markdown}`
        );

        const draftText = extractAllTextOutput(draftResult.newItems);
        console.log("✅ Draft script created.");

        console.log("🎬 Step 2: Editing and polishing script...");
        const finalResult = await run(editorDual, `Please edit and polish this podcast script:\n\n${draftText}`);

        scriptText = extractAllTextOutput(finalResult.newItems);
    }

    console.log("✅ Script finalized.");

    // Try to extract JSON if it's wrapped in markdown code blocks
    const jsonMatch = scriptText.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
    if (jsonMatch) {
        scriptText = jsonMatch[1];
    }

    const script: PodcastScript = JSON.parse(scriptText);

    // Save script as JSON for reference
    fs.writeFileSync("podcast_script.json", JSON.stringify(script, null, 2));
    console.log("📝 Script saved to podcast_script.json");

    // Step 3: Generate TTS
    console.log("🎙️ Step 3: Generating audio...");

    const chunks: Buffer[] = [];

    if (speakers === 1) {
        // Single speaker mode
        const singleScript = script as PodcastScriptSingle;

        console.log("  → Generating intro...");
        chunks.push(await generateVoiceLine("Alex", singleScript.intro));

        console.log("  → Generating main content...");
        chunks.push(await generateVoiceLine("Alex", singleScript.content));

        console.log("  → Generating outro...");
        chunks.push(await generateVoiceLine("Alex", singleScript.outro));
    } else {
        // Dual speaker mode
        const dualScript = script as PodcastScriptDual;

        console.log("  → Generating intro...");
        chunks.push(await generateVoiceLine("Alex", dualScript.intro));

        console.log(`  → Generating ${dualScript.dialogue.length} dialogue segments...`);
        for (const [index, line] of dualScript.dialogue.entries()) {
            console.log(`    [${index + 1}/${dualScript.dialogue.length}] ${line.speaker}`);
            chunks.push(await generateVoiceLine(line.speaker, line.text));
        }

        console.log("  → Generating outro...");
        chunks.push(await generateVoiceLine("Sam", dualScript.outro));
    }

    // Merge buffers
    const combined = Buffer.concat(chunks);
    fs.writeFileSync(outputFileName, combined);

    console.log(`🎧 Podcast saved as ${outputFileName}`);
    console.log(`\n✨ Done! Your ${speakers}-speaker podcast is ready to play.`);
}

/**
 * Example usage
 */
async function main() {
    // Check if markdown file is provided as argument
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.error(`❌ Please provide a markdown file as an argument.

Usage:
  npm start <markdown-file> [output-file] [--speakers=1|2]

Examples:
  npm start my-blog-post.md
  npm start my-article.md episode-01.mp3
  npm start my-article.md podcast.mp3 --speakers=2
`);
        process.exit(1);
    }

    const markdownFile = args[0];
    if (!fs.existsSync(markdownFile)) {
        console.error(`❌ File not found: ${markdownFile}`);
        process.exit(1);
    }

    const markdown = fs.readFileSync(markdownFile, "utf-8");
    const outputFile = args[1] || "podcast_episode.mp3";

    // Check for --speakers flag
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

    await generatePodcastFromMarkdown(markdown, outputFile, speakers);
}

// Run the main function
main().catch((error) => {
    console.error("❌ Error:", error.message);
    process.exit(1);
});
