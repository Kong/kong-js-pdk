// AUTO GENERATED BASED ON Kong 3.8.x, DO NOT EDIT
// Original source path: kong/pdk/service.lua

import type request from "./request"
import type response from "./response"

export default interface service {

    request: request;
    response: response;

    /**
    * kong.service.set_retries(233)
    * @param retries 
    */
    setRetries(retries: number): Promise<null>;

    /**
    * kong.service.set_target("service.local", 443)
    * kong.service.set_target("192.168.130.1", 80)
    * @param host 
    * @param port 
    */
    setTarget(host: string, port: number): Promise<null>;

    /**
    * kong.service.set_target_retry_callback(function() return "service.local", 443 end)
    * @param retry_callback 
    */
    setTargetRetryCallback(retry_callback: function): Promise<null>;

    /**
    * kong.service.set_timeouts(233, 233, 233)
    * @param connect_timeout 
    * @param write_timeout 
    * @param read_timeout 
    */
    setTimeouts(connect_timeout: number, write_timeout: number, read_timeout: number): Promise<null>;

    /**
    * local ok, err = kong.service.set_tls_verify(true)
    * if not ok then
    * -- do something with error
    * end
    * @param on Whether to enable TLS certificate verification for the current request
    * @returns `true` if the operation succeeded, `nil` if an error occurred
    * @returns An error message describing the error if there was one
    */
    setTlsVerify(on: boolean): Promise<[ret_1: boolean, ret_2: string]>;

    /**
    * local ok, err = kong.service.set_tls_verify_depth(3)
    * if not ok then
    * -- do something with error
    * end
    * @param depth Depth to use when validating. Must be non-negative
    * @returns `true` if the operation succeeded, `nil` if an error occurred
    * @returns An error message describing the error if there was one
    */
    setTlsVerifyDepth(depth: number): Promise<[ret_1: boolean, ret_2: string]>;

    /**
    * local ok, err = kong.service.set_upstream("service.prod")
    * if not ok then
    * kong.log.err(err)
    * return
    * end
    * @param host 
    * @returns `true` on success, or `nil` if no upstream entities
    where found
    * @returns An error message describing the error if there was
    one.
    */
    setUpstream(host: string): Promise<[ret_1: boolean, ret_2: string]>;

}
