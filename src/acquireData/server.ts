import express from 'express';
import Enmap from 'enmap';
const fetch = require('node-fetch');



class Server {
    app = express();
    db: Enmap<string, MinerData> = new Enmap({ name: 'data' });
    public start(port: number) {

        this.app.post('/data', async (req, res) => {
            console.log(req.body)
            const data: any = req.body;
            if (!data) return res.sendStatus(400);
            const ip = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress
            if(!ip) return res.sendStatus(400);
            console.log(data);
            const location = await this.getIpLocation(data.ip);
            if (!location) return res.sendStatus(400);
            console.log(location);
            this.db.set(ip, {
                ip,
                bandwidth: data.bandwidth,
                location,
                lastUpdate: Date.now()
            });
            res.sendStatus(200);
        });
        this.app.listen(port);
        console.log(`Server started on port ${port}`);
    }

    private getIpLocation(ip: string): Promise<{ country: string, city: string, lat: number, lon: number } | null> {
        return fetch(`http://ip-api.com/json/${ip}`)
            .then((res: any) => res.json())
            .then((json: any) => {
                return {
                    country: json.country,
                    city: json.city,
                    lat: json.lat,
                    lon: json.lon
                }
            })
            .catch((e: any) => {
                console.log(e);
                return null
            })
    }
    public getMiners(): MinerData[] {
        return this.db.array();
    }

}
const server = new Server();
export default server;
server.start(3001);

export interface MinerData {
    ip: string;
    bandwidth: { rx: number, tx: number };
    location: { country: string, city: string, lat: number, lon: number };
    lastUpdate: number;
}