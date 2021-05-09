import { Command } from "commander";
import { extract } from "./commands/extract";
import { merge } from "./commands/merge";
import { migrate } from "./commands/migrate";

export class Extractor extends Command {
    /**
     * Input directory, translation will be extracted from here
     * 
     * @type {string}
     */
    public input?: string;

    /**
     * Output directory, translation will be extracted to here
     */
    public output?: string;

    /**
     * Translation marker, appearance in code
     * 
     * @type {string} - marker
     */
    public marker?: string;

    /**
     * Comma-separated language list
     * 
     * @type {string}
     */
    public languages?: string;

    /**
     * Partial directory
     * 
     * @type {string}
     */
    public partials?: string;

    /**
     * Indent size in translation files
     * 
     * @type {string}
     */
    public indentSize?: string;

    /**
     * Source files include-pattern
     * 
     * @type {string}
     */
    public include?: string;

    /**
     * Source files exclude-pattern
     * 
     * @type {string}
     */
    public exclude?: string;

    /**
     * Translation key separator
     * 
     * @type {string}
     */
    public keySeparator?: string;

    /**
     * Common options
     * 
     * @returns {Extractor}
     */
    public withOptions(): Extractor {
        return this
            .option('-i, --input <inputPath>', 'Input path', 'src/')
            .option('-o, --output <outputPath>', 'Output path', 'public/assets/i18n/')
            .option('-p, --partials <partialPath>', 'Partial path', 'public/assets/i18n/partials/')
            .option('-ic, --include <include>', 'Include pattern', '\\.(js|jsx|ts|tsx)$')
            .option('-ex, --exclude <exclude>', 'Exclude pattern', '\\.(spec|test)\\.(js|jsx|ts|tsx)$')
            .option('-ks, --key-separator <keySeparator>', 'Key separator', '.')
            .option('-is, --indent-size <indent>', 'Indent size', '2')
            .option('-l, --languages <languages...>', 'Supported languages', 'en,vi')
            .option('-m, --marker <marker>', 'Translate marker', 'translate');
    }

    /**
     * Extract translation keys
     */
    public extract = extract;

    /**
     * Merge translation keys
     */
    public merge = merge;

    /**
     * Migrate from nested keys
     */
    public migrate = migrate;

    /**
     * Class constructor
     */
    constructor() {
        super();
    }
}
