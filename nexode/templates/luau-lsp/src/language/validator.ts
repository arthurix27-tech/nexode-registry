/**
 * Luau Validator - Validates Luau code for syntax errors and semantic issues.
 */

import { Token, tokenize } from './parser';

export interface Diagnostic {
  severity: 'error' | 'warning' | 'info' | 'hint';
  message: string;
  line: number;
  column: number;
  length?: number;
}

export interface ValidationResult {
  valid: boolean;
  diagnostics: Diagnostic[];
}

/**
 * Validate Luau source code.
 */
export function validate(source: string): ValidationResult {
  const diagnostics: Diagnostic[] = [];

  try {
    // Tokenize the source
    const tokens = tokenize(source);

    // Check for basic syntax errors
    diagnostics.push(...validateSyntax(tokens));

    // Check for semantic issues
    diagnostics.push(...validateSemantics(tokens));

    return {
      valid: diagnostics.length === 0,
      diagnostics,
    };
  } catch (error) {
    // Handle parsing errors
    diagnostics.push({
      severity: 'error',
      message: `Failed to parse: ${error instanceof Error ? error.message : String(error)}`,
      line: 1,
      column: 1,
    });

    return {
      valid: false,
      diagnostics,
    };
  }
}

/**
 * Validate syntax (e.g., matching brackets, proper statements).
 */
function validateSyntax(tokens: Token[]): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const stack: { type: string; token: Token }[] = [];

  for (const token of tokens) {
    // Skip whitespace and comments
    if (token.type === 'Whitespace' || token.type === 'Comment') {
      continue;
    }

    // Check for matching brackets
    if (token.value === '(' || token.value === '{' || token.value === '[') {
      stack.push({ type: token.value, token });
    } else if (token.value === ')' || token.value === '}' || token.value === ']') {
      const last = stack.pop();
      if (!last) {
        diagnostics.push({
          severity: 'error',
          message: `Unmatched closing '${token.value}'`,
          line: token.line,
          column: token.column,
        });
        continue;
      }

      const matchingPairs: Record<string, string> = {
        '(': ')',
        '{': '}',
        '[': ']',
      };

      if (matchingPairs[last.type] !== token.value) {
        diagnostics.push({
          severity: 'error',
          message: `Expected '${matchingPairs[last.type]}' but found '${token.value}'`,
          line: token.line,
          column: token.column,
        });
      }
    }
  }

  // Check for unclosed brackets
  for (const item of stack) {
    diagnostics.push({
      severity: 'error',
      message: `Unclosed '${item.type}'`,
      line: item.token.line,
      column: item.token.column,
    });
  }

  return diagnostics;
}

/**
 * Validate semantics (e.g., undefined variables, type mismatches).
 */
function validateSemantics(tokens: Token[]): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const declaredVariables = new Set<string>();
  const usedVariables = new Set<string>();

  // Track current scope
  let inFunction = false;
  let currentFunctionParams: string[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    // Skip whitespace and comments
    if (token.type === 'Whitespace' || token.type === 'Comment') {
      continue;
    }

    // Handle local declarations
    if (token.type === 'Keyword' && token.value === 'local') {
      // Parse variable declarations
      let j = i + 1;
      while (j < tokens.length && tokens[j].type === 'Identifier') {
        declaredVariables.add(tokens[j].value);
        j++;

        // Skip assignment
        if (j < tokens.length && tokens[j].value === '=') {
          j++;
          // Skip expression (simplified)
          while (j < tokens.length && tokens[j].value !== ',' && tokens[j].value !== ';') {
            j++;
          }
        }

        if (j < tokens.length && tokens[j].value === ',') {
          j++;
        } else {
          break;
        }
      }
      i = j - 1;
      continue;
    }

    // Handle function declarations
    if (token.type === 'Keyword' && token.value === 'function') {
      inFunction = true;
      currentFunctionParams = [];

      // Parse function name
      if (i + 1 < tokens.length && tokens[i + 1].type === 'Identifier') {
        declaredVariables.add(tokens[i + 1].value);
      }

      // Parse parameters
      if (i + 2 < tokens.length && tokens[i + 2].value === '(') {
        let j = i + 3;
        while (j < tokens.length && tokens[j].value !== ')') {
          if (tokens[j].type === 'Identifier') {
            currentFunctionParams.push(tokens[j].value);
            declaredVariables.add(tokens[j].value);
          }
          j++;
        }
        i = j;
      }
      continue;
    }

    // Handle end of function
    if (token.value === 'end' && inFunction) {
      inFunction = false;
      currentFunctionParams = [];
    }

    // Track variable usage
    if (token.type === 'Identifier') {
      usedVariables.add(token.value);

      // Check for undefined variables (simplified)
      if (!declaredVariables.has(token.value) && !isLuauBuiltin(token.value)) {
        diagnostics.push({
          severity: 'warning',
          message: `Variable '${token.value}' may not be defined`,
          line: token.line,
          column: token.column,
          length: token.value.length,
        });
      }
    }
  }

  return diagnostics;
}

/**
 * Check if a variable is a Luau built-in.
 */
function isLuauBuiltin(name: string): boolean {
  const builtins = new Set([
    // Built-in functions
    'print', 'tostring', 'tonumber', 'type', 'typeof', 'assert', 'error',
    'ipairs', 'pairs', 'next', 'select', 'unpack', 'coroutine',
    'pcall', 'xpcall', 'load', 'loadstring', 'dofile', 'loadfile',

    // Built-in tables
    'table', 'string', 'math', 'io', 'os', 'debug',

    // Built-in values
    'nil', 'true', 'false',
  ]);

  return builtins.has(name);
}
