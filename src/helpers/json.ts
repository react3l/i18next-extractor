export function unflatten(jsonTable: { [key: string]: string }) {
  const result: { [key: string]: any } = {};
  Object
    .keys(jsonTable)
    .forEach((key: string) => {
      const namespaces: string[] = key.split('.');
      let current: { [key: string]: any } = result;
      for (let i: number = 0; i < namespaces.length; i++) {
        if (!current.hasOwnProperty(namespaces[i])) {
          if (namespaces.length - i === 1) {
            current[namespaces[i]] = jsonTable[key];
          } else {
            current[namespaces[i]] = {};
          }
        }
        current = current[namespaces[i]];
      }
    });
  return result;
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
