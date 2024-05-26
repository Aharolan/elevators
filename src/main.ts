import { Settings } from "./settings";
import { BuildingFactory } from "../factories/buildingFactory";


const buildings = Settings.buildingsAttributes.map(attribute => {
    const [numOfFloors, numOfElevators] = Object.entries(attribute)[0].map(Number);
    return BuildingFactory.getBuilding(numOfFloors, numOfElevators);
});

