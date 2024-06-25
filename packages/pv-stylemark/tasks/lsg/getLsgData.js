const { readFile } = require("fs-extra");
const { resolve, parse: pathParse, normalize, relative: relPath, join, dirname } = require("path");
const { marked } = require("marked");
const frontmatter = require("front-matter");
const { glob } = require("glob");

const { resolveApp, getAppConfig } = require("../../helper/paths");

/**
 * Information extracted from the executable code blocks according to the stylemark spec (@see https://github.com/mpetrovich/stylemark/blob/main/README-SPEC.md)
 * @typedef {Object} StyleMarkCodeBlock
 * @property {string} exampleName - will be used to identify the html page rendered as an iframe
 * @property {string} [examplePath] - optional, will be a relative path to the html file (relative from target/components/path/to/markdown)
 * @property {string} [search] - optional, the query params coming after the path in the code block. example: `?foo=bar` (? is part of the value)
 * @property {string} [hash] - optional, hash value coming after the path in the code block e.g. `#anchor` (# is part of the value)
 * @property {"html"|"css"|"js"} language - `html` will create a new html page, `js` and `css` will be added in the html file
 * @property {string} content - the content of the code block
 * @property {Object} params
 * @property {boolean} [params.hidden] - Indicates whether the code block should also be shown in the styleguide description of the component
 * @property {boolean} [params.raw] - Indicates whether the html needs to be wrapped by stylemark or rendered as it comes, raw.
 * @example
 *    ```exampleName:examplePath.language hidden
 *      content
 *    ```
 *    // new pattern
 *    ```language exampleName examplePath[search][hash] hidden raw=false
 *      content
 *    ```
 */

/**
 * @typedef {{
 *  exampleName: string;
 *  exampleMarkup: StyleMarkCodeBlock;
 *  exampleStyles: StyleMarkCodeBlock[];
 *  exampleScripts: StyleMarkCodeBlock[];
 * }} StyleMarkExampleData
 */

/**
 * @typedef {{
 *  componentName: string;
 *  componentPath: string;
 *  srcPath: string;
 *  options: Object;
 *  description: string;
 *  examples: Array<StyleMarkExampleData>;
 * }} StyleMarkLSGData
 */

// example code blocks:
// ```example:/path/to/page.html
// ```
//
// ```example.js
//   console.log('Example 1: ' + data);
// ```
//
// ```example.css hidden
//   button {
//     display: none;
//   }
// ```
const legacyRegexExecutableCodeBlocks = /``` *(?<exampleName>[\w\-]+)(:(?<examplePath>(\.?\.\/)*[\w\-/]+))?\.(?<language>html|css|js)(?<params>( .*)?) *\n+(?<content>[^```]*)```/g;

// example code blocks:
// ```html example ./path/to/page.html
// ```
//
// ```js example
//   console.log('Example 1: ' + data);
// ```
//
// ```css example hidden
//   button {
//     display: none;
//   }
// ```
const regexExecutableCodeBlocks = /``` *(?<language>html|css|js) (?<exampleName>[\w\-]+)( +(?<examplePath>(\.?\.\/)*[\w\-/]+\.[\w\-/]+))?(?<search>\?.+?)?(?<hash>#.+?)?(?<params>( .*))? *\n+(?<content>[^```]*)```/g

const exampleParser = {
  name: "exampleParser",
  level: "block",
  start(src) {
    return src.match(/:[^:\n]/)?.index;
  },
  tokenizer(src) {
    const rule = /^<dds-example.*<\/dds-example>/;
    const match = rule.exec(src);
    if (match) {
      const token = {
        type: "exampleParser",
        raw: match[0],
        text: match[0].trim(),
        tokens: [],
      };
      this.lexer.inline(token.text, token.tokens);
      return token;
    }
  },
  renderer(token) {
    return `${this.parser.parseInline(token.tokens)}\n`;
  },
};

/**
 * read markdown, extract code blocks for the individual examples
 * @param {string} markdownPath
 * @returns {StyleMarkLSGData}
 */
const getLsgDataForPath = async (markdownPath) => {
  const fileContent = await readFile(markdownPath, { encoding: "utf-8" });

  const { name, dir } = pathParse(markdownPath);
  const componentsSrc = resolveApp(getAppConfig().componentsSrc);
  const componentPath = relPath(componentsSrc, dir);
  const srcPath = relPath(componentsSrc, markdownPath);

  const { attributes: frontmatterData, body: fileContentBody } = frontmatter(fileContent);

  const codeBlocks = await getExecutableCodeBlocks(fileContentBody);

  const exampleNames = codeBlocks.filter(({language}) => language === "html").map(({ exampleName }) => exampleName);
  const exampleData = exampleNames.map(name => ({
    exampleName: name,
    // assuming only one html (external file or as the content of the fenced code block) is allowed per example
    exampleMarkup: codeBlocks.find(({ exampleName, language }) => exampleName === name && language === "html"),
    // multiple css/js code blocks are allowed per example
    exampleStyles: codeBlocks.filter(({ exampleName, language }) => exampleName === name && language === "css"),
    exampleScripts: codeBlocks.filter(({ exampleName, language }) => exampleName === name && language === "js"),
  }));

  const cleanContent = cleanMarkdownFromExecutableCodeBlocks(fileContentBody, name, componentPath);
  marked.use({ extensions: [exampleParser] });
  const description = marked.parse(cleanContent);

  return {
    componentName: name,
    componentPath,
    srcPath,
    options: frontmatterData,
    description,
    examples: exampleData,
  };
};

const getDataSortedByCategory = (lsgData, config) => {
  const categoryMap = new Map();
  lsgData.sort((a, b) => {
    const aName = a.options.name ?? a.componentName;
    const bName = b.options.name ?? b.componentName;
    return aName.localeCompare(bName);
  });
  lsgData.forEach(component => {
    const categoryName = component.options.category ?? "Other";
    const categoryItems = categoryMap.get(categoryName) || [];
    categoryItems.push(component);
    categoryMap.set(categoryName, categoryItems);
  });
  const categoryList = Array.from(categoryMap).map(([categoryName, categoryItems]) => ({
    categoryName,
    categoryItems,
  }));
  const orderConfig = config.order ?? [];
  const orderedCategoryList = categoryList.sort((a, b) => {
    const aIndex = orderConfig.indexOf(a.categoryName);
    const bIndex = orderConfig.indexOf(b.categoryName);
    if (aIndex === -1 && bIndex === -1) return a.categoryName.localeCompare(b.categoryName);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
  return orderedCategoryList;
};

const getLsgData = async (curGlob, config) => {
  const paths = await glob(curGlob, {
    windowsPathsNoEscape: true,
  });
  const normalizedPaths = paths.map(filePath => normalize(resolve(process.cwd(), filePath)));

  const data = await Promise.all(normalizedPaths.map(curPath => getLsgDataForPath(curPath)));
  return getDataSortedByCategory(data, config);
};

/**
 * extracts the fenced code blocks from the markdown that are meant to be used in the example pages according to the stylemark spec (@link https://github.com/mpetrovich/stylemark/blob/main/README-SPEC.md)
 *
 * @param {string} markdownContent
 * @returns {StyleMarkCodeBlock[]}
 */
function getExecutableCodeBlocks(markdownContent) {
  return [
    ...markdownContent.matchAll(legacyRegexExecutableCodeBlocks),
    ...markdownContent.matchAll(regexExecutableCodeBlocks),
  ].map(match => normalizeRegexGroups(match.groups));
}

/**
 * the `groups` object of the regex for the executable code blocks, will be modified to have the object exactly how it is needed and not what is possible using only regex.
 * this includes nested objects and boolean casting
 * @param {object} groups
 * @param {string} [groups.examplePath]
 * @param {string} [groups.params]
 * @param {string} groups.exampleName
 * @param {string} groups.language
 * @param {string} [groups.content]
 * @returns {StyleMarkCodeBlock}
 */
function normalizeRegexGroups(groups) {
  // "type=module hidden" --> `{ type: "module", hidden: true }`
  groups.params = Object.fromEntries((groups.params ?? "").trim().split(" ").map(part => part.trim()).filter(part => part !== "").map(part => {
    let [key, value] = part.split("=");
    // for boolean, cast
    if (value === "true") value = true;
    if (value === "false") value = false;
    return [key, value ?? true];
  }));

  if (groups.examplePath) {
    // in the new pattern, the extension is part of examplePath. in the old one the extension is used for the `language` instead.
    groups.examplePath = groups.examplePath.match(/\.[\w\-]+$/) ? groups.examplePath : `${groups.examplePath}.${groups.language}`;
  }

  return groups;
}

/**
 * removes all the fenced code blocks that stylemark will use to render the examples,
 * but only for the ones referencing an external file or having the `hidden` attribute in the info string
 *
 * @param {string} markdownContent
 * @returns {string}
 */
function cleanMarkdownFromExecutableCodeBlocks(markdownContent, name, componentPath) {
  function replacer(...args) {
    let replacement = "";
    /** @type {StyleMarkCodeBlock} */
    const groups = normalizeRegexGroups(args.at(-1));

    if (groups.language === "html") {
      // html file will be generated for html code blocks without a referenced file
      const examplePath = groups.examplePath ? groups.examplePath : `${groups.exampleName}.html`;
      const markupUrl = join("../components", componentPath, examplePath);
      // relative to `componentPath`
      const exampleDir = groups.examplePath ? dirname(groups.examplePath) : "";
      const htmlPath = join(componentPath, exampleDir, `${name}-${groups.exampleName}.html`);
      replacement += `<dds-example name="${groups.exampleName}" path="${htmlPath}${groups.search ?? ""}${groups.hash ?? ""}" ${groups.examplePath && !groups.params.hidden ? `markup-url="${markupUrl}"`: ""}></dds-example>`
    }
    if (groups.content && !groups.params.hidden) {
      // add the css/js code blocks for the example. make sure it is indented the way `marked` can handle it
      replacement += `
<details>
  <summary class="dds-example__code-box-toggle">${groups.language}</summary>
  \n\`\`\`${groups.language}\n${groups.content}\n\`\`\`\n
</details>`;
    }

    return replacement;
  }

  return markdownContent
    .replace(legacyRegexExecutableCodeBlocks, replacer)
    .replace(regexExecutableCodeBlocks, replacer);
}

module.exports = {
  getLsgData,
};
