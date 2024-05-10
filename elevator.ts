import {Settings} from "./settings";

export class Elevator {
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
        this.img.id = "elevator" + id.toString();
        this.id = id;
        this.img.classList.add("elevator");
        this.img.onclick = (): void => {
            this.img.style.transform = `translateY(${-200}px)`;
        }
    }

    move = (destination: number, freeFloor: (floorNumber: number) => void): void => {

        let gap: number = Math.abs(this.currentFloor - destination);

        this.img.style.transition = `transform ${gap * 0.5}s ease`
        this.img.style.transform = `translateY(${-destination * 110}px)`
        this.currentFloor = destination;

        setTimeout(() => {
            this.ding.play();
            setTimeout(() => {
                    this.ding.pause();
                    this.ding.currentTime = 0;
                    freeFloor(destination);
                }, Settings.timeInFloor
            )
        }, gap * 0.5 * 1000
        )
    }

}
