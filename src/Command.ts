import {Command} from 'commander';

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

export default Command;
