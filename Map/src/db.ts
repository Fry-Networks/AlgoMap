import Enmap from "enmap";

class Database {
    db: Enmap<string, MinerData> = new Enmap({ name: 'data' });
    public getMiners(): MinerData[] {
        return this.db.array();
    }
    public addMiner(data: MinerData) {
        this.db.set(data.ip, data);
    }

}
export default new Database();

export interface MinerData {
    ip: string;
    bandwidth: { rx: number, tx: number };
    location: { country: string, city: string, lat: number, lon: number };
    lastUpdate: number;
}