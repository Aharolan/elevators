var Settings = /** @class */ (function () {
    function Settings() {
        this.num_of_buildings = 3;
        this.num_of_elevators = 3;
        this.num_of_floors = 15;
        this.timeInFloor = 2000;
    }
    return Settings;
}());
var Elevator = /** @class */ (function () {
    function Elevator(id) {
        var _this = this;
        this.img = document.createElement('img');
        this.ding = document.createElement('audio');
        this.currentFloor = 0;
        this.destination = 0;
        this.timer = 0;
        this.move = function (destination, freeFloor) {
            var gap = Math.abs(_this.currentFloor - destination);
            _this.img.style.transition = "transform ".concat(gap * 0.5, "s ease");
            _this.img.style.transform = "translateY(".concat(-destination * 110, "px)");
            _this.currentFloor = destination;
            setTimeout(function () {
                _this.ding.play();
                setTimeout(function () {
                    _this.ding.pause();
                    _this.ding.currentTime = 0;
                    freeFloor(destination);
                }, settings.timeInFloor);
            }, gap * 0.5 * 1000);
        };
        this.img.src = "./elv.png";
        this.ding.src = "./ding.mp3";
        this.ding.controls = true;
        this.ding.volume = 0.3;
        this.img.onclick = function () {
            _this.img.style.transform = "translateY(".concat(-200, "px)");
        };
        this.img.id = "elevator" + id.toString();
        this.id = id;
        this.img.classList.add("elevator");
    }
    return Elevator;
}());
var Floor = /** @class */ (function () {
    function Floor(floorNumber, orderElevator) {
        var _this = this;
        this.isInActive = false;
        this.button = document.createElement("button");
        this.floorElement = document.createElement("div");
        this.lineElement = document.createElement("div");
        this.lineElement.className = "blackLine";
        this.floorElement.classList.add("floor");
        //TODO: what is classList.add;
        // this.button.classList.add('metal.linear');
        this.button.className = "metal linear";
        this.floorNumber = floorNumber;
        this.button.textContent = this.floorNumber.toString();
        this.button.id = floorNumber.toString();
        this.button.onclick = function () {
            if (!_this.isInActive) {
                orderElevator(_this.floorNumber);
                _this.isInActive = true;
                _this.button.style.color = "green";
            }
        };
        this.floorElement.appendChild(this.button);
        this.floorElement.id = floorNumber.toString();
        console.log();
    }
    return Floor;
}());
var Building = /** @class */ (function () {
    function Building(num_of_floors, num_of_elevators) {
        var _this = this;
        this.floors = [];
        this.elevators = [];
        this.buildingElement = document.createElement("div");
        this.floorsElement = document.createElement("div");
        this.elevatorShaft = document.createElement("div");
        this.freeFloor = function (floorNumber) {
            _this.floors[floorNumber].isInActive = false;
            _this.floors[floorNumber].button.style.color = "hsla(0,0%,20%,1)";
        };
        this.chooseElevator = function (floorNumber, currentTime) {
            var minTime = Infinity;
            var elevatorID = 0;
            for (var _i = 0, _a = _this.elevators; _i < _a.length; _i++) {
                var elevator = _a[_i];
                var currentMin = Math.abs(elevator.destination - floorNumber) * 500
                    + settings.timeInFloor
                    + (currentTime > elevator.timer ? 0 : elevator.timer - currentTime);
                if (currentMin < minTime) {
                    minTime = currentMin;
                    elevatorID = elevator.id;
                }
            }
            return _this.elevators[elevatorID];
        };
        this.orderElevator = function (floorNumber) {
            var currentTime = Date.now();
            var selectedElevator = _this.chooseElevator(floorNumber, currentTime);
            var gap = Math.abs(selectedElevator.destination - floorNumber);
            selectedElevator.destination = floorNumber;
            if (currentTime > selectedElevator.timer) { // the elevator is resting
                selectedElevator.move(floorNumber, _this.freeFloor);
                selectedElevator.timer = currentTime + (gap * 0.5 + 2) * 1000;
            }
            else {
                setTimeout(function () {
                    selectedElevator.move(floorNumber, _this.freeFloor);
                }, selectedElevator.timer - currentTime);
                selectedElevator.timer += (gap * 0.5 + 2) * 1000;
            }
        };
        this.buildingElement.className = "building";
        this.elevatorShaft.className = "elevatorShaft";
        this.floorsElement.className = "floors";
        // creates elevators
        for (var i = 0; i < num_of_elevators; i++) {
            var elevator = new Elevator(i);
            this.elevators.push(elevator);
            this.elevatorShaft.appendChild(elevator.img);
        }
        // creates floors
        for (var i = 0; i <= num_of_floors; i++) {
            var floor = new Floor(i, this.orderElevator);
            this.floors.push(floor);
            this.floorsElement.appendChild(floor.floorElement);
            if (i != num_of_floors) {
                this.floorsElement.appendChild(floor.lineElement);
            }
            this.floorsElement.className = 'floors';
        }
        var building = document.getElementById("building");
        building.appendChild(this.floorsElement);
        building.appendChild(this.elevatorShaft);
    }
    return Building;
}());
var BuildingFactory = /** @class */ (function () {
    function BuildingFactory() {
    }
    BuildingFactory.getBuilding = function (num_of_floors, num_of_elevators) {
        return new Building(num_of_floors, num_of_elevators);
    };
    return BuildingFactory;
}());
var settings = new Settings();
// const buildingFactory: BuildingFactory = new BuildingFactory;
var building1 = BuildingFactory.getBuilding(settings.num_of_floors, settings.num_of_elevators);
var building2 = BuildingFactory.getBuilding(4, 1);
var building3 = BuildingFactory.getBuilding(8, 2);
