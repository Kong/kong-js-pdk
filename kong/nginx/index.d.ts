// AUTO GENERATED BASED ON Kong 3.8.x, DO NOT EDIT
// Original source path: kong/pdk/nginx.lua

import type shared from "./shared"

export default interface nginx {

    shared: shared;

    /**
    * 
    * @param k key for the ctx data
    * @returns the per-request context data in ngx.ctx
    */
    getCtx(k: string): Promise<any>;

    /**
    * local nginx_statistics = kong.nginx.get_statistics()
    * @returns Nginx connections and requests statistics
    */
    getStatistics(): Promise<Array<string | number> | object>;

    /**
    * 
    * @returns the subsystem name
    */
    getSubsystem(): Promise<string>;

    /**
    * 
    * @returns the TLSv1 version string
    */
    getTls1_versionStr(): Promise<string>;

    /**
    * 
    * @returns get NGINX variable value
    */
    getVar(): Promise<string>;

    /**
    * 
    * @returns ret_1
    */
    reqStartTime(): Promise<number>;

    /**
    * 
    * @param k key for the ctx data
    * @param any value for the ctx data
    */
    setCtx(k: string, any: string): Promise<null>;

}
