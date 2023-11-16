import { Room } from "./Rooms";

export interface Coin {
  id: string;
  x: number;
  y: number;
  z: number;
  room: string;
  available: boolean;
  ttl: number;
}
