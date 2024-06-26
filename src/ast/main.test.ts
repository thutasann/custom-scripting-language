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
  Logger.info('Repl v0.1')

  const prompt = () => {
    r1.question('> ', (input) => {
      if (!input || input.includes('exit')) {
        Logger.info('Exiting REPL...')
        r1.close()
        process.exit(0)
      }

      try {
        const program = parser.produceAST(input)
        Logger.info('Program --> ', program)
      } catch (error) {
        Logger.error('Error parsing input: ', error)
      }

      prompt() // Continue the REPL loop
    })
  }

  prompt() // Start the REPL loop
})()
