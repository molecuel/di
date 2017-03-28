"use strict";
import "reflect-metadata";
import * as should  from "should";
import assert = require("assert");
import * as _ from "lodash";
import {component, di, injectable, Injectable, singleton} from "../dist";

describe("decorators", () => {
  describe("injection", () => {
    @injectable
    class InjectableTestClass {
      constructor(public value?: any) {}
    }

    // tslint:disable-next-line:max-classes-per-file
    @injectable
    class InnerLoopDepClass {}

    it("should mark a class as injectable", () => {
      let checkInjectable = di.injectables.get(InjectableTestClass.name);
      should.exist(checkInjectable);
      checkInjectable.should.be.instanceof(Injectable);
      assert(_.isObject(checkInjectable.injectable));
    });
    it("should generate an instance of a marked class", () => {
      let checkInstance = di.getInstance(InjectableTestClass.name);
      should.exist(checkInstance);
      checkInstance.should.be.instanceof(InjectableTestClass);
    });
    it("should generate an instance of any non-singleton class with supplied parameters", () => {
      let checkInstance = di.getInstance(InjectableTestClass.name, true);
      should.exist(checkInstance);
      checkInstance.should.be.instanceof(InjectableTestClass);
      should.exist(checkInstance.value);
      checkInstance.value.should.be.type("boolean");
    });
    it("should resolve constructor dependencies of a marked class", () => {
      // tslint:disable-next-line:max-classes-per-file
      @injectable
      class InjectTestClass {
        public prop: InjectableTestClass;
        constructor(dep: InjectableTestClass) {
          this.prop = dep;
        }
      }
      let checkInstance: InjectTestClass = di.getInstance(InjectTestClass.name);
      should.exist(checkInstance);
      checkInstance.should.be.instanceof(InjectTestClass);
      should.exist(checkInstance.prop);
      checkInstance.prop.should.be.instanceof(InjectableTestClass);
    });
    it("should prevent loops in deps", () => {
      // tslint:disable-next-line:max-classes-per-file
      @injectable
      class OuterLoopDepClass {
        constructor(public child: InnerLoopDepClass, protected loop: OuterLoopDepClass) {}
      }

      let checkInstance = di.getInstance(OuterLoopDepClass.name);
      should.not.exist(checkInstance);
    });
    it("should inject inheriting deps", () => {
      // tslint:disable-next-line:max-classes-per-file
      @injectable
      class Vehicle {
        constructor(public requiredLicense: string) {}
      }

      // tslint:disable-next-line:max-classes-per-file
      @injectable
      class Engine {
        constructor(public horsepower: number) {}
      }

      // tslint:disable-next-line:max-classes-per-file
      @injectable
      class Car extends Vehicle {
        constructor(public engine: Engine, rL?: string) {
          super(rL);
        }
      }

      let car = di.getInstance("Car");
      assert(car);
      assert(car.engine);
    });
    it("should keep order of deps if manual params contain undefined", () => {
      // tslint:disable-next-line:max-classes-per-file
      @injectable
      class ConstParamOrderTestClass {
        constructor(public first: any, public second: null, public third: any) {}
      }

      let testInstance = di.getInstance("ConstParamOrderTestClass", {}, undefined, {});
      assert(testInstance);
      assert(testInstance.first);
      assert(!testInstance.second);
      assert(testInstance.third);
    });
  }); // category end

  describe("singleton", () => {
    it("should mark a class as singleton and only ever return one instance", () => {
      // tslint:disable-next-line:max-classes-per-file
      @injectable
      class InnerClass { }

      // tslint:disable-next-line:max-classes-per-file
      @injectable
      class SomeClass {
        public inside: InnerClass;
        constructor(inj: InnerClass) {
          this.inside = inj;
        }
        // tslint:disable-next-line:no-empty
        public someMethod(some?: string) { }
      }

      // tslint:disable-next-line:max-classes-per-file
      @singleton
      class MySingletonClass {
        public prop: any;
        constructor(inj: SomeClass) {
          this.prop = inj || false;
        }
      }
      let createdSingleton = di.getInstance(MySingletonClass.name);
      createdSingleton.should.equal(di.getInstance(MySingletonClass.name));
    });
  }); // category end

  describe("component", () => {
    // tslint:disable-next-line:max-classes-per-file
    @component
    class MyComponent {}

    // tslint:disable-next-line:max-classes-per-file
    @injectable
    class Depclass {}

    // tslint:disable-next-line:max-classes-per-file
    @component
    class DepComponent {
      // tslint:disable-next-line:no-empty
      constructor(mycomp: MyComponent, depclass: Depclass) { }
    }

    it("should mark as component", () => {
      let checkComp: Injectable = di.injectables.get("MyComponent");
      assert(checkComp instanceof Injectable);
      assert(checkComp.component === true);
    });
    it("should calculate dependencies for components", () => {
      let checkComp: Injectable = di.injectables.get(DepComponent.name);
      assert(checkComp instanceof Injectable);
      checkComp.component.should.be.equal(true);
      should.exist(checkComp.constParams);
      assert(checkComp.constParams.length === 2);
    });
    it("should load components", () => {
      di.bootstrap();
      let checkComp = di.injectables.get(DepComponent.name);
      (checkComp.instanceCount).should.be.above(0);
    });
  }); // category end
}); // test end
