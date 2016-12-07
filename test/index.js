'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
require("reflect-metadata");
const should = require("should");
const dist_1 = require("../dist");
should();
describe('decorators', function () {
    describe('singleton', function () {
        it('should mark a class as singleton', function () {
            let MySingletonClass = class MySingletonClass {
                constructor() {
                    console.log('new instance');
                }
            };
            MySingletonClass = __decorate([
                dist_1.singleton,
                __metadata("design:paramtypes", [])
            ], MySingletonClass);
            let myinj = dist_1.getInjectable(MySingletonClass);
            console.log(myinj);
            let test = new myinj();
            let test2 = new myinj();
            console.log(test);
            console.log(test2);
            console.log(test === test2);
        });
    });
});
