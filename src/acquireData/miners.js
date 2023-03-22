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
var miners_config_json_1 = require("./miners_config.json");
var os = require("os");
var fetch = require('node-fetch');
try {
    var BandwidthMonitor_1 = require('bandwidth-monitor');
    var fs_1 = require('fs');
    var wait_1 = function (ms) { return new Promise(function (resolve) { return setTimeout(resolve, ms); }); };
    var interval = 5 * 60 * 1000;
    if (miners_config_json_1.interfaceName.length > 1) {
        var b_1 = new BandwidthMonitor_1({
            interfaces: [miners_config_json_1.interfaceName]
        });
        try {
            b_1.monitors.get(miners_config_json_1.interfaceName).capture();
            var lastRx_1 = 0;
            var lastTx_1 = 0;
            setInterval(function () {
                console.log(b_1.monitors.get(miners_config_json_1.interfaceName));
                var currentRx = b_1.monitors.get(miners_config_json_1.interfaceName).totalRx;
                var currentTx = b_1.monitors.get(miners_config_json_1.interfaceName).totalTx;
                var diffRx = currentRx - lastRx_1;
                var diffTx = currentTx - lastTx_1;
                lastRx_1 = currentRx;
                lastTx_1 = currentTx;
                //TODO: MAKE REQUEST
                fetch('http://localhost:3001/data', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        bandwidth: {
                            rx: diffRx,
                            tx: diffTx
                        }
                    })
                });
                console.log("Sent data to server!");
            }, 5000);
        }
        catch (e) {
            console.log(e);
            console.log("\n\n===================  I may need root permissions to be used, or the interface you entered is incorrect  ===================\n\n");
        }
    }
    else {
        (function () { return __awaiter(void 0, void 0, void 0, function () {
            var interfaces, networkInterfaces, interfaceNames, interfacesResults_1, promises, bestInterface, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        interfaces = os.networkInterfaces();
                        if (!interfaces)
                            throw new Error("No interfaces found!");
                        networkInterfaces = Object.entries(interfaces)
                            .filter(function (_a) {
                            var key = _a[0], value = _a[1];
                            return !key.includes('anpi');
                        })
                            .reduce(function (acc, _a) {
                            var key = _a[0], value = _a[1];
                            //@ts-ignore
                            acc[key] = value.filter(function (v) { return (v.family === 'IPv4' || v.family === 'IPv6') && !v.internal; });
                            return acc;
                        }, {});
                        interfaceNames = Object.keys(networkInterfaces);
                        interfacesResults_1 = [];
                        console.log("".concat(interfaceNames.length, " interfaces found!\nCapturing data for 15s to find the most used..."));
                        promises = interfaceNames.map(function (interfaceName) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, new Promise(function (resolve) { return __awaiter(void 0, void 0, void 0, function () {
                                        var b, e_2;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    _a.trys.push([0, 2, , 3]);
                                                    b = new BandwidthMonitor_1({
                                                        interfaces: [interfaceName]
                                                    });
                                                    console.log(interfaceName);
                                                    b.monitors.get(interfaceName).capture();
                                                    return [4 /*yield*/, wait_1(15000)];
                                                case 1:
                                                    _a.sent();
                                                    b.monitors.get(interfaceName).close();
                                                    interfacesResults_1.push(b.monitors.get(interfaceName));
                                                    resolve(b.monitors.get(interfaceName));
                                                    return [3 /*break*/, 3];
                                                case 2:
                                                    e_2 = _a.sent();
                                                    console.log(e_2);
                                                    console.log(interfaceName);
                                                    return [3 /*break*/, 3];
                                                case 3: return [2 /*return*/];
                                            }
                                        });
                                    }); })];
                            });
                        }); });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1:
                        _a.sent();
                        interfacesResults_1 = interfacesResults_1.sort(function (a, b) {
                            return b.totalRx - a.totalRx;
                        });
                        bestInterface = interfacesResults_1[0];
                        fs_1.writeFileSync("miners_config.json", JSON.stringify({ interfaceName: bestInterface.device.name }));
                        console.log("Best interface found: ".concat(bestInterface.device.name, "\nPlease restart the script to use it!"));
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        console.log(e_1);
                        console.log("\n\n===================  I may need root permissions to be used, or the interface you entered is incorrect  ===================\n\n");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); })();
    }
}
catch (e) {
    console.log(e);
    console.log("\n\n===================  I may need root permissions to be used, or the interface you entered is incorrect  ===================\n\n");
}
