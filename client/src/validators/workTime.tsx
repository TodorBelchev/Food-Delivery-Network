// eslint-disable-next-line
export const workTime = (value: string) => Boolean(value.match(/^[A-Z]{1}[a-z]+-[A-Z]{1}[a-z]+ [0-9]{2}:[0-9]{2}-[0-9]{2}:[0-9]{2}$/));