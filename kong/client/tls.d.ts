// AUTO GENERATED BASED ON Kong 2.7.x, DO NOT EDIT
// Original source path: kong/pdk/client/tls.lua


export default interface tls {


    /**
    * local res, err = kong.client.tls.disable_session_reuse()
    * if not res then
    * -- do something with err
    * end
    * @returns Returns `true` if successful, `nil` if it fails.
    * @returns Returns `nil` if successful, or an error message if it fails.
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
    * @returns Returns a PEM-encoded client certificate if the mTLS
    handshake was completed, or `nil` if an error occurred or the client did
    not present its certificate.
    * @returns Returns `nil` if successful, or an error message if it fails.
    */
    getFullClientCertificateChain(): Promise<[ret_1: string, err: string]>;

    /**
    * local res, err = kong.client.tls.request_client_certificate()
    * if not res then
    * -- do something with err
    * end
    * @returns Returns `true` if request is received, or `nil` if
    request fails.
    * @returns Returns `nil` if the handshake is successful, or an error
    message if it fails.
    */
    requestClientCertificate(): Promise<[ret_1: boolean, err: string]>;

    /**
    * kong.client.tls.set_client_verify("FAILED:unknown CA")
    */
    setClientVerify(): Promise<null>;

}
