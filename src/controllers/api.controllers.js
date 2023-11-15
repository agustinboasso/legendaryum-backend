"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiController = void 0;
class ApiController {
    constructor(metaverseService) {
        this.metaverseService = metaverseService;
    }
    getRooms(req, res) {
        const rooms = this.metaverseService.getRooms();
        res.json(rooms);
    }
    getCoinsCountInRoom(req, res) {
        const { room } = req.params;
        const count = this.metaverseService.getCoinsInRoom(room);
        res.json({ count });
    }
}
exports.ApiController = ApiController;
