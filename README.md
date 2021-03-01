# kong-js-pdk

Plugin server and PDK (Plugin Development Kit) for Javascript language support in Kong.

Requires Kong >= 2.3.0.

**This project is currently work in progress, please be noted that API interfaces
are in flux and subject to change.**

## Install dependencies

```
cd /path/to/this-project
npm install
```

Run `bin/kong-js-pluginserver` to see if all dependencies are happy.

## Configure Kong

Add the following line into `kong.conf`:

```
plugins=bundled,js-hello
pluginserver_names=go, js
pluginserver_js_socket=/usr/local/kong/js_pluginserver.sock
pluginserver_js_start_cmd=/path/to/this-project/bin/kong-js-pluginserver -d /path/to/this-project/examples
pluginserver_js_query_cmd=/path/to/this-project/bin/kong-js-pluginserver -d /path/to/this-project/examples --dump-all-plugins
```

Note: if your node is installed in paths other than `/usr/bin/` or `/bin/`, please prefix the commands with node path:

```
pluginserver_js_start_cmd=/usr/local/bin/node /path/to/this-project/bin/kong-js-pluginserver -d /path/to/this-project/examples
pluginserver_js_query_cmd=/usr/local/bin/node /path/to/this-project/bin/kong-js-pluginserver -d /path/to/this-project/examples --dump-all-plugins
```

## Enable the plugin

Same step as it's a Lua plugin.

## Guide for writing your own plugin

See examples/js-hello.js for an example. PDK functions share the same pattern as if it's in Lua, except that
each PDK function must be called with `await`.

## TODO

- Better API design for user land (without async/await?)
- Dedicated server per plugin
- Generate typescript interface file
- Rewrite with typescript
