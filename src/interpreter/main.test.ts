import readline from 'readline'
import { Parser } from '../ast/compiler/parser'
import Enviornment from '../environment/environement'
import { Logger } from '../utils/logger'
import { Interpreter } from './runtime/interpreter'
import { INumberVal } from './runtime/values.interface'

const r1 = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

/** test interpreter */
;(async function repl() {
  const parser = new Parser()

  const env = new Enviornment()
  env.declareVar('x', { value: 100, type: 'number' } as INumberVal) // define variable `x` in our environment

  Logger.info('Repl v0.1')

  r1.question('> ', (input) => {
    if (!input || input.includes('exit')) {
      process.exit(1)
    }

    const program = parser.produceAST(input)

    const interpretedResult = Interpreter.evaluate(program, env)
    Logger.info('interpretedResult -> ', interpretedResult)

    r1.close()
  })
})()
