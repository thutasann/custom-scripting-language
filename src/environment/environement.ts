import { IRunTimeVal } from '../interpreter/runtime/values.interface'
import { Logger } from '../utils/logger'

/**
 * ## Envrionment
 * @description
 * to hold the structure for a scope AKA an enviroment
 */
export default class Enviornment {
  private _parent?: Enviornment
  private _variables: Map<string, IRunTimeVal>
  private _constatnts: Set<string>

  constructor(parent?: Enviornment) {
    this._parent = parent
    this._variables = new Map()
    this._constatnts = new Set()
  }

  /**
   * Declare variable
   * @param varname - variable name
   * @param value - runtime value
   * @param constant - is variable constant or not
   * @returns runtime value
   */
  public declareVar(varname: string, value: IRunTimeVal, constant: boolean): IRunTimeVal {
    if (this._variables.has(varname)) {
      throw `Cannot declare variable ${varname} as its already defined`
    }

    this._variables.set(varname, value)
    if (constant) {
      this._constatnts.add(varname)
    }
    return value
  }

  /**
   * Assign variable
   * @param varname - variable name
   * @param value - runtime value
   */
  public assignVar(varname: string, value: IRunTimeVal): IRunTimeVal {
    const env = this.resolve(varname)

    // cannot assign to constant
    if (env._constatnts.has(varname)) {
      throw `Cannot reassign to variable ${varname} as it was declared as constant`
    }

    env._variables.set(varname, value)
    return value
  }

  /**
   * Loook up variable
   */
  public lookupVar(varname: string): IRunTimeVal {
    const env = this.resolve(varname)
    return env._variables.get(varname) as IRunTimeVal
  }

  public resolve(varname: string): Enviornment {
    if (this._variables.has(varname)) {
      return this
    }

    if (this._parent == undefined) {
      throw `Cannot resolve '${varname}' as it does not exist`
    }

    return this._parent.resolve(varname)
  }
}
