"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signMsg = exports.getServerPubK = exports.generateBothKeys = void 0;
const rsa_1 = require("@scbd/rsa");
const bic = __importStar(require("bigint-conversion"));
const data_1 = __importDefault(require("../data"));
const index_1 = __importDefault(require("../index"));
const users_1 = __importDefault(require("../models/users"));
const bitLength = 1024;
function generateBothKeys(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const keyPair = yield (0, rsa_1.generateKeys)(bitLength);
        const key = {
            e: bic.bigintToBase64(keyPair.publicKey.e),
            n: bic.bigintToBase64(keyPair.publicKey.n)
        };
        return res.status(201).json(key);
    });
}
exports.generateBothKeys = generateBothKeys;
function getServerPubK(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //añadir condicion login
        console.log(req.body);
        const username = req.body;
        const check = data_1.default.find((obj) => {
            return obj.username === username.username;
        });
        //Si no encontramos el usuario en la lista (archivo data.ts), le denegaremos el acceso a la clave
        if (check === undefined) {
            const error = {
                message: "You are not authorized"
            };
            return res.status(401).json(error);
        }
        else {
            const key = {
                e: bic.bigintToBase64(yield (yield index_1.default).publicKey.e),
                n: bic.bigintToBase64(yield (yield index_1.default).publicKey.n)
            };
            return res.status(201).json(key);
        }
    });
}
exports.getServerPubK = getServerPubK;
function signMsg(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const msg = yield (JSON.parse(JSON.stringify(yield req.body)));
        console.log("Resumen recibido: " + bic.base64ToBigint(yield msg.message));
        const privKey = yield (yield index_1.default).privateKey;
        const sign = privKey.sign(bic.base64ToBigint(msg.message));
        const signed = bic.bigintToBase64(sign);
        console.log("Firma completada: " + (yield signed));
        const json = {
            message: signed,
        };
        console.log((yield index_1.default).publicKey.verify(yield sign));
        console.log(json);
        return res.status(201).json(json);
    });
}
exports.signMsg = signMsg;
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const msg = (JSON.parse(JSON.stringify(req.body)));
        var user = new users_1.default(msg.username, msg.password);
        const check = data_1.default.find((obj) => {
            return obj.username === user.username && obj.password === user.password;
        });
        if (check === undefined) {
            const error = {
                message: "Login failed"
            };
            console.log("sf");
            return res.status(401).json(error);
        }
        console.log("TOMAROMAAAA");
        return res.status(201).json({ "message": "login complete" });
    });
}
exports.login = login;
//# sourceMappingURL=rsa.controller.js.map