import { run } from "./cli";

async function runCli() {
    try {
        await run();
        process.exit(0);
    }
    catch(e) {
        console.error(e.code, e.message);
        process.exit(1);
    }
}

runCli();