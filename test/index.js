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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
require('reflect-metadata');
const should = require('should');
const dist_1 = require('../dist');
should();
describe('decorators', function () {
    describe('singleton', function () {
        it('should mark a class as singleton', function () {
            let SomeClass = class SomeClass {
                constructor() {
                }
                someMethod() {
                    console.log('did something.');
                }
            };
            SomeClass = __decorate([
                dist_1.injectable, 
                __metadata('design:paramtypes', [])
            ], SomeClass);
            let MySingletonClass = class MySingletonClass {
                constructor() {
                    this.prop = {};
                    console.log('new instance');
                }
            };
            MySingletonClass = __decorate([
                dist_1.injectable, 
                __metadata('design:paramtypes', [])
            ], MySingletonClass);
            let testClass = class testClass {
                constructor(one, two) {
                    this.one = one;
                    this.two = two;
                }
                deiMudda(one, two) {
                    this.one = one;
                    this.two = two;
                }
            };
            __decorate([
                __param(0, dist_1.logParam), 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', [SomeClass, MySingletonClass]), 
                __metadata('design:returntype', void 0)
            ], testClass.prototype, "deiMudda", null);
            testClass = __decorate([
                dist_1.inject,
                __param(0, dist_1.logParam), 
                __metadata('design:paramtypes', [SomeClass, MySingletonClass])
            ], testClass);
        });
    });
});
