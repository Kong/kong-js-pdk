// AUTO GENERATED BASED ON Kong 2.3.x, DO NOT EDIT
// Original source path: kong/pdk/client/tls.lua


export default interface tls {


    /**
    * local res, err = kong.client.tls.disable_session_reuse()
    * if not res then
    * -- do something with err
    * end
    * @returns true if success, nil if failed
    * @returns nil if success, or error message if failure
    */
    disableSessionReuse(): Promise<[ret_1: boolean, err: string]>;

    /**
    * local cert, err = kong.client.get_full_client_certificate_chain()
    * if err then
    * -- do something with err
    * end
    * if not cert then
    * -- client did not complete mTLS
    * end
    * -- do something with cert
    * @returns PEM-encoded client certificate if mTLS handshake
    was completed, nil if an error occurred or client did not present
    its certificate
    * @returns nil if success, or error message if failure
    */
    getFullClientCertificateChain(): Promise<[ret_1: string, err: string]>;

    /**
    * local res, err = kong.client.tls.request_client_certificate()
    * if not res then
    * -- do something with err
    * end
    * @returns true if request was received, nil if request failed
    * @returns nil if success, or error message if failure
    */
    requestClientCertificate(): Promise<[ret_1: boolean, err: string]>;

    /**
    * kong.client.tls.set_client_verify("FAILED:unknown CA")
    */
    setClientVerify(): Promise<null>;

}
