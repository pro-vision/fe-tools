const Handlebars = require("handlebars");

// a simple class to extract used partial and expression when traversing a handlebars ast
module.exports = class Visitor extends Handlebars.Visitor {
  constructor() {
    super();
    this.partials = [];
    this.pathExpressions = [];
  }

  // @overrides
  PartialStatement(partial) {
    // add partial to the list, ignore duplicates
    if (!this.partials.includes(partial.name.original))
      this.partials.push(partial.name.original);

    super.PartialStatement(partial);
  }

  // @overrides
  PartialBlockStatement(partial) {
    if (!this.partials.includes(partial.name.original))
      this.partials.push(partial.name.original);

    super.PartialBlockStatement(partial);
  }

  // @overrides
  PathExpression(pathExpression) {
    // @root.foo.bar will each be one part
    pathExpression.parts.forEach((expression) => {
      if (!this.pathExpressions.includes(expression))
        this.pathExpressions.push(expression);
    });

    super.PathExpression(pathExpression);
  }
};
