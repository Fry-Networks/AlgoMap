import Server from "./Server.js";
import Database from "./Database.js";
const server = new Server();
server.start(3001);
console.log(server.db.getMinersPoints());