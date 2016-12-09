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
   * @description Constructor of injectable
   */
  public injectable: any;

  /**
   * @type {*[]}
   * @memberOf Injectable
   * @description Constructor parameters of injectable
   */
  public constParams: any[];

  /**
   * @type {boolean}
   * @memberOf Injectable
   * @description Marks a injectable as component
   */
  public component: boolean;

  /**
   * @description Count of created instances
   * @type {number}
   * @memberOf Injectable
   */
  public instanceCount: number = 0;
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
      let currentInjectable: Injectable =  this.injectables.get(name);
      let injections: any[] = [];
      for (let parameter of currentInjectable.constParams) {
        injections.push(this.getInstance(parameter.name));
      }
      currentInjectable.instanceCount++;
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
  public setInjectable(name: string, injectable: any, propertyName?: string) {
    let currentInjectable = new Injectable();
    if(propertyName) {
      currentInjectable.constParams = injectable[propertyName];
    }
    else {
      currentInjectable.constParams = Reflect.getMetadata('design:paramtypes', injectable);
    }
    currentInjectable.injectable = injectable;

    this.injectables.set(name, currentInjectable);
  }

  /**
   * 
   * @param {string} name
   * @param {*} injectable
   * 
   * @memberOf DiContainer
   */
  public setComponent(name: string, component: any) {
    let currentComponent = new Injectable();
    currentComponent.constParams = Reflect.getMetadata('design:paramtypes', component);
    currentComponent.injectable = component;
    currentComponent.component = true;
    this.injectables.set(name, currentComponent);
  }

  /**
   * @description Bootstrap DI
   * @memberOf DiContainer
   */
  public bootstrap() {
      // @todo check dependencies of @component

      // init components
      for(let [key, component] of this.injectables) {
        if(component.component) {
          this.getInstance(key);
        }
      }
  }
}
export let di: DiContainer = getSingleton(DiContainer);

/**
 * @decorator
 * @export
 * @param {*} target
 */

function injectableNameOverride(injectionKey?: string) {
  return function(target: any, propertyName?: string) {
    // console.log('OVR:TARGET');
    // console.log(target);
    // console.log('OVR:NAME');
    // console.log(target.name);
    // console.log('OVR:PROPERTY');
    // console.log(propertyName);
    // console.log('OVR:KEY');
    // console.log(injectionKey);
    di.setInjectable(injectionKey || propertyName || target.name, target, propertyName);
  };
}

function injectableConstructorName(target: any, propertyName?: string) {
  // console.log('CON:TARGET');
  // console.log(target);
  // console.log('CON:NAME');
  // console.log(target.name);
  // console.log('CON:PROPERTY');
  // console.log(propertyName);
  di.setInjectable(propertyName || target.name, target, propertyName);
}

export function injectable(...args: any[]) {
  if(args.length === 1 && typeof args[0] === 'string') {
    return injectableNameOverride(...args);
  }
  else {
    return injectableConstructorName(...args);
  }

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
  let globalSymbols = Object.getOwnPropertySymbols(global);
  let hasSingletonKey = (globalSymbols.indexOf(singletonKey) > -1);

  if (!hasSingletonKey) {
    if(!_.isObject(global[singletonKey])) {
      global[singletonKey] = {};
    }
  }
  if(!global[singletonKey][target.name]) {
    let singletonInstance: Object; // = new target();
    let injections: Object[] = [];
    for (let parameter of Reflect.getMetadata('design:paramtypes', target)) {
      injections.push(di.getInstance(parameter.name));
    }
    if (injections.length) {
      singletonInstance = new target(...injections);
    }
    else {
      singletonInstance = new target();
    }
    global[singletonKey][target.name] = singletonInstance;
  }
  // ensure the API is never changed
  Object.freeze(singleton);
}

export function component(target: any) {
  di.setComponent(target.name, target);
}