/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/building.ts":
/*!*************************!*\
  !*** ./src/building.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nvar floor_1 = __webpack_require__(/*! ./floor */ \"./src/floor.ts\");\nvar settings_1 = __webpack_require__(/*! ./settings */ \"./src/settings.ts\");\nvar elevator_1 = __webpack_require__(/*! ./elevator */ \"./src/elevator.ts\");\nvar Building = /** @class */ (function () {\n    function Building(numOfFloors, numOfElevators) {\n        var _this = this;\n        this.floors = [];\n        this.elevators = [];\n        this.buildingElement = document.createElement(\"div\");\n        this.floorsElement = document.createElement(\"div\");\n        this.elevatorShaft = document.createElement(\"div\");\n        this.initialElevators = function (numOfElevators) {\n            for (var i = 0; i < numOfElevators; i++) {\n                var elevator = new elevator_1.Elevator(i);\n                _this.elevators.push(elevator);\n                _this.elevatorShaft.appendChild(elevator.img);\n            }\n        };\n        this.initialFloors = function (numOfFloors) {\n            for (var i = 0; i <= numOfFloors; i++) {\n                var floor = new floor_1.Floor(i, _this.orderElevator);\n                _this.floors.push(floor);\n                _this.floorsElement.appendChild(floor.floorElement);\n                if (i != numOfFloors) {\n                    _this.floorsElement.appendChild(floor.lineElement);\n                }\n            }\n        };\n        this.appendElements = function () {\n            var building = document.getElementById(\"building\");\n            if (building) {\n                building.appendChild(_this.floorsElement);\n                building.appendChild(_this.elevatorShaft);\n            }\n        };\n        this.freeFloor = function (floorNumber) {\n            _this.floors[floorNumber].isInActive = false;\n            _this.floors[floorNumber].button.style.color = \"hsla(0,0%,20%,1)\";\n        };\n        this.chooseElevator = function (floorNumber, currentTime) {\n            var minTime = Infinity;\n            var elevatorID = 0;\n            for (var _i = 0, _a = _this.elevators; _i < _a.length; _i++) {\n                var elevator = _a[_i];\n                var currentMin = Math.abs(elevator.destination - floorNumber) * settings_1.Settings.timeBetweenFloors\n                    + (currentTime > elevator.timer // the elevator is resting\n                        ? 0 : (elevator.timer - currentTime) / settings_1.Settings.millisecond);\n                if (currentMin < minTime) {\n                    minTime = currentMin;\n                    elevatorID = elevator.id;\n                }\n            }\n            return _this.elevators[elevatorID];\n        };\n        this.handleImmediateElevatorOrder = function (elevator, currentTime, floorNumber, gap) {\n            elevator.move(floorNumber, _this.freeFloor);\n            elevator.timer = currentTime + settings_1.Settings.timeInFloor + (gap * settings_1.Settings.timeBetweenFloors) * settings_1.Settings.millisecond;\n            _this.floors[floorNumber].startCounter(gap * settings_1.Settings.timeBetweenFloors);\n        };\n        this.handleElevatorOrderInAWhile = function (elevator, currentTime, floorNumber, gap) {\n            setTimeout(function () {\n                elevator.move(floorNumber, _this.freeFloor);\n            }, elevator.timer - currentTime);\n            _this.floors[floorNumber].startCounter(gap * settings_1.Settings.timeBetweenFloors + (elevator.timer - currentTime) / settings_1.Settings.millisecond);\n            elevator.timer += ((gap * settings_1.Settings.timeBetweenFloors) * settings_1.Settings.millisecond + settings_1.Settings.timeInFloor);\n        };\n        this.orderElevator = function (floorNumber) {\n            var currentTime = Date.now();\n            var selectedElevator = _this.chooseElevator(floorNumber, currentTime);\n            var gap = Math.abs(selectedElevator.destination - floorNumber);\n            if (currentTime > selectedElevator.timer) { // the elevator is resting\n                _this.handleImmediateElevatorOrder(selectedElevator, currentTime, floorNumber, gap);\n            }\n            else {\n                _this.handleElevatorOrderInAWhile(selectedElevator, currentTime, floorNumber, gap);\n            }\n            selectedElevator.destination = floorNumber;\n        };\n        this.buildingElement.className = \"building\";\n        this.elevatorShaft.className = \"elevatorShaft\";\n        this.floorsElement.className = \"floors\";\n        this.initialElevators(numOfElevators);\n        this.initialFloors(numOfFloors);\n        this.appendElements();\n    }\n    return Building;\n}());\nvar BuildingFactory = /** @class */ (function () {\n    function BuildingFactory() {\n    }\n    BuildingFactory.getBuilding = function (num_of_floors, num_of_elevators) {\n        return new Building(num_of_floors, num_of_elevators);\n    };\n    return BuildingFactory;\n}());\nvar building1 = BuildingFactory.getBuilding(settings_1.Settings.numOfFloors, settings_1.Settings.numOfElevators);\nvar building2 = BuildingFactory.getBuilding(4, 1);\nvar building3 = BuildingFactory.getBuilding(8, 2);\n\n\n//# sourceURL=webpack:///./src/building.ts?");

/***/ }),

/***/ "./src/elevator.ts":
/*!*************************!*\
  !*** ./src/elevator.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Elevator = void 0;\nvar settings_1 = __webpack_require__(/*! ./settings */ \"./src/settings.ts\");\nvar Elevator = /** @class */ (function () {\n    function Elevator(id) {\n        var _this = this;\n        this.img = document.createElement('img');\n        this.ding = document.createElement('audio');\n        this.currentFloor = 0;\n        this.destination = 0;\n        this.timer = 0;\n        this.playDingSound = function (flag) {\n            if (flag) {\n                _this.ding.play();\n            }\n            else {\n                _this.ding.pause();\n                _this.ding.currentTime = 0;\n            }\n        };\n        this.move = function (destination, freeFloor) {\n            var gap = Math.abs(_this.currentFloor - destination);\n            _this.img.style.transform = \"translateY(\".concat(-destination * 110, \"px)\");\n            _this.img.style.transition = \"transform \".concat(gap * 0.5, \"s ease\");\n            _this.currentFloor = destination;\n            setTimeout(function () {\n                _this.playDingSound(true);\n                setTimeout(function () {\n                    _this.playDingSound(false);\n                    freeFloor(destination);\n                }, settings_1.Settings.timeInFloor);\n            }, gap * 0.5 * 1000);\n        };\n        this.img.src = \"../assets/elv.png\";\n        this.ding.src = \"../assets/ding.mp3\";\n        this.ding.controls = true;\n        this.ding.volume = 0.3;\n        this.img.id = \"elevator\" + id.toString();\n        this.id = id;\n        this.img.classList.add(\"elevator\");\n        this.img.onclick = function () {\n            _this.img.style.transform = \"translateY(\".concat(-200, \"px)\");\n        };\n    }\n    return Elevator;\n}());\nexports.Elevator = Elevator;\n\n\n//# sourceURL=webpack:///./src/elevator.ts?");

/***/ }),

/***/ "./src/floor.ts":
/*!**********************!*\
  !*** ./src/floor.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Floor = void 0;\nvar Floor = /** @class */ (function () {\n    function Floor(floorNumber, orderElevator) {\n        var _this = this;\n        this.isInActive = false;\n        this.button = document.createElement(\"button\");\n        this.floorElement = document.createElement(\"div\");\n        this.lineElement = document.createElement(\"div\");\n        this.counterElement = document.createElement(\"div\");\n        this.lineElement.className = \"blackLine\";\n        this.floorElement.classList.add(\"floor\");\n        this.counterElement.classList.add(\"counter\");\n        this.button.className = \"metal linear\";\n        this.counterElement.className = \"counter\";\n        this.floorNumber = floorNumber;\n        this.button.textContent = this.floorNumber.toString();\n        this.button.id = floorNumber.toString();\n        this.floorElement.appendChild(this.button);\n        this.floorElement.appendChild(this.counterElement);\n        this.floorElement.id = floorNumber.toString();\n        this.button.onclick = function () {\n            if (!_this.isInActive) {\n                orderElevator(_this.floorNumber);\n                _this.isInActive = true;\n                _this.button.style.color = \"green\";\n            }\n        };\n    }\n    Floor.prototype.startCounter = function (counter) {\n        var _this = this;\n        var timeOut = counter % 1;\n        setTimeout(function () {\n            var num = Math.floor(counter); // Set initial value\n            //  TODO: validate not updated to zero\n            _this.updateCounter(num);\n            var interval = setInterval(function () {\n                num--;\n                _this.updateCounter(num);\n                if (num < 0) {\n                    clearInterval(interval);\n                    _this.counterElement.style.background = 'transparent';\n                    _this.counterElement.textContent = '';\n                }\n            }, 1000);\n        }, timeOut);\n    };\n    Floor.prototype.updateCounter = function (num) {\n        this.counterElement.style.background = '#23b20d';\n        this.counterElement.textContent = num.toString();\n    };\n    return Floor;\n}());\nexports.Floor = Floor;\n\n\n//# sourceURL=webpack:///./src/floor.ts?");

/***/ }),

/***/ "./src/settings.ts":
/*!*************************!*\
  !*** ./src/settings.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Settings = void 0;\nvar Settings = /** @class */ (function () {\n    function Settings() {\n    }\n    Settings.numOfBuildings = 3;\n    Settings.numOfElevators = 3;\n    Settings.numOfFloors = 15;\n    Settings.timeInFloor = 2000;\n    Settings.timeBetweenFloors = 0.5;\n    Settings.millisecond = 1000;\n    return Settings;\n}());\nexports.Settings = Settings;\n\n\n//# sourceURL=webpack:///./src/settings.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/building.ts");
/******/ 	
/******/ })()
;