import { writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { getFileList } from '../helpers/get-file-list';
import { program } from '../translate.cli';

export const merge = () => {
  let results: { [key: string]: { [key: string]: string } } = {};
  program.languages.forEach((language: string) => {
    getFileList(join(program.partials, language))
      .forEach((file: string) => {
        if (!results.hasOwnProperty(language)) {
          results = {
            ...results,
            [language]: {},
          };
        }
        const loadedKeys: { [key: string]: string } = require(file);
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
