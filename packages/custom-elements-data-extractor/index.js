const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const globby = require("globby");
const slash = require("slash");
const parser = require("@babel/parser");
const { default: traverse } = require("@babel/traverse");
const doctrine = require("doctrine");
const kebabCase = require("kebab-case");
const { titleCase } = require("title-case");
const mkdirp = require("mkdirp");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

/**
 * @typedef {Object} CustomElementsData
 * @property {boolean} descriptions - info regarding this Custom Element written as leading comment(s) to its class definition
 * @property {PropData[]} props - list of its props
 */

/**
 * @typedef {Object} PropData
 * @property {string} name - property's name
 * @property {string[]} descriptions - info regarding this property written as leading comment(s)
 * @property {Array<{key: string, value:*}>} value - info regarding this property such as it being mandatory etc. {@see https://github.com/kluntje/kluntje/tree/develop/packages/core#props}
 */

/**
 * {@see https://github.com/microsoft/vscode-html-languageservice/blob/a78978e573337f2766cfbe685c06de40d4d47a49/docs/customData.schema.json#L66}
 * @typedef {Object} AttributeData
 * @property {string} name - attribute's name
 * @property {string} descriptions - info regarding this attribute
 * @property {Array<{name:string}>} values - possible values which this attribute can have
 */

/**
 * provide methods to extract property/attribute information from custom element classes
 * and generates e.g vscode`s html.customData {@see https://github.com/microsoft/vscode-html-languageservice/blob/main/docs/customData.md}
 *
 * @class Extract
 */
class CustomElementDataExtractor {
  /** @type {[key: string]: CustomElementsData} */
  customElementsData = {};

  /**
   * list of plugins used by babel parser to parse the components javascript file
   * @readonly
   */
  get babelParserPlugins() {
    return ["typescript", "classProperties", "decorators-legacy"];
  }

  /**
   * name of decorator without the "@" sign which generates a component property
   * @readonly
   */
  get propDecoratorName() {
    return "prop";
  }

  /**
   * Creates an instance of Extract.
   * @param {Object} arg
   * @param {string|number} [arg.port] - port number for the local FE dev-server
   * @param {string|number} arg.namespace - project prefix e.g. ("pva") {@see https://github.com/pro-vision/fe-tools/tree/master/packages/pv-scripts}
   * @param {string} arg.components - glob pattern with absolute path to all custom elements classes which their data needs to be extracted
   * @param {string} [arg.iconsDir] - absolute path to the root folder of avg icons
   * @memberof Extract
   */
  constructor({ port, namespace, components, iconsDir }) {
    this.port = port;
    // "pva" -> "pva-"
    this.namespace = namespace ? `${namespace}-` : "";
    this.components = slash(components);

    if (iconsDir) this.iconsDir = slash(path.join(iconsDir, "/"));
  }

  /**
   * extract text content from the node's leading comments or comment blocks including JSDoc
   *
   * @param {Node} node - AST Node which might have a leading comment
   * @returns {string[]}
   */
  getDescriptions(node) {
    return (node.leadingComments || []).map((comment) => {
      if (comment.type === "CommentBlock") {
        const jsdocAst = doctrine.parse(comment.value, { unwrap: true });
        return jsdocAst.description;
      }
      return comment.value.trim();
    });
  }

  /**
   * generates the custom elements tag name based on its file path
   *
   * @param {string} filePath - absolute path to the components file (with unix separators)
   * @param {*} _code - content of the components file
   * @returns {string}
   */
  getElementName(filePath, _code) {
    return path.basename(filePath, ".ts");
  }

  /**
   * return options which the given attribute for the element can have.
   *
   * @param {Object} param
   * @param {string} param.attributeName - attribute name e.g `ajax-url`
   * @param {string} param.elementName - custom elements tag name e.g. `pva-button`
   * @param {PropData} param.propData - extracted data from the Custom elements JS class
   * @returns {Array<{name:string}>|null}
   *
   * @example
   * // <elem dir="ltr" />
   * getValues({attributeName}) { if (attributeName="dir") return [{name: "rtl"}, {name: "ltr"}]}
   */
  getValues({ attributeName, elementName: _elementName, propData: _propData }) {
    if (attributeName === "icon-id") {
      return this.getIconsList().map((name) => ({
        name,
      }));
    }

    return null;
  }

  /**
   * returns a list of references for the tag shown in completion and hover
   * link to the living styleguide entry is returned by default
   * @param {string} elementName - custom elements tag name
   * @returns {Array<{name: string, url: string}>} - {@see https://github.com/microsoft/vscode-html-languageservice/blob/a78978e573337f2766cfbe685c06de40d4d47a49/docs/customData.schema.json#L10}
   */
  getReferences(elementName) {
    return [
      {
        name: "Living Styleguide",
        url: `http://localhost:${
          this.port
        }/styleguide/index.html#${elementName
          .replace(this.namespace, "")
          .replace(/^(e|m)-/, "")}`,
      },
    ];
  }

  /**
   * returns the (kebab-case) name for the attribute for the given (camelCase) property
   *
   * @param {string} propName
   * @returns {string}
   */
  getAttributeName(propName) {
    return kebabCase(propName);
  }

  /**
   * returns the custom html data info for the given property/attribute
   *
   * @param {PropData} prop - prop object
   * @param {string} elementName - custom elements tag name
   * @returns {AttributeData} - {@see https://github.com/microsoft/vscode-html-languageservice/blob/a78978e573337f2766cfbe685c06de40d4d47a49/docs/customData.schema.json#L66}
   */
  getAttributeData(prop, elementName) {
    const attrName = this.getAttributeName(prop.name);
    const attributeData = {
      name: attrName,
      description: prop.descriptions.join("\n").trim(),
    };

    const values = this.getValues({
      attributeName: attrName,
      propData: prop,
      elementName,
    });

    if (Array.isArray(values) && values.length) attributeData.values = values;

    return attributeData;
  }

  /**
   * returns the list of icons "names" which are used for the icon elements attribute
   *
   * @returns {string[]}
   */
  getIconsList() {
    if (!this.iconsDir) return [];

    const iconPaths = globby.sync(this.iconsDir, {
      expandDirectories: {
        extensions: ["svg"],
      },
    });

    return iconPaths.map((filePath) =>
      filePath.replace(this.iconsDir, "").replace(/\.svg$/, "")
    );
  }

  /**
   * extracts props from props object in constructor or class fields with `@prop` decorator.
   * For all component classes in glob pattern
   * @async
   */
  async extractAllCustomElementsData() {
    for await (const filePath of globby.stream(this.components)) {
      const code = await readFile(filePath, { encoding: "utf-8" });
      const elementName = this.getElementName(filePath, code);
      const customElementsData = this.extractCustomElementsData(code);
      if (customElementsData)
        this.customElementsData[elementName] = customElementsData;
    }
  }

  /**
   * extracts props from props object in constructor or class fields with `@prop` decorator.
   * @param {string} code - JS/TS code for the components custom element class
   * @returns {CustomElementsData|undefined}
   */
  extractCustomElementsData(code) {
    let result, ast;

    try {
      ast = parser.parse(code, {
        sourceType: "module",
        plugins: this.babelParserPlugins,
      });
    } catch (err) {
      // parse error when code has some syntax issues
      console.error(err);
      return result;
    }

    traverse(ast, {
      // extract comment from the custom element class
      ClassDeclaration: (nodePath) => {
        result = {
          descriptions: this.getDescriptions(nodePath.node),
          props: [],
        };
      },
      // extract the data from `props` in the constructor argument.
      ClassMethod: (nodePath) => {
        if (nodePath.node.kind === "constructor") {
          traverse(
            nodePath.node,
            {
              enter: (subNodePath) => {
                if (subNodePath.isIdentifier({ name: "props" })) {
                  const propsData = subNodePath.container.value.properties.map(
                    (property) => ({
                      name: property.key.name,
                      descriptions: this.getDescriptions(property),
                      value: property.value.properties.map((propDef) => ({
                        key: propDef.key.name,
                        value: propDef.value.value,
                      })),
                    })
                  );

                  result.props.push(...propsData);
                }
              },
            },
            nodePath.scope,
            nodePath.state,
            nodePath
          );
        }
      },

      // via `@prop` decorators
      ClassProperty: (nodePath) => {
        if (nodePath.node.decorators) {
          nodePath.node.decorators.forEach((n) => {
            // `@prop foo`
            if (
              n.expression.type === "Identifier" &&
              n.expression.name === this.propDecoratorName
            ) {
              result.props.push({
                name: nodePath.node.key.name,
                descriptions: this.getDescriptions(nodePath.node),
                value: [],
              });
            }
            // `@prop({required: true}) foo`
            else if (
              n.expression.type === "CallExpression" &&
              n.expression.callee.name === this.propDecoratorName
            ) {
              const value = n.expression.arguments?.[0].properties.map((p) => ({
                key: p.key.name,
                value: p.value.value,
              }));

              result.props.push({
                name: nodePath.node.key.name,
                descriptions: this.getDescriptions(nodePath.node),
                value,
              });
            }
          });
        }
      },
    });

    return result;
  }

  /**
   * generates object for vscode`s html.customData
   * {@see https://github.com/microsoft/vscode-html-languageservice/blob/main/docs/customData.md}
   *
   * @returns {Object} - {@see https://github.com/microsoft/vscode-html-languageservice/blob/a78978e573337f2766cfbe685c06de40d4d47a49/docs/customData.schema.json}
   */
  getHTMLCustomData() {
    const customElementsHtmlData = {
      version: 1.1,
      tags: [],
      valueSets: [],
    };
    Object.entries(this.customElementsData).forEach(
      ([elementName, customElementData]) => {
        const tagData = {
          // assuming file name and custom elements name are the same
          name: elementName,
          description:
            customElementData.descriptions.join("\n").trim() ||
            titleCase(
              elementName
                .replace(this.namespace, "")
                .replace(/^(e|m)-/, "")
                .replace(/-/g, " ")
            ),
          attributes: [],
        };

        const references = this.getReferences(elementName);
        if (references) tagData.references = references;

        customElementData.props.forEach((prop) => {
          const attributeData = this.getAttributeData(prop, elementName);
          if (attributeData.values) {
            const valueSet = `${elementName}:${attributeData.name}`;
            customElementsHtmlData.valueSets.push({
              name: valueSet,
              values: attributeData.values,
            });

            delete attributeData.values;
            attributeData.valueSet = valueSet;
          }

          tagData.attributes.push(attributeData);
        });

        customElementsHtmlData.tags.push(tagData);
      }
    );

    return customElementsHtmlData;
  }

  // html custom data is generated and written to disc
  async writeHTMLCustomData(outputDir) {
    const htmlCustomData = this.getHTMLCustomData();
    // make sure folder exists
    await mkdirp(outputDir);
    await writeFile(
      path.join(outputDir, "custom-elements.html-data.json"),
      JSON.stringify(htmlCustomData, null, "  ")
    );
  }
}

module.exports = CustomElementDataExtractor;
