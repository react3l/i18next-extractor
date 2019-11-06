import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'fs';
import {kebabCase} from 'lodash';
import {join, resolve} from 'path';
import {getFileList} from '../helpers/get-file-list';
import {getMarkedPattern} from '../helpers/get-marker-pattern';
import {flatten, unflatten} from '../helpers/json';
import {ENCODING, program} from '../translate.cli';

export const extract = () => {
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
      try {
        mkdirSync(join(partials, language));
      } catch (error) {
        // tslint:disable-next-line:no-console
        console.info('Directory existed, no need to create new');
      }
      Object
        .entries(namespaces)
        .forEach(([namespace, kebabizedNamespace]) => {
          const filePath: string = resolve(partials, language, `${kebabizedNamespace}.json`);
          if (existsSync(filePath)) {
            try {
              const existedKeys: { [key: string]: any } = flatten(require(filePath));
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
          writeFileSync(filePath, JSON.stringify(unflatten(updatedKeys), null, indentSize));
          // tslint:disable-next-line:no-console
          console.info('Write %d keys to file %s', Object.keys(updatedKeys).length, filePath);
        });
    });
};
