import express from 'express'
import 'dotenv/config'

const app = express()
const port = process.env.PORT

app.get('/', (req, res) => {
    res.send("Api is working")
})

app.listen(port, () => {
    console.log(`App is listening on http://localhost:${port}`)
})