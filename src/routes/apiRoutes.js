"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRoutes = void 0;
const express_1 = require("express");
const controller_1 = require("../controllers/controller");
const api_controllers_1 = require("../controllers/api.controllers");
function apiRoutes(metaverseService) {
    const router = (0, express_1.Router)();
    const metaverseController = new controller_1.MetaverseController(metaverseService);
    const apiController = new api_controllers_1.ApiController(metaverseService);
    router.get('/coins/:room', metaverseController.getCoinsInRoom.bind(metaverseController));
    router.post('/grab/:id', metaverseController.grabCoin.bind(metaverseController));
    router.get('/rooms', apiController.getRooms.bind(apiController));
    router.get('/coins/count/:room', apiController.getCoinsCountInRoom.bind(apiController));
    return router;
}
exports.apiRoutes = apiRoutes;
