// AUTO GENERATED BASED ON Kong 3.8.x, DO NOT EDIT
// Original source path: kong/pdk/request.lua


export default interface request {


    /**
    * local body, err, mimetype = kong.request.get_body()
    * body.name -- "John Doe"
    * body.age  -- "42"
    * @param mimetype? The MIME type.
    * @param max_args? Sets a limit on the maximum number of parsed
    * @param max_allowed_file_size? the max allowed file size to be read from
    arguments.
    * @returns A table representation of the body.
    * @returns An error message.
    * @returns mimetype The MIME type used.
    */
    getBody(mimetype?: string, max_args?: number, max_allowed_file_size?: number): Promise<[ret_1: Array<string | number> | object, ret_2: string, ret_3: string]>;

    /**
    * kong.request.get_forwarded_host() -- "example.com"
    * @returns The forwarded host.
    */
    getForwardedHost(): Promise<string>;

    /**
    * kong.request.get_forwarded_path() -- /path
    * @returns The forwarded path.
    */
    getForwardedPath(): Promise<string>;

    /**
    * kong.request.get_forwarded_port() -- 1234
    * @returns The forwarded port.
    */
    getForwardedPort(): Promise<number>;

    /**
    * kong.request.get_forwarded_prefix() -- /prefix
    * @returns The forwarded path prefix or `nil` if the prefix was
    not stripped.
    */
    getForwardedPrefix(): Promise<string>;

    /**
    * kong.request.get_forwarded_scheme() -- "https"
    * @returns The forwarded scheme.
    */
    getForwardedScheme(): Promise<string>;

    /**
    * -- Given a request with the following headers:
    * -- Host: foo.com
    * -- X-Custom-Header: bla
    * -- X-Another: foo bar
    * -- X-Another: baz
    * kong.request.get_header("Host")            -- "foo.com"
    * kong.request.get_header("x-custom-header") -- "bla"
    * kong.request.get_header("X-Another")       -- "foo bar"
    * @param name the name of the header to be returned
    * @returns the value of the header or nil if not present
    */
    getHeader(name: string): Promise<string>;

    /**
    * -- Given a request with the following headers:
    * -- Host: foo.com
    * -- X-Custom-Header: bla
    * -- X-Another: foo bar
    * -- X-Another: baz
    * local headers = kong.request.get_headers()
    * headers.host            -- "foo.com"
    * headers.x_custom_header -- "bla"
    * headers.x_another[1]    -- "foo bar"
    * headers["X-Another"][2] -- "baz"
    * @param max_headers? Sets a limit on the maximum number of
    parsed headers.
    * @returns The request headers in table form.
    */
    getHeaders(max_headers?: number): Promise<Array<string | number> | object>;

    /**
    * -- Given a request to https://example.com:1234/v1/movies
    * kong.request.get_host() -- "example.com"
    * @returns The hostname.
    */
    getHost(): Promise<string>;

    /**
    * kong.request.get_http_version() -- 1.1
    * @returns The HTTP version as a Lua number.
    */
    getHttpVersion(): Promise<number>;

    /**
    * kong.request.get_method() -- "GET"
    * @returns The request method.
    */
    getMethod(): Promise<string>;

    /**
    * -- Given a request to https://example.com/t/Abc%20123%C3%B8%2f/parent/..//test/./
    * kong.request.get_path() -- "/t/Abc 123ø%2F/test/"
    * @returns the path
    */
    getPath(): Promise<string>;

    /**
    * -- Given a request to https://example.com:1234/v1/movies?movie=foo
    * kong.request.get_path_with_query() -- "/v1/movies?movie=foo"
    * @returns The path with the query string.
    */
    getPathWithQuery(): Promise<string>;

    /**
    * -- Given a request to https://example.com:1234/v1/movies
    * kong.request.get_port() -- 1234
    * @returns The port.
    */
    getPort(): Promise<number>;

    /**
    * -- Given a request GET /test?foo=hello%20world&bar=baz&zzz&blo=&bar=bla&bar
    * for k, v in pairs(kong.request.get_query()) do
    * kong.log.inspect(k, v)
    * end
    * -- Will print
    * -- "foo" "hello world"
    * -- "bar" {"baz", "bla", true}
    * -- "zzz" true
    * -- "blo" ""
    * @param max_args? Sets a limit on the maximum number of parsed
    arguments.
    * @returns A table representation of the query string.
    */
    getQuery(max_args?: number): Promise<Array<string | number> | object>;

    /**
    * -- Given a request GET /test?foo=hello%20world&bar=baz&zzz&blo=&bar=bla&bar
    * kong.request.get_query_arg("foo") -- "hello world"
    * kong.request.get_query_arg("bar") -- "baz"
    * kong.request.get_query_arg("zzz") -- true
    * kong.request.get_query_arg("blo") -- ""
    * @returns The value of the argument.
    */
    getQueryArg(): Promise<any>;

    /**
    * -- Given a body with payload "Hello, Earth!":
    * kong.request.get_raw_body():gsub("Earth", "Mars") -- "Hello, Mars!"
    * @returns The plain request body or nil if it does not fit into
    the NGINX temporary buffer.
    * @returns An error message.
    */
    getRawBody(): Promise<[ret_1: Buffer, ret_2: string]>;

    /**
    * -- Given a request to https://example.com/t/Abc%20123%C3%B8%2f/parent/..//test/./?movie=foo
    * kong.request.get_raw_path() -- "/t/Abc%20123%C3%B8%2f/parent/..//test/./"
    * @returns The path.
    */
    getRawPath(): Promise<string>;

    /**
    * -- Given a request to https://example.com/foo?msg=hello%20world&bla=&bar
    * kong.request.get_raw_query() -- "msg=hello%20world&bla=&bar"
    * @returns The query component of the request's URL.
    */
    getRawQuery(): Promise<string>;

    /**
    * -- Given a request to https://example.com:1234/v1/movies
    * kong.request.get_scheme() -- "https"
    * @returns A string like `"http"` or `"https"`.
    */
    getScheme(): Promise<string>;

    /**
    * kong.request.get_start_time() -- 1649960273000
    * @returns The timestamp
    */
    getStartTime(): Promise<number>;

    /**
    * local captures = kong.request.get_uri_captures()
    * for idx, value in ipairs(captures.unnamed) do
    * -- do what you want to captures
    * end
    * for name, value in pairs(captures.named) do
    * -- do what you want to captures
    * end
    * @returns tables containing unamed and named captures.
    */
    getUriCaptures(): Promise<Array<string | number> | object>;

}
