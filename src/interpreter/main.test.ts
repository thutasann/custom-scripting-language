import readline from 'readline'
import { Parser } from '../ast/compiler/parser'
import { Logger } from '../utils/logger'
import { Interpreter } from './runtime/interpreter'

const r1 = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

/** test interpreter */
;(async function repl() {
  const parser = new Parser()
  Logger.info('Repl v0.1')

  r1.question('> ', (input) => {
    if (!input || input.includes('exit')) {
      process.exit(1)
    }

    const program = parser.produceAST(input)

    const interpretedResult = Interpreter.evaluate(program)
    Logger.info('interpretedResult -> ', interpretedResult)

    console.log('-----\n\n')

    r1.close()
  })
})()
