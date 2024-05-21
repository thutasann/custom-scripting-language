import { Parser } from './compiler/parser'
import readline from 'readline'
import { Logger } from '../utils/logger'

const r1 = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

/** test parser */
;(async function repl() {
  const parser = new Parser()
  Logger.log('Repl v0.1')

  r1.question('> ', (input) => {
    if (!input || input.includes('exit')) {
      process.exit(1)
    }

    const program = parser.produceAST(input)
    Logger.log('Program --> ', program)

    r1.close()
  })
})()
