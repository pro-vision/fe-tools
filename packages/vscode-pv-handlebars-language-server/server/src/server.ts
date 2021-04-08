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

import { definitionProvider } from "./definitionProvider";
import { completionProvider } from "./completionProvider";
import { hoverProvider } from "./hoverProvider";
import { getFilePath } from "./helpers";

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager.
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

// The LS settings
interface Settings {
  showHoverInfo: number;
}
// Cache the settings of all open documents
const documentSettings: Map<string, Thenable<Settings>> = new Map<string, Thenable<Settings>>();
function getDocumentSettings(resource: string): Thenable<Settings> {
  let result = documentSettings.get(resource);
  if (!result) {
    result = connection.workspace.getConfiguration({
      scopeUri: resource,
      section: "P!VHandlebarsLanguageServer",
    });
    documentSettings.set(resource, result);
  }
  return result;
}

connection.onInitialize((_params: InitializeParams) => {
  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      // Tell the client that this server supports code completion.
      completionProvider: { resolveProvider: false },
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
  // Reset all cached document settings
  documentSettings.clear();
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
  const settings = await getDocumentSettings(textDocument.uri);

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
