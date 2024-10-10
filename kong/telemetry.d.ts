// AUTO GENERATED BASED ON Kong 3.8.x, DO NOT EDIT
// Original source path: kong/pdk/telemetry.lua


export default interface telemetry {


    /**
    * local attributes = {
    * http_method = kong.request.get_method()
    * ["node.id"] = kong.node.get_id(),
    * hostname = kong.node.get_hostname(),
    * }
    * local ok, err = kong.telemetry.log("my_plugin", conf, "result", "successful operation", attributes)
    * @param plugin_name the name of the plugin
    * @param plugin_config the plugin configuration
    * @param message_type the type of the log message, useful to categorize
    the log entry
    * @param message the log message
    * @param attributes structured information to be included in the
    `attributes` field of the log entry
    */
    log(plugin_name: string, plugin_config: Array<string | number> | object, message_type: string, message: string, attributes: Array<string | number> | object): Promise<null>;

}
