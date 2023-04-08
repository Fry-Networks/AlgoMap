import Server from "./Server.js";
import Database from "./Database.js";
const server = new Server();
server.start(3001);
const points = server.db.getMinersPoints();
for (const point of points) {
    console.log(point);
}