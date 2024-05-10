import {Floor} from "./floor";
import {Settings} from "./settings";
import {Elevator} from "./elevator";


class Building {

    floors: Floor[] = [];
    elevators: Elevator[] = [];
    buildingElement: HTMLDivElement = document.createElement("div");
    floorsElement: HTMLDivElement = document.createElement("div");
    elevatorShaft: HTMLDivElement = document.createElement("div");

    constructor(num_of_floors: number, num_of_elevators: number) {
        this.buildingElement.className = "building";
        this.elevatorShaft.className = "elevatorShaft";
        this.floorsElement.className = "floors";

        // creates elevators
        for (let i = 0; i < num_of_elevators; i++) {
            const elevator = new Elevator(i);
            this.elevators.push(elevator);
            this.elevatorShaft.appendChild(elevator.img);
        }

        // creates floors
        for (let i = 0; i <= num_of_floors; i++) {
            const floor: Floor = new Floor(i, this.orderElevator);
            this.floors.push(floor);
            this.floorsElement.appendChild(floor.floorElement);
            if (i != num_of_floors) {
                this.floorsElement.appendChild(floor.lineElement);
            }
            this.floorsElement.className = 'floors';
        }

        const building: HTMLElement | null = document.getElementById("building");
        if (building) {
            building.appendChild(this.floorsElement);
            building.appendChild(this.elevatorShaft);
        }
    }

    freeFloor = (floorNumber: number) => {
        this.floors[floorNumber].isInActive = false;
        this.floors[floorNumber].button.style.color = "hsla(0,0%,20%,1)";
    }

    chooseElevator = (floorNumber: number, currentTime: number): Elevator => {
        let minTime: number = Infinity;
        let elevatorID: number = 0;

        for (let elevator of this.elevators) {

            const currentMin: number =
                Math.abs(elevator.destination - floorNumber) * 500
                + Settings.timeInFloor
                + (currentTime > elevator.timer ? 0 : elevator.timer - currentTime);

            if (currentMin < minTime) {
                minTime = currentMin;
                elevatorID = elevator.id;
            }
        }
        return this.elevators[elevatorID];
    }
    orderElevator = (floorNumber: number): void => {

        let currentTime: number = Date.now();
        const selectedElevator: Elevator = this.chooseElevator(floorNumber, currentTime);
        let gap: number = Math.abs(selectedElevator.destination - floorNumber);
        selectedElevator.destination = floorNumber;

        if (currentTime > selectedElevator.timer) { // the elevator is resting
            selectedElevator.move(floorNumber, this.freeFloor);
            selectedElevator.timer = currentTime + (gap * 0.5 + 2) * 1000;
            this.floors[floorNumber].startCounter(gap * 0.5)
        } else {
            setTimeout((): void => { // the elevator is working
                selectedElevator.move(floorNumber, this.freeFloor)
            }, selectedElevator.timer - currentTime)
            selectedElevator.timer += (gap * 0.5 + 2) * 1000;
            this.floors[floorNumber].startCounter(gap * 0.5 + (selectedElevator.timer - currentTime) / 1000)
        }
    }
}

class BuildingFactory {
    static getBuilding(num_of_floors: number, num_of_elevators: number): Building {
        return new Building(num_of_floors, num_of_elevators);
    }
}

const building1: Building = BuildingFactory.getBuilding(Settings.num_of_floors, Settings.num_of_elevators);
const building2: Building = BuildingFactory.getBuilding(4, 1);
const building3: Building = BuildingFactory.getBuilding(8, 2);
