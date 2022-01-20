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

    let fields = {}

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
      // console.log(`Field [${name}]: value: %j`, val);
      fields[name] = val
    });

    bb.on('close', () => {
      db.collection('posts').doc(fields.id).set({
        id: fields.id,
        caption: fields.caption,
        location: fields.location,
        date: parseInt(fields.date),
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/quasagram-46530.appspot.com/o/5tUZBEy.jpeg?alt=media&token=60d6d232-63b5-4b79-8aff-2f4e9b6e6ef6',
      })

      response.send('Done parsing form!')
    });
    request.pipe(bb);
  })

/*
  listen
*/

  app.listen(process.env.PORT || 3000)