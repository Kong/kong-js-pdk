// AUTO GENERATED BASED ON Kong 3.8.x, DO NOT EDIT
// Original source path: kong/pdk/service/request.lua


export default interface request {


    /**
    * kong.service.request.add_header("Cache-Control", "no-cache")
    * kong.service.request.add_header("Cache-Control", "no-store")
    * @param header The header name. Example: "Cache-Control".
    * @param of strings|string|number|boolean value The header value. Example: "no-cache".
    * @returns throws an error on invalid inputs.
    */
    addHeader(header: string, of: array): Promise<null>;

    /**
    * kong.service.request.set_header("X-Foo", "foo")
    * kong.service.request.add_header("X-Foo", "bar")
    * kong.service.request.clear_header("X-Foo")
    * -- from here onwards, no X-Foo headers will exist in the request
    * @param header The header name. Example: "X-Foo".
    * @returns throws an error on invalid inputs.
    The function does not throw an error if no header was removed.
    */
    clearHeader(header: string): Promise<null>;

    /**
    * local ok, err = kong.service.request.disable_tls()
    * if not ok then
    * -- do something with error
    * end
    * @returns `true` if the operation succeeded, `nil` if an error occurred.
    * @returns An error message describing the error if there was one.
    */
    disableTls(): Promise<[ret_1: boolean, ret_2: string]>;

    /**
    * kong.service.request.enable_buffering()
    * @returns 
    */
    enableBuffering(): Promise<null>;

    /**
    * kong.service.set_header("application/json")
    * local ok, err = kong.service.request.set_body({
    * name = "John Doe",
    * age = 42,
    * numbers = {1, 2, 3}
    * })
    * -- Produces the following JSON body:
    * -- { "name": "John Doe", "age": 42, "numbers":[1, 2, 3] }
    * local ok, err = kong.service.request.set_body({
    * foo = "hello world",
    * bar = {"baz", "bla", true},
    * zzz = true,
    * blo = ""
    * }, "application/x-www-form-urlencoded")
    * -- Produces the following body:
    * -- bar=baz&bar=bla&bar&blo=&foo=hello%20world&zzz
    * @param args A table with data to be converted to the appropriate format
    and stored in the body.
    * @param mimetype? can be one of:
    * @returns `true` on success, `nil` otherwise.
    * @returns `nil` on success, an error message in case of error.
    Throws an error on invalid inputs.
    */
    setBody(args: Array<string | number> | object, mimetype?: string): Promise<[ret_1: boolean, ret_2: string]>;

    /**
    * kong.service.request.set_header("X-Foo", "value")
    * @param header The header name. Example: "X-Foo".
    * @param of strings|string|boolean|number value The header value. Example: "hello world".
    * @returns throws an error on invalid inputs.
    */
    setHeader(header: string, of: array): Promise<null>;

    /**
    * kong.service.request.set_header("X-Foo", "foo1")
    * kong.service.request.add_header("X-Foo", "foo2")
    * kong.service.request.set_header("X-Bar", "bar1")
    * kong.service.request.set_headers({
    * ["X-Foo"] = "foo3",
    * ["Cache-Control"] = { "no-store", "no-cache" },
    * ["Bla"] = "boo"
    * })
    * -- Will add the following headers to the request, in this order:
    * -- X-Bar: bar1
    * -- Bla: boo
    * -- Cache-Control: no-store
    * -- Cache-Control: no-cache
    * -- X-Foo: foo3
    * @param headers A table where each key is a string containing a header name
    and each value is either a string or an array of strings.
    * @returns throws an error on invalid inputs.
    */
    setHeaders(headers: Array<string | number> | object): Promise<null>;

    /**
    * kong.service.request.set_method("DELETE")
    * @param method The method string, which must be in all
    uppercase. Supported values are: `"GET"`, `"HEAD"`, `"PUT"`, `"POST"`,
    `"DELETE"`, `"OPTIONS"`, `"MKCOL"`, `"COPY"`, `"MOVE"`, `"PROPFIND"`,
    `"PROPPATCH"`, `"LOCK"`, `"UNLOCK"`, `"PATCH"`, or `"TRACE"`.
    * @returns throws an error on invalid inputs.
    */
    setMethod(method: string): Promise<null>;

    /**
    * kong.service.request.set_path("/v2/movies")
    * @param path The path string. Special characters and UTF-8
    characters are allowed, for example: `"/v2/movies"` or `"/foo/😀"`.
    * @returns throws an error on invalid inputs.
    */
    setPath(path: string): Promise<null>;

    /**
    * kong.service.request.set_query({
    * foo = "hello world",
    * bar = {"baz", "bla", true},
    * zzz = true,
    * blo = ""
    * })
    * -- Produces the following query string:
    * -- bar=baz&bar=bla&bar&blo=&foo=hello%20world&zzz
    * @param args A table where each key is a string (corresponding to an
    argument name), and each value is either a boolean, a string, or an array of
    strings or booleans. Any string values given are URL-encoded.
    * @returns throws an error on invalid inputs.
    */
    setQuery(args: Array<string | number> | object): Promise<null>;

    /**
    * kong.service.request.set_raw_body("Hello, world!")
    * @param body The raw body.
    * @returns throws an error on invalid inputs.
    */
    setRawBody(body: string): Promise<null>;

    /**
    * kong.service.request.set_raw_query("zzz&bar=baz&bar=bla&bar&blo=&foo=hello%20world")
    * @param query The raw querystring. Example:
    `"foo=bar&bla&baz=hello%20world"`.
    * @returns throws an error on invalid inputs.
    */
    setRawQuery(query: string): Promise<null>;

    /**
    * kong.service.request.set_scheme("https")
    * @param scheme The scheme to be used. Supported values are `"http"` or `"https"`.
    * @returns throws an error on invalid inputs.
    */
    setScheme(scheme: string): Promise<null>;

}
