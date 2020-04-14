export default function newStep(per) {
  let curStep = 0
  return () => {
    curStep += 1
    return `(${curStep}/${per})`
  }
}