import {extract} from 'src/commands/extract';
import {merge} from 'src/commands/merge';
import {migrate} from 'src/commands/migrate';
import {Command} from 'commander';

const {version} = require('../package.json');

Command.prototype.withOptions = function(): Command {
  return this
    .option('-i, --input <inputPath>', 'Input path', 'src/')
    .option('-o, --output <outputPath>', 'Output path', 'public/assets/i18n/')
    .option('-p, --partials <partialPath>', 'Partial path', 'public/assets/i18n/partials/')
    .option('-ic, --include <include>', 'Include pattern', '\\.(js|jsx|ts|tsx)$')
    .option('-ex, --exclude <exclude>', 'Exclude pattern', '\\.(spec|test)\\.(js|jsx|ts|tsx)$')
    .option('-ks, --key-separator <keySeparator>', 'Key separator', '.')
    .option('-is, --indent-size <indent>', 'Indent size', 2)
    .option('-l, --languages <languages...>', 'Supported languages', ['en', 'vi'])
    .option('-m, --marker <marker>', 'Translate marker', 'translate');
};

export const program: Command = new Command();

program
  .version(version)
  .description(`Translate your application using i18next
  
  react-i18next-extractor merge [...options]

  react-i18next-extractor extract [...options]
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
