import { Coin } from '../models/Coin';

export class MetaverseService {
  private coinsByRoom: Record<string, Coin[]> = {};

  constructor() {
    // Genera las monedas y habitaciones al iniciar la aplicación
    this.generateCoins('sala1', 10, { xmin: 0, xmax: 100, ymin: 0, ymax: 100, zmin: 0, zmax: 100 });
    this.generateCoins('sala2', 5, { xmin: 0, xmax: 50, ymin: 0, ymax: 50, zmin: 0, zmax: 50 });
    // ... otras llamadas a generateCoins para otras habitaciones
  }

  public generateCoins(room: string, count: number, area: any): Coin[] {
    // Si la habitación no existe, créala
    if (!this.coinsByRoom[room]) {
      this.coinsByRoom[room] = this.generateRoom(room, area);
    }
  
    // Lógica para generar las monedas en la habitación
    const coins: Coin[] = [];
  
    for (let i = 0; i < count; i++) {
      const coin: Coin = {
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

  private generateRoom(room: string, area: any): Coin[] {
    // Lógica para generar la habitación
    const roomCoins: Coin[] = [];

    for (let i = 0; i < 5; i++) {
      const coin: Coin = {
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

  public getCoinsInRoom(room: string): Coin[] {
    return this.coinsByRoom[room] || [];
  }

  public getRooms(): string[] {
    return Object.keys(this.coinsByRoom);
  }

  public removeCoin(id: string): void {
    for (const room in this.coinsByRoom) {
      this.coinsByRoom[room] = this.coinsByRoom[room].filter((coin) => coin.id !== id);
    }
  }

  public startCoinGenerationTimer(): void {
    
    setInterval(() => {
      
      this.generateCoins('sala1', 10, { xmin: 0, xmax: 100, ymin: 0, ymax: 100, zmin: 0, zmax: 100 });
      this.generateCoins('sala2', 5, { xmin: 0, xmax: 50, ymin: 0, ymax: 50, zmin: 0, zmax: 50 });
     
    }, 60 * 60 * 1000); 
  }
}

function getRandomCoordinate(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}
