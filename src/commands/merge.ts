import {ENCODING} from 'config/consts';
import {readFileSync, writeFileSync} from 'fs';
import {getFileList} from 'helpers/get-file-list';
import {join, resolve} from 'path';
import {program} from 'translate.cli';

export const merge = () => {
  let results: Record<string, Record<string, string>> = {};
  program.languages.forEach((language: string) => {
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
