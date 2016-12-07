'use strict'
import 'reflect-metadata';
import should = require('should');
import assert = require('assert');
import {injectable, inject, singleton, getInjectable} from '../dist';
should();

describe('decorators', function() {


  describe('singleton', function() {

    it('should mark a class as singleton', function() {
      @injectable
      class SomeClass {
        constructor() {

        }
        someMethod(){
          console.log('did something.');
        }
      }

      // @singleton
      @injectable
      class MySingletonClass {
        prop:any;
        constructor() {
          this.prop = {};
          console.log('new instance');
        }
      }

      @inject
      class testClass {
        constructor(one: SomeClass, two: MySingletonClass) {
          this.one = one;
          this.two = two;
        }
        one: any;
        two: any;
      }

      // @inject()
      // let testInstance = new testClass;

      // let myinj = getInjectable(MySingletonClass);
      // console.log(myinj);
      // let test = new myinj();
      // let test2 = new myinj();
      // console.log(test);
      // console.log(test2);
      // console.log(test === test2);
    });
  
  }); // category end
}) // test end
