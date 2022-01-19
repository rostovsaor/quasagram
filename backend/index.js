/*
  dependencies
*/

  const express = require('express')
  const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
  const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
  

  
/*
  config - express
*/

  const app = express()

/*
  config firebase
*/

  const serviceAccount = require('./serviceAccountKey.json');
    
  initializeApp({
    credential: cert(serviceAccount)
  });

  const db = getFirestore();

/*
  endpoint
*/

  app.get('/posts', (request, response) => {
    let posts = []
    db.collection('posts').get().then(snapshot => {
      snapshot.forEach((doc) => {
        console.log(doc.id, '=>', doc.data());
        posts.push(doc.data())
      });
      response.send(posts)
    })
  })

/*
  listen
*/
  // app.listen(3000)
  app.listen(process.env.PORT || 3000)