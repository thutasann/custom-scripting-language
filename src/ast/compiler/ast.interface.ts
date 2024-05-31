/** ## Abstract Syntax Tree Node Types
 * ### Defines the structure of our language AST
 * @description
 * - expression is not a statement
 * - expression example -> 5 * 10
 * - assignment expression example -> x = 45
 * - statements will not return a value
 * - statement example -> let x = 45
 */
export type NodeType =
  // STATEMENTS
  | 'Program'
  | 'VarDeclaration'
  // EXPRESSIONS
  | 'AssignmentExpr'
  | 'NumericLiteral'
  | 'Identifier'
  | 'BinaryExpr'

/** Abstract Statement Interface that include statement kind
 * @description
 * - IStatement -> IProgram
 * - IStatement -> IExpression
 */
export interface IStatement {
  kind: NodeType
}

/** Program Node Type that include `kind` and body of the `statements` */
export interface IProgram extends IStatement {
  /** kind of the program */
  kind: 'Program'
  /** array of the statements */
  body: IStatement[]
}

/** Variable Declaration Node Type
 * @example
 * let x; // x is undefined
 */
export interface IVarDeclaration extends IStatement {
  kind: 'VarDeclaration'
  constant: boolean
  identifier: string
  value?: IExpression
}

/** Expression interface that extends `IStatement` */
export interface IExpression extends IStatement {}

/**
 * Assignment Expression
 * @example
 * - x = { foo: "bar"}
 * - left hand side is the assigne
 * - x.foo = "foo bar"
 * - x.foo is another complex expression
 */
export interface IAssignmentExpr extends IExpression {
  kind: 'AssignmentExpr'
  assigne: IExpression
  value: IExpression
}

/** Binary Expression Node Type
 * @example
 * 10 - 5
 * foo() - bar()
 */
export interface IBinaryExpression extends IExpression {
  kind: 'BinaryExpr'
  left: IExpression
  right: IExpression
  operator: string
}

/** Identifier Expression Node Type
 * @example
 * foo - bar
 * - `foo` and `bar` are identifiers
 */
export interface IIdentifierExpression extends IExpression {
  kind: 'Identifier'
  symbol: string
}

/** Numeric Literal Expression Node Type */
export interface INumericLiteral extends IExpression {
  kind: 'NumericLiteral'
  value: number
}
