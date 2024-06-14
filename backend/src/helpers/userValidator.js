import { body } from 'express-validator'

export const userAddValidator = [ 
    body('first_name','First name field is required.').notEmpty(), 
    body('last_name','Last name field is required.').notEmpty(), 
    body('email','Email field is required.').notEmpty(),  
]