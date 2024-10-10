// AUTO GENERATED BASED ON Kong 3.8.x, DO NOT EDIT
// Original source path: kong/pdk/nginx/shared.lua


export default interface shared {


    /**
    * 
    * @param k key for the ctx data
    * @returns the per-request context data in ngx.ctx
    */
    get(k: string): Promise<any>;

    /**
    * 
    * @param k key for the ctx data
    * @param v value for the ctx data
    */
    set(k: string, v: string): Promise<null>;

}
