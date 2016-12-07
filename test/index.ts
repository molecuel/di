'use strict'
import 'reflect-metadata';
import should = require('should');
import assert = require('assert');
import {di, injectable, inject, singleton, getInjectable} from '../dist';
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
    });
  }); // category end
}) // test end
