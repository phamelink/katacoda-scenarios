const express = require("express")
const app = express()
const port = 8000

app.get("/api/", (req, res) => {
	res.send("Hello World! This is the Express API\n")
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
