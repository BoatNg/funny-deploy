import * as core from '@actions/core'
import * as github from '@actions/github'
import * as NodeSSH from 'node-ssh'

import log from "@/utils/log"
import newStep from '@/utils/newStep'
import validateEnv from '@/utils/validateEnv'
import * as path from 'path'
const ssh = new NodeSSH
export default async function (): Promise<void> {

  // init
  log.info(`🚌 💨 initialize project`)

  const step = newStep(5)
  const pidName = "funny-deploy"
  const pidNumber = "9527"
  core.saveState(pidName, pidNumber);

  try {

    // 1. get Configuration
    log.info(`${step()} geting env configuration`)
    const {
      REMOTE_HOST,
      REMOTE_PORT = 22,
      REMOTE_USER,
      REMOTE_PASSWORD,
      REMOTE_PATH,
      GITHUB_WORKSPACE,
      SOURCE = "",
    } = process.env
    // 2. validate Configuration
    log.info(`${step()} validating env configuration`)
    const [error] = validateEnv({
      REMOTE_HOST,
      REMOTE_PORT,
      REMOTE_USER,
      REMOTE_PASSWORD,
      REMOTE_PATH,
      GITHUB_WORKSPACE,
      SOURCE,
    })
    if (error) {
      log.error(error)
      return
    }

    // 3. connet ssh
    log.info(`${step()} conneting server via ssh`)
    await ssh.connect({
      host: REMOTE_HOST,
      username: REMOTE_USER,
      password: REMOTE_PASSWORD,
      port: REMOTE_PORT
    })

    // 4. creating file
    log.info(`${step()} creating server's path`)
    const createRes = await ssh.execCommand(`mkdir -p ${REMOTE_PATH}`, { cwd: '/' })
    if (createRes.stderr) {
      log.error(createRes.stderr)
      return
    }

    // 5. transporting file
    log.info(`${step()} transporting file to server...`)
    const failed = []
    const successful = []
    const local = path.resolve(GITHUB_WORKSPACE, '.', SOURCE)//`${GITHUB_WORKSPACE}/${SOURCE}`
    log.info(`the remote path is ${REMOTE_PATH}`)
    log.info(`the local path is ${local}`)

    const transportRes = await ssh.putDirectory(
      local,
      REMOTE_PATH,
      {
        recursive: true,
        // concurrency: 10,
        tick: function (localPath, remotePath, error) {
          if (error) {
            failed.push(localPath)
          } else {
            successful.push(localPath)
          }
        }
      })
    if (!transportRes) {
      log.warn(`failed transfers: ${failed.join(', ')}`)
      log.error(`transporting file to server failed`)
      return
    }

    // successs
    log.info(`🎉 success`)
    return Promise.resolve()
  } catch (err) {
    log.error(err)
    process.abort()
  }

}