import { Router } from 'express'
const routes = new Router()

import { userController } from '../controllers/userController.js'
import { userAddValidator } from '../helpers/userValidator.js' 

routes.delete('/delete-bulk',[userAddValidator],userController.deleteBulkUser)
routes.post('/',[userAddValidator],userController.addUser)
routes.put('/:id',[userAddValidator],userController.editUser)
routes.delete('/:id',userController.deleteUser)
routes.get('/:id',userController.getUser)
routes.get('/',userController.getAllUser)
  
export default routes