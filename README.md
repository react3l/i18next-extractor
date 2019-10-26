react-i18next-extract
=====================
_i18next extraction tool for React application_

```bash
Usage: react-i18next-extract [options] [command]

Translate your application using i18next

  react-i18next-extract merge [...options]

  react-i18next-extract extract [...options]
  

Options:
  -V, --version                        output the version number
  -i, --input <inputPath>              Input path (default: "./src/")
  -o, --output <outputPath>            Output path (default: "./public/assets/i18n/")
  -p, --partials <partialPath>         Partial path (default: "./public/assets/i18n/partials/")
  -ic, --include <include>             Include pattern (default: "\\.(js|jsx|ts|tsx)$")
  -ex, --exclude <exclude>             Exclude pattern (default: "\\.(spec|test)\\.(js|jsx|ts|tsx)$")
  -ks, --key-separator <keySeparator>  Key separator (default: ".")
  -is, --indent-size <indent>          Indent size (default: 2)
  -l, --languages <languages...>       Supported languages (default: ["en","vi"])
  -m, --marker <marker>                Translate marker (default: "translate")
  -h, --help                           output usage information

Commands:
  extract [options]                    Extract all translations from your source code
  merge [options]                      Merge all translations for each language into a single JSON file
```
