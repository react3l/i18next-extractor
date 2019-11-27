interface IJSONObject {
  [key: string]: string | number | boolean | null | undefined | IJSONObject;
}

export function sort(json: IJSONObject) {
  const result: IJSONObject = {};
  Object
    .keys(json)
    .sort()
    .forEach((key: string) => {
      result[key] = json[key];
      if (typeof result[key] === 'object') {
        result[key] = sort(result[key] as IJSONObject);
      }
    });
  return result;
}

export function unflatten(jsonTable: { [key: string]: string }) {
  const result: { [key: string]: any } = {};
  Object
    .keys(jsonTable)
    .forEach((key: string) => {
      const namespaces: string[] = key.split('.');
      const lastIndex: number = namespaces.length - 1;
      let current: { [key: string]: any } = result;

      namespaces.forEach((namespace: string, index: number) => {
        const hasKey: boolean = current.hasOwnProperty(namespace);
        const isLastIndex = index === lastIndex;
        if (!hasKey) {
          if (isLastIndex) {
            current[namespace] = jsonTable[key];
          } else {
            current[namespace] = {};
          }
        }
        if (typeof current[namespace] === 'object') {
          current = current[namespace];
        }
      });
    });
  return sort(result);
}

export function flatten(json: { [key: string]: any }, parentKey: string = '') {
  let result: { [key: string]: string } = {};
  Object
    .keys(json)
    .forEach((key: string) => {
      const combinedKey: string = parentKey ? `${parentKey}.${key}` : key;
      if (typeof json[key] !== 'object') {
        result = {
          ...result,
          [combinedKey]: json[key],
        };
      } else {
        result = {
          ...result,
          ...flatten(json[key], combinedKey),
        };
      }
    });
  return result;
}
