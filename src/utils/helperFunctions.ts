function tryParseJSON_( jsonString:string , options:object ) {
    try {
      var o = JSON.parse(jsonString);
      console.log(typeof o)
      if (o && typeof o === "object") {
        return o;
      }
    }
    catch (e) { }
    console.log('error parsing the json file')
    return false;
};

exports.tryParseJSON_ = tryParseJSON_