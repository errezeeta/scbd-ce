
import {Request, Response} from 'express';
import {generateKeys, RsaPublicKey, RsaPrivateKey, RsaKeyPair} from '@scbd/rsa';
import * as sha from 'object-sha';
import * as bic from 'bigint-conversion';
import userList from '../data';
import keys from '../index';
import User from '../models/users';
const bitLength = 1024;

export async function generateBothKeys(req: Request, res: Response): Promise<Response>{
    const keyPair: RsaKeyPair = await generateKeys(bitLength);
    const key = {
        e: bic.bigintToBase64(keyPair.publicKey.e),
		n: bic.bigintToBase64(keyPair.publicKey.n)
    }
    return res.status(201).json(key);
}

export async function getServerPubK(req: Request, res: Response): Promise<Response>{
	//añadir condicion login
	console.log(req.body);
	const username = req.body;
	const check = userList.find((obj) => {
		return obj.username === username.username;
	})
	//Si no encontramos el usuario en la lista (archivo data.ts), le denegaremos el acceso a la clave
	if (check === undefined) {
		const error = {
			message: "You are not authorized"
		}
		return res.status(401).json(error);
	}
	else {
		const key = {
			e: bic.bigintToBase64(await (await keys).publicKey.e),
			n: bic.bigintToBase64(await (await keys).publicKey.n)
		}
		return res.status(201).json(key);
	}
}

export async function signMsg(req: Request, res: Response): Promise<Response>{
	const msg = await (JSON.parse(JSON.stringify(await req.body)));
	console.log("Resumen recibido: " +bic.base64ToBigint(await msg.message));
	const privKey: RsaPrivateKey = await (await keys).privateKey;
	const sign = privKey.sign(bic.base64ToBigint(msg.message));
	const signed = bic.bigintToBase64(sign);
	console.log("Firma completada: " + await signed);
	const json = {
		message: signed,
	}
	console.log((await keys).publicKey.verify(await sign));
	console.log(json);
	return res.status(201).json(json);
}

export async function login(req:Request, res: Response): Promise<Response> {
	const msg = (JSON.parse(JSON.stringify(req.body)));
	var user: User = new User(msg.username,msg.password);
	const check = userList.find((obj) => {
		return obj.username === user.username && obj.password === user.password;
	})
	if (check === undefined) {
		const error = {
			message: "Login failed"
		}
		return res.status(401).json(error);
	}
	return res.status(201).json({"message": "login complete"});
}
