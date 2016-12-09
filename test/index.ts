'use strict';
import 'reflect-metadata';
import should = require('should');
import assert = require('assert');
import * as _ from 'lodash';
import {di, injectable, Injectable, singleton, component} from '../dist';
should();

describe('decorators', function() {
  describe('injection', function() {
    @injectable
    class InjectableTestClass {}
    it('should mark a class as injectable', () => {
      let checkInjectable = di.injectables.get(InjectableTestClass.name);
      should.exist(checkInjectable);
      checkInjectable.should.be.instanceof(Injectable);
      assert(_.isObject(checkInjectable.injectable));
    });
    it('should generate an instance of a marked class', () => {
      let checkInstance = di.getInstance(InjectableTestClass.name);
      should.exist(checkInstance);
      checkInstance.should.be.instanceof(InjectableTestClass);
    });
    it('should resolve constructor dependencies of a marked class', () => {
      @component
      class InjectTestClass {
        prop: InjectableTestClass;
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
    it('should resolve constructor parameters of built-in types', () => {
      class injectionValues {
        @injectable('injStr')
        public static injectableString: string = 'test';
        @injectable
        public static injectableBoolean: boolean = true;
      }

      @component
      class InjectBuiltInTestClass {
        prop: any;
        constructor(value: string) {
          this.prop = value || false;
        }
      }
      console.log(di.injectables); // testing
      let checkInstance = di.getInstance(InjectBuiltInTestClass.name);
      checkInstance.should.exist;
      checkInstance.should.be.instanceof(InjectBuiltInTestClass);
      checkInstance.prop.should.be.type('string');
    });
  }); // category end

  describe('singleton', function() {
    it('should mark a class as singleton and only ever return one instance', function() {
      @injectable
      class InnerClass {
        constructor() {

        }
      }
      @injectable
      class SomeClass {
        inside: InnerClass;
        constructor(inj: InnerClass) {
          this.inside = inj;
        }
        someMethod(){
          console.log('did something.');
        }
      }

      @singleton
      class MySingletonClass {
        prop: any;
        constructor(inj: SomeClass) {
          this.prop = inj || false;
        }
      }
      let createdSingleton = di.getInstance(MySingletonClass.name);
      createdSingleton.should.equal(di.getInstance(MySingletonClass.name));
    });
  }); // category end

  describe('component', function() {
    @component
    class MyComponent {}

    @injectable
    class Depclass {}

    @component
    class DepComponent {
      constructor(mycomp: MyComponent, depclass: Depclass) {
      }
    }

    it('should mark as component', function() {
      let checkComp: Injectable = di.injectables.get('MyComponent');
      assert(checkComp instanceof Injectable);
      assert(checkComp.component === true);
    });
    it('should calculate dependencies for components', function() {

      let checkComp: Injectable = di.injectables.get(DepComponent.name);
      assert(checkComp instanceof Injectable);
      checkComp.component.should.be.equal(true);
      should.exist(checkComp.constParams);
      assert(checkComp.constParams.length === 2);
    });
    it('should prevent loops in deps', function() {
      assert(false);
    });
    it('should load components', function() {
      di.bootstrap();
      let checkComp = di.injectables.get(DepComponent.name);
      assert(checkComp.instanceCount > 0);
    });
  }); // category end
}); // test end
