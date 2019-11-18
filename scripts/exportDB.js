const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const { firestoreExport } = require('node-firestore-import-export')
const firebase = require('firebase-admin')

if (process.argv.length < 4) {
  console.log('Usage: node exportDB.js accountKey databaseURL')
  process.exit(1)
}

const credential = firebase.credential.cert(JSON.parse(process.argv[2]))
const databaseURL = process.argv[3]
firebase.initializeApp({ credential, databaseURL })

function saveCollectionsToRepo(filename, collections) {
  mkdirp.sync(filename)
  Object.keys(collections).forEach(collectionName => {
    saveCollectionToRepo(path.join(filename, collectionName), collections[collectionName])
  })
}

function saveCollectionToRepo(filename, collection) {
  mkdirp.sync(filename);
  Object.keys(collection).forEach(id => {
    saveDocToRepo(path.join(filename, id), collection[id])
  })
}

function saveDocToRepo(filename, doc) {
  const { __collections__, ...data } = doc
  fs.writeFileSync(filename + '.json', JSON.stringify(data), 'utf8')
  if (__collections__ && Object.keys(__collections__).length > 0) {
    saveCollectionsToRepo(filename, __collections__)
  }
}

async function exportDB(ref) {
  const db = await firestoreExport(ref)
  const dbFilename = path.resolve(__dirname, '..', 'db') 
  rimraf.sync(dbFilename)
  mkdirp.sync(dbFilename)
  const collections = db.__collections__
  const collectionsFilename = path.join(dbFilename, 'collections')
  fs.writeFileSync(collectionsFilename + '.json', JSON.stringify(collections), 'utf8')
  saveCollectionsToRepo(collectionsFilename, collections)
}

exportDB(firebase.firestore())
