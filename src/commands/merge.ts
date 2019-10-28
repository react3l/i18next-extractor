import {writeFileSync} from 'fs';
import {resolve} from 'path';
import {getFileList} from '../helpers/get-file-list';
import {unflatten} from '../helpers/json';
import {program} from '../translate.cli';

export const merge = () => {
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
      const loadedKeys: { [key: string]: string } = require(file);
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
      const outputFile: string = resolve(program.output, `${language}.json`);
      writeFileSync(outputFile, JSON.stringify(unflatten(translations), null, program.indentSize));
      // tslint:disable-next-line:no-console
      console.info('Language file %s updated', outputFile);
    });
};
