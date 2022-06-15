import {Router} from 'express';
import * as rsa from '../controllers/rsa.controller';


const rsaRouter = Router();

rsaRouter.route('/generateKeys')
	.get(rsa.generateBothKeys)

rsaRouter.route('/pubK_CE')
	.get(rsa.getServerPubK)
rsaRouter.route('/pubk_CE')
	.post(rsa.getServerPubK)

rsaRouter.route('/sign')
	.get(rsa.signMsg)
rsaRouter.route('/sign')
	.post(rsa.signMsg)

rsaRouter.route('/login')
	.get(rsa.login)
rsaRouter.route('/login')
	.post(rsa.login)

	
export default rsaRouter;