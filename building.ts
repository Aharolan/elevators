
class Settings {
    num_of_buildings: number = 3
    num_of_elevators: number = 3;
    num_of_floors: number = 15;
    timeInFloor: number = 2000;
}

class Elevator {
    id: number;
    img: HTMLImageElement = document.createElement('img');
    ding: HTMLAudioElement = document.createElement('audio');
    currentFloor: number = 0;
    destination: number = 0;
    timer: number = 0;
    constructor(id: number) {
        this.img.src = "./elv.png";
        this.ding.src = "./ding.mp3";
        this.ding.controls = true;
        this.ding.volume = 0.3
        this.img.onclick = (): void => {
            this.img.style.transform = `translateY(${-200}px)`;
        }

        this.img.id = "elevator" + id.toString();
        this.id = id;
        this.img.classList.add("elevator");
    }

    move = (destination: number, freeFloor: (floorNumber: number) => void): void => {

        let gap:number = Math.abs(this.currentFloor - destination);

        this.img.style.transition = `transform ${gap * 0.5}s ease`
        this.img.style.transform = `translateY(${- destination * 110}px)`

        this.currentFloor = destination;



        setTimeout(() => {
            this.ding.play();
            setTimeout(() => {
                this.ding.pause();
                freeFloor(destination);
                }, settings.timeInFloor
            )}, gap * 0.5 * 1000
        )
    }

}

class Floor {

    public isInActive: boolean = false;
    floorNumber: number;
    button: HTMLButtonElement = document.createElement("button");
    floorElement: HTMLDivElement = document.createElement("div");
    lineElement: HTMLDivElement = document.createElement("div");


    constructor(floorNumber: number, orderElevator: ( floorNumber: number) => void ) {
        this.lineElement.className = "blackLine";
        this.floorElement.classList.add("floor");
        //TODO: what is classList.add;
        // this.button.classList.add('metal.linear');
        this.button.className = "metal linear";
        this.floorNumber = floorNumber
        this.button.textContent = this.floorNumber.toString();
        this.button.id = floorNumber.toString();
        this.button.onclick = () => {
            if (!this.isInActive) {
                orderElevator(this.floorNumber)
                this.isInActive = true;
            }
        };
        this.floorElement.appendChild(this.button);
        this.floorElement.id = floorNumber.toString();
        console.log()
    }

}


class Building {

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

        const building: HTMLElement = document.getElementById("building")
        building.appendChild(this.floorsElement);
        building.appendChild(this.elevatorShaft);
    }

    floors: Floor[] = [];
    elevators: Elevator[] = [];
    buildingElement: HTMLDivElement = document.createElement("div");
    floorsElement: HTMLDivElement = document.createElement("div");
    elevatorShaft: HTMLDivElement = document.createElement("div");

    freeFloor = (floorNumber: number) => {
        this.floors[floorNumber].isInActive = false;
    }

    chooseElevator = (floorNumber: number, currentTime: number) => {
        let minTime: number = Infinity;
        let elevatorID: number = 0;

        for (let elevator of this.elevators) {

            const currentMin =
                Math.abs(elevator.destination - floorNumber) * 500
                + settings.timeInFloor
                + (currentTime > elevator.timer ? 0 : elevator.timer - currentTime);

            if (currentMin < minTime) {
                minTime = currentMin;
                elevatorID = elevator.id;
            }
        }
        return this.elevators[elevatorID];
    }
    orderElevator = (floorNumber: number) => {

        let currentTime: number = Date.now();
        const selectedElevator: Elevator = this.chooseElevator(floorNumber, currentTime);
        let gap: number = Math.abs(selectedElevator.destination - floorNumber);
        selectedElevator.destination = floorNumber;

        if (currentTime > selectedElevator.timer) { // the elevator is resting
            selectedElevator.move(floorNumber, this.freeFloor);
            selectedElevator.timer = currentTime + (gap * 0.5 + 2) * 1000;
        } else {
            setTimeout(():void => { // the elevator is working
                selectedElevator.move(floorNumber, this.freeFloor)
            }, selectedElevator.timer - currentTime)
            selectedElevator.timer += (gap * 0.5 + 2) * 1000;
        }
    }
}

class BuildingFactory {
    static getBuilding(num_of_floors: number, num_of_elevators: number): Building {
        return new Building(num_of_floors, num_of_elevators);
    }
}


const settings: Settings = new Settings();
// const buildingFactory: BuildingFactory = new BuildingFactory;
const building1 : Building =  BuildingFactory.getBuilding(settings.num_of_floors, settings.num_of_elevators);
const building2 : Building =  BuildingFactory.getBuilding(4, 1);
const building3 : Building =  BuildingFactory.getBuilding(8, 2);
