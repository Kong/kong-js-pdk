// AUTO GENERATED BASED ON Kong 3.8.x, DO NOT EDIT
// Original source path: kong/pdk.lua

import type client from "./client"
import type cluster from "./cluster"
import type ctx from "./ctx"
import type enterpriseEdition from "./enterpriseEdition"
import type ip from "./ip"
import type log from "./log"
import type nginx from "./nginx"
import type node from "./node"
import type plugin from "./plugin"
import type request from "./request"
import type response from "./response"
import type router from "./router"
import type service from "./service"
import type telemetry from "./telemetry"
import type vault from "./vault"

export default interface kong {

    client: client;
    cluster: cluster;
    ctx: ctx;
    enterpriseEdition: enterpriseEdition;
    ip: ip;
    log: log;
    nginx: nginx;
    node: node;
    plugin: plugin;
    request: request;
    response: response;
    router: router;
    service: service;
    telemetry: telemetry;
    vault: vault;

}
