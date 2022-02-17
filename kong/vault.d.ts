// AUTO GENERATED BASED ON Kong 2.7.x, DO NOT EDIT
// Original source path: kong/pdk/vault.lua


export default interface vault {


    /**
    * local value, err = kong.vault.get("{vault://env/cert/key}")
    * @param reference reference to resolve
    * @returns resolved value of the reference
    * @returns error message on failure, otherwise `nil`
    */
    get(reference: string): Promise<[ret_1: string, ret_2: string]>;

    /**
    * kong.vault.is_reference("{vault://env/key}") -- true
    * kong.vault.is_reference("not a reference")   -- false
    * @param reference reference to check
    * @returns `true` is the passed in reference looks like a reference, otherwise `false`
    */
    isReference(reference: string): Promise<boolean>;

    /**
    * local ref, err = kong.vault.parse_reference("{vault://env/cert/key?prefix=SSL_#1}") -- table
    * @param reference reference to parse
    * @returns a table containing each component of the reference, or `nil` on error
    * @returns error message on failure, otherwise `nil`
    */
    parseReference(reference: string): Promise<[ret_1: Array<string | number> | object, ret_2: string]>;

}
