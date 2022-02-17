// AUTO GENERATED BASED ON Kong 2.7.x, DO NOT EDIT
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
    * @returns the NGINX version string
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
