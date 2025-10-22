import { readFile, writeFile } from 'node:fs/promises';
import { cancel, intro, isCancel, outro, text } from '@clack/prompts';
import { $ } from 'bun';

const FILES_TO_UPDATE = ['package.json', 'README.md', 'bun.lock'];

(async () => {
    intro('Setup');

    const packageName = await text({
        message: 'What is the name of your package?',
    });

    if (isCancel(packageName)) {
        cancel('Operation cancelled.');
        process.exit(1);
    }

    const packageDescription = await text({
        message: 'Provide a short description of your package:',
    });

    if (isCancel(packageDescription)) {
        cancel('Operation cancelled.');
        process.exit(1);
    }

    const githubUrl = await $`git remote get-url origin`.quiet().text('utf-8');

    for (const filePath of FILES_TO_UPDATE)
        try {
            let content = await readFile(filePath.trim(), 'utf-8');

            content = content
                .replaceAll('{{package.name}}', packageName.trim())
                .replaceAll(
                    '{{package.description}}',
                    packageDescription.trim(),
                )
                .replaceAll('{{github.url}}', githubUrl.trim());

            await writeFile(filePath.trim(), content, 'utf-8');
        } catch {}

    outro('Setup complete!');
})();
