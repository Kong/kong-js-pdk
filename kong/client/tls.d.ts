// AUTO GENERATED BASED ON Kong 3.8.x, DO NOT EDIT
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
    * local cert, err = kong.client.tls.get_full_client_certificate_chain()
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
    * local x509_lib = require "resty.openssl.x509"
    * local chain_lib = require "resty.openssl.x509.chain"
    * local res, err
    * local chain = chain_lib.new()
    * -- err check
    * local x509, err = x509_lib.new(pem_cert, "PEM")
    * -- err check
    * res, err = chain:add(x509)
    * -- err check
    * -- `chain.ctx` is the raw data of the chain, i.e. `STACK_OF(X509) *`
    * res, err = kong.client.tls.request_client_certificate(chain.ctx)
    * if not res then
    * -- do something with err
    * end
    * @param ca_certs? The CA certificate chain opaque pointer
    * @returns Returns `true` if successful, or `nil` if it fails.
    * @returns Returns `nil` if successful, or an error message if it fails.
    */
    requestClientCertificate(ca_certs?: cdata): Promise<[ret_1: boolean, err: string]>;

    /**
    * kong.client.tls.set_client_verify("FAILED:unknown CA")
    */
    setClientVerify(): Promise<null>;

}
