import 'dotenv/config'
import app from './app'
import { PORT } from './config/variables.config'

app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`)
})
