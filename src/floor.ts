export class Floor {

    isInActive: boolean = false;
    floorNumber: number;
    button: HTMLButtonElement = document.createElement("button");
    floorElement: HTMLDivElement = document.createElement("div");
    lineElement: HTMLDivElement = document.createElement("div");
    counterElement: HTMLDivElement = document.createElement("div");

    constructor(floorNumber: number, orderElevator: (floorNumber: number) => void) {
        this.floorNumber = floorNumber;
        this.initialButton(orderElevator);
        this.initialElements();
    }

    initialElements(): void {
        this.lineElement.className = "blackLine";
        this.floorElement.className = "floor";
        this.button.className = "metal linear";
        this.counterElement.className = "counter";
        this.floorElement.appendChild(this.button);
        this.floorElement.appendChild(this.counterElement);
        this.floorElement.id = this.floorNumber.toString();
    }

    initialButton(orderElevator: (floorNumber: number) => void): void {
        this.button.textContent = this.floorNumber.toString();
        this.button.id = this.floorNumber.toString();
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
        setTimeout((): void => {
            let num: number = Math.floor(counter); // Set initial value
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
        this.counterElement.style.background = 'black';
        this.counterElement.textContent = num.toString();
    }
}
