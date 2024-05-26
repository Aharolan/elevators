import {Settings} from "./settings";

export class Elevator {
    id: number;
    img: HTMLImageElement = document.createElement('img');
    ding: HTMLAudioElement = document.createElement('audio');
    currentFloor: number = 0;
    destination: number = 0;
    timer: number = 0;

    constructor(id: number) {
        this.id = id;
        this.initialElements();
    }

    initialElements(): void {
        this.img.src = "../assets/elv.png";
        this.ding.src = "../assets/ding.mp3";
        this.ding.controls = true;
        this.ding.volume = 0.3
        this.img.id = "elevator" + this.id.toString();
        this.img.classList.add("elevator");
    }

    playDingSound = (flag: boolean): void => {
        if (flag) {
            this.ding.play();
        } else {
            this.ding.pause();
            this.ding.currentTime = 0;
        }
    }
    move = (destination: number, freeFloor: (floorNumber: number) => void): void => {

        let gap: number = Math.abs(this.currentFloor - destination);

        this.img.style.transform = `translateY(${-destination * 110}px)`
        this.img.style.transition = `transform ${gap * 0.5}s ease`
        this.currentFloor = destination;

        setTimeout((): void => {
            this.playDingSound(true);
            setTimeout((): void => {
                    this.playDingSound(false);
                    freeFloor(destination);
                }, Settings.timeInFloor
            )
        }, gap * 0.5 * 1000)
    }

}
