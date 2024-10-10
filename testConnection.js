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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
require('dotenv').config({ path: '.env.local' });
var _a = require('mongodb'), MongoClient = _a.MongoClient, MongoServerError = _a.MongoServerError, MongoNetworkError = _a.MongoNetworkError;
function testConnection() {
    return __awaiter(this, void 0, void 0, function () {
        var client, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!process.env.MONGODB_URI) {
                        console.error('MONGODB_URI is not defined in the environment variables');
                        process.exit(1);
                    }
                    console.log('MONGODB_URI:', process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@')); // Log the URI with password hidden
                    client = new MongoClient(process.env.MONGODB_URI, {
                        serverSelectionTimeoutMS: 5000,
                        connectTimeoutMS: 10000,
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 7]);
                    console.log('Attempting to connect to MongoDB...');
                    return [4 /*yield*/, client.connect()];
                case 2:
                    _a.sent();
                    console.log('Connected successfully to MongoDB');
                    return [4 /*yield*/, client.db('journalDB').command({ ping: 1 })];
                case 3:
                    _a.sent();
                    console.log('MongoDB is responsive');
                    return [3 /*break*/, 7];
                case 4:
                    error_1 = _a.sent();
                    console.error('Failed to connect to MongoDB:', error_1);
                    if (error_1 instanceof MongoServerError) {
                        console.error('Error code:', error_1.code);
                        console.error('Error message:', error_1.errmsg || error_1.message);
                    }
                    else if (error_1 instanceof MongoNetworkError) {
                        console.error('Network error details:', error_1.message);
                    }
                    else if (error_1 instanceof Error) {
                        console.error('Error message:', error_1.message);
                    }
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, client.close()];
                case 6:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    });
}
testConnection();
