import { DiagnosticSeverity, type Diagnostic, type Connection } from "vscode-languageserver/node";
import { type Range, TextDocument } from "vscode-languageserver-textdocument";
import * as Handlebars from "handlebars";
import * as yamlFront from "yaml-front-matter";
import { type YAMLException } from "js-yaml";
import { getFilePath, isPVArchetype } from "./helpers";
import SettingsService from "./SettingsService";

// is shown in the vscode ui, when user hovers on the marked error. To let them know what plugin has marked this as error.
const DIAGNOSTIC_SOURCE = "p!v Handlebars Language Server";

// Handlebars.parse has normal errors and also this type of error with exact position. e.g. for non matching close tag for block helpers.
type HandlebarsParseError = Error | Handlebars.Exception;
type YAMLParseError = Error | YAMLException;

// Highlights any parse errors in the handlebars or their yaml front matter
class DiagnosticProvide {
  connection!: Connection;
  public hasDiagnosticCapability!: boolean;

  init(currentConnection: Connection) {
    this.connection = currentConnection;
  }

  unsetDiagnostics(document: TextDocument) {
    if (this.hasDiagnosticCapability) this.connection!.sendDiagnostics({ uri: document.uri, diagnostics: [] });
  }

  // debounce showing errors. don't annoy the developer when they are still in the middle of typing.
  private diagnosticsDelay = 250; // ms
  private timeout?: NodeJS.Timeout;
  setDiagnostics(document: TextDocument) {
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(async () => {
      const settings = await SettingsService.getDocumentSettings(document.uri);
      if (settings.validateHandlebars && this.hasDiagnosticCapability)
        this.validateHandlebarsFile(document, this.connection!);
    }, this.diagnosticsDelay);
  }

  async validateHandlebarsFile(textDocument: TextDocument, connection: Connection) {
    const filePath = getFilePath(textDocument);
    if (!isPVArchetype(filePath)) return;

    let diagnostics: Diagnostic[] = [];

    const fileContent = textDocument.getText();
    let hbsContent = "";
    try {
      hbsContent = yamlFront.loadFront(fileContent).__content.trim();
    } catch (error) {
      const err = error as YAMLParseError;

      diagnostics.push({
        severity: DiagnosticSeverity.Error,
        range: this.getYamlErrorRange(err),
        message: err.message,
        source: DIAGNOSTIC_SOURCE,
      });
    }
    const hbsOffset = fileContent.split("\n").indexOf(hbsContent.split("\n")[0]);

    let err: HandlebarsParseError | null = null;

    try {
      Handlebars.parse(hbsContent);
    } catch (error) {
      err = error as HandlebarsParseError;

      diagnostics.push({
        severity: DiagnosticSeverity.Error,
        range: this.getHandlebarsErrorRange(err, hbsOffset),
        message: err.message,
        source: DIAGNOSTIC_SOURCE,
      });
    }

    connection.sendDiagnostics({
      uri: textDocument.uri,
      diagnostics,
    });
  }

  /**
   * depending on the HBS error, this returns the range for that error, taking into account the yaml front matter
   * @param {HandlebarsParseError} err - exception throng by `Handlebars.parse()`
   * @param {number} lineOffset - the line number for where the hbs starts (i.e. when file has front matter as well)
   * @returns {Range}
   */
  private getHandlebarsErrorRange(err: HandlebarsParseError, lineOffset: number = 0): Range {
    // handlebars specific exception with additional info
    if (err instanceof Handlebars.Exception) {
      // error lines start from 1. file lines start from 0.
      const errorLine = err.lineNumber! - 1 + lineOffset;

      // adjust the line number for the yaml front matter in the error message
      err.message = err.message.replace(String(err.lineNumber), String(errorLine + 1));

      return {
        start: {
          line: errorLine,
          character: err.column!,
        },
        end: {
          line: errorLine,
          character: err.endColumn!,
        },
      };
    }

    const message = err.message.split("\n")[0];
    const hbsParseErrorPattern = /Parse error on line (?<lineNumber>\d+):/;
    const match = message.match(hbsParseErrorPattern);
    if (match) {
      const errorLine = Number(match.groups!.lineNumber) - 1 + lineOffset;

      // adjust the line number for the yaml front matter in the error message
      err.message = err.message.replace(String(match.groups!.lineNumber), String(errorLine + 1));

      return {
        start: {
          line: errorLine,
          character: 0,
        },
        end: {
          line: errorLine,
          character: 1_000,
        },
      };
    }

    // for unknown type of parse error, mark the start of the file only
    return { start: { line: lineOffset, character: 0 }, end: { line: lineOffset, character: 0 } };
  }

  private getYamlErrorRange(err: YAMLParseError) {
    if (err.name === "YAMLException") {
      const yamlError = err as YAMLException;
      err.message = "[YAML] " + yamlError.reason;
      return {
        start: {
          // add 1 line for the "---" at the start of the file
          line: yamlError.mark.line + 1,
          character: yamlError.mark.column,
        },
        end: {
          line: yamlError.mark.line + 1,
          character: yamlError.mark.column,
        },
      };
    }

    err.message = "[YAML] " + err.message;
    // any other TypeError
    return {
      start: { line: 0, character: 0 },
      end: { line: 0, character: 0 },
    };
  }
}

export default new DiagnosticProvide();
