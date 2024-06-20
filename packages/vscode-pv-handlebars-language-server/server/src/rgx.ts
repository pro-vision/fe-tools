export default {
  ts: {
    // `@uiElements(".optional` | `@uiElement("`
    endsWithUiDecoratorSelector: () => /@uiElements?\("[^"]*\.?$/,
    // `@uiElements(".selector") ctas`
    uiDecoratorPropertyName: () => /@uiElements?\(.+?\)\s*(?<ui>[_$a-zA-Z0-9]+)/,
    // `@uiEvent("optional` | `@uiEvent<T>("`
    endsWithEventDecoratorElementName: () => /@uiEvent(\<.*\>)?\("[^"]*$/,
    // @eventListener({ ... target: "optional
    endsWithEventListenerDecoratorTarget: () => /@eventListener\({[^}]*target:\s*"[^"]*$/,
  },
  hbs: {
    // `<some-tag class="className {{#if foo}}className2{{/if}}"`
    classNamesAndTags: () => /<(?<tagName>[a-zA-Z0-9_-]+)[^>]*?(class="(?<className>[^"]*))?"/,
    // {{#> some-partial
    partials: () => /{{#?>\s*(?<partial>[-_a-zA-Z0-9]+)/g,
  },
};
