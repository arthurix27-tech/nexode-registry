/**
 * Luau Parser - A simple parser for Luau syntax.
 * This is a basic implementation for demonstration purposes.
 */

export type TokenType =
  | 'Keyword'
  | 'Identifier'
  | 'String'
  | 'Number'
  | 'Operator'
  | 'Punctuation'
  | 'Comment'
  | 'Whitespace';

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

export interface AstNode {
  type: string;
  value?: string;
  children?: AstNode[];
  line?: number;
  column?: number;
}

// Luau keywords
const keywords = new Set([
  'and', 'break', 'do', 'else', 'elseif', 'end', 'false', 'for', 'function',
  'goto', 'if', 'in', 'local', 'nil', 'not', 'or', 'repeat', 'return', 'then',
  'true', 'until', 'while', 'continue', 'type', 'typeof', 'export', 'as'
]);

// Luau operators
const operators = new Set(['+', '-', '*', '/', '%', '^', '==', '~=', '<=', '>=', '<', '>', 'and', 'or', 'not']);

// Luau punctuation
const punctuation = new Set(['(', ')', '{', '}', '[', ']', '=', ',', ';', ':', '.', '...']);

/**
 * Tokenize Luau source code.
 */
export function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let current = 0;
  let line = 1;
  let column = 1;

  while (current < source.length) {
    const char = source[current];

    // Handle newlines
    if (char === '\n') {
      line++;
      column = 1;
      current++;
      continue;
    }

    // Handle whitespace
    if (\t /\s/.test(char)) {
      const start = current;
      while (current < source.length && \t /\s/.test(source[current])) {
        current++;
        column++;
      }
      tokens.push({
        type: 'Whitespace',
        value: source.substring(start, current),
        line,
        column: column - (current - start),
      });
      continue;
    }

    // Handle comments
    if (char === '-' && source[current + 1] === '-') {
      const start = current;
      if (source[current + 2] === '[') {
        // Block comment
        current += 3;
        column += 3;
        while (current < source.length) {
          if (source[current] === ']' && source[current + 1] === ']') {
            current += 2;
            column += 2;
            break;
          }
          if (source[current] === '\n') {
            line++;
            column = 1;
          } else {
            column++;
          }
          current++;
        }
        tokens.push({
          type: 'Comment',
          value: source.substring(start, current),
          line,
          column: column - (current - start),
        });
      } else {
        // Line comment
        while (current < source.length && source[current] !== '\n') {
          current++;
          column++;
        }
        tokens.push({
          type: 'Comment',
          value: source.substring(start, current),
          line,
          column: column - (current - start),
        });
      }
      continue;
    }

    // Handle strings
    if (char === '"' || char === "'") {
      const quote = char;
      const start = current;
      current++;
      column++;
      while (current < source.length && source[current] !== quote) {
        if (source[current] === '\\') {
          current++;
          column++;
        }
        if (source[current] === '\n') {
          line++;
          column = 1;
        } else {
          column++;
        }
        current++;
      }
      if (current < source.length) {
        current++;
        column++;
      }
      tokens.push({
        type: 'String',
        value: source.substring(start, current),
        line,
        column: column - (current - start),
      });
      continue;
    }

    // Handle numbers
    if (/\d/.test(char)) {
      const start = current;
      while (current < source.length && /[\d.]/.test(source[current])) {
        current++;
        column++;
      }
      tokens.push({
        type: 'Number',
        value: source.substring(start, current),
        line,
        column: column - (current - start),
      });
      continue;
    }

    // Handle identifiers and keywords
    if (/[a-zA-Z_]/.test(char)) {
      const start = current;
      while (current < source.length && /[a-zA-Z0-9_]/.test(source[current])) {
        current++;
        column++;
      }
      const value = source.substring(start, current);
      tokens.push({
        type: keywords.has(value) ? 'Keyword' : 'Identifier',
        value,
        line,
        column: column - (current - start),
      });
      continue;
    }

    // Handle operators
    if (operators.has(char) || (char === '~' && source[current + 1] === '=')) {
      const start = current;
      if (char === '~' && source[current + 1] === '=') {
        current += 2;
        column += 2;
      } else if (char === '<' && source[current + 1] === '=') {
        current += 2;
        column += 2;
      } else if (char === '>' && source[current + 1] === '=') {
        current += 2;
        column += 2;
      } else if (char === '=' && source[current + 1] === '=') {
        current += 2;
        column += 2;
      } else {
        current++;
        column++;
      }
      tokens.push({
        type: 'Operator',
        value: source.substring(start, current),
        line,
        column: column - (current - start),
      });
      continue;
    }

    // Handle punctuation
    if (punctuation.has(char)) {
      const start = current;
      if (char === '.' && source[current + 1] === '.' && source[current + 2] === '.') {
        current += 3;
        column += 3;
      } else {
        current++;
        column++;
      }
      tokens.push({
        type: 'Punctuation',
        value: source.substring(start, current),
        line,
        column: column - (current - start),
      });
      continue;
    }

    // Unknown character
    current++;
    column++;
  }

  return tokens;
}

/**
 * Parse tokens into an AST.
 */
export function parse(tokens: Token[]): AstNode {
  // This is a simplified parser for demonstration
  // A full Luau parser would be much more complex
  const root: AstNode = { type: 'Program', children: [] };

  let index = 0;
  while (index < tokens.length) {
    const token = tokens[index];

    // Skip whitespace and comments
    if (token.type === 'Whitespace' || token.type === 'Comment') {
      index++;
      continue;
    }

    // Handle local declarations
    if (token.type === 'Keyword' && token.value === 'local') {
      const localNode: AstNode = { type: 'LocalDeclaration', children: [], line: token.line, column: token.column };
      index++;

      // Parse identifiers
      while (index < tokens.length && tokens[index].type === 'Identifier') {
        localNode.children?.push({
          type: 'Identifier',
          value: tokens[index].value,
          line: tokens[index].line,
          column: tokens[index].column,
        });
        index++;

        // Handle assignment
        if (index < tokens.length && tokens[index].type === 'Operator' && tokens[index].value === '=') {
          index++;
          // Parse expression (simplified)
          if (index < tokens.length) {
            localNode.children?.push({
              type: 'Assignment',
              children: [{
                type: 'Expression',
                value: tokens[index].value,
                line: tokens[index].line,
                column: tokens[index].column,
              }],
            });
            index++;
          }
        }

        if (index < tokens.length && tokens[index].value === ',') {
          index++;
        } else {
          break;
        }
      }

      root.children?.push(localNode);
      continue;
    }

    // Handle function declarations
    if (token.type === 'Keyword' && token.value === 'function') {
      const funcNode: AstNode = { type: 'FunctionDeclaration', children: [], line: token.line, column: token.column };
      index++;

      // Parse function name
      if (index < tokens.length && tokens[index].type === 'Identifier') {
        funcNode.children?.push({
          type: 'Identifier',
          value: tokens[index].value,
          line: tokens[index].line,
          column: tokens[index].column,
        });
        index++;
      }

      // Parse parameters
      if (index < tokens.length && tokens[index].value === '(') {
        index++;
        const params: AstNode = { type: 'Parameters', children: [] };

        while (index < tokens.length && tokens[index].value !== ')') {
          if (tokens[index].type === 'Identifier') {
            params.children?.push({
              type: 'Parameter',
              value: tokens[index].value,
              line: tokens[index].line,
              column: tokens[index].column,
            });
            index++;
          }

          if (index < tokens.length && tokens[index].value === ',') {
            index++;
          }
        }

        if (index < tokens.length && tokens[index].value === ')') {
          index++;
        }

        funcNode.children?.push(params);
      }

      // Parse body
      if (index < tokens.length && tokens[index].value === '{') {
        index++;
        const body: AstNode = { type: 'Block', children: [] };

        while (index < tokens.length && tokens[index].value !== '}') {
          // Recursively parse statements (simplified)
          if (tokens[index].type === 'Keyword' || tokens[index].type === 'Identifier') {
            body.children?.push({
              type: 'Statement',
              value: tokens[index].value,
              line: tokens[index].line,
              column: tokens[index].column,
            });
          }
          index++;
        }

        if (index < tokens.length && tokens[index].value === '}') {
          index++;
        }

        funcNode.children?.push(body);
      }

      root.children?.push(funcNode);
      continue;
    }

    // Default: add as a statement
    root.children?.push({
      type: 'Statement',
      value: token.value,
      line: token.line,
      column: token.column,
    });
    index++;
  }

  return root;
}
