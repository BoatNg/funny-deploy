import * as core from '@actions/core'
import * as github from '@actions/github'
import log from "utils/log"

export default function (): void {

  // init
  try {

    // 1. get input
    log.info('get input begin')
    // `who-to-greet` input defined in action metadata file
    const nameToGreet = core.getInput('who-to-greet');
    log.info(`Hello ${nameToGreet}!`);
    const time = (new Date()).toTimeString();
    core.setOutput("time", time);
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    log.warn(`The event payload: ${payload}`);
    // 2. validate input

    // 3. connet ssh

    // 4. put file

    // successs
  } catch (err) {
    log.error(err)
  }

}