import { Coin } from '../models/Coin';
import { redisClient } from '../redis/redisConfig';

export class MetaverseService {
  private coinsByRoom: Record<string, Coin[]> = {};
  redis: any;

  constructor() {
    
    this.redis = redisClient;

    this.generateCoins('sala1', 10, { xmin: 0, xmax: 100, ymin: 0, ymax: 100, zmin: 0, zmax: 100 });
    this.generateCoins('sala2', 5, { xmin: 0, xmax: 50, ymin: 0, ymax: 50, zmin: 0, zmax: 50 });
    
  }

  public generateCoins(room: string, count: number, area: any): Coin[] {
    
    if (!this.coinsByRoom[room]) {
      this.coinsByRoom[room] = this.generateRoom(room, area);
    }
  

    const coins: Coin[] = [];
  
    for (let i = 0; i < count; i++) {
      const coin: Coin = {
        id: `coin-${i + 1}`,
        x: getRandomCoordinate(area.xmin, area.xmax),
        y: getRandomCoordinate(area.ymin, area.ymax),
        z: getRandomCoordinate(area.zmin, area.zmax),
        room: room,
        available: true,
        ttl: 3600000, 
      };
      coins.push(coin);

      const coinKey = `coin:${coin.id}`;
      redisClient.hmset(coinKey, coin);
      redisClient.expire(coinKey, coin.ttl);
    }
  
   
    this.coinsByRoom[room] = [...this.coinsByRoom[room], ...coins];
  
    return coins;
  }

  private generateRoom(room: string, area: any): Coin[] {

    const roomCoins: Coin[] = [];

    for (let i = 0; i < 5; i++) {
      const coin: Coin = {
        id: `room-coin-${i + 1}`,
        x: getRandomCoordinate(area.xmin, area.xmax),
        y: getRandomCoordinate(area.ymin, area.ymax),
        z: getRandomCoordinate(area.zmin, area.zmax),
        room: room,
        available: true,
        ttl: 3600000, 
      };
      roomCoins.push(coin);
      
      const coinKey = `coin:${coin.id}`;
      redisClient.hmset(coinKey, coin);
      redisClient.expire(coinKey, coin.ttl);
    }

    return roomCoins;
  }

  public getCoinsInRoom(room: string): Coin[] {
    return this.redis.hgetall(`coin:${room}`);
  }

   public getRooms(): Promise<string[]> {
    return this.redis.keys('coin:*');
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
