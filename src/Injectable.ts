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
