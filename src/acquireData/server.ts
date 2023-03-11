import express from 'express';
const fetch = require('node-fetch');
class Server {
    app = express();


    public start(port: number, callback: () => void) {
  
        this.app.post('/data', async (req, res) => {
            const data: MinerData = req.body;
            if(!data) return res.sendStatus(400);
            console.log(data);
            const location = await this.getIpLocation(data.ip);
            if(!location) return res.sendStatus(400);
            console.log(location);
        
        });
        this.app.listen(port, callback);
    }

    private getIpLocation(ip: string) {
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
                return {
                    country: "Unknown",
                    city: "Unknown",
                    lat: 0,
                    lon: 0
                }
            })
    }

}
export default Server;

interface MinerData {
    ip: string;
    bandwidth: { rx: number, tx: number };
}