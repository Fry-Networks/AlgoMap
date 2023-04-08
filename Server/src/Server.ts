import express, { Request } from 'express';
import Database from './Database.js';
import fetch from 'node-fetch';
import bodyParser from 'body-parser';

export default class Server {
    app = express();
    db = new Database();
    public start(port: number) {

        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.set('trust proxy', true);
        this.app.post('/data', async (req, res) => {

            const data: reqData = req.body;
            console.log(data)
            if (!data) return res.sendStatus(400);
            const ip = this.getIpFromRequest(req);
            console.log(ip);
            if (!ip || ip === "::1") return res.send("Localhost detected");
            const location = await this.getIpLocation(ip);
            if (!location) return res.sendStatus(400);
            console.log(location);
            this.db.addMiner({
                ip: ip,
                bandwidth: data.bandwidth,
                location: location,
                lastUpdate: Date.now(),
                hwid: data.hwid
            })
            res.sendStatus(200);
        });
        this.app.get("/points", (req, res) => {
            const points = this.db.getMinersPoints();
            res.send(points);
        })
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
    private getIpFromRequest = (req: Request) => {
        let ips = (
            req.headers['cf-connecting-ip'] ||
            req.headers['x-real-ip'] ||
            req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress || ''
            // @ts-ignore
        ).split(',');
        const ip = ips[0].trim();
        if (ip === "::1") return null;
        //parse with regex an ipv4 address
        const ipv4Regex = /(?:[0-9]{1,3}\.){3}[0-9]{1,3}/;
        const ipv4 = ipv4Regex.exec(ip);
        if (ipv4) return ipv4[0];
        else return null
    };
}

export interface MinerData {
    ip: string;
    bandwidth: {
        rx: number;
        tx: number;
        time: number;
    };
    hwid: string;
    location: {
        country: string;
        city: string;
        lat: number;
        lon: number;
    };
    lastUpdate: number;
}



interface reqData {
    bandwidth: {
        rx: number;
        tx: number;
        time: number;
    };
    hwid: string;
}
