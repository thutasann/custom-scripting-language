import { Lexer } from '../../lexer/lexer'
import { IToken, TokenType } from '../../lexer/lexer.interface'
import {
  IStatement,
  IProgram,
  IExpression,
  IBinaryExpression,
  INumericLiteral,
  IIdentifierExpression,
} from './ast.interface'

/**
 * Parser Object
 * @description
 * - the job of the parser is to take in our tokens that we created from our `tokenizer`
 */
export class Parser {
  private tokens: IToken[] = []

  /**
   * produce AST fnc
   * @returns
   * Program Node Type that include `kind` and body of the `statements`
   */
  public produceAST(sourceCode: string): IProgram {
    const _lexer = new Lexer()
    this.tokens = _lexer.tokenize(sourceCode)
    console.log('tokens -> ', this.tokens)

    const program: IProgram = {
      kind: 'Program',
      body: [],
    }

    // parse until end of the file
    while (this.notEOF()) {
      program.body.push(this.parseSTMT())
    }

    return program
  }

  /** entry point of the parser*/
  private parseSTMT(): IStatement {
    // skip to parseExpr
    return this.parseExpr()
  }

  /** parse expression */
  private parseExpr(): IExpression {
    return this.parsePrimaryExpr()
  }

  /** parse primary expressions */
  private parsePrimaryExpr(): IExpression {
    const tokenType = this.at().type

    switch (tokenType) {
      case TokenType.Identifier:
        return { kind: 'Identifier', symbol: this.eat().value } as IIdentifierExpression
      case TokenType.Number:
        return { kind: 'NumericLiteral', value: parseFloat(this.eat().value) } as INumericLiteral
      default:
        console.error('Unexpected token found during parsing :', this.at())
        process.exit(1)
    }
  }

  /** fnc to return tokens index position */
  private at(): IToken {
    return this.tokens[0]
  }

  /** check token is EOF or not */
  private notEOF(): boolean {
    return this.tokens[0].type !== TokenType.EOF
  }

  /** shift the token */
  private eat(): IToken {
    const prev = this.tokens.shift()
    return prev as IToken
  }
}
