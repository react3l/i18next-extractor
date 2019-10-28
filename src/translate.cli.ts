#!/usr/bin/env node

import * as commander from 'commander';
import {extract} from './commands/extract';
import {merge} from './commands/merge';

const {version} = require('../package.json');

export const ENCODING: string = 'utf-8';

export const program = new commander.Command();

program
  .version(version)
  .description(`Translate your application using i18next

  react-i18next-extract merge [...options]

  react-i18next-extract extract [...options]
  `)
  .option('-i, --input <inputPath>', 'Input path', 'src/')
  .option('-o, --output <outputPath>', 'Output path', 'public/assets/i18n/')
  .option('-p, --partials <partialPath>', 'Partial path', 'public/assets/i18n/partials/')
  .option('-ic, --include <include>', 'Include pattern', '\\.(js|jsx|ts|tsx)$')
  .option('-ex, --exclude <exclude>', 'Exclude pattern', '\\.(spec|test)\\.(js|jsx|ts|tsx)$')
  .option('-ks, --key-separator <keySeparator>', 'Key separator', '.')
  .option('-is, --indent-size <indent>', 'Indent size', 2)
  .option('-l, --languages <languages...>', 'Supported languages', ['en', 'vi'])
  .option('-m, --marker <marker>', 'Translate marker', 'translate');

program
  .command('extract')
  .description('Extract all translations from your source code')
  .option('-i, --input <inputPath>', 'Input path', 'src/')
  .option('-o, --output <outputPath>', 'Output path', 'public/assets/i18n/')
  .option('-p, --partials <partialPath>', 'Partial path', 'public/assets/i18n/partials/')
  .option('-ic, --include <include>', 'Include pattern', '\\.(js|jsx|ts|tsx)$')
  .option('-ex, --exclude <exclude>', 'Exclude pattern', '\\.(spec|test)\\.(js|jsx|ts|tsx)$')
  .option('-ks, --key-separator <keySeparator>', 'Key separator', '.')
  .option('-is, --indent-size <indent>', 'Indent size', 2)
  .option('-l, --languages <languages...>', 'Supported languages', ['en', 'vi'])
  .option('-m, --marker <marker>', 'Translate marker', 'translate')
  .action(extract);

program
  .command('merge')
  .description('Merge all translations for each language into a single JSON file')
  .option('-p, --partials <partialPath>', 'Partial path', 'public/assets/i18n/partials/')
  .option('-o, --output <outputPath>', 'Output path', 'public/assets/i18n/')
  .option('-ks, --key-separator <keySeparator>', 'Key separator', '.')
  .option('-is, --indent-size <indent>', 'Indent size', 2)
  .option('-l, --languages <languages...>', 'Supported languages', ['en', 'vi'])
  .action(merge);

program.parse(process.argv);
