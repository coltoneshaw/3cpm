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

const removeDuplicatesInArray = (data: any[], idAttribute:any) => {
  return Array.from(new Set( data.map(a => a[idAttribute] ))).map(id => data.find(a => a[idAttribute] === id))
}

export {
  removeDuplicatesInArray,
  tryParseJSON_
}