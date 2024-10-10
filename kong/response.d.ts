// AUTO GENERATED BASED ON Kong 3.8.x, DO NOT EDIT
// Original source path: kong/pdk/response.lua


export default interface response {


    /**
    * kong.response.add_header("Cache-Control", "no-cache")
    * kong.response.add_header("Cache-Control", "no-store")
    * @param name The header name.
    * @param of strings|string|number|boolean value The header value.
    * @returns throws an error on invalid input.
    */
    addHeader(name: string, of: array): Promise<null>;

    /**
    * kong.response.set_header("X-Foo", "foo")
    * kong.response.add_header("X-Foo", "bar")
    * kong.response.clear_header("X-Foo")
    * -- from here onwards, no X-Foo headers will exist in the response
    * @param name The name of the header to be cleared
    * @returns throws an error on invalid input.
    */
    clearHeader(name: string): Promise<null>;

    /**
    * return kong.response.error(403, "Access Forbidden", {
    * ["Content-Type"] = "text/plain",
    * ["WWW-Authenticate"] = "Basic"
    * })
    * ---
    * return kong.response.error(403, "Access Forbidden")
    * ---
    * return kong.response.error(403)
    * @param status The status to be used (>399).
    * @param message? The error message to be used.
    * @param headers? The headers to be used.
    * @returns throws an error on invalid input.
    */
    error(status: number, message?: string, headers?: Array<string | number> | object): Promise<null>;

    /**
    * return kong.response.exit(403, "Access Forbidden", {
    * ["Content-Type"] = "text/plain",
    * ["WWW-Authenticate"] = "Basic"
    * })
    * ---
    * return kong.response.exit(403, [[{"message":"Access Forbidden"}]], {
    * ["Content-Type"] = "application/json",
    * ["WWW-Authenticate"] = "Basic"
    * })
    * ---
    * return kong.response.exit(403, { message = "Access Forbidden" }, {
    * ["WWW-Authenticate"] = "Basic"
    * })
    * ---
    * -- In L4 proxy mode
    * return kong.response.exit(200, "Success")
    * @param status The status to be used.
    * @param body? The body to be used.
    * @param headers? The headers to be used.
    * @returns throws an error on invalid input.
    */
    exit(status: number, body?: Buffer, headers?: Array<string | number> | object): Promise<null>;

    /**
    * -- Given a response with the following headers:
    * -- X-Custom-Header: bla
    * -- X-Another: foo bar
    * -- X-Another: baz
    * kong.response.get_header("x-custom-header") -- "bla"
    * kong.response.get_header("X-Another")       -- "foo bar"
    * kong.response.get_header("X-None")          -- nil
    * @param name The name of the header.
    Header names are case-insensitive and dashes (`-`) can be written as
    underscores (`_`). For example, the header `X-Custom-Header` can also be
    retrieved as `x_custom_header`.
    * @returns The value of the header.
    */
    getHeader(name: string): Promise<string>;

    /**
    * -- Given an response from the Service with the following headers:
    * -- X-Custom-Header: bla
    * -- X-Another: foo bar
    * -- X-Another: baz
    * local headers = kong.response.get_headers()
    * headers.x_custom_header -- "bla"
    * headers.x_another[1]    -- "foo bar"
    * headers["X-Another"][2] -- "baz"
    * @param max_headers? Limits the number of headers parsed.
    * @returns headers A table representation of the headers in the
    response.
    * @returns err If more headers than `max_headers` were present,
    returns a string with the error `"truncated"`.
    */
    getHeaders(max_headers?: number): Promise<[ret_1: Array<string | number> | object, ret_2: string]>;

    /**
    * if kong.response.get_source() == "service" then
    * kong.log("The response comes from the Service")
    * elseif kong.response.get_source() == "error" then
    * kong.log("There was an error while processing the request")
    * elseif kong.response.get_source() == "exit" then
    * kong.log("There was an early exit while processing the request")
    * end
    * @returns The source.
    */
    getSource(): Promise<string>;

    /**
    * kong.response.get_status() -- 200
    * @returns status The HTTP status code currently set for the
    downstream response.
    */
    getStatus(): Promise<number>;

    /**
    * kong.response.set_header("X-Foo", "value")
    * @param name The name of the header
    * @param of strings|string|number|boolean value The new value for the header.
    * @returns throws an error on invalid input.
    */
    setHeader(name: string, of: array): Promise<null>;

    /**
    * kong.response.set_headers({
    * ["Bla"] = "boo",
    * ["X-Foo"] = "foo3",
    * ["Cache-Control"] = { "no-store", "no-cache" }
    * })
    * -- Will add the following headers to the response, in this order:
    * -- X-Bar: bar1
    * -- Bla: boo
    * -- Cache-Control: no-store
    * -- Cache-Control: no-cache
    * -- X-Foo: foo3
    * @param headers 
    * @returns throws an error on invalid input.
    */
    setHeaders(headers: Array<string | number> | object): Promise<null>;

    /**
    * kong.response.set_status(404)
    * @param status The new status.
    * @returns throws an error on invalid input.
    */
    setStatus(status: number): Promise<null>;

}
