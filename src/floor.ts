export class Floor {

    isInActive: boolean = false;
    floorNumber: number;
    button: HTMLButtonElement = document.createElement("button");
    floorElement: HTMLDivElement = document.createElement("div");
    lineElement: HTMLDivElement = document.createElement("div");
    counterElement: HTMLDivElement = document.createElement("div");

    constructor(floorNumber: number, orderElevator: (floorNumber: number) => void) {
        this.lineElement.className = "blackLine";
        this.floorElement.classList.add("floor");
        this.counterElement.classList.add("counter");
        this.button.className = "metal linear";
        this.counterElement.className = "counter";
        this.floorNumber = floorNumber
        this.button.textContent = this.floorNumber.toString();
        this.button.id = floorNumber.toString();
        this.floorElement.appendChild(this.button);
        this.floorElement.appendChild(this.counterElement);
        this.floorElement.id = floorNumber.toString();
        this.button.onclick = (): void => {
            if (!this.isInActive) {
                orderElevator(this.floorNumber);
                this.isInActive = true;
                this.button.style.color = "green";
            }
        };
    }

    startCounter(counter: number): void {
        const timeOut: number = counter % 1;
        console.log("timeOut " + timeOut)
        setTimeout((): void => {
            let num: number = Math.floor(counter); // Set initial value
            //  TODO: validate not updated to zero
            this.updateCounter(num);

            const interval = setInterval((): void => {
                num--;
                this.updateCounter(num);

                if (num < 0) {
                    clearInterval(interval);
                    this.counterElement.style.background = 'transparent';
                    this.counterElement.textContent = '';
                }
            }, 1000);
        }, timeOut);

    }

    updateCounter(num: number): void {
        this.counterElement.style.background = '#23b20d';
        this.counterElement.textContent = num.toString();
    }
}