import {
  createConnection,
  TextDocuments,
  ProposedFeatures,
  InitializeParams,
  DidChangeConfigurationNotification,
  CompletionItem,
  TextDocumentPositionParams,
  TextDocumentSyncKind,
} from "vscode-languageserver/node";
import { TextDocument } from "vscode-languageserver-textdocument";

import SettingsService from "./SettingsService";
import DiagnosticProvide from "./diagnosticProvider";
import { definitionProvider } from "./definitionProvider";
import { completionProvider } from "./completionProvider";
import { hoverProvider } from "./hoverProvider";
import { getFilePath } from "./helpers";

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = createConnection(ProposedFeatures.all);
SettingsService.init(connection);
DiagnosticProvide.init(connection);

// Create a simple text document manager.
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);
// a list of currently opened documents, by tracking the close and open/content events
const openDocuments = new Set<TextDocument>();

connection.onInitialize((params: InitializeParams) => {
  DiagnosticProvide.hasDiagnosticCapability = !!params.capabilities.textDocument?.publishDiagnostics;

  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      // Tell the client that this server supports code completion.
      completionProvider: {
        resolveProvider: false,
        triggerCharacters: [
          "@", // e.g. `{{@root`
          ".", // e.g. `{{@root."
          '"', // e.g. `class="`
          " ", // e.g. `class="foo "`
          // other characters or positions (e.g. parameter of a partial) is already a trigger character from vscode,
          // adding letters here would allow auto completion for renaming class names,
          // but would trigger a call to the completionProvider on each key stroke instead of re-using the old results
          // which isn't performant
        ],
      },
      // supports goto definition
      definitionProvider: true,
      // supports hover tooltips
      hoverProvider: true,
      diagnosticProvider: {
        interFileDependencies: false,
        workspaceDiagnostics: false,
      },
      workspaceFolders: { supported: true },
    },
  };
});

connection.onInitialized(() => {
  // Register for all configuration changes.
  connection.client.register(DidChangeConfigurationNotification.type, undefined);
});

connection.onDidChangeConfiguration(_change => {
  SettingsService.clearDocumentSettingsCache();

  // update diagnostics info for the open files
  openDocuments.forEach(async document => {
    const settings = await SettingsService.getDocumentSettings(document.uri);
    if (settings.validateHandlebars) DiagnosticProvide.setDiagnostics(document);
    else DiagnosticProvide.unsetDiagnostics(document);
  });
});

// This handler provides the initial list of the completion items.
connection.onCompletion(async (textDocumentPosition: TextDocumentPositionParams): Promise<CompletionItem[] | null> => {
  const document = documents.get(textDocumentPosition.textDocument.uri);

  if (document) {
    const filePath = getFilePath(document);
    if (filePath) return completionProvider(document, textDocumentPosition.position, filePath);
  }
  return null;
});

connection.onHover(async ({ textDocument, position }) => {
  const document = documents.get(textDocument.uri);
  const settings = await SettingsService.getDocumentSettings(textDocument.uri);

  if (document && settings.showHoverInfo) return hoverProvider(document, position);

  return null;
});

connection.onDefinition(({ textDocument, position }) => {
  const document = documents.get(textDocument.uri);

  if (document) {
    const filePath = getFilePath(document);
    if (filePath) return definitionProvider(document, position, filePath);
  }

  return null;
});

// is called when the file is first opened and every time it is modified
// only supporting push diagnostics
documents.onDidChangeContent(change => {
  const document = change.document;
  DiagnosticProvide.setDiagnostics(document);
  openDocuments.add(document);
});

// a document has closed: clear all diagnostics
documents.onDidClose(event => {
  DiagnosticProvide.unsetDiagnostics(event.document);
  openDocuments.delete(event.document);
});

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
