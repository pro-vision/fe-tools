declare namespace PvCreateComponent {
  // name of component e.g. "related topic"
  export type ComponentName = string;
  export type UnitTestTypes = "karma" | "jest";
  export type DataFileType = ".json" | ".yaml";
  export type ComponentTypes = "Element" | "Module" | "Page";
  // project namespace which will be used for component prefixing.
  // e.g. "pv"
  // see pv-scripts config for more information
  export type Namespace = string;

  export interface CliOptions {
    name?: ComponentName; // name of component
    skip?: string[]; // questions to be skipped. e.g. ["scss", "galen"]
    unit?: UnitTestTypes;
    namespace?: Namespace;
    config?: String;
    templatesDir?: String;
    // ask to generate for example unit test files even if the user didn't want a js file
    // this is helpful if some files needs to be generated later
    dontCheck?: boolean;
  }

  export interface Options extends CliOptions {
    useTS: boolean; // use .ts files instead of .js files
    name: ComponentName; // e.g. "related content"
    type: ComponentTypes; // is this an element or module
    hasScss: boolean; // component has .scss file
    hasHbs: hasHbs; // component has .hbs file
    dataFile: DataFileType | false;
    hasTs: boolean; // component has .ts file
    hasJs: boolean; // component has .js file
    hasUnit: boolean; // has unit test file
    unit: UnitTestTypes;
    hasGalen: boolean; // has galen test files
    gitAdd: boolean; // generated files will be staged with git
  }

  export interface TemplateOptions extends Options {
    pascalCase: string; // e.g. "Related Topics"
    camelCase: string; // e.g. "RelatedTopics"
    kebabCase: string; // e.g. "relatedTopics"
    constructorName: string; // e.g. "related-topics"
    componentName: string; // e.g. "PVRelatedTopics"
    isCustomElement: boolean; // component has a js/ts file and therefor is a custom element
  }

  export type Prompt = import("@types/inquirer").Question;

  export interface ConfigItem {
    // identifier which might be used by the user to find the config which needs modification
    id?: string;
    prompt?: Prompt;
    files?: Array<{
      id?: string;
      // whether or not the file should be created
      when?: boolean | ((opt: Options) => boolean) = true;
      // function which returns the boilerplate code to be used as the starter
      template: (opt: TemplateOptions) => string;
      // path to stored the generated file. is relative to the cmd cwd
      path: (opt: TemplateOptions) => string;
    }>;
    imports?: Array<{
      id?: string;
      // whether or not the import should be added
      when: boolean | ((opt: Options) => boolean) = true;
      // path of file where the import statement is added to
      path: string | ((opt: TemplateOptions) => string);
      // should return the import statement or any text which will be added to the file
      template: (opt: TemplateOptions) => string;
      // if provided, the import statement will be placed before it,
      // otherwise it will be added at the end of file
      placeholder?: string | ((opt: TemplateOptions) => string);
    }>;
  }

  type Config = ConfigItem[];
}
