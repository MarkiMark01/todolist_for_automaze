"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
exports.query = query;
const pg_1 = __importDefault(require("pg"));
const { Pool } = pg_1.default;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function query(text, params) {
    const client = await exports.pool.connect();
    try {
        const res = await client.query(text, params);
        return res;
    }
    finally {
        client.release();
    }
}
