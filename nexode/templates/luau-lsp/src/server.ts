import {
  createConnection,
  TextDocuments,
  ProposedFeatures,
  InitializeResult,
  TextDocumentSyncKind,
  CompletionItem,
  CompletionItemKind,
  Hover,
  Definition,
  ReferenceParams,
  Location,
} from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';

// Create a connection for the server
const connection = createConnection(ProposedFeatures.all);
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

// Simple in-memory store for Luau symbols (for demonstration)
const luauSymbols: Record<string, { type: string; description: string; file: string; line: number }> = {
  'print': { type: 'function', description: 'Prints values to the console', file: 'builtin', line: 0 },
  'tostring': { type: 'function', description: 'Converts a value to a string', file: 'builtin', line: 0 },
  'table': { type: 'table', description: 'Table manipulation functions', file: 'builtin', line: 0 },
  'string': { type: 'table', description: 'String manipulation functions', file: 'builtin', line: 0 },
};

// Add Luau-specific keywords
const luauKeywords = [
  'and', 'break', 'do', 'else', 'elseif', 'end', 'false', 'for', 'function',
  'goto', 'if', 'in', 'local', 'nil', 'not', 'or', 'repeat', 'return', 'then',
  'true', 'until', 'while', 'continue', 'type', 'typeof', 'export', 'as'
];

// Initialize the language server
connection.onInitialize(() => {
  const result: InitializeResult = {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      completionProvider: {
        resolveProvider: true,
        triggerCharacters: ['.', ':'],
      },
      hoverProvider: true,
      definitionProvider: true,
      referencesProvider: true,
    },
  };
  return result;
});

// Handle document open/change/close
documents.listen(connection);

// Provide completion items
connection.onCompletion((textDocumentPosition) => {
  const text = documents.get(textDocumentPosition.textDocument.uri)?.getText() || '';
  const position = textDocumentPosition.position;
  const line = text.split('\n')[position.line];
  const prefix = line.substring(0, position.character);

  // Match the current word or symbol
  const wordMatch = prefix.match(/([a-zA-Z_][a-zA-Z0-9_]*)?$/);
  const currentWord = wordMatch ? wordMatch[1] : '';

  // Filter symbols based on the current word
  const completions: CompletionItem[] = [];

  // Add keywords
  for (const keyword of luauKeywords) {
    if (keyword.startsWith(currentWord)) {
      completions.push({
        label: keyword,
        kind: CompletionItemKind.Keyword,
        detail: 'Luau keyword',
      });
    }
  }

  // Add built-in symbols
  for (const [name, symbol] of Object.entries(luauSymbols)) {
    if (name.startsWith(currentWord)) {
      completions.push({
        label: name,
        kind: symbol.type === 'function' ? CompletionItemKind.Function : CompletionItemKind.Class,
        detail: symbol.description,
      });
    }
  }

  return completions;
});

// Provide hover information
connection.onHover((textDocumentPosition) => {
  const text = documents.get(textDocumentPosition.textDocument.uri)?.getText() || '';
  const position = textDocumentPosition.position;
  const line = text.split('\n')[position.line];

  // Match the word at the current position
  const wordMatch = line.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || [];
  const wordAtPos = wordMatch.find((word, index, arr) => {
    const prevWords = arr.slice(0, index);
    const prevLength = prevWords.reduce((sum, w) => sum + w.length, 0);
    const spacesBefore = line.substring(0, position.character).split(/\S+/).length - 1;
    return spacesBefore === index;
  });

  if (wordAtPos && luauSymbols[wordAtPos]) {
    const symbol = luauSymbols[wordAtPos];
    return {
      contents: {
        kind: 'markdown',
        value: `**${wordAtPos}**\n\n${symbol.description}`,
      },
    } as Hover;
  }

  return null;
});

// Provide go-to-definition
connection.onDefinition((textDocumentPosition) => {
  const text = documents.get(textDocumentPosition.textDocument.uri)?.getText() || '';
  const position = textDocumentPosition.position;
  const line = text.split('\n')[position.line];

  // Match the word at the current position
  const wordMatch = line.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || [];
  const wordAtPos = wordMatch.find((word, index, arr) => {
    const prevWords = arr.slice(0, index);
    const prevLength = prevWords.reduce((sum, w) => sum + w.length, 0);
    const spacesBefore = line.substring(0, position.character).split(/\S+/).length - 1;
    return spacesBefore === index;
  });

  if (wordAtPos && luauSymbols[wordAtPos]) {
    const symbol = luauSymbols[wordAtPos];
    return {
      uri: textDocumentPosition.textDocument.uri,
      range: {
        start: { line: symbol.line, character: 0 },
        end: { line: symbol.line, character: 0 },
      },
    } as Location;
  }

  return null;
});

// Provide find-references
connection.onReferences((referenceParams: ReferenceParams) => {
  const text = documents.get(referenceParams.textDocument.uri)?.getText() || '';
  const position = referenceParams.position;
  const line = text.split('\n')[position.line];

  // Match the word at the current position
  const wordMatch = line.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || [];
  const wordAtPos = wordMatch.find((word, index, arr) => {
    const prevWords = arr.slice(0, index);
    const prevLength = prevWords.reduce((sum, w) => sum + w.length, 0);
    const spacesBefore = line.substring(0, position.character).split(/\S+/).length - 1;
    return spacesBefore === index;
  });

  if (wordAtPos && luauSymbols[wordAtPos]) {
    // For built-ins, return an empty array (no references in the current file)
    return [];
  }

  return [];
});

// Start the server
connection.listen();
