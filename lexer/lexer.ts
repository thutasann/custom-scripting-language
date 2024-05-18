import { KEYWORDS, Token, TokenType } from './lexer.interface'

export class Lexer {
  /**
   * Tokenize function
   * @param sourceCode - source code string
   */
  public tokenize(sourceCode: string): Token[] {
    const tokens = new Array<Token>()
    const src: string[] = sourceCode.split('')

    // build each token until end of file
    while (src.length > 0) {
      if (src[0] == '(') {
        tokens.push(this.token(src.shift(), TokenType.OpenParen))
      } else if (src[0] == ')') {
        tokens.push(this.token(src.shift(), TokenType.CloseParen))
      } else if (src[0] == '+' || src[0] == '-' || src[0] == '*' || src[0] == '/') {
        tokens.push(this.token(src.shift(), TokenType.BinaryOperator))
      } else if (src[0] == '=') {
        tokens.push(this.token(src.shift(), TokenType.Equals))
      } else {
        // handling multi character tokens
        if (this.isInt(src[0])) {
          let num = ''
          while (src.length > 0 && this.isInt(src[0])) {
            num += src.shift()
          }

          tokens.push(this.token(num, TokenType.Number))
        } else if (this.isAlpha(src[0])) {
          let ident = '' // foo let
          while (src.length > 0 && this.isAlpha(src[0])) {
            ident += src.shift()
          }

          // check for reserved keywords
          const reserved = KEYWORDS[ident]
          if (reserved === undefined) {
            tokens.push(this.token(ident, TokenType.Identifier))
          } else {
            tokens.push(this.token(ident, reserved))
          }
        } else if (this.isSkippable(src[0])) {
          src.shift() // skip the current character
        } else {
          console.log('Unrecognized character found in source : ', src[0])
          process.exit(1)
        }
      }
    }

    return tokens
  }

  private token(value: string = '', type: TokenType): Token {
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
