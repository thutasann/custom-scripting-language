import readline from 'readline'
import { Parser } from '../ast/compiler/parser'
import Enviornment from '../environment/environement'
import { Logger } from '../utils/logger'
import { Interpreter } from './runtime/interpreter'
import { makeBool, makeNull, makeNumber } from './runtime/values.interface'

const r1 = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

/** test interpreter */
;(async function repl() {
  const parser = new Parser()

  // define variables in  environment
  const env = new Enviornment()
  env.declareVar('true', makeBool(true), true)
  env.declareVar('false', makeBool(false), true)
  env.declareVar('null', makeNull(), true)

  Logger.info('Repl v0.1')

  const repeatReadline = async function () {
    r1.question('> ', async (input) => {
      if (!input || input.includes('exit')) {
        process.exit(1)
      }
      const program = parser.produceAST(input)

      const interpretedResult = Interpreter.evaluate(program, env)
      Logger.info('interpretedResult -> ', interpretedResult)
      await repeatReadline()
    })
  }

  await repeatReadline()
})()
