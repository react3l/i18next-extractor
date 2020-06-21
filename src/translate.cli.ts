import Command from 'Command';
import {extract} from 'commands/extract';
import {merge} from 'commands/merge';
import {migrate} from 'commands/migrate';

const {version} = require('../package.json');

export const program: Command = new Command();

program
  .version(version)
  .description(`Translate your application using i18next

  react-i18next-extract merge [...options]

  react-i18next-extract extract [...options]
  `)
  .withOptions();

program
  .command(nameof(extract))
  .description('Extract all translations from your source code')
  .withOptions()
  .action(extract);

program
  .command(nameof(merge))
  .description('Merge all translations for each language into a single JSON file')
  .withOptions()
  .action(merge);

program
  .command(nameof(migrate))
  .description('Migrate all old JSON files to new flattened files')
  .withOptions()
  .action(migrate);

program.parse(process.argv);
