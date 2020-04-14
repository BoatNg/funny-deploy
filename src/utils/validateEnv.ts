import log from '@/utils/log'

interface ValitateItem {
  required: boolean
}
interface ValidateMap {
  [propName: string]: ValitateItem
}
const validateMap: ValidateMap = {
  REMOTE_HOST: {
    required: true,
  },
  REMOTE_PORT: {
    required: true
  },
  REMOTE_USER: {
    required: true
  },
  REMOTE_PASSWORD: {
    required: true
  },
  REMOTE_PATH: {
    required: true
  },
  GITHUB_WORKSPACE: {
    required: true
  },
  SOURCE: {
    required: false
  },
}

export default function (envMap: object): any[] {
  for (let key in validateMap) {
    let item = validateMap[key]
    if (item.required) {
      if (envMap[key]) {
        continue
      } else {
        return [
          `illegal parameter! ${key} is required but here is ${envMap[key]}!`
        ]
      }
    }
  }
  return [
    null
  ]
}