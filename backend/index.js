/*
  dependencies
*/

  const express = require('express')
  const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
  const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
  let inspect = require('util').inspect
  let busboy = require('busboy');
    
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
  endpoint - posts
*/

  app.get('/posts', (request, response) => {
    response.set('Access-Control-Allow-Origin', '*')

    let posts = []
    db.collection('posts').orderBy('date', 'desc').get().then(snapshot => {
      snapshot.forEach((doc) => {
        console.log(doc.id, '=>', doc.data());
        posts.push(doc.data())
      });
      response.send(posts)
    })
  })

/*
  endpoint - createPost
*/

  app.post('/createPost', (request, response) => {
    response.set('Access-Control-Allow-Origin', '*')

    const bb = busboy({ headers: request.headers });

    bb.on('file', (name, file, info) => {
      const { filename, encoding, mimeType } = info;
      console.log(
        `File [${name}]: filename: %j, encoding: %j, mimeType: %j`,
        filename,
        encoding,
        mimeType
      );
      file.on('data', (data) => {
        console.log(`File [${name}] got ${data.length} bytes`);
      }).on('close', () => {
        console.log(`File [${name}] done`);
      });
    });
    bb.on('field', (name, val, info) => {
      console.log(`Field [${name}]: value: %j`, val);
    });
    bb.on('close', () => {
      console.log('Done parsing form!')
      // response.writeHead(303, { Connection: 'close', Location: '/' });
      // response.end();
      response.send('Done parsing form!')
    });
    request.pipe(bb);
  })

/*
  listen
*/

  app.listen(process.env.PORT || 3000)