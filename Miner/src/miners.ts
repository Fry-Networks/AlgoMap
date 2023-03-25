import config from "./miners_config.json" assert {type: "json"};
import * as os from "os";
import axios from "axios";
const interfaceName = config.interfaceName;
import fs from 'fs';

async function main() {
    try {
        const BandwidthMonitor = (await import('bandwidth-monitor')).default;
        console.log(BandwidthMonitor);
        type DeviceMonitor = {
            device: { name: string, addresses: string[] },
            totalRx: number,
            totalTx: number,
            rxPerSec: number,
            txPerSec: number,
            isCapturing: boolean
        }
        const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
        const interval = 5 * 60 * 1000;
        if (interfaceName.length > 1) {
            const b = new BandwidthMonitor({
                interfaces: [interfaceName],
            }
            );
            try {
                b.monitors.get(interfaceName).capture();
                let lastRx = 0;
                let lastTx = 0;
                setInterval(() => {
                    console.log(b.monitors.get(interfaceName));
                    const currentRx = b.monitors.get(interfaceName).totalRx
                    const currentTx = b.monitors.get(interfaceName).totalTx
                    const diffRx = currentRx - lastRx;
                    const diffTx = currentTx - lastTx;
                    lastRx = currentRx;
                    lastTx = currentTx;

                    //TODO: MAKE REQUEST
                    axios.post("http://localhost:3001/data", {
                        bandwidth: {
                            rx: diffRx,
                            tx: diffTx
                        }
                    })
                    console.log("Sent data to server!");
                }, 5000);
            } catch (e) {
                console.log(e);
                console.log("\n\n===================  I may need root permissions to be used, or the interface you entered is incorrect  ===================\n\n");
            }
        } else {
            (async () => {
                try {
                    const interfaces: any = os.networkInterfaces();
                    if (!interfaces) throw new Error("No interfaces found!");
                    const networkInterfaces = Object.entries(interfaces)
                        .filter(([key, value]) => !key.includes('anpi'))
                        .reduce((acc, [key, value]) => {
                            //@ts-ignore
                            acc[key] = value.filter((v: any) => (v.family === 'IPv4' || v.family === 'IPv6') && !v.internal);
                            return acc;
                        }, {});
                    const interfaceNames = Object.keys(networkInterfaces);
                    let interfacesResults: DeviceMonitor[] = [];
                    console.log(`${interfaceNames.length} interfaces found!\nCapturing data for 15s to find the most used...`)
                    const promises = interfaceNames.map(async (interfaceName) => {
                        return new Promise(async (resolve) => {
                            try {
                                const b = new BandwidthMonitor({
                                    interfaces: [interfaceName],
                                });
                                console.log(interfaceName)
                                b.monitors.get(interfaceName).capture();
                                await wait(15000);
                                b.monitors.get(interfaceName).close();
                                interfacesResults.push(b.monitors.get(interfaceName));
                                resolve(b.monitors.get(interfaceName));
                            } catch (e) {
                                console.log(e);
                                console.log(interfaceName)
                            }
                        });
                    });

                    await Promise.all(promises);


                    interfacesResults = interfacesResults.sort((a, b) => {
                        return b.totalRx - a.totalRx;
                    });
                    const bestInterface = interfacesResults[0];

                    fs.writeFileSync("miners_config.json", JSON.stringify({ interfaceName: bestInterface.device.name }));
                    console.log(`Best interface found: ${bestInterface.device.name}\nPlease restart the script to use it!`);
                } catch (e) {
                    console.log(e);
                    console.log("\n\n===================  I may need root permissions to be used, or the interface you entered is incorrect  ===================\n\n");
                }
            })();
        }
    } catch (e) {
        console.log(e);
        console.log("\n\n===================  I may need root permissions to be used, or the interface you entered is incorrect  ===================\n\n");
    }
}
main();
export { }