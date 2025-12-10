import { createPlanet, findPlanet, listPlanet } from "./planet";

export const router = {
  planet: {
    listPlanet,
    findPlanet,
    createPlanet
  }
}
