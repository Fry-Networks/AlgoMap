"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var express_1 = require("express");
var enmap_1 = require("enmap");
var fetch = require('node-fetch');
var Server = /** @class */ (function () {
    function Server() {
        this.app = (0, express_1)();
        this.db = new enmap_1({ name: 'data' });
    }
    Server.prototype.start = function (port) {
        var _this = this;
        this.app.post('/data', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var data, ip, location;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = req.body;
                        if (!data)
                            return [2 /*return*/, res.sendStatus(400)];
                        ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
                        if (!ip)
                            return [2 /*return*/, res.sendStatus(400)];
                        console.log(data);
                        return [4 /*yield*/, this.getIpLocation(data.ip)];
                    case 1:
                        location = _a.sent();
                        if (!location)
                            return [2 /*return*/, res.sendStatus(400)];
                        console.log(location);
                        this.db.set(ip, {
                            ip: ip,
                            bandwidth: data.bandwidth,
                            location: location,
                            lastUpdate: Date.now()
                        });
                        res.sendStatus(200);
                        return [2 /*return*/];
                }
            });
        }); });
        this.app.listen(port);
        console.log("Server started on port ".concat(port));
    };
    Server.prototype.getIpLocation = function (ip) {
        return fetch("http://ip-api.com/json/".concat(ip))
            .then(function (res) { return res.json(); })
            .then(function (json) {
            return {
                country: json.country,
                city: json.city,
                lat: json.lat,
                lon: json.lon
            };
        })["catch"](function (e) {
            console.log(e);
            return null;
        });
    };
    Server.prototype.getMiners = function () {
        return this.db.array();
    };
    return Server;
}());
var server = new Server();
exports["default"] = server;
server.start(3001);
