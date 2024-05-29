import { Lexer } from '../../lexer/lexer'
import { IToken, TokenType } from '../../lexer/lexer.interface'
import { Logger } from '../../utils/logger'
import {
  IStatement,
  IProgram,
  IExpression,
  IBinaryExpression,
  INumericLiteral,
  IIdentifierExpression,
  IVarDeclaration,
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
    console.log('this.tokens', this.tokens)

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
    switch (this.at().type) {
      case TokenType.Let:
      case TokenType.Const:
        return this.parseVarDeclaration()
      default:
        return this.parseExpr()
    }
  }

  /** parse variable declaration
   * @example
   * - LET IDENTIFIER;
   * - ( LET | CONST ) IDENTIFIER = EXPR;
   */
  private parseVarDeclaration(): IStatement {
    const isConstant = this.eat().type == TokenType.Const
    const identifier = this.expect(
      TokenType.Identifier,
      'Expected identifier name following let | const keywords.'
    ).value

    if (this.at().type == TokenType.Semicolon) {
      this.eat() // expect semicolon
      if (isConstant) {
        throw 'Must assigne value to constant expression. No value provided.'
      }

      return {
        kind: 'VarDeclaration',
        identifier,
        constant: false,
      } as IVarDeclaration
    }

    this.expect(TokenType.Equals, 'Expected equals token following identifier in var declaration.')

    const declaration = {
      kind: 'VarDeclaration',
      value: this.parseExpr(),
      identifier,
      constant: isConstant,
    } as IVarDeclaration

    this.expect(TokenType.Semicolon, 'Variable declaration statment must end with semicolon.')

    return declaration
  }

  /** ## parse expression */
  private parseExpr(): IExpression {
    return this.parseAdditiveExpr()
  }

  /** ### parse additive expression
   * @description <br/>
   * - Additive Expression has left <-> hand presidence
   * @example
   * - (10 + 5) - 5
   * - (10 + (10 - fooBar)) - 5
   * - 10 + 5 * 3
   * - wrap with additive expression with `()`
   */
  private parseAdditiveExpr(): IExpression {
    let left = this.parseMultiplicitaveExpr()

    while (this.at().value == '+' || this.at().value == '-') {
      const operator = this.eat().value
      const right = this.parseMultiplicitaveExpr()
      left = {
        kind: 'BinaryExpr',
        left,
        right,
        operator,
      } as IBinaryExpression
    }

    return left
  }

  /** ### parse multiplicative expression
   * @description  parse `*`, `/` and `%`
   */
  private parseMultiplicitaveExpr(): IExpression {
    let left = this.parsePrimaryExpr()

    while (this.at().value == '/' || this.at().value == '*' || this.at().value == '%') {
      const operator = this.eat().value
      const right = this.parsePrimaryExpr()
      left = {
        kind: 'BinaryExpr',
        left,
        right,
        operator,
      } as IBinaryExpression
    }

    return left
  }

  /** ### primary parse expressions fnc
   * @description this is the primary fnc of parse expression
   */
  private parsePrimaryExpr(): IExpression {
    const tokenType = this.at().type

    switch (tokenType) {
      case TokenType.Identifier:
        return { kind: 'Identifier', symbol: this.eat().value } as IIdentifierExpression

      // Constants and Numeric Constants
      case TokenType.Number:
        return {
          kind: 'NumericLiteral',
          value: parseFloat(this.eat().value),
        } as INumericLiteral

      // Grouping Expressions
      case TokenType.OpenParen: {
        this.eat() // eat the opening paren
        const value = this.parseExpr()
        this.expect(
          TokenType.CloseParen,
          'Unexpected token found inside parenthesised expression. Expected closing parenthesis.'
        ) // closing paren
        return value
      }

      // Unidentified Tokens and Invalid Code Reached
      default:
        Logger.error('Unexpected token found during parsing!', this.at())
        process.exit(1)
    }
  }

  /** fnc to return tokens index position */
  private at(): IToken {
    return this.tokens[0] as IToken
  }

  /** expect fnc */
  private expect(type: TokenType, err: any): IToken {
    const prev = this.tokens.shift() as IToken
    if (!prev || prev.type !== type) {
      Logger.error('Parse Error:\n', err, prev, ' - Expecting: ', type)
      process.exit(1)
    }
    return prev
  }

  /** shift the token */
  private eat(): IToken {
    const prev = this.tokens.shift()
    return prev as IToken
  }

  /** check token is EOF or not */
  private notEOF(): boolean {
    return this.tokens[0].type !== TokenType.EOF
  }
}

/**
 * ## Orders of Prescidence
 * - AssignmentExpr
 * - MemberExpr
 * - FunctionCall
 * - LogicalExpr
 * - ComparisionExpr
 * - AdditiveExpr ✅
 * - MultiplicationExpr
 * - UnaryExpr
 * - PrimaryExpr
 * @description This is just the Note
 */
class OrdersOfPrescidence {}
