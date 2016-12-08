'use strict'
import 'reflect-metadata';
import should = require('should');
import assert = require('assert');
import {di, injectable, singleton} from '../dist';
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
        prop:any;
        constructor(inj: SomeClass) {
          this.prop = inj || false;
          console.log('new instance');
        }
      }
      console.log(di.injectables);
      let createdSingleton = di.getInstance(MySingletonClass.name);
      console.log(createdSingleton);
      createdSingleton.should.equal(di.getInstance(MySingletonClass.name));      
    });
  }); // category end
}) // test end
