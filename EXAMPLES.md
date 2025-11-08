# Usage Examples

**Note:** All commands require a markdown file as input.

## Basic Usage

### 1. Single Speaker (Default)

```bash
npm start example-article.md
```

Creates a solo podcast with Alex as the host.

### 2. Two Speakers

```bash
npm start example-article.md --speakers=2
```

Creates a conversational podcast with Alex and Sam.

## With Custom Files

### Single Speaker with Custom Article

```bash
npm start my-blog-post.md
```

### Two Speakers with Custom Article

```bash
npm start my-blog-post.md --speakers=2
```

### Custom Output Filename (Single Speaker)

```bash
npm start my-article.md episode-01.mp3
```

### Custom Output Filename (Two Speakers)

```bash
npm start my-article.md episode-01.mp3 --speakers=2
```

## Real-World Examples

### Creating a Tutorial Series (Single Speaker)

```bash
npm start tutorials/part1-intro.md tutorial-01-intro.mp3
npm start tutorials/part2-advanced.md tutorial-02-advanced.mp3
npm start tutorials/part3-conclusion.md tutorial-03-conclusion.mp3
```

### Creating Conversational Tech Discussions (Two Speakers)

```bash
npm start articles/react-vs-vue.md react-vue-debate.mp3 --speakers=2
npm start articles/ai-trends.md ai-discussion.mp3 --speakers=2
```

## When to Use Which Mode?

### Use Single Speaker When:

-   Creating straightforward tutorials
-   Delivering technical documentation
-   Building a consistent solo podcast series
-   Faster generation (fewer TTS calls)
-   Lower cost

### Use Two Speakers When:

-   Discussing complex topics that benefit from multiple perspectives
-   Making dry content more engaging
-   Creating debate-style content
-   Explaining pros/cons of different approaches
-   Adding personality and humor to technical content

## Output Files

Every run creates:

1. `podcast_script.json` - The generated script (useful for review/editing)
2. `[output-name].mp3` - The final podcast audio

## Tips

-   Review `podcast_script.json` after generation to see how the AI interpreted your article
-   Single speaker mode is ~50% cheaper (fewer TTS calls)
-   Two speaker mode is more engaging for longer content (10+ min)
-   You can manually edit `podcast_script.json` and regenerate just the audio if needed
