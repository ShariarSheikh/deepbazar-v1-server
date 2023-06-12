import Express from 'express'

const jsonParser = Express.json()
const urlencoded = Express.urlencoded({ extended: true })

export default { jsonParser, urlencoded }
