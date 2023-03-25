import Enmap from 'enmap';
import { MinerData } from './Server.js';

export default class Database {
    static db = new Enmap({ name: 'miners' });
    static addMiner(miner: MinerData) {
        console.log(miner);
        this.db.set(miner.ip, miner);
    }
    static getMiners() {
        return this.db.array();
    }
}