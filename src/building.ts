import {Floor} from "./floor";
import {Settings} from "./settings";
import {Elevator} from "./elevator";


export class Building {

    floors: Floor[] = [];
    elevators: Elevator[] = [];
    buildingElement: HTMLDivElement = document.createElement("div");
    floorsElement: HTMLDivElement = document.createElement("div");
    elevatorShaft: HTMLDivElement = document.createElement("div");
    roof: HTMLImageElement = document.createElement('img');

    constructor(numOfFloors: number, numOfElevators: number) {

        this.initialElevators(numOfElevators);
        this.initialFloors(numOfFloors);
        this.initialElements();

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
            const floor: Floor = new Floor(i, this.callElevator);
            this.floors.push(floor);
            this.floorsElement.appendChild(floor.floorElement);
            if (i != numOfFloors) {
                this.floorsElement.appendChild(floor.lineElement);
            }
        }
        this.floorsElement.appendChild(this.roof);
    }

    initialElements = (): void => {
        this.roof.src = "../assets/roof.png";

        this.buildingElement.className = "building";
        this.elevatorShaft.className = "elevatorShaft";
        this.floorsElement.className = "floors";
        this.roof.className = "roof";


        this.buildingElement.appendChild(this.floorsElement);
        this.buildingElement.appendChild(this.elevatorShaft);

        const buildings: HTMLElement | null = document.getElementById("buildings");
        if (buildings) {
            buildings.appendChild(this.buildingElement);
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

            const currentSpeed: number =
                Math.abs(elevator.destination - floorNumber) * Settings.timeBetweenFloors
                + (currentTime > elevator.timer ? 0
                : (elevator.timer - currentTime) / Settings.millisecond);

            if (currentSpeed < minTime) {
                minTime = currentSpeed;
                elevatorID = elevator.id;
            }
        }
        return this.elevators[elevatorID];
    }

    callFreeElevator = (elevator: Elevator, currentTime: number, floorNumber: number, gap: number): void => {
        elevator.move(floorNumber, this.freeFloor);
        elevator.timer = currentTime + Settings.timeInFloor + (gap * Settings.timeBetweenFloors) * Settings.millisecond;
        this.floors[floorNumber].startCounter(gap * Settings.timeBetweenFloors);
    }

    callBusyElevator = (elevator: Elevator, currentTime: number, floorNumber: number, gap: number): void => {
        setTimeout((): void => {
            elevator.move(floorNumber, this.freeFloor)
        }, elevator.timer - currentTime)
        this.floors[floorNumber].startCounter(gap * Settings.timeBetweenFloors + (elevator.timer - currentTime) / Settings.millisecond);
        elevator.timer += ((gap * Settings.timeBetweenFloors) * Settings.millisecond + Settings.timeInFloor);
    }
    callElevator = (floorNumber: number): void => {

        let currentTime: number = Date.now();
        const selectedElevator: Elevator = this.chooseElevator(floorNumber, currentTime);
        let gap: number = Math.abs(selectedElevator.destination - floorNumber);

        if (currentTime > selectedElevator.timer) { 
            this.callFreeElevator(selectedElevator, currentTime, floorNumber, gap);
        } else {
            this.callBusyElevator(selectedElevator, currentTime, floorNumber, gap);
        }
        selectedElevator.destination = floorNumber;
    }
}

