import { Request, Response } from 'express';
import { MetaverseService } from '../services/service';

export class ApiController {
  private metaverseService: MetaverseService;

  constructor(metaverseService: MetaverseService) {
    this.metaverseService = metaverseService;
  }

  public getRooms(req: Request, res: Response): void {
    const rooms = this.metaverseService.getRooms();
    res.json(rooms);
  }

  public getCoinsCountInRoom(req: Request, res: Response): void {
    const { room } = req.params;
    const count = this.metaverseService.getCoinsInRoom(room);
    res.json({ count });
  }
}
