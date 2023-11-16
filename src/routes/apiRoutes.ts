import { Router } from "express";
import { MetaverseController } from "../controllers/controller";
import { MetaverseService } from "../services/service";
import { ApiController } from "../controllers/api.controllers";

export function apiRoutes(metaverseService: MetaverseService): Router {
  const router = Router();
  const metaverseController = new MetaverseController(metaverseService);
  const apiController = new ApiController(metaverseService);

  router.get(
    "/coins/:room",
    metaverseController.getCoinsInRoom.bind(metaverseController),
  );
  router.post(
    "/grab/:id",
    metaverseController.grabCoin.bind(metaverseController),
  );
  router.get("/rooms", apiController.getRooms.bind(apiController));
  router.get(
    "/coins/count/:room",
    apiController.getCoinsCountInRoom.bind(apiController),
  );

  return router;
}
