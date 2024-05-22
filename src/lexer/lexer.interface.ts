/**
 *  Token Type Enum
 * @example
 * let x = 45 + (foo * bar)
 * [letToken, IdentifierToken, EqualsToken, NumberToken]
 */
export enum TokenType {
  //? ------ literal types
  /** Null Type that is undefined in javascript */
  Null,
  /** number */
  Number,
  /** identifier */
  Identifier,

  //? ------ Keywords
  /** let to declare variable */
  Let,

  //? ------ Grouping * Operators
  /** binary operator */
  BinaryOperator,
  /** equal */
  Equals,
  /** open parenthesis */
  OpenParen,
  /** close parenthesis */
  CloseParen,
  /** signified the end of file */
  EOF,
}

/**
 * Token interface that include value and TokenType
 */
export interface IToken {
  value: string
  type: TokenType
}

/** Reserved Keywords */
export const KEYWORDS: Record<string, TokenType> = {
  let: TokenType.Let,
  null: TokenType.Null,
}
