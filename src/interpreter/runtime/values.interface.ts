// values are going to define the types
// that we're going to be using for our runtime

/** value types (null and number)
 * @description
 * - in the future, we will define custom user-defined functions objects booleans and strings
 */
export type ValueTypes = 'null' | 'number' | 'boolean'

/** base runtime interface that include value type */
export interface IRunTimeVal {
  type: ValueTypes
}

/** null value type */
export interface INullVal extends IRunTimeVal {
  type: 'null'
  value: null
}

/** number value type */
export interface INumberVal extends IRunTimeVal {
  type: 'number'
  value: number
}

/** boolean value type */
export interface IBoolVal extends IRunTimeVal {
  type: 'boolean'
  value: boolean
}

/** make value fnc */
export function makeNumber(n = 0) {
  return {
    type: 'number',
    value: n,
  } as INumberVal
}

/** make null fnc */
export function makeNull() {
  return {
    type: 'null',
    value: null,
  } as INullVal
}

/** make boolen fnc */
export function makeBool(val: boolean = true) {
  return {
    type: 'boolean',
    value: val,
  } as IBoolVal
}
