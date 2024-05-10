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

/***/ "./building.ts":
/*!*********************!*\
  !*** ./building.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nvar floor_1 = __webpack_require__(/*! ./floor */ \"./floor.ts\");\nvar settings_1 = __webpack_require__(/*! ./settings */ \"./settings.ts\");\nvar elevator_1 = __webpack_require__(/*! ./elevator */ \"./elevator.ts\");\nvar Building = /** @class */ (function () {\n    function Building(num_of_floors, num_of_elevators) {\n        var _this = this;\n        this.floors = [];\n        this.elevators = [];\n        this.buildingElement = document.createElement(\"div\");\n        this.floorsElement = document.createElement(\"div\");\n        this.elevatorShaft = document.createElement(\"div\");\n        this.freeFloor = function (floorNumber) {\n            _this.floors[floorNumber].isInActive = false;\n            _this.floors[floorNumber].button.style.color = \"hsla(0,0%,20%,1)\";\n        };\n        this.chooseElevator = function (floorNumber, currentTime) {\n            var minTime = Infinity;\n            var elevatorID = 0;\n            for (var _i = 0, _a = _this.elevators; _i < _a.length; _i++) {\n                var elevator = _a[_i];\n                var currentMin = Math.abs(elevator.destination - floorNumber) * 500\n                    + settings_1.Settings.timeInFloor\n                    + (currentTime > elevator.timer ? 0 : elevator.timer - currentTime);\n                if (currentMin < minTime) {\n                    minTime = currentMin;\n                    elevatorID = elevator.id;\n                }\n            }\n            return _this.elevators[elevatorID];\n        };\n        this.orderElevator = function (floorNumber) {\n            var currentTime = Date.now();\n            var selectedElevator = _this.chooseElevator(floorNumber, currentTime);\n            var gap = Math.abs(selectedElevator.destination - floorNumber);\n            selectedElevator.destination = floorNumber;\n            if (currentTime > selectedElevator.timer) { // the elevator is resting\n                selectedElevator.move(floorNumber, _this.freeFloor);\n                selectedElevator.timer = currentTime + (gap * 0.5 + 2) * 1000;\n                _this.floors[floorNumber].startCounter(gap * 0.5);\n            }\n            else {\n                setTimeout(function () {\n                    selectedElevator.move(floorNumber, _this.freeFloor);\n                }, selectedElevator.timer - currentTime);\n                selectedElevator.timer += (gap * 0.5 + 2) * 1000;\n                console.log(\"Message: travel \" + (gap * 0.5));\n                console.log(\"Message: add \" + (selectedElevator.timer - currentTime) / 1000);\n                console.log(\"Message: full calculate \" + (gap * 0.5 + (selectedElevator.timer - currentTime) / 1000));\n                _this.floors[floorNumber].startCounter(gap * 0.5 + (selectedElevator.timer - currentTime) / 1000);\n            }\n        };\n        this.buildingElement.className = \"building\";\n        this.elevatorShaft.className = \"elevatorShaft\";\n        this.floorsElement.className = \"floors\";\n        // creates elevators\n        for (var i = 0; i < num_of_elevators; i++) {\n            var elevator = new elevator_1.Elevator(i);\n            this.elevators.push(elevator);\n            this.elevatorShaft.appendChild(elevator.img);\n        }\n        // creates floors\n        for (var i = 0; i <= num_of_floors; i++) {\n            var floor = new floor_1.Floor(i, this.orderElevator);\n            this.floors.push(floor);\n            this.floorsElement.appendChild(floor.floorElement);\n            if (i != num_of_floors) {\n                this.floorsElement.appendChild(floor.lineElement);\n            }\n            this.floorsElement.className = 'floors';\n        }\n        var building = document.getElementById(\"building\");\n        if (building) {\n            building.appendChild(this.floorsElement);\n            building.appendChild(this.elevatorShaft);\n        }\n    }\n    return Building;\n}());\nvar BuildingFactory = /** @class */ (function () {\n    function BuildingFactory() {\n    }\n    BuildingFactory.getBuilding = function (num_of_floors, num_of_elevators) {\n        return new Building(num_of_floors, num_of_elevators);\n    };\n    return BuildingFactory;\n}());\nvar building1 = BuildingFactory.getBuilding(settings_1.Settings.num_of_floors, settings_1.Settings.num_of_elevators);\nvar building2 = BuildingFactory.getBuilding(4, 1);\nvar building3 = BuildingFactory.getBuilding(8, 2);\n\n\n//# sourceURL=webpack:///./building.ts?");

/***/ }),

/***/ "./elevator.ts":
/*!*********************!*\
  !*** ./elevator.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Elevator = void 0;\nvar settings_1 = __webpack_require__(/*! ./settings */ \"./settings.ts\");\nvar Elevator = /** @class */ (function () {\n    function Elevator(id) {\n        var _this = this;\n        this.img = document.createElement('img');\n        this.ding = document.createElement('audio');\n        this.currentFloor = 0;\n        this.destination = 0;\n        this.timer = 0;\n        this.move = function (destination, freeFloor) {\n            var gap = Math.abs(_this.currentFloor - destination);\n            _this.img.style.transition = \"transform \".concat(gap * 0.5, \"s ease\");\n            _this.img.style.transform = \"translateY(\".concat(-destination * 110, \"px)\");\n            _this.currentFloor = destination;\n            setTimeout(function () {\n                _this.ding.play();\n                setTimeout(function () {\n                    _this.ding.pause();\n                    _this.ding.currentTime = 0;\n                    freeFloor(destination);\n                }, settings_1.Settings.timeInFloor);\n            }, gap * 0.5 * 1000);\n        };\n        this.img.src = \"./elv.png\";\n        this.ding.src = \"./ding.mp3\";\n        this.ding.controls = true;\n        this.ding.volume = 0.3;\n        this.img.id = \"elevator\" + id.toString();\n        this.id = id;\n        this.img.classList.add(\"elevator\");\n        this.img.onclick = function () {\n            _this.img.style.transform = \"translateY(\".concat(-200, \"px)\");\n        };\n    }\n    return Elevator;\n}());\nexports.Elevator = Elevator;\n\n\n//# sourceURL=webpack:///./elevator.ts?");

/***/ }),

/***/ "./floor.ts":
/*!******************!*\
  !*** ./floor.ts ***!
  \******************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Floor = void 0;\nvar Floor = /** @class */ (function () {\n    function Floor(floorNumber, orderElevator) {\n        var _this = this;\n        this.isInActive = false;\n        this.button = document.createElement(\"button\");\n        this.floorElement = document.createElement(\"div\");\n        this.lineElement = document.createElement(\"div\");\n        this.counterElement = document.createElement(\"div\");\n        this.lineElement.className = \"blackLine\";\n        this.floorElement.classList.add(\"floor\");\n        this.counterElement.classList.add(\"counter\");\n        this.button.className = \"metal linear\";\n        this.counterElement.className = \"counter\";\n        this.floorNumber = floorNumber;\n        this.button.textContent = this.floorNumber.toString();\n        this.button.id = floorNumber.toString();\n        this.floorElement.appendChild(this.button);\n        this.floorElement.appendChild(this.counterElement);\n        this.floorElement.id = floorNumber.toString();\n        this.button.onclick = function () {\n            if (!_this.isInActive) {\n                orderElevator(_this.floorNumber);\n                _this.isInActive = true;\n                _this.button.style.color = \"green\";\n                // this.startCounter(5);\n            }\n        };\n    }\n    Floor.prototype.startCounter = function (counter) {\n        var _this = this;\n        var timeOut = counter % 1;\n        setTimeout(function () {\n            var num = Math.floor(counter); // Set initial value\n            //TODO: validate not updated to zero\n            _this.updateCounter(num);\n            var interval = setInterval(function () {\n                num--;\n                _this.updateCounter(num);\n                if (num <= 0) {\n                    clearInterval(interval);\n                    _this.counterElement.textContent = null;\n                }\n            }, 1000);\n        }, timeOut);\n    };\n    Floor.prototype.updateCounter = function (num) {\n        this.counterElement.textContent = num.toString();\n    };\n    return Floor;\n}());\nexports.Floor = Floor;\n\n\n//# sourceURL=webpack:///./floor.ts?");

/***/ }),

/***/ "./settings.ts":
/*!*********************!*\
  !*** ./settings.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Settings = void 0;\nvar Settings = /** @class */ (function () {\n    function Settings() {\n    }\n    Settings.num_of_buildings = 3;\n    Settings.num_of_elevators = 3;\n    Settings.num_of_floors = 15;\n    Settings.timeInFloor = 2000;\n    return Settings;\n}());\nexports.Settings = Settings;\n\n\n//# sourceURL=webpack:///./settings.ts?");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./building.ts");
/******/ 	
/******/ })()
;