import { HighlightOptions } from "highlight.js";
import hljs from "highlight.js/lib/core";
import xml from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import scss from "highlight.js/lib/languages/scss";
import json from "highlight.js/lib/languages/json";
import javascript from "highlight.js/lib/languages/javascript";
import hbs from "highlight.js/lib/languages/handlebars";

class SyntaxHighlightService {
  constructor() {
    hljs.registerLanguage("html", xml);
    hljs.registerLanguage("css", css);
    hljs.registerLanguage("scss", scss);
    hljs.registerLanguage("json", json);
    hljs.registerLanguage("javascript", javascript);
    hljs.registerLanguage("hbs", hbs);
    hljs.highlightAll();
  }

  public highlightMarkup(markup: string, options: HighlightOptions): string {
    return hljs.highlight(markup, options).value;
  }
}

export default new SyntaxHighlightService();
