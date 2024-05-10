"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Floor = void 0;
var Floor = /** @class */ (function () {
    function Floor(floorNumber, orderElevator) {
        var _this = this;
        this.isInActive = false;
        this.button = document.createElement("button");
        this.floorElement = document.createElement("div");
        this.lineElement = document.createElement("div");
        this.counterElement = document.createElement("div");
        this.lineElement.className = "blackLine";
        this.floorElement.classList.add("floor");
        this.counterElement.classList.add("counter");
        this.button.className = "metal linear";
        this.counterElement.className = "counter";
        this.floorNumber = floorNumber;
        this.button.textContent = this.floorNumber.toString();
        this.button.id = floorNumber.toString();
        this.floorElement.appendChild(this.button);
        this.floorElement.appendChild(this.counterElement);
        this.floorElement.id = floorNumber.toString();
        this.button.onclick = function () {
            if (!_this.isInActive) {
                orderElevator(_this.floorNumber);
                _this.isInActive = true;
                _this.button.style.color = "green";
                // this.startCounter(5);
            }
        };
    }
    Floor.prototype.startCounter = function (counter) {
        var _this = this;
        var timeOut = counter % 1;
        setTimeout(function () {
            var num = Math.floor(counter); // Set initial value
            //TODO: validate not updated to zero
            _this.updateCounter(num);
            var interval = setInterval(function () {
                num--;
                _this.updateCounter(num);
                if (num <= 0) {
                    clearInterval(interval);
                    _this.counterElement.textContent = null;
                }
            }, 1000);
        }, timeOut);
    };
    Floor.prototype.updateCounter = function (num) {
        this.counterElement.textContent = num.toString();
    };
    return Floor;
}());
exports.Floor = Floor;
