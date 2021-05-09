import { Command } from 'commander';
import { extract } from 'src/commands/extract';
import { merge } from 'src/commands/merge';
import { migrate } from 'src/commands/migrate';
import { Extractor } from './Extractor';

const { version } = require('../package.json');

export const program: Extractor = new Command() as Extractor;
program.withOptions = Extractor.prototype.withOptions.bind(program);
program.extract = extract.bind(program);
program.migrate = migrate.bind(program);
program.merge = merge.bind(program);

program
  .description(`Translate your application using i18next
  
  react-i18next-extractor merge [...options]

  react-i18next-extractor extract [...options]
  `)
  .withOptions();

program
  .withOptions()
  .command(nameof(extract))
  .description('Extract all translations from your source code')
  .action(program.extract);

program
  .withOptions()
  .command(nameof(merge))
  .description('Merge all translations for each language into a single JSON file')
  .action(program.merge);

program
  .withOptions()
  .command(nameof(migrate))
  .description('Migrate all old JSON files to new flattened files')
  .action(program.migrate);

program
  .withOptions()
  .command('test')
  .description('Test')
  .action(() => {
    console.log(program.languages);
  });

program.parse(process.argv);
