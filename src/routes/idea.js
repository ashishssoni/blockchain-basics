import Express from 'express'
import { ideaController } from '../controllers'
import { asyncMiddleware } from '../classes'

const ideaRouter = new Express.Router()

ideaRouter.get('/ideas', asyncMiddleware(ideaController.getAllIdeas))
ideaRouter.post('/proveIt', asyncMiddleware(ideaController.proveNewIdea))
ideaRouter.post('/updateIdea', asyncMiddleware(ideaController.updateIdea))
ideaRouter.post('/ideaProof', asyncMiddleware(ideaController.getIdeaProof))
ideaRouter.post('/verifyProof', asyncMiddleware(ideaController.verifyIdeaProof))
ideaRouter.post('/docHistory', asyncMiddleware(ideaController.getDocHistory))
ideaRouter.post('/forgetDoc', asyncMiddleware(ideaController.forgetDocument))
ideaRouter.post('/compactDocs', asyncMiddleware(ideaController.compactionDocs))
ideaRouter.get('/getVersion', asyncMiddleware(ideaController.getVersion))
ideaRouter.post('/setVersion', asyncMiddleware(ideaController.setVersion))

export { ideaRouter }
