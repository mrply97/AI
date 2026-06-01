# Batch Rendering

## Single Video Render

```bash
bunx remotion render <composition-id> <output-path>
```

Example:
```bash
bunx remotion render showcase-ai-pet-adventure-landscape out/showcase/ai-pet-adventure.mp4
```

## Batch Render Script

```bash
#!/bin/bash
cd "$(dirname "$0")"

VIDEOS=(
  "comp-id-landscape:output-name"
  "another-comp-landscape:another-output"
)

total=${#VIDEOS[@]}
i=0

for entry in "${VIDEOS[@]}"; do
  IFS=':' read -r comp_id filename <<< "$entry"
  outpath="out/folder/${filename}.mp4"
  i=$((i + 1))

  # Skip already rendered
  if [ -f "$outpath" ]; then
    echo "[$i/$total] SKIP $filename (exists)"
    continue
  fi

  echo "[$i/$total] Rendering $filename..."
  bunx remotion render "$comp_id" "$outpath" 2>&1 | grep -E "(Encoded|error|\+)"

  if [ $? -eq 0 ]; then
    echo "[$i/$total] DONE $filename"
  else
    echo "[$i/$total] FAILED $filename"
  fi
done

echo "=== Render complete ==="
ls -la out/folder/*.mp4 2>/dev/null | wc -l
echo "videos rendered"
```

## Performance Notes

- ~22s render time per 18s landscape video (1920x1080) at 8x concurrency
- ~10MB average file size per landscape video
- Sequential renders are more reliable than parallel
- Parallel `bunx remotion render` processes can conflict on bundling
- Always create dedicated output subdirectory (e.g., `out/showcase/`)
- Use `--overwrite` flag if re-rendering existing files (default behavior with remotion config)

## Composition ID Format

- Vertical: `{base-id}-vertical` (1080x1920)
- Landscape: `{base-id}-landscape` (1920x1080)

## Output Organization

```
out/
  showcase/           # New showcase videos
    ai-pet-adventure.mp4
    world-of-elizapets.mp4
    ...
  meet-your-pet-vertical.mp4    # Original videos
  arena-battle-vertical.mp4
  ...
```

## Render All Script (package.json)

Add render scripts to package.json for common render sets:

```json
{
  "scripts": {
    "render:showcase": "bash render-showcase.sh",
    "render:showcase:vertical": "bash render-showcase-vertical.sh"
  }
}
```

## Troubleshooting

- `npx remotion` may fail on Windows - use `bunx remotion` instead
- If bundling hangs, check for circular imports in constants
- Font loading errors usually mean @remotion/google-fonts is not installed
- TypeScript errors block rendering - always run `bunx tsc --noEmit` before batch render
