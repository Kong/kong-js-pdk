// AUTO GENERATED BASED ON Kong 2.7.x, DO NOT EDIT
// Original source path: kong/pdk/client.lua

import type tls from "./tls"

export default interface client {

    tls: tls;

    /**
    * -- assuming `credential` and `consumer` have been set by some authentication code
    * kong.client.authenticate(consumer, credentials)
    * @param consumer The consumer to set. If no
    value is provided, then any existing value will be cleared.
    * @param credential The credential to set. If
    no value is provided, then any existing value will be cleared.
    */
    authenticate(consumer: Array<string | number> | object, credential: Array<string | number> | object): Promise<null>;

    /**
    * local consumer = kong.client.get_consumer()
    * if consumer then
    * consumer_id = consumer.id
    * else
    * -- request not authenticated yet, or a credential
    * -- without a consumer (external auth)
    * end
    * @returns The authenticated consumer entity.
    */
    getConsumer(): Promise<Array<string | number> | object>;

    /**
    * local credential = kong.client.get_credential()
    * if credential then
    * consumer_id = credential.consumer_id
    * else
    * -- request not authenticated yet
    * end
    * @returns The authenticated credential.
    */
    getCredential(): Promise<string>;

    /**
    * -- Given a client with IP 127.0.0.1 making connection through
    * -- a load balancer with IP 10.0.0.1 to Kong answering the request for
    * -- https://username:password@example.com:1234/v1/movies
    * kong.client.get_forwarded_ip() -- "127.0.0.1"
    * -- Note: This example assumes that 10.0.0.1 is one of the trusted IPs, and that
    * -- the load balancer adds the right headers matching with the configuration
    * -- of `real_ip_header`, e.g. `proxy_protocol`.
    * @returns The remote IP address of the client making the request,
    considering forwarded addresses.
    */
    getForwardedIp(): Promise<string>;

    /**
    * -- [client]:40000 <-> 80:[balancer]:30000 <-> 80:[kong]:20000 <-> 80:[service]
    * kong.client.get_forwarded_port() -- 40000
    * -- Note: This example assumes that [balancer] is one of the trusted IPs, and that
    * -- the load balancer adds the right headers matching with the configuration
    * -- of `real_ip_header`, e.g. `proxy_protocol`.
    * @returns The remote client port, considering forwarded ports.
    */
    getForwardedPort(): Promise<number>;

    /**
    * -- Given a client with IP 127.0.0.1 making connection through
    * -- a load balancer with IP 10.0.0.1 to Kong answering the request for
    * -- https://example.com:1234/v1/movies
    * kong.client.get_ip() -- "10.0.0.1"
    * @returns The remote IP address of the client making the request.
    */
    getIp(): Promise<string>;

    /**
    * -- [client]:40000 <-> 80:[balancer]:30000 <-> 80:[kong]:20000 <-> 80:[service]
    * kong.client.get_port() -- 30000
    * @returns The remote client port.
    */
    getPort(): Promise<number>;

    /**
    * kong.client.get_protocol() -- "http"
    * @param allow_terminated? If set, the `X-Forwarded-Proto` header is checked when checking for HTTPS.
    * @returns Can be one of `"http"`, `"https"`, `"tcp"`, `"tls"` or `nil`.
    * @returns `nil` if successful, or an error message if it fails.
    */
    getProtocol(allow_terminated?: boolean): Promise<[ret_1: string, err: string]>;

    /**
    * local consumer_id = "john_doe"
    * local consumer = kong.client.load_consumer(consumer_id, true)
    * @param consumer_id The consumer ID to look up.
    * @param search_by_username? If truthy,
    and if the consumer is not found by ID,
    then a second search by username will be performed.
    * @returns Consumer entity or `nil`.
    * @returns `nil` if successful, or an error message if it fails.
    */
    loadConsumer(consumer_id: string, search_by_username?: boolean): Promise<[ret_1: Array<string | number> | object, err: string]>;

}
