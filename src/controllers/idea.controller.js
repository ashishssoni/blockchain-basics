import { MongoClient } from 'mongodb'
import debug from 'debug'
import { ERR_CONST } from '../constants'

const { PROVENDB_USERNAME, PROVENDB_PASSWORD, COLLECTION_NAME, DB_NAME } = process.env
const log = debug('app:idea')
const provenURI = `mongodb://${PROVENDB_USERNAME}:${PROVENDB_PASSWORD}@${DB_NAME}.provendb.io/${DB_NAME}?ssl=true`
let dbObject
let collection

const setupPorvenDB = async () => {
  const mongoclient = await MongoClient.connect(provenURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).catch(err => {
    log('Error connecting to ProvenDB:', err)
    process.exit(1)
  })

  dbObject = mongoclient.db(DB_NAME)
  collection = dbObject.collection(COLLECTION_NAME)
  log('Connected to ProvenDB')
}

setupPorvenDB()

const getAllIdeas = async (request, response) => {
  const { params: idea } = request
  const collectionData = await collection.find(idea).toArray()
  const responseText = { msgType: 'S', collectionData: collectionData }
  return response.sendData(responseText)
}

const proveNewIdea = async (request, response) => {
  const { body } = request
  const newDocument = { ...body, uploadDate: Date.now() }

  if (collection) {
    await collection.insertOne(newDocument)
  } else {
    const errorMsg = { msgType: 'E', message: ERR_CONST.COLLECTION_NOT_FOUND }
    return response.sendError(errorMsg)
  }

  const res = await dbObject.command({ getVersion: 1 })
  log(`Current version is ${res.version}`)
  const currentVersion = parseInt(res.version)
  const provedIdea = await dbObject.command({ submitProof: currentVersion })
  const responseText = { msgType: 'S', provedIdea: provedIdea }
  return response.sendData(responseText)
}

const updateIdea = async (request, response) => {
  const { body } = request
  const { refNo, updateData = {} } = body

  await collection.updateOne({ refNo }, { $set: { ...updateData } })
  const res = await dbObject.command({ getVersion: 1 })
  log(`Current version is ${res.version}`)
  const currentVersion = parseInt(res.version)
  const updatedIdea = await dbObject.command({ submitProof: currentVersion })
  const responseText = { msgType: 'S', provedIdea: updatedIdea }
  return response.sendData(responseText)
}

const getIdeaProof = async (request, response) => {
  const { body } = request
  const searchVersion = body.version
  delete body.version
  const res = await dbObject.command({ getVersion: 1 })
  log(`Current version is ${res.version}`)

  const results = await dbObject.command(
    {
      getDocumentProof: {
        collection: COLLECTION_NAME,
        filter: body,
        version: searchVersion
      }
    }).catch(err => {
    const errorMsg = { msgType: 'E', message: ERR_CONST.IDEA_PROOF_FAILED, error: err }
    return response.sendError(errorMsg)
  })
  const responseText = { msgType: 'S', proofs: results.proofs }
  return response.sendData(responseText)
}

const verifyIdeaProof = async (request, response) => {
  const { body: { proofId } } = request
  const proofVerified = await await dbObject.command({ getProof: proofId })
  const responseText = { msgType: 'S', proofVerified: proofVerified }
  return response.sendData(responseText)
}

const getDocHistory = async (request, response) => {
  const { body } = request
  const docHistory = await await dbObject.command({
    docHistory: {
      collection: COLLECTION_NAME,
      filter: body
    }
  }).catch(err => {
    const errorMsg = { msgType: 'E', message: ERR_CONST.FAILED_DOC_HISTORY, error: err }
    return response.sendError(errorMsg)
  })

  const responseText = { msgType: 'S', docHistory: docHistory }
  return response.sendData(responseText)
}

const forgetDocument = async (request, response) => {
  const { body } = request
  const forgetData = await await dbObject.command({
    forget: {
      prepare: {
        collection: COLLECTION_NAME,
        filter: body
      }
    }
  }).catch(err => {
    const errorMsg = { msgType: 'E', message: ERR_CONST.FORGET_DOC_ERROR, error: err }
    return response.sendError(errorMsg)
  })

  const forgetResult = await await dbObject.command({
    forget: {
      execute: {
        forgetId: forgetData.forgetId,
        password: forgetData.password
      }
    }
  }).catch(err => {
    const errorMsg = { msgType: 'E', message: ERR_CONST.FORGET_DOC_ERROR, error: err }
    return response.sendError(errorMsg)
  })

  const responseText = { msgType: 'S', forgetData, forgetResult }
  return response.sendData(responseText)
}

const compactionDocs = async (request, response) => {
  const { body: { startVersion, endVersion } } = request
  const compactDocs = await await dbObject.command({
    compact: {
      startVersion,
      endVersion
    }
  }).catch(err => {
    const errorMsg = { msgType: 'E', message: ERR_CONST.COMPACT_DOC_ERROR, error: err }
    return response.sendError(errorMsg)
  })

  const responseText = { msgType: 'S', compactDocs: compactDocs }
  return response.sendData(responseText)
}

const getVersion = async (request, response) => {
  const currentVersion = await dbObject.command({ getVersion: 1 })
  log(`Current version is ${currentVersion.version}`)
  const responseText = { msgType: 'S', currentVersion: currentVersion }
  return response.sendData(responseText)
}

const setVersion = async (request, response) => {
  const { body: { setVersion } } = request
  const setVersionResult = await dbObject.command({ setVersion })
  log(`Current version is ${setVersionResult.version}`)
  const responseText = { msgType: 'S', setVersionResult: setVersionResult }
  return response.sendData(responseText)
}

const ideaController = {
  getAllIdeas,
  proveNewIdea,
  updateIdea,
  getIdeaProof,
  verifyIdeaProof,
  getDocHistory,
  forgetDocument,
  compactionDocs,
  getVersion,
  setVersion
}

export { ideaController }
