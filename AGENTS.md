# AGENTS.md

## Auto-push convention

After every code change, commit and push to GitHub automatically.

### Workflow
1. Make code changes
2. Verify build and lint pass (`npm run build && npm run lint`)
3. Stage all changes (`git add -A`)
4. Commit with a concise message
5. Push to origin (`git push`)

### Commands
- Build: `npm run build`
- Lint: `npm run lint`
- Dev: `npm run dev`