import * as core from '@actions/core'
import * as github from '@actions/github'
import log from "utils/log"

function newStep(per) {
  let curStep = 0
  return () => {
    curStep += 1
    return `(${curStep}/${per})`
  }
}


export default function (): void {

  // init
  log.info(`initialize project`)

  const step = newStep(5)

  try {

    // 1. get Configuration
    log.info(`${step()} geting env configuration`)
    // REMOTE_HOST REMOTE_PORT REMOTE_USER  REMOTE_PASSWORD REMOTE_DIR

    // GITHUB_WORKSPACE SOURCE_DIR


    // 2. validate Configuration
    log.info(`${step()} validating env configuration`)

    // 3. connet ssh
    log.info(`${step()} conneting server via ssh`)

    // 4. check file
    log.info(`${step()} checking server's path`)

    // 5. put file
    log.info(`${step()} transporting file to server`)

    log.info(`🎉 success`)
    // successs
  } catch (err) {
    log.error(err)
  }

}