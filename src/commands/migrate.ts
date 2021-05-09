import {ENCODING} from 'src/config/consts';
import * as fs from 'fs';
import {flatten} from 'src/helpers/json';
import * as path from 'path';

export function migrate(dir: string) {
  fs.readdirSync(dir)
    .forEach((entry: string) => {
      const entryPath: string = path.join(dir, entry);
      if (fs.lstatSync(entryPath).isDirectory()) {
        return migrate(entryPath);
      }
      if (entryPath.match(/\.json$/)) {
        const content: Record<string, string> = flatten(
          JSON.parse(
            fs.readFileSync(
              entryPath,
              {
                encoding: ENCODING,
              },
            )
              .toString(),
          ),
        );
        const result: Record<string, string> = {};
        Object
          .keys(content)
          .sort()
          .forEach((key: string) => {
            result[key] = content[key];
          });
        fs.writeFileSync(
          entryPath,
          JSON.stringify(
            result,
            null,
            2,
          ),
        );
      }
    });
}
