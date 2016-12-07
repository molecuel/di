'use strict';
import 'reflect-metadata';
import * as _ from 'lodash';

// create a unique, GLOBAL symbol name
// -----------------------------------
const singletonKey = Symbol.for('mlcl.di.singletons');

export class Injectable {
  public injectable: any;
  public constparams: any;
}

@singleton
export class DiContainer {
  public injectables: Map<string, Injectable>;
  public constructor() {
    this.injectables = new Map();
  }
  public getInstance(name: string) {
    let checkSingleton = getSingleton(name);
    if(checkSingleton) {
      return checkSingleton;
    } else {
      // init class here and check the constructor deps before
      let currentInjectable =  this.injectables.get(name);
      return new currentInjectable.injectable();
    }
  }
  public setInjectable(name: string, injectable: any) {
    let currentInjectable = new Injectable();
    currentInjectable.injectable = injectable;
    this.injectables.set(name, currentInjectable);
  }
}
export let di: DiContainer = getSingleton(DiContainer);

export function injectable(target: any) {
  di.setInjectable(target.name, target);
}

export function getSingleton(target: any) {
  if(_.isObject(target)) {
    return global[singletonKey][target.name];
  } else if(_.isString(target)) {
    return global[singletonKey][target];
  }
}

export function singleton(target: any) {
  // check if the global object has this symbol
  // add it if it does not have the symbol, yet
  let containerSymbols = Object.getOwnPropertySymbols(global);
  let hasSingletonKey = (containerSymbols.indexOf(singletonKey) > -1);

  if (!hasSingletonKey) {
    if(!_.isObject(global[singletonKey])) {
      global[singletonKey] = {};
    }
    if(!_.isObject(global[singletonKey][target.name])) {
      let singletonInstance = new target();
      global[singletonKey][target.name] = singletonInstance;
    }
  }
  // ensure the API is never changed
  Object.freeze(singleton);
}