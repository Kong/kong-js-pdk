// AUTO GENERATED BASED ON Kong 3.8.x, DO NOT EDIT
// Original source path: kong/pdk/log.lua


export default interface log {


    /**
    * kong.log.warn("something require attention")
    * kong.log.err("something failed: ", err)
    * kong.log.alert("something requires immediate action")
    * @param ...varargs All params will be concatenated and stringified before being sent to the log.
    * @returns Throws an error on invalid inputs.
    */
    alert(...varargs: any): Promise<null>;

    /**
    * kong.log.warn("something require attention")
    * kong.log.err("something failed: ", err)
    * kong.log.alert("something requires immediate action")
    * @param ...varargs All params will be concatenated and stringified before being sent to the log.
    * @returns Throws an error on invalid inputs.
    */
    crit(...varargs: any): Promise<null>;

    /**
    * kong.log.warn("something require attention")
    * kong.log.err("something failed: ", err)
    * kong.log.alert("something requires immediate action")
    * @param ...varargs All params will be concatenated and stringified before being sent to the log.
    * @returns Throws an error on invalid inputs.
    */
    debug(...varargs: any): Promise<null>;

    /**
    * kong.log.deprecation("hello ", "world")
    * kong.log.deprecation("hello ", "world", { after = "2.5.0" })
    * kong.log.deprecation("hello ", "world", { removal = "3.0.0" })
    * kong.log.deprecation("hello ", "world", { after = "2.5.0", removal = "3.0.0" })
    * kong.log.deprecation("hello ", "world", { trace = true })
    * @param ...varargs all params will be concatenated and stringified before being sent to the log
    (if the last param is a table, it is considered as a deprecation metadata)
    * @returns throws an error on invalid inputs.
    */
    deprecation(...varargs: any): Promise<null>;

    /**
    * kong.log.warn("something require attention")
    * kong.log.err("something failed: ", err)
    * kong.log.alert("something requires immediate action")
    * @param ...varargs All params will be concatenated and stringified before being sent to the log.
    * @returns Throws an error on invalid inputs.
    */
    err(...varargs: any): Promise<null>;

    /**
    * kong.log.warn("something require attention")
    * kong.log.err("something failed: ", err)
    * kong.log.alert("something requires immediate action")
    * @param ...varargs All params will be concatenated and stringified before being sent to the log.
    * @returns Throws an error on invalid inputs.
    */
    info(...varargs: any): Promise<null>;

    /**
    * kong.log.warn("something require attention")
    * kong.log.err("something failed: ", err)
    * kong.log.alert("something requires immediate action")
    * @param ...varargs All params will be concatenated and stringified before being sent to the log.
    * @returns Throws an error on invalid inputs.
    */
    notice(...varargs: any): Promise<null>;

    /**
    * 
    */
    serialize(): Promise<null>;

    /**
    * -- Adds a new value to the serialized table
    * kong.log.set_serialize_value("my_new_value", 1)
    * assert(kong.log.serialize().my_new_value == 1)
    * -- Value can be a table
    * kong.log.set_serialize_value("my", { new = { value = 2 } })
    * assert(kong.log.serialize().my.new.value == 2)
    * -- It is possible to change an existing serialized value
    * kong.log.set_serialize_value("my_new_value", 3)
    * assert(kong.log.serialize().my_new_value == 3)
    * -- Unset an existing value by setting it to nil
    * kong.log.set_serialize_value("my_new_value", nil)
    * assert(kong.log.serialize().my_new_value == nil)
    * -- Dots in the key are interpreted as table accesses
    * kong.log.set_serialize_value("my.new.value", 4)
    * assert(kong.log.serialize().my.new_value == 4)
    * @param key The name of the field.
    * @param value Value to be set. When a table is used, its keys must be numbers, strings, or booleans, and its values can be numbers, strings, or other tables like itself, recursively.
    * @param options Can contain two entries: options.mode can be `set` (the default, always sets), `add` (only add if entry does not already exist) and `replace` (only change value if it already exists).
    * @returns The request information table.
    */
    setSerializeValue(key: string, value: any, options: Array<string | number> | object): Promise<Array<string | number> | object>;

    /**
    * kong.log.warn("something require attention")
    * kong.log.err("something failed: ", err)
    * kong.log.alert("something requires immediate action")
    * @param ...varargs All params will be concatenated and stringified before being sent to the log.
    * @returns Throws an error on invalid inputs.
    */
    warn(...varargs: any): Promise<null>;

}
