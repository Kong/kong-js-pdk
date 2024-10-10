// AUTO GENERATED BASED ON Kong 3.8.x, DO NOT EDIT
// Original source path: kong/pdk/ip.lua


export default interface ip {


    /**
    * if kong.ip.is_trusted("1.1.1.1") then
    * kong.log("The IP is trusted")
    * end
    * @param address A string representing an IP address.
    * @returns `true` if the IP is trusted, `false` otherwise.
    */
    isTrusted(address: string): Promise<boolean>;

}
