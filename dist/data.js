"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = __importDefault(require("./models/users"));
var userList = new Array(new users_1.default("admin", "admin"), new users_1.default("Messi", "10"), new users_1.default("Bartomeu", "nobita"), new users_1.default("Laporta", "presi"), new users_1.default("Pique", "gavi"));
exports.default = userList;
//# sourceMappingURL=data.js.map