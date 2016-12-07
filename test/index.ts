'use strict'
import 'reflect-metadata';
import should = require('should');
import assert = require('assert');
import {injectable, inject, singleton, getInjectable} from '../dist';
should();

describe('decorators', function() {


  describe('singleton', function() {

    it('should mark a class as singleton', function() {
      @singleton
      class MySingletonClass {
        constructor() {
          console.log('new instance');
        }
      }
      let myinj = getInjectable(MySingletonClass);

      console.log(myinj);
      let test = new myinj();
      let test2 = new myinj();
      console.log(test);
      console.log(test2);
      console.log(test === test2);
    });
  
  }); // category end
}) // test end
