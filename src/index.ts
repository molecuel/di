import "reflect-metadata";
import {DiContainer, getSingleton} from "./DiContainer";
export {Injectable} from "./Injectable";
export {singleton} from "./DiContainer";

export let di: DiContainer = getSingleton(DiContainer);

/**
 * @decorator
 * @export
 * @param {*} target
 */
export function injectable(target: any, propertyName?: string) {
  di.setInjectable(propertyName || target.name, target, propertyName);
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
