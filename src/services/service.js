"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaverseService = void 0;
class MetaverseService {
    constructor() {
        this.coinsByRoom = {};
        // Genera las monedas y habitaciones al iniciar la aplicación
        this.generateCoins('sala1', 10, { xmin: 0, xmax: 100, ymin: 0, ymax: 100, zmin: 0, zmax: 100 });
        this.generateCoins('sala2', 5, { xmin: 0, xmax: 50, ymin: 0, ymax: 50, zmin: 0, zmax: 50 });
        // ... otras llamadas a generateCoins para otras habitaciones
    }
    generateCoins(room, count, area) {
        // Si la habitación no existe, créala
        if (!this.coinsByRoom[room]) {
            this.coinsByRoom[room] = this.generateRoom(room, area);
        }
        // Lógica para generar las monedas en la habitación
        const coins = [];
        for (let i = 0; i < count; i++) {
            const coin = {
                id: `coin-${i + 1}`,
                x: getRandomCoordinate(area.xmin, area.xmax),
                y: getRandomCoordinate(area.ymin, area.ymax),
                z: getRandomCoordinate(area.zmin, area.zmax),
                room: room,
                available: true,
                ttl: 3600000, // 1 hora en milisegundos
            };
            coins.push(coin);
        }
        // Agrega las monedas a la habitación
        this.coinsByRoom[room] = [...this.coinsByRoom[room], ...coins];
        return coins;
    }
    generateRoom(room, area) {
        // Lógica para generar la habitación
        const roomCoins = [];
        for (let i = 0; i < 5; i++) {
            const coin = {
                id: `room-coin-${i + 1}`,
                x: getRandomCoordinate(area.xmin, area.xmax),
                y: getRandomCoordinate(area.ymin, area.ymax),
                z: getRandomCoordinate(area.zmin, area.zmax),
                room: room,
                available: true,
                ttl: 3600000, // 1 hora en milisegundos
            };
            roomCoins.push(coin);
        }
        return roomCoins;
    }
    getCoinsInRoom(room) {
        return this.coinsByRoom[room] || [];
    }
    getRooms() {
        return Object.keys(this.coinsByRoom);
    }
    removeCoin(id) {
        for (const room in this.coinsByRoom) {
            this.coinsByRoom[room] = this.coinsByRoom[room].filter((coin) => coin.id !== id);
        }
    }
    startCoinGenerationTimer() {
        // Llama a generateCoins cada hora
        setInterval(() => {
            // Llama a generateCoins para cada habitación
            this.generateCoins('sala1', 10, { xmin: 0, xmax: 100, ymin: 0, ymax: 100, zmin: 0, zmax: 100 });
            this.generateCoins('sala2', 5, { xmin: 0, xmax: 50, ymin: 0, ymax: 50, zmin: 0, zmax: 50 });
            // ... otras llamadas a generateCoins para otras habitaciones
        }, 60 * 60 * 1000); // Cada hora
    }
}
exports.MetaverseService = MetaverseService;
function getRandomCoordinate(min, max) {
    return Math.random() * (max - min) + min;
}
