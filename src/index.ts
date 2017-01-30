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
    // this.injectionOverrides = [];
  }
  /**
   * @description Returns a initialized instance of a injectable object or returns a singleton
   * @param {string} name
   * @returns
   *
   * @memberOf DiContainer
   */
  public getInstance(name: string|any, ...params) {
    let checkSingleton = getSingleton(name);
    if(checkSingleton) {
      return checkSingleton;
    }
    else {
      let currentInjectable: Injectable =  this.injectables.get(name);
        if(!currentInjectable || this.checkDependencyLoop(name)) {
          return undefined;
        }
        let injections: any[] = [];
        if (currentInjectable.constParams) {
          for (let paramIndex = 0; paramIndex < currentInjectable.constParams.length; paramIndex++) {
            let injectableParent = this.injectables.get(Object.getPrototypeOf(currentInjectable.injectable).name);
            if (params[paramIndex] !== undefined
            && (paramIndex < currentInjectable.injectable.length
            || (injectableParent && injectableParent.injectable.length))) {
              injections.push(params[paramIndex]);
            }
            else if (currentInjectable.constParams[paramIndex] && currentInjectable.constParams[paramIndex].name) {

              let slicedParams = (params[paramIndex] !== undefined && params.slice(paramIndex).length) ? params.slice(paramIndex) : [];
              injections.push(this.getInstance(currentInjectable.constParams[paramIndex].name,
              ...slicedParams));
            }
            else {
              injections.push(undefined);
            }
          }
        }
        // @todo: properly inject built-in types
        currentInjectable.instanceCount++;
        if (injections.length) {
          return new currentInjectable.injectable(...injections);
        }
        return new currentInjectable.injectable();
      // }
    }
  }

  /**
   * @description Stores a injectable
   * @param {string} name
   *
   * @memberOf DiContainer
   */
  public setInjectable(name: string, injectable: any, propertyName?: string) {
    let currentInjectable = new Injectable();
    let parentClass = Object.getPrototypeOf(injectable);
      let meta = Reflect.getMetadata('design:paramtypes', injectable);
      currentInjectable.constParams = (meta && meta[0]) ? meta : [];
      currentInjectable.injectable = injectable;
      if (parentClass && this.injectables.get(parentClass.name)) {
        let parentConstParams = Reflect.getMetadata('design:paramtypes', parentClass);
        if (parentConstParams && currentInjectable.constParams !== parentConstParams) {
          currentInjectable.constParams = currentInjectable.constParams.concat(parentConstParams);
        }
      }
    this.injectables.set(name, currentInjectable);
  }

  /**
   * @description Check an Injectable to have no looping deps
   * @param {string} name
   * @param {*} injectable
   *
   * @memberOf DiContainer
   */
  protected checkDependencyLoop(target: string, parents: Injectable[] = []): boolean {
    let check = this.injectables.get(target);
    if (!check || !check.constParams || !check.constParams.length) {
      return false;
    }
    else if (_.includes(parents, check.injectable)) {
      return true;
    }
    else if (check && check.constParams) {
      parents.push(check.injectable);
      for (let param of check.constParams) {
        if (param && this.checkDependencyLoop(param.name || param, parents)) {
          return true;
        }
        else {
          parents.pop();
        }
      }
    }
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
    currentComponent.constParams = Reflect.getMetadata('design:paramtypes', component) || [];
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
    for(let [key, value] of this.injectables) {
      if(value && value.component) {
        this.getInstance(key);
      }
    }
  }
}

export let di: DiContainer = getSingleton(DiContainer);

// function injectableNameOverride(injectionKey?: string) {
//   return function(target: any, propertyName?: string) {
//     di.setInjectable(injectionKey || propertyName || target.name, target, propertyName);
//   };
// }

/**
 * @decorator
 * @export
 * @param {*} target
 */
export function injectable(target: any, propertyName?: string) { // function injectableConstructorName(target: any, propertyName?: string) {
  di.setInjectable(propertyName || target.name, target, propertyName);
}
//
// export function injectable(...args: any[]) {
//   if(args.length === 1 && typeof args[0] === 'string') {
//     return injectableNameOverride(...args);
//   }
//   else {
//     return injectableConstructorName(...args);
//   }
// }

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
    let constParams = Reflect.getMetadata('design:paramtypes', target);
    if (_.isArray(constParams)) {
      for (let parameter of constParams) {
        injections.push(di.getInstance((<any>parameter).name));
      }
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

/**
 *
 * @decorator
 * @export
 * @param {*} target
 */
export function component(target: any) {
  di.setComponent(target.name, target);
}