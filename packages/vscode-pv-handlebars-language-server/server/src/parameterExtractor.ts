import * as Handlebars from "handlebars";

import { BUILD_IN_HELPERS, handlebarsHelpersNames, pvHandlebarsHelperNames } from "./hbsHelpers";

// extracts expressions parameter names in a hbs template string
class Visitor extends Handlebars.Visitor {
  // parameters used in the template. e.g. `<p>{{param}}</p>`
  public parameters: Set<string> = new Set<string>();
  // partials used in the template. e.g. `{{> partial-name}}
  public partials: Set<string> = new Set<string>();
  // ignore any expression which has a depth other than the desired depth. e.g. `{{../param}}`
  private depth: number;

  constructor(depth = 0) {
    super();
    this.depth = depth;
  }

  // {{#helper}}...{{/helper}}
  BlockStatement(block: hbs.AST.BlockStatement): void {
    if (block.path.parts[0] === "each" || block.path.parts[0] === "with") {
      const scanner = new Visitor(this.depth + 1);
      scanner.accept(block.program);
      this.parameters = new Set([...this.parameters, ...scanner.parameters]);
      // no need to further traverse this subtree which was already handled with the given depth.
      // Handlebars visitor.accept checks if the `program` is falsy, and ignores it
      // @ts-ignore
      block.program = null;
    }

    super.BlockStatement(block);
  }

  // {{> partial param}}
  PartialStatement(partial: hbs.AST.PartialStatement): void {
    // not SubExpression
    if (partial.name.type === "PathExpression") this.partials.add(partial.name.original);

    super.PartialStatement(partial);
  }

  // {{#> partial param}} ... {{/partial}}
  PartialBlockStatement(partial: hbs.AST.PartialBlockStatement): void {
    if (partial.name.type === "PathExpression") this.partials.add(partial.name.original);

    super.PartialBlockStatement(partial);
  }

  // {{exp}} , {{> helper key=exp2}}
  PathExpression(path: hbs.AST.PathExpression): void {
    const name = path.parts[0];
    // ignore having @data such as @key or when reading props from parent context (e.g. `../../label`)
    if (!this.partials.has(name) && !path.data && path.depth === this.depth) {
      // ignore expression which probably are the helper names
      if (![...BUILD_IN_HELPERS, ...handlebarsHelpersNames, ...pvHandlebarsHelperNames].includes(name))
        this.parameters.add(name);
    }
    super.PathExpression(path);
  }
}

/**
 * extract list of variables used in expressions in the given template which can be called the parameters which the template uses.
 *
 * @param {string} template - handlebars template
 * @returns {string[]}
 *
 * @example
 *   getParameters("{{foo}} {{#if bar}}{{> partial}}{{/if}}") // = ["foo", "bar"]
 */
export function getParameters(template: string): string[] {
  const ast = Handlebars.parse(template);
  const scanner = new Visitor();
  scanner.accept(ast);

  return Array.from(scanner.parameters);
}
