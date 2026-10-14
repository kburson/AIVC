import { main } from '../../node_modules/@kburson/ai-task-manager/scripts/task-tracker/verify-epic-trail.mjs';
process.exitCode = await main(process.argv.slice(2));
