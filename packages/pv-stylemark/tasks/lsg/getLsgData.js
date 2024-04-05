const { readFile } = require("fs-extra");
const { resolve, parse: pathParse, normalize, relative: relPath, dirname } = require("path");
const { marked } = require("marked");
const frontmatter = require("front-matter");
const { glob } = require("glob");

const { resolveApp, getAppConfig } = require("../../helper/paths");

const getStylesData = stylesMatch => {
  const exampleKeys = stylesMatch
    .match(/^ *[\w\-]+\.css/)
    .map(match => match.replace(/ /g, "").replace(/\.css$/g, ""));
  if (exampleKeys.length === 0) return null;

  const styleContent = stylesMatch.replace(/^ *[\w\-]+\.css( +hidden)?\s+/g, "").trim();
  return {
    exampleKey: exampleKeys[0],
    styleContent,
  };
};

const getExampleMarkup = (matchingString, name, componentPath) => {
  matchingString = matchingString.replace(/```/g, "").replace(/\s/g, "");
  const [exampleName, examplePath] = matchingString.split(":");
  const markupUrl = `../components/${componentPath}/${examplePath}`;
  return `<dds-example name="${exampleName}" path="${name}-${exampleName}.html" markup-url="${markupUrl}"></dds-example>`;
};

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

const getLsgDataForPath = async (path, componentsSrc) => {
  const fileContent = await readFile(path, { encoding: "utf-8" });

  const { name } = pathParse(path);
  const componentPath = dirname(relPath(resolveApp(componentsSrc), path));

  const { attributes: frontmatterData, body: fileContentBody } = frontmatter(fileContent);

  const stylesRegex = new RegExp(/``` *[\w\-]+\.css( +hidden)? *\n+[^```]+```/g);

  const stylesMatches = fileContentBody.match(stylesRegex) || [];

  const styles = stylesMatches.map(match => match.replace(/```/g, ""));
  const stylesList = styles.map(getStylesData);

  const exampleRegex = new RegExp(/``` *[\w\-]+:(\.?\.\/)*[\w\-/]+\.[a-z]+\s*\n```/g);

  const exampleMatches = fileContentBody.match(exampleRegex) || [];
  const examples = exampleMatches.map(match => match.replace(/```/g, "").replace(/\s/g, ""));
  const exampleData = examples.map(match => {
    const [exampleName, examplePath] = match.split(":");
    const exampleStyles = stylesList.filter(style => style.exampleKey === exampleName);
    return { exampleName, examplePath, exampleStyles };
  });

  const cleanContent = fileContentBody
    .replace(exampleRegex, match => getExampleMarkup(match, name, componentPath))
    .replace(stylesRegex, "");
  marked.use({ extensions: [exampleParser] });
  const description = marked.parse(cleanContent);
  return {
    componentName: name,
    componentPath,
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
  const { componentsSrc } = getAppConfig();
  const paths = await glob(curGlob, {
    windowsPathsNoEscape: true,
  });
  const normalizedPaths = paths.map(filePath => normalize(resolve(process.cwd(), filePath)));

  const data = await Promise.all(normalizedPaths.map(curPath => getLsgDataForPath(curPath, componentsSrc)));
  return getDataSortedByCategory(data, config);
};

module.exports = {
  getLsgData,
};
