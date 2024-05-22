import { IRunTimeVal, INullVal, INumberVal } from './values.interface'
import { IStatement, INumericLiteral } from '../../ast/compiler/ast.interface'
import { Logger } from '../../utils/logger'

/**
 * ## Interpreter class
 */
export abstract class Interpreter {
  /**
   * ### Evaluate fnc
   * @description
   * - to evaluate the astNodes
   * - and then translate them into runtime values based on AST nodes
   * @param astNode - AST node
   */
  public static evaluate(astNode: IStatement): IRunTimeVal {
    switch (astNode.kind) {
      case 'NumericLiteral':
        return {
          type: 'number',
          value: (astNode as INumericLiteral).value,
        } as INumberVal
      case 'NullLiteral':
        return { type: 'null', value: 'null' } as INullVal
      default:
        Logger.error(`This AST Node has not been setup ${astNode}`)
        process.exit(1)
    }
  }
}
