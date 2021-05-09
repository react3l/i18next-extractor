import { readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { ENCODING } from 'src/config/consts';
import { Extractor } from 'src/Extractor';
import { getFileList } from 'src/helpers/get-file-list';
import { program } from 'src/index';

export function merge(this: Extractor) {
  const program = this;

  let results: Record<string, Record<string, string>> = {};
  this.languages
    .split(",")
    .forEach((language: string) => {
      getFileList(join(program.partials, language))
        .forEach((file: string) => {
          if (!results.hasOwnProperty(language)) {
            results = {
              ...results,
              [language]: {},
            };
          }
          const loadedKeys: { [key: string]: string } = JSON.parse(readFileSync(file, {
            encoding: ENCODING,
          }));
          results[language] = {
            ...results[language],
            ...loadedKeys,
          };
          // tslint:disable-next-line:no-console
          console.info('Loaded file %s', file);
        });
    });
  Object
    .entries(results)
    .forEach(([language, translations]) => {
      const outputFile: string = resolve(program.output, `${language}.json`);
      writeFileSync(outputFile, JSON.stringify(translations, null, program.indentSize));
      // tslint:disable-next-line:no-console
      console.info('Language file %s updated', outputFile);
    });
};
