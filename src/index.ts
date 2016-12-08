'use strict';
import 'reflect-metadata';
import * as _ from 'lodash';

// create a unique, GLOBAL symbol name
const singletonKey = Symbol.for('mlcl.di.singletons');

/**
 * @description Injectable class delivers the injectable and additional informations
 * @export
 * @class Injectable
 */
export class Injectable {
  /**
   * @type {*}
   * @memberOf Injectable
   */
  public injectable: any;
  /**
   * @type {*}
   * @memberOf Injectable
   */
  public constparams: any;
}


/**
 * 
 * @description Di Container class needed to handle DI function and return instances
 * @export
 * @class DiContainer
 */
@singleton
export class DiContainer {
  /**
   * @type {Map<string, Injectable>}
   * @memberOf DiContainer
   */
  public injectables: Map<string, Injectable>;
  /**
   * Creates an instance of DiContainer.
   * @memberOf DiContainer
   */
  public constructor() {
    this.injectables = new Map();
  }
  /**
   * @description Returns a initialized instance of a injectable object or returns a singleton
   * @param {string} name
   * @returns
   * 
   * @memberOf DiContainer
   */
  public getInstance(name: string|any) {
    let checkSingleton = getSingleton(name);
    if(checkSingleton) {
      return checkSingleton;
    } else {
      // @todo add the decorator
      let currentInjectable: Injectable =  this.injectables.get(name);
      let injections: any[] = [];
      for (let parameter of currentInjectable.constparams) {
        injections.push(this.getInstance(parameter.name));
      }
      if (injections.length) {
        return new currentInjectable.injectable(...injections);
      }
      return new currentInjectable.injectable();
    }
  }
  /**
   * @description Stores a injectable
   * @param {string} name
   * @param {*} injectable
   * 
   * @memberOf DiContainer
   */
  public setInjectable(name: string, injectable: any) {
    let currentInjectable = new Injectable();
    currentInjectable.constparams = Reflect.getMetadata('design:paramtypes', injectable);
    currentInjectable.injectable = injectable;
    this.injectables.set(name, currentInjectable);
  }
}
export let di: DiContainer = getSingleton(DiContainer);

/**
 * @decorator
 * @export
 * @param {*} target
 */
export function injectable(target: any) {
  di.setInjectable(target.name, target);
}

/**
 * 
 * @decorator
 * @export
 * @param {*} target
 * @returns
 */
export function getSingleton(target: any) {
  // check if it's an object to get the name from the prototype
  if(_.isObject(target)) {
    return global[singletonKey][target.name];
  } else if(_.isString(target)) {
    // if it's a string return singleton by string
    return global[singletonKey][target];
  }
}

/**
 * 
 * @decorator
 * @export
 * @param {*} target
 */
export function singleton(target: any): void {
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