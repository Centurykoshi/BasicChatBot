const express = require('express')
const app = express()
const port = 3000
const { join } = require("node:path");

app.use(express.static("public")); 

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })




app.get('/', (req, res)=>{
    res.sendFile(join(__dirname, "public","index.html")); 
})
app.listen(port, () => {
  console.log(`Your website at http://localhost:${port}`)
})

