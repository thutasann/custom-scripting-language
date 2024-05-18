/**
 *  Token Type Enum
 * @example
 * let x = 45 + (foo * bar)
 * [letToken, IdentifierToken, EqualsToken, NumberToken]
 */
export enum TokenType {
  /** number */
  Number,
  /** identifier */
  Identifier,
  /** equal */
  Equals,
  /** open parenthesis */
  OpenParen,
  /** close parenthesis */
  CloseParen,
  /** binary operator */
  BinaryOperator,
  /** let to declare variable */
  Let,
}

/**
 * Token interface that include value and TokenType
 */
export interface Token {
  value: string
  type: TokenType
}

/** Reserved Keywords */
export const KEYWORDS: Record<string, TokenType> = {
  let: TokenType.Let,
}
