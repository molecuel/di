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
      console.log(di.injectables);
      console.log(di.getInstance(MySingletonClass.name));
    });
  }); // category end
}) // test end
