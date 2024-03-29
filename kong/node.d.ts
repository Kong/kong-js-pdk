// AUTO GENERATED BASED ON Kong 3.4.x, DO NOT EDIT
// Original source path: kong/pdk/node.lua


export default interface node {


    /**
    * local hostname = kong.node.get_hostname()
    * @returns The local machine hostname.
    */
    getHostname(): Promise<string>;

    /**
    * local id = kong.node.get_id()
    * @returns The v4 UUID used by this node as its ID.
    */
    getId(): Promise<string>;

    /**
    * local res = kong.node.get_memory_stats()
    * -- res will have the following structure:
    * {
    * lua_shared_dicts = {
    * kong = {
    * allocated_slabs = 12288,
    * capacity = 24576
    * },
    * kong_db_cache = {
    * allocated_slabs = 12288,
    * capacity = 12288
    * }
    * },
    * workers_lua_vms = {
    * {
    * http_allocated_gc = 1102,
    * pid = 18004
    * },
    * {
    * http_allocated_gc = 1102,
    * pid = 18005
    * }
    * },
    * -- if the `kong` uses dbless mode, the following will be present:
    * lmdb = {
    * map_size: "128.00 MiB",
    * used_size: "0.02 MiB",
    * last_used_page: 6,
    * last_txnid: 2,
    * max_readers: 126,
    * current_readers: 16
    * },
    * }
    * }
    * local res = kong.node.get_memory_stats("k", 1)
    * -- res will have the following structure:
    * {
    * lua_shared_dicts = {
    * kong = {
    * allocated_slabs = "12.0 KiB",
    * capacity = "24.0 KiB",
    * },
    * kong_db_cache = {
    * allocated_slabs = "12.0 KiB",
    * capacity = "12.0 KiB",
    * }
    * },
    * workers_lua_vms = {
    * {
    * http_allocated_gc = "1.1 KiB",
    * pid = 18004
    * },
    * {
    * http_allocated_gc = "1.1 KiB",
    * pid = 18005
    * }
    * }
    * -- if the `kong` uses dbless mode, the following will be present:
    * lmdb = {
    * map_size: "131072 KB",
    * used_size: "20.48 KB",
    * last_used_page: 6,
    * last_txnid: 2,
    * max_readers: 126,
    * current_readers: 16
    * },
    * }
    * @param unit? The unit that memory is reported in. Can be
    any of `b/B`, `k/K`, `m/M`, or `g/G` for bytes, kibibytes, mebibytes,
    or gibibytes, respectively. Defaults to `b` (bytes).
    * @param scale? The number of digits to the right of the decimal
    point. Defaults to 2.
    * @returns A table containing memory usage statistics for this node.
    If `unit` is `b/B` (the default), reported values are Lua numbers.
    Otherwise, reported values are strings with the unit as a suffix.
    */
    getMemoryStats(unit?: string, scale?: number): Promise<Array<string | number> | object>;

}
