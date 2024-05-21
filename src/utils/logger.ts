import { basename } from 'path'

interface IGetLogDetails {
  fileName: string
  lineNumber: number | null
  columnNumber: number | null
}

/**
 * Custom Logger class
 */
export abstract class Logger {
  public static log(...args: any[]): void {
    const { fileName, lineNumber, columnNumber } = this.getLogDetails()
    const logMessage = `[${fileName}:${lineNumber}:${columnNumber}]`
    console.log(logMessage, ...args)
  }

  public static info(...args: any[]): void {
    Logger.log(['INFO', ...args])
  }

  static warn(...args: any[]) {
    Logger.log('[WARN]', ...args)
  }

  static error(...args: any[]) {
    Logger.log('[ERROR]', ...args)
  }

  private static getLogDetails(): IGetLogDetails {
    const oldStackTrace = Error.prepareStackTrace
    Error.prepareStackTrace = (_, stack) => stack
    const stack = new Error().stack as any as NodeJS.CallSite[]
    Error.prepareStackTrace = oldStackTrace

    // Stack trace structure :
    // 0: getLogDetails (this fnc)
    // 1: log (our custom log fnc)
    // 2: caller (the function that called log)
    const caller = stack[2]
    const fileName = basename(caller.getFileName() || '')
    const lineNumber = caller.getLineNumber()
    const columnNumber = caller.getColumnNumber()

    return { fileName, lineNumber, columnNumber }
  }
}
