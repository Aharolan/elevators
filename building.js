"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var floor_1 = require("./floor");
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
        this.img.id = "elevator" + id.toString();
        this.id = id;
        this.img.classList.add("elevator");
        this.img.onclick = function () {
            _this.img.style.transform = "translateY(".concat(-200, "px)");
        };
    }
    return Elevator;
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
                _this.floors[floorNumber].startCounter(gap * 0.5);
            }
            else {
                setTimeout(function () {
                    selectedElevator.move(floorNumber, _this.freeFloor);
                }, selectedElevator.timer - currentTime);
                selectedElevator.timer += (gap * 0.5 + 2) * 1000;
                console.log("Message: travel " + (gap * 0.5));
                console.log("Message: add " + (selectedElevator.timer - currentTime) / 1000);
                console.log("Message: full calaulate " + (gap * 0.5 + (selectedElevator.timer - currentTime) / 1000));
                _this.floors[floorNumber].startCounter(gap * 0.5 + (selectedElevator.timer - currentTime) / 1000);
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
            var floor = new floor_1.Floor(i, this.orderElevator);
            this.floors.push(floor);
            this.floorsElement.appendChild(floor.floorElement);
            if (i != num_of_floors) {
                this.floorsElement.appendChild(floor.lineElement);
            }
            this.floorsElement.className = 'floors';
        }
        var building = document.getElementById("building");
        if (building) {
            building.appendChild(this.floorsElement);
            building.appendChild(this.elevatorShaft);
        }
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
var building1 = BuildingFactory.getBuilding(settings.num_of_floors, settings.num_of_elevators);
var building2 = BuildingFactory.getBuilding(4, 1);
var building3 = BuildingFactory.getBuilding(8, 2);
