import { Lexer } from './lexer'
import { Logger } from '../utils/logger'
import fs from 'fs'

// --------- testing ---------
;(function Test() {
  const lexer = new Lexer()
  const source = fs.readFileSync('./lexer.lang')
  for (const token of lexer.tokenize(source.toString())) {
    Logger.info('token ==> ', token)
  }
})()
