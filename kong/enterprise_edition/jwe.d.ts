// AUTO GENERATED BASED ON Kong 3.8.x, DO NOT EDIT
// Original source path: kong/pdk/enterprise_edition/jwe.lua


export default interface jwe {


    /**
    * 
    * @param token JWE encrypted JWT token
    * @returns A table containing JWT token parts decoded, or nil
    * @returns Error message, or nil
    */
    decode(token: string): Promise<[ret_1: string, ret_2: string]>;

    /**
    * 
    * @param key Private key
    * @param token JWE encrypted JWT token
    * @returns JWT token payload in plaintext, or nil
    * @returns Error message, or nil
    */
    decrypt(key: any, token: string): Promise<[ret_1: string, ret_2: string]>;

    /**
    * 
    * @param alg Algorithm used for key management
    * @param enc Encryption algorithm used for content encryption
    * @param key Public key
    * @param plaintext Plaintext
    * @param options? Options (optional), default: nil
    * @returns JWE encrypted JWT token, or nil
    * @returns Error message, or nil
    */
    encrypt(alg: string, enc: string, key: any, plaintext: string, options?: Array<string | number> | object): Promise<[ret_1: string, ret_2: string]>;

}
