#!/usr/bin/env node

import * as commander from 'commander';
import * as merge from 'deepmerge';
import {existsSync, lstatSync, readdirSync, readFileSync, writeFileSync} from 'fs';
import {kebabCase} from 'lodash';
import {join} from 'path';

const {version} = require('./package.json');

const ENCODING: string = 'utf-8';

function match(str: string, include?: RegExp, exclude?: RegExp): boolean {
  if (include) {
    if (include.test(str)) {
      return exclude ? !exclude.test(str) : true;
    }
    return false;
  }
  return true;
}

function getFileList(path: string, include?: RegExp, exclude?: RegExp): string[] {
  let files: string[] = [];
  readdirSync(path)
    .forEach((entry: string) => {
      const entryPath: string = join(path, entry);
      if (lstatSync(entryPath).isDirectory()) {
        files = [
          ...files,
          ...getFileList(entryPath, include, exclude),
        ];
      } else {
        if (match(entryPath, include, exclude)) {
          files = [
            ...files,
            entryPath,
          ];
        }
      }
    });
  return files;
}

const program = new commander.Command();

function getMarkedPattern(marker: string) {
  return new RegExp(`${marker}\\(['"]([a-zA-Z0-9]+(\\.[a-zA-Z0-9]+)*)['"]\\)`, 'gm');
}

program
  .version(version)
  .description(`Translate your application using i18next

  react-i18next-extract merge [...options]

  react-i18next-extract extract [...options]
  `)
  .option('-i, --input <inputPath>', 'Input path', './src/')
  .option('-o, --output <outputPath>', 'Output path', './public/assets/i18n/')
  .option('-p, --partials <partialPath>', 'Partial path', './public/assets/i18n/partials/')
  .option('-ic, --include <include>', 'Include pattern', '\\.(js|jsx|ts|tsx)$')
  .option('-ex, --exclude <exclude>', 'Exclude pattern', '\\.(spec|test)\\.(js|jsx|ts|tsx)$')
  .option('-ks, --key-separator <keySeparator>', 'Key separator', '.')
  .option('-is, --indent-size <indent>', 'Indent size', 2)
  .option('-l, --languages <languages...>', 'Supported languages', ['en', 'vi'])
  .option('-m, --marker <marker>', 'Translate marker', 'translate');

program
  .command('extract')
  .description('Extract all translations from your source code')
  .option('-i, --input <inputPath>', 'Input path', './src/')
  .option('-o, --output <outputPath>', 'Output path', './public/assets/i18n/')
  .option('-p, --partials <partialPath>', 'Partial path', './public/assets/i18n/partials/')
  .option('-ic, --include <include>', 'Include pattern', '\\.(js|jsx|ts|tsx)$')
  .option('-ex, --exclude <exclude>', 'Exclude pattern', '\\.(spec|test)\\.(js|jsx|ts|tsx)$')
  .option('-ks, --key-separator <keySeparator>', 'Key separator', '.')
  .option('-is, --indent-size <indent>', 'Indent size', 2)
  .option('-l, --languages <languages...>', 'Supported languages', ['en', 'vi'])
  .option('-m, --marker <marker>', 'Translate marker', 'translate')
  .action(() => {
    const {
      input,
      marker,
      languages,
      partials,
      indentSize,
    } = program;
    const include: RegExp = new RegExp(program.include);
    const exclude: RegExp = new RegExp(program.exclude);
    let keys: { [key: string]: string } = {};
    let namespaces: { [key: string]: string } = {};
    getFileList(input, include, exclude)
      .forEach((file: string) => {
        const content: string = readFileSync(file, ENCODING);
        const pattern: RegExp = getMarkedPattern(marker);
        const matches: RegExpMatchArray = content.match(pattern);
        if (matches !== null) {
          matches
            .forEach((match: string) => {
              const key: string = match.replace(getMarkedPattern(marker), '$1');
              const namespace: string = key.split(program.keySeparator)[0];
              if (!keys.hasOwnProperty(key)) {
                keys = {
                  ...keys,
                  [key]: '',
                };
              }
              if (!namespaces.hasOwnProperty(namespace)) {
                namespaces = {
                  ...namespaces,
                  [namespace]: kebabCase(namespace),
                };
              }
            });
        }
      });
    (languages as string[])
      .forEach((language: string) => {
        Object
          .entries(namespaces)
          .forEach(([namespace, kebabizedNamespace]) => {
            const filePath: string = join(partials, `${kebabizedNamespace}.${language}.json`);
            if (existsSync(filePath)) {
              try {
                const existedKeys: { [key: string]: any } = require(`./${filePath}`);
                Object
                  .entries(existedKeys)
                  .forEach(([key, value]) => {
                    if (keys.hasOwnProperty(key)) {
                      keys = {
                        ...keys,
                        [key]: value,
                      };
                    }
                  });
              } catch (error) {
                // tslint:disable-next-line:no-console
                console.error('Can not read file %s', filePath);
              }
            }
            let updatedKeys: { [key: string]: any } = {};
            Object
              .keys(keys)
              .forEach((key: string) => {
                if (key.startsWith(`${namespace}.`)) {
                  updatedKeys = {
                    ...updatedKeys,
                    [key]: keys[key],
                  };
                }
              });
            writeFileSync(filePath, JSON.stringify(updatedKeys, null, indentSize));
            // tslint:disable-next-line:no-console
            console.info('Write %d keys to file %s', Object.keys(updatedKeys).length, filePath);
          });
      });
  });

program
  .command('merge')
  .description('Merge all translations for each language into a single JSON file')
  .option('-p, --partials <partialPath>', 'Partial path', './public/assets/i18n/partials/')
  .option('-o, --output <outputPath>', 'Output path', './public/assets/i18n/')
  .option('-ks, --key-separator <keySeparator>', 'Key separator', '.')
  .option('-is, --indent-size <indent>', 'Indent size', 2)
  .option('-l, --languages <languages...>', 'Supported languages', ['en', 'vi'])
  .action(() => {
    let results: { [key: string]: { [key: string]: string } } = {};
    getFileList(program.partials)
      .forEach((file: string) => {
        const [, language] = file.match(/\.([a-z]{2})\.json$/);
        if (!results.hasOwnProperty(language)) {
          results = {
            ...results,
            [language]: {},
          };
        }
        const loadedKeys: { [key: string]: string } = require(`./${file}`);
        results = {
          ...results,
          [language]: {
            ...results[language],
            ...loadedKeys,
          },
        };
        // tslint:disable-next-line:no-console
        console.info('Loaded file %s', file);
      });
    Object
      .entries(results)
      .forEach(([language, translations]) => {
        const outputFile: string = join(program.output, `${language}.json`);
        writeFileSync(outputFile, JSON.stringify(translations, null, program.indentSize));
        // tslint:disable-next-line:no-console
        console.info('Language file %s updated', outputFile);
      });
  });

program.parse(process.argv);
