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
import { definitionProvider } from "./definitionProvider";
import { completionProvider } from "./completionProvider";
import { hoverProvider } from "./hoverProvider";
import { getFilePath } from "./helpers";

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = createConnection(ProposedFeatures.all);
SettingsService.init(connection);

// Create a simple text document manager.
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

connection.onInitialize((_params: InitializeParams) => {
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
});

// This handler provides the initial list of the completion items.
connection.onCompletion(
  async (textDocumentPosition: TextDocumentPositionParams): Promise<CompletionItem[] | null> => {
    const document = documents.get(textDocumentPosition.textDocument.uri);

    if (document) {
      const filePath = getFilePath(document);
      if (filePath) return completionProvider(document, textDocumentPosition.position, filePath);
    }
    return null;
  },
);

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

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
