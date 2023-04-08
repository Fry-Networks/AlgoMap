import Enmap from 'enmap';
import { MinerData } from './Server.js';

export default class Database {
    public db: Enmap<string, MinerDataDB> = new Enmap({ name: 'miners' })
    public addMiner(miner: MinerData) {
        if (this.db.has(miner.hwid)) {
            this.updateMiner(miner);
        } else {
            console.log(miner);
            const data: MinerDataDB = {
                ...miner,
                bandwidth: [{
                    rx: miner.bandwidth.rx,
                    tx: miner.bandwidth.tx,
                    time: Date.now()
                }]
            }
            this.db.set(miner.hwid, data);
        }
    }
    public updateMiner(miner: MinerData) {
        const oldMiner = this.db.get(miner.hwid);
        if (!oldMiner) return this.addMiner(miner);

        const newMiner: MinerDataDB = {
            ...oldMiner,
            bandwidth: [
                ...oldMiner.bandwidth,
                {
                    rx: miner.bandwidth.rx,
                    tx: miner.bandwidth.tx,
                    time: Date.now()
                },
            ],
            lastUpdate: Date.now()
        }
        if (oldMiner.location.lat !== miner.location.lat || oldMiner.location.lon !== miner.location.lon) {
            newMiner.location = miner.location;
        }
        this.db.set(miner.hwid, newMiner);
    }





    public getMiners() {
        return this.db.array();
    }
    public getMinersPoints() {
        const miners = this.getMiners();
        const points: toSend[] = [];
        miners.forEach((miner) => {
            if (miner.location) {
                const five = {
                    rx: miner.bandwidth.filter((b) => b.time > Date.now() - 5 * 60 * 1000).reduce((a, b) => a + b.rx, 0),
                    tx: miner.bandwidth.filter((b) => b.time > Date.now() - 5 * 60 * 1000).reduce((a, b) => a + b.tx, 0),
                }
                const sevendays = {
                    rx: miner.bandwidth.filter((b) => b.time > Date.now() - 7 * 24 * 60 * 60 * 1000).reduce((a, b) => a + b.rx, 0),
                    tx: miner.bandwidth.filter((b) => b.time > Date.now() - 7 * 24 * 60 * 60 * 1000).reduce((a, b) => a + b.tx, 0),
                }
                const fourteendays = {
                    rx: miner.bandwidth.filter((b) => b.time > Date.now() - 14 * 24 * 60 * 60 * 1000).reduce((a, b) => a + b.rx, 0),
                    tx: miner.bandwidth.filter((b) => b.time > Date.now() - 14 * 24 * 60 * 60 * 1000).reduce((a, b) => a + b.tx, 0),
                }
                const month = {
                    rx: miner.bandwidth.filter((b) => b.time > Date.now() - 30 * 24 * 60 * 60 * 1000).reduce((a, b) => a + b.rx, 0),
                    tx: miner.bandwidth.filter((b) => b.time > Date.now() - 30 * 24 * 60 * 60 * 1000).reduce((a, b) => a + b.tx, 0),
                }
                const total = {
                    rx: miner.bandwidth.reduce((a, b) => a + b.rx, 0),
                    tx: miner.bandwidth.reduce((a, b) => a + b.tx, 0),
                }
                points.push({
                    lat: miner.location.lat,
                    lon: miner.location.lon,
                    hwid: miner.hwid,
                    five,
                    sevendays,
                    fourteendays,
                    month,
                    total
                })
            }
        })
        return points;
    }
}


export interface MinerDataDB {
    ip: string;
    bandwidth: {
        rx: number;
        tx: number;
        time: number;
    }[];
    hwid: string;
    location: {
        country: string;
        city: string;
        lat: number;
        lon: number;
    };
    lastUpdate: number;
}

interface toSend {
    lat: number,
    lon: number,
    hwid: string,
    five: {
        rx: number;
        tx: number;
    }
    sevendays: {
        rx: number;
        tx: number;
    }
    fourteendays: {
        rx: number;
        tx: number;
    }
    month: {
        rx: number;
        tx: number;
    }
    total: {
        rx: number;
        tx: number;
    }
}