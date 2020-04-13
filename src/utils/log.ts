import * as core from '@actions/core'
import * as os from 'os'
import * as chalk from 'chalk'

export interface Log {
  info(message: string): void;
  warn(message: string): void;
  error(message: string | Error): void;

}
const NAME: string = '[funny-deploy]'
const infoWrap = chalk.bold.green
const warnWrap = chalk.keyword('orange');
const errorWrap = chalk.bold.red;
const _END = os.EOL
export function info(message, ...arg): void {
  let msg = `${NAME}: ${message} ${_END}`
  msg = infoWrap(msg)
  console.log(msg, ...arg)
}

export function warn(message, ...arg): void {
  let msg = `${NAME}::Warn:: ${message} ${_END}`
  msg = warnWrap(msg)
  console.warn(msg, ...arg)
}

export function error(message, ...arg): void {
  let msg = `${NAME}::Error:: ${message} ${_END}`
  let msgWrap = errorWrap(msg)
  console.error(msgWrap, ...arg)
  core.setFailed(msg)
}

const log: Log = {
  info,
  warn,
  error,
}

export default log