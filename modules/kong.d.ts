// AUTO GENERATED BASED ON Kong 2.3.x, DO NOT EDIT
// Original source path: kong/pdk.lua

import type client from "./kong/client"
import type cluster from "./kong/cluster"
import type ctx from "./kong/ctx"
import type ip from "./kong/ip"
import type log from "./kong/log"
import type nginx from "./kong/nginx"
import type node from "./kong/node"
import type request from "./kong/request"
import type response from "./kong/response"
import type router from "./kong/router"
import type service from "./kong/service"
import type table from "./kong/table"

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
    table: table;

}
