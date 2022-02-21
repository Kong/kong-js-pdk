'use strict';

const path = require('path')
const { v4: uuidv4 } = require('uuid')
const fetch = require("node-fetch")
const PDK = require(path.join(__dirname, 'pdk'))
const PipePair = require(path.join(__dirname, 'lib', 'pipe'))
const {
  Module
} = require(path.join(__dirname, 'lib', 'mod'))

const MSG_RET = 'ret'

let noop = function() {
  return true
}

let mockFunctions = {
  "kong.client.get_ip": function() { return "1.2.3.4" },
  "kong.client.get_forwarded_ip": function() { return "1.2.3.4" },
  "kong.client.get_port": function() { return 443 },
  "kong.client.get_forwarded_port": function() { return 443 },
  "kong.client.get_credential": function() { return { id: uuidv4(), consumer_id: "123456" } },
  "kong.client.load_consumer": function() { return { id: uuidv4(), username: "Jon Doe" } },
  "kong.client.authenticate": noop,
  "kong.client.get_protocol": function() { "https" },

  "kong.ip.is_trusted": noop,

  "kong.node.get_id": function() { return "a9777ac2-57e6-482b-a3c4-ef3d6ca41a1f" },
  "kong.node.get_memory_stats": function() {
    return {
      lua_shared_dicts: {
        kong: {
          allocated_slabs: 12288,
          capacity: 24576
        },
        kong_db_cache: {
          allocated_slabs: 12288,
          capacity: 12288
        }
      },
      workers_lua_vms: [
        {
          http_allocated_gc: 1102,
          pid: 18004
        },
        {
          http_allocated_gc: 1102,
          pid: 18005
        }
      ],
    }
  },

  "kong.request.get_scheme": function(i) { return i.request.url.protocol.replace(":", "") },
  "kong.request.get_host": function(i) { return i.request.url.hostname },
  "kong.request.get_port": function(i) { return i.request.url.port },
  "kong.request.get_forwarded_scheme": function(i) { return i.request.headers.get("X-Forwarded-Proto") },
  "kong.request.get_forwarded_host": function(i) { return i.request.headers.get("X-Forwarded-Host") },
  "kong.request.get_forwarded_port": function(i) { return i.request.headers.get("X-Forwarded-Port") },
  "kong.request.get_http_version": function() { return "1.1" },
  "kong.request.get_method": function(i) { return i.request.method },
  "kong.request.get_path": function(i) { return i.request.url.pathname },
  "kong.request.get_path_with_query": function(i) { return i.request.url.pathname + i.request.url.search },
  "kong.request.get_raw_query": function(i) { return i.request.url.search },
  "kong.request.get_query_arg": function(i, k) { return new URLSearchParams(i.request.url.search).get(k) },
  "kong.request.get_query": function(i) { return Array.from(new URLSearchParams(i.request.url.search).entries()) },
  "kong.request.get_header": function(i, k) { return i.request.headers.get(k) },
  "kong.request.get_headers": function(i) { return Array.from(i.request.headers.entries()) },
  "kong.request.get_raw_body": function(i) { return i.request.body },

  "kong.response.get_status": function(i) { return i.response.status },
  "kong.response.get_header": function(i, k) { return i.response.headers.get(k) },
  "kong.response.get_headers": function(i) { return Array.from(i.response.headers.entries()) },
  "kong.response.get_source": function() { return "service" },
  "kong.response.set_status": function(i, status) { i.response.status = status },
  "kong.response.set_header": function(i, k, v) { i.response.headers.set(k, v) },
  "kong.response.add_header": function(i, k, v) { i.response.headers.add(k, v) },
  "kong.response.set_headers": function(i, headers) {
    for(let [k, v] in Object.entries(headers)) {
      i.response.headers.set(k, v)
    }
  },
  "kong.response.clear_header": function(i, k) { i.response.headers.delete(k) },
  "kong.response.exit": function(i, status, body, headers) {
    i.response.status = status
    i.response.body = body
    if (headers !== undefined) {
      for(let [k, v] in Object.entries(headers)) {
        i.response.headers.set(k, v)
      }
    }
    i.setExiting(true)
  },
  "kong.response.error": function(i, status, message, headers) {
    mockFunctions["kong.response.exit"](i, status, message, headers)
  },

  "kong.router.get_route": function() { return {
    id: uuidv4(),
    name: "route_66",
    protocols: ["http", "tcp"],
    paths: ["/v0/left", "/v1/this"],
  }},
  "kong.router.get_service": function() { return {
			id: uuidv4(),
			name: "self_service",
			protocol: "http",
			path: "/v0/left",
  }},

  "kong.service.set_upstream": noop,
  "kong.service.set_target": noop,
  "kong.service.request.set_scheme": function(i, protocol) { i.serviceRequest.url.protocol = protocol },
  "kong.service.request.set_path": function(i, path) { i.serviceRequest.url.pathname = path },
  "kong.service.request.set_raw_query": function(i, query) { i.serviceRequest.url.search = query },
  "kong.service.request.set_method": function(i, method) { i.serviceRequest.method = method },
  "kong.service.request.set_query": function(i, args) {
    let params = new URLSearchParams(i.serviceRequest.url.search)
    for (let [k, v] of Object.entries(args)) {
      params.set(k, v)
    }
    i.serviceRequest.url.search = params.toString()
  },
  "kong.service.request.set_header": function(i, k, v) { i.serviceRequest.headers.set(k, v) },
  "kong.service.request.add_header": function(i, k, v) { i.serviceRequest.headers.add(k, v) },
  "kong.service.request.set_headers": function(i, headers) {
    for (let [k, v] of Object.entries(headers)) {
      i.serviceRequest.headers.set(k, v)
    }
  },
  "kong.service.request.clear_header": function(i, k) { i.serviceRequest.headers.delete(k) },
  "kong.service.request.set_raw_body": function(i, body) { i.serviceRequest.body = body },

  "kong.service.response.get_status": function(i) { return i.serviceResponse.status },
  "kong.service.response.get_headers": function(i) { return i.serviceResponse.headers },
  "kong.service.response.get_header": function(i, k) { return i.serviceResponse.headers.get(k) },
  "kong.service.response.get_raw_body": function(i) { return i.serviceResponse.body },
}

let logFunctions = [
  "kong.log.alert", "kong.log.crit", "kong.log.err", "kong.log.warn",
  "kong.log.notice", "kong.log.info", "kong.log.debug"
]

for (let i = 0; i < logFunctions.length; i++) {
  const logFunction = logFunctions[i]
  mockFunctions[logFunction] = function(...args) {
    console.log("Log " + logFunction, ...args)
  }
}

class PluginTest {
  constructor(request) {
    this.request = request
    this.response = new Response()
    this.serviceRequest = new Request(request)
    let [ch, childCh] = new PipePair().getPair()
    this.ch = ch
    this.childCh = childCh
    this.exiting = false
  }

  async Run(pluginToTest, pluginConfig) {
    let pluginModule = new Module("TestPlugin", undefined, pluginToTest)
    let pluginInstance = pluginModule.new(pluginConfig)

    if(this.request.isHttps || this.request.isTLS){
      await this.executePhase(pluginInstance, "certificate")
    }

    if(this.request.isTCP || this.request.isTLS) {
      await this.executePhase(pluginInstance, "preread")
    } else{
      await this.executePhase(pluginInstance, "access")
      await this.executePhase(pluginInstance, "rewrite")
      if (!this.exiting) {
        this.serviceResponse = this.serviceRequest.toResponse()
        this.response.merge(this.serviceResponse)
      }
      await this.executePhase(pluginInstance, "response")
    }

    await this.executePhase(pluginInstance, "log")
    return {mod: pluginModule, instance: pluginInstance}
  }

  async executePhase(ins, phase) {
    // skip phases to mock Kong "early exit"
    if (this.exiting && phase != "log") return
    // start the consumer to mock RPC functions
    this.mockKongPDK()
    // if the plugin doesn't implement this phase, ignore
    if (ins.cls[phase] === undefined) {
      return
    }

    await ins.executePhase(phase, new PDK(this.childCh).kong)
    this.childCh.put(MSG_RET)
  }

  mockKongPDK() {
    setImmediate(() => {
      new Promise(async () => {
        while(1) {
          let r = await this.ch.get()

          if (r == MSG_RET) return

          let meth = r.Method
          if (mockFunctions[meth] === undefined) {
            throw new Error("function " + meth + " is not a valid PDK function")
          }

          let ret = mockFunctions[meth](this, ...r.Args)
          this.ch.put([ret, undefined])
        }
      })
    })
  }

  setExiting(exiting) {
    this.exiting = exiting
  }
}

class Request {
  url = new URL("http://konghq.com");
  headers = new fetch.Headers();
  method = "GET";
  isHttps = false;
  isTCP = false;
  isTLS = false;
  body = "";

  constructor(request) {
    if (request !== undefined) {
      this.useURL(request.url.toString())
      this.useHeaders(Array.from(request.headers.entries()))
      this.useMethod(request.method)
      this.useBody(request.body)
    }
  }

  useURL(url) {
    this.url = new URL(url)
    this.isHttps = this.url.protocol == "https:"
    this.isTCP = this.url.protocol == "tcp:"
    this.isTLS = this.url.protocol == "tls:"
    return this
  }

  useHeaders(headers) {
    for(let [k, v] of Object.entries(headers)) {
      this.headers.set(k, v)
    }
    return this
  }

  useMethod(method) {
    this.method = method
    return this
  }

  useBody(body) {
    this.body = body
    return this
  }

  toResponse() {
    let response = new Response(this.url.toString())
    response.status = 200
    response.body = "OK"
    response.headers = new fetch.Headers(this.headers)
    return response
  }
}

class Response {
  status;
  body = "";
  headers = new fetch.Headers();

  constructor(response) {
    if (response !== undefined) {
      this.status = response.status
      this.headers = new fetch.Headers(response.headers)
      this.body = response.body
    }
  }

  merge(response) {
    for (let [k, v] in response.headers.entries()) {
      this.headers.append(k, v)
    }
    this.body = response.body
    this.status = response.status
  }
}

module.exports = {
  PluginTest: PluginTest,
  Request: Request,
  Response: Response,
}
