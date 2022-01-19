/*
  dependencies
*/

  const express = require('express')

/*
  config - express
*/

  const app = express()

/*
  endpoint
*/

  app.get('/', (request, response) => {
    response.send('I love Node!')
  })

app.listen(3000)