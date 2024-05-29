import { Logger } from '../utils/logger'
import { KEYWORDS, IToken, TokenType } from './lexer.interface'

/**
 * Lexer Object
 */
export class Lexer {
  /**
   * tokenizer fnc
   * @param sourceCode - source code string
   * @returns tokens array
   */
  public tokenize(sourceCode: string): IToken[] {
    /** tokens to store splited source code strings */
    const tokens = new Array<IToken>()
    const src: string[] = sourceCode.split('')

    // build each token until end of file
    while (src.length > 0) {
      // BEGIN PARSING ONE CHARACTER TOKENS
      if (src[0] == '(') {
        tokens.push(this.token(src.shift(), TokenType.OpenParen))
      } else if (src[0] == ')') {
        tokens.push(this.token(src.shift(), TokenType.CloseParen))
      } // HANDLE BINARY OPERATORS
      else if (src[0] == '+' || src[0] == '-' || src[0] == '*' || src[0] == '/' || src[0] == '%') {
        tokens.push(this.token(src.shift(), TokenType.BinaryOperator))
      } // Handle Conditional & Assignment Tokens
      else if (src[0] == '=') {
        tokens.push(this.token(src.shift(), TokenType.Equals))
      } else if (src[0] == ';') {
        tokens.push(this.token(src.shift(), TokenType.Semicolon))
      } // HANDLE MULTICHARACTER KEYWORDS, TOKENS, IDENTIFIERS ETC...
      else {
        // Handle numeric literals -> Integers
        if (this.isInt(src[0])) {
          let num = ''
          while (src.length > 0 && this.isInt(src[0])) {
            num += src.shift()
          }

          // append new numeric token.
          tokens.push(this.token(num, TokenType.Number))
        } // Handle Identifier & Keyword Tokens.
        else if (this.isAlpha(src[0])) {
          let ident = ''
          while (src.length > 0 && this.isAlpha(src[0])) {
            ident += src.shift()
          }

          // CHECK FOR RESERVED KEYWORDS
          const reserved = KEYWORDS[ident]
          // If value is not undefined then the identifier is
          // reconized keyword
          if (typeof reserved == 'number') {
            tokens.push(this.token(ident, reserved))
          } else {
            // Unreconized name must mean user defined symbol.
            tokens.push(this.token(ident, TokenType.Identifier))
          }
        } else if (this.isSkippable(src[0])) {
          // Skip uneeded chars.
          src.shift()
        } // Handle unreconized characters.
        // TODO: Impliment better errors and error recovery.
        else {
          console.error('Unreconized character found in source: ', src[0].charCodeAt(0), src[0])
          process.exit(1)
        }
      }
    }

    tokens.push({ value: 'EndOfFile', type: TokenType.EOF })
    return tokens
  }

  private token(value: string = '', type: TokenType): IToken {
    return { value, type }
  }

  private isAlpha(src: string): boolean {
    return src.toUpperCase() != src.toLowerCase()
  }

  private isInt(str: string): boolean {
    const c = str.charCodeAt(0)
    const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)]
    return c >= bounds[0] && c <= bounds[1]
  }

  private isSkippable(str: string): boolean {
    return str == ' ' || str == '\n' || str == '\t'
  }
}
