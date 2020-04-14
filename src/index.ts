import deploy from './deploy'
import log from '@/utils/log'

const res = deploy()
res.then(()=>{
  log.info('🚧 close process')
  process.exitCode = 0
  process.exit()
})