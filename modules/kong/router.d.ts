// AUTO GENERATED BASED ON Kong 2.3.x, DO NOT EDIT
// Original source path: kong/pdk/router.lua


export default interface router {


    /**
    * local route = kong.router.get_route()
    * local protocols = route.protocols
    * @returns the `route` entity.
    */
    getRoute(): Promise<Array<string | number> | object>;

    /**
    * if kong.router.get_service() then
    * -- routed by route & service entities
    * else
    * -- routed by a route without a service
    * end
    * @returns the `service` entity.
    */
    getService(): Promise<Array<string | number> | object>;

}
