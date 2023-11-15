import { Request, Response } from 'express';
import { MetaverseService } from '../services/service';
import { Room } from '../models/Rooms';

export class MetaverseController {
  private metaverseService: MetaverseService;

  constructor(metaverseService: MetaverseService) {
    this.metaverseService = metaverseService;
  }

  public getCoinsInRoom(req: Request, res: Response): void {
    const roomName = req.params.room;
    const coins = this.metaverseService.getCoinsInRoom(roomName);
    res.json(coins);
  }

  public grabCoin(req: Request, res: Response): void {
    const coinId = req.params.id;
    this.metaverseService.removeCoin(coinId);
    // Implementar lógica para informar a todos los clientes sobre la moneda agarrada
    res.sendStatus(204);
  }

  public getRooms(req: Request, res: Response): void {
    const rooms = this.metaverseService.getRooms();
    res.json(rooms);
  }
}
