import { IRunTimeVal, INumberVal, makeNull } from './values.interface'
import {
  IStatement,
  INumericLiteral,
  IBinaryExpression,
  IProgram,
  IIdentifierExpression,
  IVarDeclaration,
  IAssignmentExpr,
} from '../../ast/compiler/ast.interface'
import { Logger } from '../../utils/logger'
import Enviornment from '../../environment/environement'

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
  public static evaluate(astNode: IStatement, env: Enviornment): IRunTimeVal {
    switch (astNode.kind) {
      case 'NumericLiteral':
        return {
          type: 'number',
          value: (astNode as INumericLiteral).value,
        } as INumberVal
      case 'Identifier':
        return this.evaluateIdentifier(astNode as IIdentifierExpression, env)
      case 'AssignmentExpr':
        return this.evaluateAssignment(astNode as IAssignmentExpr, env)
      case 'BinaryExpr':
        return this.evaluateBinaryExpr(astNode as IBinaryExpression, env)
      case 'Program':
        return this.evaluateProgram(astNode as IProgram, env)
      case 'VarDeclaration':
        return this.evaluateVarDeclaration(astNode as IVarDeclaration, env)
      default:
        Logger.error('This AST Node has not yet been setup for interpretation.', astNode)
        process.exit(0)
    }
  }

  /**
   * ### Evaluate Var Declaration
   */
  private static evaluateVarDeclaration(declaration: IVarDeclaration, env: Enviornment): IRunTimeVal {
    const value = declaration.value ? this.evaluate(declaration.value, env) : makeNull()
    return env.declareVar(declaration.identifier, value, declaration.constant)
  }

  /**
   * ### Evaluate Identifier
   * @param identifier - Identifier Expression
   * @param env - Environment
   */
  private static evaluateIdentifier(identifier: IIdentifierExpression, env: Enviornment): IRunTimeVal {
    const val = env.lookupVar(identifier.symbol)
    return val
  }

  /**
   * ### Evaluate Binary Expression
   * @param binop - Binary Expression
   * @param env - Environment
   */
  private static evaluateBinaryExpr(binop: IBinaryExpression, env: Enviornment): IRunTimeVal {
    const leftHandSide = this.evaluate(binop.left, env)
    const rightHandSide = this.evaluate(binop.right, env)

    if (leftHandSide.type == 'number' && rightHandSide.type == 'number') {
      return this.evaluateNumericBinaryExpr(leftHandSide as INumberVal, rightHandSide as INumberVal, binop.operator)
    }

    // when one or both are `null`
    return makeNull()
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
   * @param env - Environment
   * @description <br/>
   * - evaluating a program from top to bottom
   */
  private static evaluateProgram(program: IProgram, env: Enviornment): IRunTimeVal {
    let lastEvaluated: IRunTimeVal = makeNull()
    for (const statement of program.body) {
      lastEvaluated = this.evaluate(statement, env)
    }

    return lastEvaluated
  }

  /**
   * ## Evaluate Assignment
   * @param node - assignment expresssion
   * @param env - environment
   * @returns
   */
  private static evaluateAssignment(node: IAssignmentExpr, env: Enviornment): IRunTimeVal {
    if (node.assigne.kind !== 'Identifier') {
      throw `Invalid LHS inaide assignment expr ${JSON.stringify(node.assigne)}`
    }

    const varname = (node.assigne as IIdentifierExpression).symbol
    return env.assignVar(varname, this.evaluate(node.value, env))
  }
}
