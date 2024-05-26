import {Settings} from "../src/settings";
import {Building} from "../src/building";

export class BuildingFactory {
    static getBuilding(num_of_floors: number, num_of_elevators: number): Building {
        return new Building(num_of_floors, num_of_elevators);
    }
}

