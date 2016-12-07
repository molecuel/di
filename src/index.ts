'use strict';
import 'reflect-metadata';
import * as _ from 'lodash';

// create a unique, GLOBAL symbol name
// -----------------------------------
const injectableKey = Symbol.for('mlcl.di.injectables');

export function injectable(target: any) {

  // check if the global object has this symbol
  // add it if it does not have the symbol, yet
  // ------------------------------------------
  let globalSymbols = Object.getOwnPropertySymbols(global);
  let hasInjectableKey = (globalSymbols.indexOf(injectableKey) > -1);

  if (!hasInjectableKey) {
    if(!_.isObject(global[injectableKey])) {
      global[injectableKey] = {};
    }
    if(!_.isObject(global[injectableKey][target.name])) {
      global[injectableKey][target.name] = target;
    }
  }
}

// export function inject(){
export function inject(target: any, key, mytest) {
  let injectables: any[] = [];
  /*for (let injReq of Reflect.getMetadata('design:paramtypes', target)) {
    injectables.push(getInjectable(injReq));
  }*/
  // if (new.target) {
  // 
  // }
  var types = Reflect.getMetadata("design:paramtypes", target, key);
  var s = types.map(a => a.name).join();
  console.log(`${key} param types: ${s}`);
}

/**
 * Should alwas return a instance of the di singleton
 */
export function di() {

}

export function getInjectable(target: any) {
  return global[injectableKey][target.name];
}

export function singleton(target: any) {
  injectable(target);
  let injectableTarget = getInjectable(target);

  // create a unique, global symbol name
  let singletonKey = Symbol.for('mlcl.di.singletons');

  // check if the global object has this symbol
  // add it if it does not have the symbol, yet
  let globalSymbols = Object.getOwnPropertySymbols(global);
  let hasSingletonKey = (globalSymbols.indexOf(singletonKey) > -1);

  if (!hasSingletonKey) {
    if(!_.isObject(global[singletonKey])) {
      global[singletonKey] = {};
    }
    if(!_.isObject(global[singletonKey][target.name])) {
      let singletonInstance = new injectableTarget();
      global[singletonKey][target.name] = singletonInstance;
    }
  }
  // ensure the API is never changed
  Object.freeze(singleton);
}