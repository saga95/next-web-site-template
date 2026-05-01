# /persona

Create a detailed user persona and save it to `ux-docs/personas/`.

## What I do:

1. Ask you key questions about the user type (or accept inline args)
2. Generate a rich persona markdown file with all sections filled
3. Create a visual persona card as a React component
4. Link the persona to relevant user flows and empathy maps

## Output files:

- `ux-docs/personas/[name].md`
- `src/stories/ux/Persona.[Name].stories.tsx`

## Persona Template Structure:

- Name, age, occupation, location
- Goals (primary + secondary)
- Frustrations / Pain points
- Behaviors & habits
- Tech proficiency
- Motivations
- Quote
- Scenario narrative
- Linked user flows
- Linked empathy map

## Usage:

```
/persona
/persona "Sarah the Admin"
/persona --role="Product Manager" --goal="streamline approvals"
```
