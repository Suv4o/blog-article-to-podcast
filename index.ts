import fs from "fs";
import OpenAI from "openai";
import { Agent, run, extractAllTextOutput } from "@openai/agents";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Script structure returned by agents
 */
interface PodcastScript {
    intro: string;
    dialogue: Array<{
        speaker: "Alex" | "Sam";
        text: string;
    }>;
    outro: string;
}

/**
 * 1️⃣ Scriptwriter Agent
 * Turns a Markdown article into a 2-speaker conversation
 */
const scriptwriter = new Agent({
    name: "Scriptwriter",
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
const editor = new Agent({
    name: "Editor",
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
async function generatePodcastFromMarkdown(markdown: string, outputFileName = "podcast_episode.mp3") {
    console.log("🎬 Step 1: Generating initial podcast script...");

    // Step 1: Scriptwriter creates the initial draft
    const draftResult = await run(
        scriptwriter,
        `Convert this markdown tech article into an engaging podcast conversation:\n\n${markdown}`
    );

    // Extract text from the result
    const draftText = extractAllTextOutput(draftResult.newItems);
    console.log("✅ Draft script created.");

    console.log("🎬 Step 2: Editing and polishing script...");

    // Step 2: Editor polishes the draft
    const finalResult = await run(editor, `Please edit and polish this podcast script:\n\n${draftText}`);

    // Extract final text
    let scriptText = extractAllTextOutput(finalResult.newItems);
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

    // Step 3: Generate TTS for intro, dialogue, and outro
    console.log("🎙️ Step 3: Generating audio...");

    const chunks: Buffer[] = [];

    // Intro (Alex)
    console.log("  → Generating intro...");
    chunks.push(await generateVoiceLine("Alex", script.intro));

    // Dialogue
    console.log(`  → Generating ${script.dialogue.length} dialogue segments...`);
    for (const [index, line] of script.dialogue.entries()) {
        console.log(`    [${index + 1}/${script.dialogue.length}] ${line.speaker}`);
        chunks.push(await generateVoiceLine(line.speaker, line.text));
    }

    // Outro (Sam)
    console.log("  → Generating outro...");
    chunks.push(await generateVoiceLine("Sam", script.outro));

    // Merge buffers
    const combined = Buffer.concat(chunks);
    fs.writeFileSync(outputFileName, combined);

    console.log(`🎧 Podcast saved as ${outputFileName}`);
    console.log(`\n✨ Done! Your podcast is ready to play.`);
}

/**
 * Example usage
 */
async function main() {
    // Check if markdown file is provided as argument
    const args = process.argv.slice(2);

    if (args.length > 0) {
        const markdownFile = args[0];
        if (!fs.existsSync(markdownFile)) {
            console.error(`❌ File not found: ${markdownFile}`);
            process.exit(1);
        }

        const markdown = fs.readFileSync(markdownFile, "utf-8");
        const outputFile = args[1] || "podcast_episode.mp3";

        await generatePodcastFromMarkdown(markdown, outputFile);
    } else {
        // Use example markdown
        const markdown = `
# Migrating Your Homebrew Setup to a New Mac with One Command

Setting up a new Mac can be a hassle — especially reinstalling all your tools.
Luckily, Homebrew makes it easy.

\`\`\`bash
brew bundle dump --file=~/Brewfile --describe
\`\`\`

This command exports all your installed packages, casks, and taps into a single file called a Brewfile.
Think of it as a shopping list for all your development tools.

## How it works

The Brewfile contains:
- All installed formulae (command-line tools)
- All casks (GUI applications)
- All taps (third-party repositories)

You can later restore them on a new Mac with:

\`\`\`bash
brew bundle install --file=~/Brewfile
\`\`\`

No manual reinstalling required! Just run this command, and Homebrew will install everything from your Brewfile automatically.

## Pro Tips

- Keep your Brewfile in version control (like Git)
- Update it regularly when you install new tools
- Share it with your team for consistent setups

That's it! Never manually reinstall your dev tools again.
`;

        await generatePodcastFromMarkdown(markdown);
    }
}

// Run the main function
main().catch((error) => {
    console.error("❌ Error:", error.message);
    process.exit(1);
});
