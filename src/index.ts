'use strict';
import 'reflect-metadata';
import * as _ from 'lodash';

// create a unique, GLOBAL symbol name
// -----------------------------------
const injectableKey = Symbol.for('mlcl.di.injectables');

let container = {};
let singletons = new Map();

export function injectable(target: any) {

  // check if the global object has this symbol
  // add it if it does not have the symbol, yet
  // ------------------------------------------
  let containerSymbols = Object.getOwnPropertySymbols(container);
  let hasInjectableKey = (containerSymbols.indexOf(injectableKey) > -1);

  if (!hasInjectableKey) {
    if(!_.isObject(container[injectableKey])) {
      container[injectableKey] = {};
    }
    if(!_.isObject(container[injectableKey][target.name])) {
      container[injectableKey][target.name] = target;
    }
  }
}

// export function inject(){
export function inject(target: any, keyName: string) {
  let injectables: any[] = [];
  let types = Reflect.getMetadata('design:paramtypes', target, keyName);
    if(!keyName){
    keyName = 'constructor';
  }
  for (let injReq of types) {
    // console.log(injReq); // testing
    injectables.push(getInjectable(injReq));
  }
  console.log(injectables); // testing

  // console.log(types); // testing
  // console.log(_.toString(target));
  // console.log(_.toString(target.constructor));
  // let props: any[] = Array.prototype.slice.call(target);
  // for (let prop of props) { // testing
  //   console.log(_.toString(prop)); // testing
  // }
    
}

/**
 * Should alwas return a instance of the di singleton
 */
export function di() {
  let that = this;
  class diSingletonMantle {
    diContainer: any;
    diSingletons: any;
    contructor() {
      this.diContainer = that.container;
      this.diSingletons = that.singletons;
    }
    let diExport: diSingletonMantle;
    if (_.isObject(diExport)) {
      return diExport;
    }
    else {
      diExport = new diSingletonMantle;
      return diExport;
    }
  }
}

export function getInjectable(target: any) {
  return container[injectableKey][target.name];
}

export function singleton(target: any) {
  injectable(target);
  let injectableTarget = getInjectable(target);

  // create a unique, global symbol name
  let singletonKey = Symbol.for('mlcl.di.singletons');

  // check if the global object has this symbol
  // add it if it does not have the symbol, yet
  let containerSymbols = Object.getOwnPropertySymbols(container);
  let hasSingletonKey = (containerSymbols.indexOf(singletonKey) > -1);

  if (!hasSingletonKey) {
    if(!_.isObject(container[singletonKey])) {
      container[singletonKey] = {};
    }
    if(!_.isObject(container[singletonKey][target.name])) {
      let singletonInstance = new injectableTarget();
      container[singletonKey][target.name] = singletonInstance;
    }
  }
  // ensure the API is never changed
  Object.freeze(singleton);
}