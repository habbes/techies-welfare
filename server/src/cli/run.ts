import { commands } from "./commands";
import { runCommand, loadServices } from "./util";

export async function run() {
    // command string is like: node run-cli subcommand arg1 arg2...
    const [,, commandName, ...args] = process.argv;

    if (commandName === 'help') {
        printHelp();
        return;
    }

    const command = commands.find(c => c.name === commandName);
    if (!command) {
        console.error('Error: Unknown command!\n');
        printHelp();
        return;
    }

    const services = await loadServices();
    await runCommand(command, services);
}

function printHelp() {
    console.log('Available commands:');
    commands.forEach((cmd) => {
        console.log(cmd.name);
    });

    return;
}
