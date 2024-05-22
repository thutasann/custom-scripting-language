import { IRunTimeVal, INullVal, INumberVal } from './values.interface'
import { IStatement, INumericLiteral, IBinaryExpression, IProgram } from '../../ast/compiler/ast.interface'
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
      case 'BinaryExpr':
        return this.evaluateBinaryExpr(astNode as IBinaryExpression)
      case 'Program':
        return this.evaluateProgram(astNode as IProgram)
      default:
        Logger.error(`This AST Node has not been setup ${astNode}`)
        process.exit(1)
    }
  }

  /**
   * ### Evaluate Binary Expression
   * @param binop - Binary Expression
   */
  private static evaluateBinaryExpr(binop: IBinaryExpression): IRunTimeVal {
    const leftHandSide = this.evaluate(binop.left)
    const rightHandSide = this.evaluate(binop.right)

    if (leftHandSide.type == 'number' && rightHandSide.type == 'number') {
      return this.evaluateNumericBinaryExpr(leftHandSide as INumberVal, rightHandSide as INumberVal, binop.operator)
    }

    // when one or both are `null`
    return { type: 'null', value: 'null' } as INullVal
  }

  /**
   * ### Evaluate Numeric Binary Expression
   * @param lhs - Left Hand Side
   * @param rhs - Right Hand Side
   */
  private static evaluateNumericBinaryExpr(lhs: INumberVal, rhs: INumberVal, operator: string): IRunTimeVal {
    let result: number
    if (operator == '+') {
      result = lhs.value + rhs.value
    } else if (operator == '-') {
      result = lhs.value - rhs.value
    } else if (operator == '*') {
      result = lhs.value * rhs.value
    } else if (operator == '/') {
      // TODO: division by zero check
      result = lhs.value / rhs.value
    } else {
      result = lhs.value % rhs.value
    }

    return {
      type: 'number',
      value: result,
    } as INumberVal
  }

  /**
   * ### Evaluate Program
   * @param program - program node type
   * @description <br/>
   * - evaluating a program from top to bottom
   */
  private static evaluateProgram(program: IProgram): IRunTimeVal {
    let lastEvaluated: IRunTimeVal = { type: 'null', value: 'null' } as INullVal

    for (const statement of program.body) {
      lastEvaluated = this.evaluate(statement)
    }

    return lastEvaluated
  }
}
