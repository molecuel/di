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
require('reflect-metadata');
const should = require('should');
const assert = require('assert');
const _ = require('lodash');
const dist_1 = require('../dist');
should();
describe('decorators', function () {
    describe('injection', function () {
        let InjectableTestClass = class InjectableTestClass {
        };
        InjectableTestClass = __decorate([
            dist_1.injectable, 
            __metadata('design:paramtypes', [])
        ], InjectableTestClass);
        it('should mark a class as injectable', () => {
            let checkInjectable = dist_1.di.injectables.get(InjectableTestClass.name);
            should.exist(checkInjectable);
            checkInjectable.should.be.instanceof(dist_1.Injectable);
            assert(_.isObject(checkInjectable.injectable));
        });
        it('should generate an instance of a marked class', () => {
            let checkInstance = dist_1.di.getInstance(InjectableTestClass.name);
            should.exist(checkInstance);
            checkInstance.should.be.instanceof(InjectableTestClass);
        });
        it('should resolve constructor dependencies of a marked class', () => {
            let InjectTestClass = class InjectTestClass {
                constructor(dep) {
                    this.prop = dep;
                }
            };
            InjectTestClass = __decorate([
                dist_1.component, 
                __metadata('design:paramtypes', [InjectableTestClass])
            ], InjectTestClass);
            let checkInstance = dist_1.di.getInstance(InjectTestClass.name);
            should.exist(checkInstance);
            checkInstance.should.be.instanceof(InjectTestClass);
            should.exist(checkInstance.prop);
            checkInstance.prop.should.be.instanceof(InjectableTestClass);
        });
        it('should resolve constructor parameters of built-in types', () => {
            let InjectBuiltInTestClass = class InjectBuiltInTestClass {
                constructor(value) {
                    this.prop = value || false;
                }
            };
            InjectBuiltInTestClass = __decorate([
                dist_1.component, 
                __metadata('design:paramtypes', [String])
            ], InjectBuiltInTestClass);
            let checkInstance = dist_1.di.getInstance(InjectBuiltInTestClass.name);
            checkInstance.should.exist;
            checkInstance.should.be.instanceof(InjectBuiltInTestClass);
            checkInstance.prop.should.be.type('string');
        });
    });
    describe('singleton', function () {
        it('should mark a class as singleton and only ever return one instance', function () {
            let InnerClass = class InnerClass {
                constructor() {
                }
            };
            InnerClass = __decorate([
                dist_1.injectable, 
                __metadata('design:paramtypes', [])
            ], InnerClass);
            let SomeClass = class SomeClass {
                constructor(inj) {
                    this.inside = inj;
                }
                someMethod() {
                    console.log('did something.');
                }
            };
            SomeClass = __decorate([
                dist_1.injectable, 
                __metadata('design:paramtypes', [InnerClass])
            ], SomeClass);
            let MySingletonClass = class MySingletonClass {
                constructor(inj) {
                    this.prop = inj || false;
                }
            };
            MySingletonClass = __decorate([
                dist_1.singleton, 
                __metadata('design:paramtypes', [SomeClass])
            ], MySingletonClass);
            let createdSingleton = dist_1.di.getInstance(MySingletonClass.name);
            createdSingleton.should.equal(dist_1.di.getInstance(MySingletonClass.name));
        });
    });
    describe('component', function () {
        let MyComponent = class MyComponent {
        };
        MyComponent = __decorate([
            dist_1.component, 
            __metadata('design:paramtypes', [])
        ], MyComponent);
        let Depclass = class Depclass {
        };
        Depclass = __decorate([
            dist_1.injectable, 
            __metadata('design:paramtypes', [])
        ], Depclass);
        let DepComponent = class DepComponent {
            constructor(mycomp, depclass) {
            }
        };
        DepComponent = __decorate([
            dist_1.component, 
            __metadata('design:paramtypes', [MyComponent, Depclass])
        ], DepComponent);
        it('should mark as component', function () {
            let checkComp = dist_1.di.injectables.get('MyComponent');
            assert(checkComp instanceof dist_1.Injectable);
            assert(checkComp.component === true);
        });
        it('should calculate dependencies for components', function () {
            let checkComp = dist_1.di.injectables.get(DepComponent.name);
            assert(checkComp instanceof dist_1.Injectable);
            checkComp.component.should.be.equal(true);
            should.exist(checkComp.constParams);
            assert(checkComp.constParams.length === 2);
        });
        it('should prevent loops in deps', function () {
            assert(false);
        });
        it('should load components', function () {
            dist_1.di.bootstrap();
            let checkComp = dist_1.di.injectables.get(DepComponent.name);
            assert(checkComp.instanceCount > 0);
        });
    });
});
