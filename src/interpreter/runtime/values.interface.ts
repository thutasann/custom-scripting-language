// values are going to define the types
// that we're going to be using for our runtime

import { IBinaryExpression, IProgram, IStatement } from '../../ast/compiler/ast.interface'

/** value types (null and number)
 * @description
 * - in the future, we will define custom user-defined functions objects booleans and strings
 */
export type ValueTypes = 'null' | 'number'

/** base runtime interface that include value type */
export interface IRunTimeVal {
  type: ValueTypes
}

/** null value type */
export interface INullVal extends IRunTimeVal {
  type: 'null'
  value: 'null'
}

/** number value type */
export interface INumberVal extends IRunTimeVal {
  type: 'number'
  value: number
}
