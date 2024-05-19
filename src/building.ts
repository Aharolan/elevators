import {Floor} from "./floor";
import {Settings} from "./settings";
import {Elevator} from "./elevator";


class Building {

    floors: Floor[] = [];
    elevators: Elevator[] = [];
    buildingElement: HTMLDivElement = document.createElement("div");
    floorsElement: HTMLDivElement = document.createElement("div");
    elevatorShaft: HTMLDivElement = document.createElement("div");

    constructor(numOfFloors: number, numOfElevators: number) {
        this.buildingElement.className = "building";
        this.elevatorShaft.className = "elevatorShaft";
        this.floorsElement.className = "floors";

        this.initialElevators(numOfElevators);
        this.initialFloors(numOfFloors);
        this.appendElements();

    }

    initialElevators = (numOfElevators: number): void => {
        for (let i: number = 0; i < numOfElevators; i++) {
            const elevator: Elevator = new Elevator(i);
            this.elevators.push(elevator);
            this.elevatorShaft.appendChild(elevator.img);
        }
    }

    initialFloors = (numOfFloors: number): void => {
        for (let i: number = 0; i <= numOfFloors; i++) {
            const floor: Floor = new Floor(i, this.orderElevator);
            this.floors.push(floor);
            this.floorsElement.appendChild(floor.floorElement);
            if (i != numOfFloors) {
                this.floorsElement.appendChild(floor.lineElement);
            }
        }
    }

    appendElements = (): void => {
        const building: HTMLElement | null = document.getElementById("building");
        if (building) {
            building.appendChild(this.floorsElement);
            building.appendChild(this.elevatorShaft);
        }
    }

    freeFloor = (floorNumber: number): void => {
        this.floors[floorNumber].isInActive = false;
        this.floors[floorNumber].button.style.color = "hsla(0,0%,20%,1)";
    }

    chooseElevator = (floorNumber: number, currentTime: number): Elevator => {
        let minTime: number = Infinity;
        let elevatorID: number = 0;

        for (let elevator of this.elevators) {

            const currentMin: number =
                Math.abs(elevator.destination - floorNumber) * Settings.timeBetweenFloors
                + (currentTime > elevator.timer // the elevator is resting
                    ? 0 : (elevator.timer - currentTime) / Settings.millisecond);

            if (currentMin < minTime) {
                minTime = currentMin;
                elevatorID = elevator.id;
            }
        }
        return this.elevators[elevatorID];
    }

    handleImmediateElevatorOrder = (elevator: Elevator, currentTime: number, floorNumber: number, gap: number): void => {
        elevator.move(floorNumber, this.freeFloor);
        elevator.timer = currentTime + Settings.timeInFloor + (gap * Settings.timeBetweenFloors) * Settings.millisecond;
        this.floors[floorNumber].startCounter(gap * Settings.timeBetweenFloors);
    }

    handleElevatorOrderInAWhile = (elevator: Elevator, currentTime: number, floorNumber: number, gap: number): void => {
        setTimeout((): void => { // the elevator is working
            elevator.move(floorNumber, this.freeFloor)
        }, elevator.timer - currentTime)
        this.floors[floorNumber].startCounter(gap * Settings.timeBetweenFloors + (elevator.timer - currentTime) / Settings.millisecond);
        elevator.timer += ((gap * Settings.timeBetweenFloors) * Settings.millisecond + Settings.timeInFloor);
    }
    orderElevator = (floorNumber: number): void => {

        let currentTime: number = Date.now();
        const selectedElevator: Elevator = this.chooseElevator(floorNumber, currentTime);
        let gap: number = Math.abs(selectedElevator.destination - floorNumber);

        if (currentTime > selectedElevator.timer) { // the elevator is resting
            this.handleImmediateElevatorOrder(selectedElevator, currentTime, floorNumber, gap);
        } else {
            this.handleElevatorOrderInAWhile(selectedElevator, currentTime, floorNumber, gap);
        }
        selectedElevator.destination = floorNumber;
    }
}

class BuildingFactory {
    static getBuilding(num_of_floors: number, num_of_elevators: number): Building {
        return new Building(num_of_floors, num_of_elevators);
    }
}

const building1: Building = BuildingFactory.getBuilding(Settings.numOfFloors, Settings.numOfElevators);
const building2: Building = BuildingFactory.getBuilding(4, 1);
const building3: Building = BuildingFactory.getBuilding(8, 2);
