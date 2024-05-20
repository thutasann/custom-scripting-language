import {
  IStatement,
  IProgram,
  IExpression,
  IBinaryExpression,
  INumericLiteral,
  IIdentifierExpression,
} from './ast.interface'
import { Lexer } from '../lexer/lexer'
import { TokenType, IToken } from '../lexer/lexer.interface'

/**
 * Parser Object
 * @description
 * - the job of the parser is to take in our tokens that we created from our `tokenizer`
 */
export class Parser {
  private readonly _lexer: Lexer
  private tokens: IToken[] = []

  constructor(lexer: Lexer) {
    this._lexer = lexer
  }

  /**
   * produce AST fnc
   */
  public produceAST(sourceCode: string): IProgram {
    this.tokens = this._lexer.tokenize(sourceCode)

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

  /** check token is EOF or not */
  private notEOF(): boolean {
    return this.tokens[0].type !== TokenType.EOF
  }

  /** entry point of the parser */
  private parseSTMT(): IStatement {
    // skip to parseExpr
    return this.parseExpr()
  }

  private parseExpr(): IExpression {
    return { kind: 'BinaryExpr' }
  }

  private parsePrimaryExpr(): IExpression {
    return { kind: 'Identifier' }
  }
}
