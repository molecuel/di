'use strict';
import 'reflect-metadata';
import should = require('should');
import assert = require('assert');
import {di, injectable, Injectable, singleton, component} from '../dist';
should();

describe('decorators', function() {


  describe('singleton', function() {

    it('should mark a class as singleton', function() {
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

      @injectable
      @singleton
      class MySingletonClass {
        prop: any;
        constructor(inj: SomeClass) {
          this.prop = inj || false;
          console.log('new instance');
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

  });
}); // test end
