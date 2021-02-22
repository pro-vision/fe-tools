const { basename, relative, dirname, extname } = require("path");
const { readJson, readFile } = require("fs-extra");
const Handlebars = require("handlebars");
const { loadFront } = require("yaml-front-matter");
const handlebarsHelpers = require("handlebars-helpers");
const { safeLoad } = require("js-yaml");

const Timer = require("./Timer");
const Visitor = require("./Visitor");
const {
  getPaths,
  asyncReadFile,
  asyncWriteFile,
  getName,
} = require("./helper/io-helper");

/**
 * provides an instance which build html pages from handlebars templates, helpers and data
 * to be consumed by Stylemark for a static living styleguide
 *
 * @class Assemble
 */
module.exports = class Assemble {
  constructor({ verbose = false } = {}) {
    // if `true`, it logs info when running
    this.verbose = verbose;
    // key, value pairs of the path to .hbs files for components, partials and pages which will be read an processed
    this.templates = {};
    // key, value pairs of the path to .hbs files for layouts which will be read an processed
    this.layouts = {};
    // same as {Assemble#layouts} but for the layouts used for lsg components outputs
    this.lsgLayouts = {};
    // data which will be used when handlebars templates are rendered
    this.dataPool = {};
    // list of current handlebar helpers (which is also the file name of these helpers).
    this.helpers = {};
    // paths of files which throw an error during parsing or executing,
    // and should be re-tried in the next interval regardless of them being changed by the user or not
    // it helps the user to not forget to fix stuff,
    // and sometimes a simple re-run might help. e.g. when there was a i/o issues
    this.failedPaths = [];
  }

  // console logs in verbose mode
  log(...args) {
    if (this.verbose) console.log("[Assemble-Lite] ", ...args);
  }

  /**
   * builds all the html pages, based on the provided arguments,
   * an re-uses cached items from the previous builds
   *
   * @param {*} {
   *     baseDir,
   *     components,
   *     pages,
   *     data,
   *     helpers,
   *     layouts,
   *     lsgLayouts,
   *     componentsTargetDirectory,
   *     pagesTargetDirectory,
   *     lsgComponentsTargetDirectory,
   *   }
   * @param {string[] | null} modifiedFiles - list of paths of files which have been modified compared to the last build
   * @memberof Assemble
   */
  async build(
    {
      baseDir = "./",
      components,
      pages,
      data,
      helpers,
      layouts,
      lsgLayouts,
      componentsTargetDirectory,
      pagesTargetDirectory,
      lsgComponentsTargetDirectory,
    },
    modifiedFiles
  ) {
    this.log("--------------------------------");
    this.log("Build start ...");

    // use a timer to measure execution duration for individual tasks
    const timer = new Timer();
    timer.start("BUILD");

    // if the `modifiedFiles` argument is passed,
    // use data from last render, and only update the modified data
    const useCache = Boolean(modifiedFiles);

    timer.start("GETTING-PATHS");
    // get the list of paths for all relevant files for rendering the handlebars templates
    let [
      helperPaths,
      layoutPaths,
      lsgLayoutPaths,
      componentPaths,
      pagePaths,
      dataPaths,
    ] = await Promise.all([
      getPaths(helpers),
      getPaths(layouts),
      getPaths(lsgLayouts),
      getPaths(components),
      getPaths(pages),
      getPaths(data),
    ]);
    this.log("Getting paths took:", timer.measure("GETTING-PATHS", true), "s");

    timer.start("PROCESSING-FILES");

    // these lists will be used when only e.g. the lsg components need to be re-rendered (i.e. their layout has changed)
    const onlyNormalRender = [];
    const onlyLsgRender = [];

    // called during the watch task and only some files have been changed
    if (useCache) {
      this.log("modified files:", modifiedFiles);
      if (this.failedPaths.length)
        this.log("failed paths from last build:", this.failedPaths);
      // re-try the failed files from the last try
      modifiedFiles.push(...this.failedPaths);
      // reset the list from the last run for the next iteration
      this.failedPaths = [];

      // #region remove data from memory for deleted files
      this._removeObsolete(this.dataPool, dataPaths, getName);
      this._removeObsolete(this.layouts, layoutPaths, getName);
      this._removeObsolete(this.lsgLayouts, lsgLayoutPaths, getName);
      // remove obsolete helpers (strongly assuming helper name and file name are identical)
      this._removeObsolete(this.helpers, helperPaths, getName, ({ name }) =>
        Handlebars.unregisterHelper(name)
      );
      // remove obsolete templates
      this._removeObsolete(
        this.templates,
        [...componentPaths, ...pagePaths],
        (path) => path,
        (tpl) => Handlebars.unregisterPartial(tpl.name)
      );
      // #endregion remove

      // ignore paths which belong to files not being changed
      const wasModified = (path) => modifiedFiles.includes(path);
      helperPaths = helperPaths.filter(wasModified);
      layoutPaths = layoutPaths.filter(wasModified);
      lsgLayoutPaths = lsgLayoutPaths.filter(wasModified);
      componentPaths = componentPaths.filter(wasModified);
      pagePaths = pagePaths.filter(wasModified);
      dataPaths = dataPaths.filter(wasModified);
    }

    timer.start("READ-AND-PARSE-FILES");
    // reads components and pages
    await Promise.all(
      [
        layoutPaths.map((path) => this._processLayout(path, "NORMAL")),
        lsgLayoutPaths.map((path) => this._processLayout(path, "LSG")),
        componentPaths.map((path) => this._processTemplate(path, "COMPONENT")),
        pagePaths.map((path) => this._processTemplate(path, "PAGE")),
      ].flat()
    );
    const toBeRenderedTemplates = [...componentPaths, ...pagePaths];

    // load helpers
    // on the first run. also load the helpers from "handlebars-helpers" package
    const loadCommonHandlebarsHelpers = !useCache;
    this._loadHelpers(helperPaths, loadCommonHandlebarsHelpers);

    // read data
    const readData = await this._loadData(dataPaths);
    // merge with (potentially) old data
    Object.assign(this.dataPool, readData);

    this.log(
      "Reading and parsing took:",
      timer.measure("READ-AND-PARSE-FILES", true),
      "s"
    );

    // on watch, add any dependent templates
    // i.e. template, helper, data or layout A has been modified,
    // find any template B which directly or indirectly uses A as partial, data or helper
    if (useCache) {
      timer.start("FIND-OUT-OF-DATE-TEMPLATES");
      // items which their hbs has not been changed,
      // but still have to be checked if they have a (direct or indirect) dependency on a modified file
      const listOfTemplates = new Set(
        Object.values(this.templates).filter(
          ({ path }) => !toBeRenderedTemplates.includes(path)
        )
      );

      // only components can currently be used as partials
      const modifiedComponents = componentPaths
        .map((path) => this.templates[path])
        .filter((tpl) => tpl.type === "COMPONENT");

      // list of partial name, helper or expression for modified files
      const modifications = modifiedFiles.map(getName);

      // this makes sure every template that has a partial with an expression (i.e. `{{> (exp)}}`),
      // which is not easy to determine what it references, is also picked,
      // and that the modifications list is not empty even when no component had any changes (i.e. only helper or data were modified)
      // so in the loop all comps which reference them are found
      modifiedComponents.push({ name: undefined });

      // go over all modified components (their markup or dependencies have been changed),
      // and find any dependent component which uses this as partial,
      // and add it to the modified list
      for (const comp of modifiedComponents) {
        // add the name to check-list to check if it was used by others as a partial call
        if (!modifications.includes(comp.name)) modifications.push(comp.name);

        // iterate over remaining templates and check if any has a dependency to the current modification list
        for (const tpl of listOfTemplates) {
          if (
            tpl.pathExpressions.some((exp) => modifications.includes(exp)) ||
            tpl.partials.some((exp) => modifications.includes(exp))
          ) {
            toBeRenderedTemplates.push(tpl.path);
            // template already was found to need a re-render, no need to (re-)check it later.
            listOfTemplates.delete(tpl);
            // add to list of comps/partials that have been changed, so their dependents will be checked as well
            if (tpl.type === "COMPONENT") modifiedComponents.push(tpl); // eslint-disable-line max-depth
          }
        }
      }

      // find layouts which use partials which are modified
      layoutPaths.push(
        ...Object.values(this.layouts)
          .filter(({ path }) => !layoutPaths.includes(path))
          .filter(({ pathExpressions }) =>
            pathExpressions.some((exp) => modifications.includes(exp))
          )
          .map(({ path }) => path)
      );

      lsgLayoutPaths.push(
        ...Object.values(this.lsgLayouts)
          .filter(({ path }) => !lsgLayoutPaths.includes(path))
          .filter(({ pathExpressions }) =>
            pathExpressions.some((exp) => modifications.includes(exp))
          )
          .map(({ path }) => path)
      );

      // if some layouts have been changed,
      // mark the templates (components, pages) which referenced them to be re-rendered
      const modifiedNormalLayouts = layoutPaths.map(getName);
      const modifiedLsgLayouts = lsgLayoutPaths.map(getName);
      const modifiedLayouts = [...modifiedNormalLayouts, ...modifiedLsgLayouts];
      for (const tpl of listOfTemplates) {
        if (modifiedLayouts.includes(tpl.layout)) {
          toBeRenderedTemplates.push(tpl.path);
          if (modifiedNormalLayouts.includes(tpl.layout))
            onlyNormalRender.push(tpl.path);
          // check instead of else, incase *both* layouts have been changed
          if (modifiedLsgLayouts.includes(tpl.layout))
            onlyLsgRender.push(tpl.path);
          listOfTemplates.delete(tpl);
        }
      }
      this.log(
        "Finding templates depending on modified files took:",
        timer.measure("FIND-OUT-OF-DATE-TEMPLATES", true),
        "s"
      );
    }

    // #region  generate html and write to files
    timer.start("RENDERING-AND-WRITING");
    const renderOption = {
      baseDir,
      componentsTargetDirectory,
      pagesTargetDirectory,
      lsgComponentsTargetDirectory,
    };

    if (useCache) this.log("to be rendered templates: ", toBeRenderedTemplates);

    // render html in parallel
    await Promise.all(
      toBeRenderedTemplates.map((path) =>
        this._render(path, renderOption, {
          // normal is false only when the path is only in lsg list
          NORMAL:
            onlyNormalRender.includes(path) || !onlyLsgRender.includes(path),
          LSG: !onlyNormalRender.includes(path) || onlyLsgRender.includes(path),
        })
      )
    );
    this.log(
      "Rendering took:",
      timer.measure("RENDERING-AND-WRITING", true),
      "s"
    );
    // #regionend  generate html and write to files

    this.log(
      "Processing files took collectively:",
      timer.measure("PROCESSING-FILES", true),
      "s"
    );
    this.log("Build end. took:", timer.measure("BUILD", true), "s");
    this.log("--------------------------------");
  }

  /**
   * extract information from handlebars file for the given path,
   * and memorize these information for future updates
   *
   * @param {string} path - absolute path to the .hbs file (which optionally can have front-matter)
   * @param {"COMPONENT" | "PAGE"} type - is it the template of a component or a page
   */
  async _processTemplate(path, type) {
    const filename = basename(path, ".hbs");

    // create and provide default properties for the template if they are not existing yet,
    // update some fields which do not need any processing
    this.templates[path] = {
      // list of all partials referenced in the hbs
      partials: [],
      // html output which was last generated.
      output: {
        /** @type {string|null} */
        NORMAL: null,
        /** @type {string|null} */
        LSG: null,
      },
      // list of handlebars pathExpressions (helper, partial, keys, values) in the hbs file
      /** @type {string[]} */
      pathExpressions: [],
      // optional name of the layout to be used with this template
      layout: "",
      /**
       * Handlebars ast returned when hbs file (without the front-matter part) is parsed
       * @type{hbs.AST.Program}
       */
      ast: null,
      // data extracted from the front-matter
      data: {},
      // fields from the last processing
      ...this.templates[path],
      /**
       * the templates belongs to a component or page
       * @type{"COMPONENT"|"PAGE"}
       */
      type,
      // absolute path to the .hbs file
      path,
      // name of the file without extension which is used for components as their partial name
      name: filename,
    };

    const { clearedMarkup, frontData } = await this._separateFrontAndTemplate(
      path
    );

    Object.assign(this.templates[path], {
      data: frontData,
      layout: frontData.layout,
    });

    const { ast, partials, pathExpressions, failed } = this._analyseHandlebars(
      clearedMarkup,
      path
    );
    if (failed) this.failedPaths.push(path);

    Object.assign(this.templates[path], {
      ast,
      partials,
      pathExpressions,
      render: this._getRenderFunction(ast, path),
    });

    // register components as partials
    if (type === "COMPONENT")
      Handlebars.registerPartial(filename, this.templates[path].ast);
  }

  /**
   * extracts information from handlebars file meant to be the "layout" for other components/pages
   * and memorize these information for future updates
   *
   * @param {string} path - path to .hbs files
   * @param {"NORMAL" | "LSG"} type - is it the layout for an stylemarkt component or a normal component/page
   * @memberof Assemble
   */
  async _processLayout(path, type) {
    const filename = basename(path, ".hbs");
    const markup = await asyncReadFile(path);
    const { ast, partials, pathExpressions, failed } = this._analyseHandlebars(
      markup,
      path
    );
    if (failed) this.failedPaths.push(path);

    this[type === "LSG" ? "lsgLayouts" : "layouts"][getName(path)] = {
      name: filename,
      path,
      partials,
      pathExpressions,
      ast,
      render: this._getRenderFunction(ast, path),
    };
  }

  async _render(
    path,
    {
      baseDir,
      componentsTargetDirectory,
      pagesTargetDirectory,
      lsgComponentsTargetDirectory,
    },
    layouts = { NORMAL: true, LSG: true }
  ) {
    const filename = basename(path, ".hbs");
    const relpath = relative(baseDir, path);
    const reldir = dirname(relpath);

    const tpl = this.templates[path];

    const curData = {
      ...this.dataPool,
      ...tpl.data,
    };

    const body = tpl.render(curData);
    if (tpl.layout && !this.layouts.hasOwnProperty(tpl.layout))
      console.warn(
        `[Assemble-Lite] no layout file was defined for "${tpl.layout}"`
      );

    if (tpl.type === "COMPONENT") {
      const writingJobs = [];
      if (layouts.NORMAL) {
        const layout = this.layouts[tpl.layout]
          ? this.layouts[tpl.layout].render(curData)
          : "";
        const html = layout ? layout.replace(/{%\s*body\s*%}/g, body) : body;
        // only write to disc when the value changes
        if (html !== tpl.output.NORMAL)
          writingJobs.push(
            asyncWriteFile(componentsTargetDirectory, reldir, filename, html)
          );

        tpl.output.NORMAL = html;
      }

      if (layouts.LSG) {
        const layout = this.lsgLayouts[tpl.layout]
          ? this.lsgLayouts[tpl.layout].render(curData)
          : "";
        const html = layout ? layout.replace(/{%\s*body\s*%}/g, body) : body;
        if (html !== tpl.output.LSG)
          writingJobs.push(
            asyncWriteFile(lsgComponentsTargetDirectory, reldir, filename, html)
          );
        tpl.output.LSG = html;
      }

      await Promise.all(writingJobs);
    }
    // for PAGE
    else {
      const layout = this.layouts[tpl.layout]
        ? this.layouts[tpl.layout].render(curData)
        : "";
      const html = layout ? layout.replace(/{%\s*body\s*%}/g, body) : body;
      if (html !== tpl.output.NORMAL)
        await asyncWriteFile(pagesTargetDirectory, reldir, filename, html);
      tpl.output.NORMAL = html;
    }
  }

  /**
   * loads and registers handlebar helper for the given paths
   *
   * @param {string[]} helperPaths - path of the helper files
   * @param {boolean} [loadCommonHandlebarsHelpers=false] - loads the helpers form "handlebars-helpers" package
   * @memberof Assemble
   */
  _loadHelpers(helperPaths, loadCommonHandlebarsHelpers = false) {
    if (loadCommonHandlebarsHelpers)
      Handlebars.registerHelper(handlebarsHelpers());

    helperPaths.forEach((path) => {
      try {
        // remove from cache incase the helper was modified during watch task.
        delete require.cache[path];
        const helperFn = require(path);
        Handlebars.registerHelper(helperFn);
        this.helpers[getName(path)] = { path, name: getName(path) };
      } catch (error) {
        console.error(
          `[Assemble-Lite] Failed reading handlebars helper ${basename(path)}`
        );
        console.error(error);
        // make sure on the next iteration, the helper is re-read,
        // so the user can't forget about this issue
        this.failedPaths.push(path);
      }
    });
  }

  /**
   * reads the content of the given json or yaml files and returns them combined
   *
   * @param {string[]} dataPaths - path of .json or .yaml files
   * @returns {Object}
   * @memberof Assemble
   */
  async _loadData(dataPaths) {
    const dataPool = {};

    await Promise.all(
      dataPaths.map(async (path) => {
        const ext = extname(path);
        const filename = basename(path, ext);
        try {
          if (ext === ".json") {
            dataPool[filename] = await readJson(path);
          } else if (ext === ".yaml" || ext === ".yml") {
            dataPool[filename] = safeLoad(await readFile(path, "utf-8"), {
              filename,
            });
          }
        } catch (error) {
          console.error(
            `[assemble-lite] Failed reading data file ${basename(path)}`
          );
          console.error(error);
          // make sure on the next iteration, the helper is re-read,
          // so the user can't forget about this issue (if it still exist)
          this.failedPaths.push(path);
        }
      })
    );
    return dataPool;
  }

  /**
   * extract front matter and handlebars template from hbs files
   *
   * @param {string} path
   * @returns {Object}
   * @memberof Assemble
   */
  async _separateFrontAndTemplate(path) {
    try {
      const fileContent = await asyncReadFile(path);
      const { clearedMarkup, ...frontData } = loadFront(fileContent, {
        contentKeyName: "clearedMarkup",
      });

      return {
        clearedMarkup,
        frontData,
      };
    } catch (error) {
      this.failedPaths.push(path);
      const errorMessage = `[assemble-lite] error reading front-matter from ${basename(
        path
      )}`;
      const errorMarkup = `<!-- ${errorMessage} -->`;
      console.error(errorMessage);
      console.error(error);

      return {
        clearedMarkup: errorMarkup,
        frontData: {},
      };
    }
  }

  // parses handlebars template and returns list of all partials and expressions used in it
  _analyseHandlebars(str, filename) {
    try {
      const ast = Handlebars.parse(str);

      const scanner = new Visitor();
      scanner.accept(ast);

      return {
        ast,
        partials: scanner.partials,
        pathExpressions: scanner.pathExpressions,
        failed: false,
      };
    } catch (error) {
      console.error();
      const errorMessage = `[assemble-lite] error parsing ${filename}.hbs`;
      const errorMarkup = `<!-- ${errorMessage} -->`;
      console.error(errorMessage);
      console.error(error);

      return {
        ast: Handlebars.parse(errorMarkup),
        partials: [],
        pathExpressions: [],
        failed: true,
      };
    }
  }

  /**
   * returns a fail safe function to be used for rendering a parsed handlebars template
   *
   * @param {hbs.AST.Program} ast - parsed hbs ast
   * @param {string} path - file path of the hbs file
   * @returns {Function}
   * @memberof Assemble
   */
  _getRenderFunction(ast, path) {
    const compiledTemplate = Handlebars.compile(ast);
    return (data) => {
      try {
        return compiledTemplate(data);
      } catch (error) {
        this.failedPaths.push(path);
        const errorMessage = `[assemble-lite] failed to render template for ${basename(
          path
        )}`;
        console.error(errorMessage);
        console.error(error);

        return `<!-- ${errorMessage} -->`;
      }
    };
  }

  /**
   * from the given object, remove entries which won't be represented by the provided path list
   *
   * @param {Object} obj
   * @param {string[]} paths
   * @param {Function} pathToKeyConverter - a function that returns the key used in the object corresponding to the filepath
   * @param {Function} [cb] - a function that will run on each obsolete item
   */
  _removeObsolete(obj, paths, pathToKeyConverter, cb) {
    const keys = paths.map(pathToKeyConverter);

    Object.keys(obj)
      .filter((key) => !keys.includes(key))
      .forEach((key) => {
        if (cb) cb(obj[key]);
        delete obj[key];
      });
  }
};
