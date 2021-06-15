// AUTO GENERATED BASED ON Kong 2.3.x, DO NOT EDIT
// Original source path: kong/pdk.lua

import type client from "./client"
import type cluster from "./cluster"
import type ctx from "./ctx"
import type ip from "./ip"
import type log from "./log"
import type nginx from "./nginx"
import type node from "./node"
import type request from "./request"
import type response from "./response"
import type router from "./router"
import type service from "./service"

export default interface kong {

    client: client;
    cluster: cluster;
    ctx: ctx;
    ip: ip;
    log: log;
    nginx: nginx;
    node: node;
    request: request;
    response: response;
    router: router;
    service: service;

}
