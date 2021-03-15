// AUTO GENERATED BASED ON Kong 2.3.x, DO NOT EDIT
// Original source path: kong/pdk/service/response.lua


export default interface response {


    /**
    * -- Plugin needs to call kong.service.request.enable_buffering() on `rewrite`
    * -- or `access` phase prior calling this function.
    * local body = kong.service.response.get_body()
    * @param mimetype The mime-type of the response (if known)
    * @param mimetype? the MIME type
    * @param max_args? set a limit on the maximum number of parsed
    * @returns body The raw buffered body
    */
    getBody(mimetype: string, mimetype?: string, max_args?: number): Promise<string>;

    /**
    * -- Given a response with the following headers:
    * -- X-Custom-Header: bla
    * -- X-Another: foo bar
    * -- X-Another: baz
    * kong.log.inspect(kong.service.response.get_header("x-custom-header")) -- "bla"
    * kong.log.inspect(kong.service.response.get_header("X-Another"))       -- "foo bar"
    * @param name The name of the header.
    Header names in are case-insensitive and are normalized to lowercase, and
    dashes (`-`) can be written as underscores (`_`); that is, the header
    `X-Custom-Header` can also be retrieved as `x_custom_header`.
    * @returns The value of the header, or `nil` if a header with
    `name` was not found in the response. If a header with the same name is present
    multiple times in the response, this function will return the value of the
    first occurrence of this header.
    */
    getHeader(name: string): Promise<string>;

    /**
    * -- Given a response with the following headers:
    * -- X-Custom-Header: bla
    * -- X-Another: foo bar
    * -- X-Another: baz
    * local headers = kong.service.response.get_headers()
    * if headers then
    * kong.log.inspect(headers.x_custom_header) -- "bla"
    * kong.log.inspect(headers.x_another[1])    -- "foo bar"
    * kong.log.inspect(headers["X-Another"][2]) -- "baz"
    * end
    * @param max_headers? customize the headers to parse
    * @returns the response headers in table form
    * @returns err If more headers than `max_headers` were present, a
    string with the error `"truncated"`.
    */
    getHeaders(max_headers?: number): Promise<[ret_1: Array<string | number> | object, ret_2: string]>;

    /**
    * -- Plugin needs to call kong.service.request.enable_buffering() on `rewrite`
    * -- or `access` phase prior calling this function.
    * local body = kong.service.response.get_raw_body()
    * @returns body The raw buffered body
    */
    getRawBody(): Promise<string>;

    /**
    * kong.log.inspect(kong.service.response.get_status()) -- 418
    * @returns the status code from the response from the Service, or `nil`
    if the request was not proxied (i.e. `kong.response.get_source()` returned
    anything other than `"service"`.
    */
    getStatus(): Promise<number>;

}
