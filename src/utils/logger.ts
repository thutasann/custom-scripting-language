import chalk, { type ChalkInstance} from 'chalk';
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

  public static info(...args: any[]) {
    Logger.log(chalk.blue, '[INFO]', ...args);
  }

  public static warn(...args: any[]) {
    Logger.log(chalk.yellow, '[WARN]', ...args);
  }

  public static error(...args: any[]) {
    Logger.log(chalk.red, '[ERROR]', ...args);
  }

  private static log(colorFn: ChalkInstance, label: string, ...args: any[]) {
    const { fileName, lineNumber, columnNumber } = Logger.getLogDetails();
    const logMessage = colorFn(`[${fileName}:${lineNumber}:${columnNumber}] ${label}`);
    console.log(logMessage, ...args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg, null, 2) : colorFn(arg))));
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
