import { createPlanet, findPlanet, listPlanet } from "./planet";
import { generateImage } from "./image";

export const router = {
  planet: {
    listPlanet,
    findPlanet,
    createPlanet
  },
  image: {
    generateImage
  }
}
