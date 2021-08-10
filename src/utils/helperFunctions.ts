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

function dynamicSort(property:string ) {
  var sortOrder = 1;
  if(property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
  }
  return function (a:any ,b:any) {
      /* next line works with strings and numbers, 
       * and you may want to customize it to your needs
       */
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
  }
}

export {
  removeDuplicatesInArray,
  tryParseJSON_,
  dynamicSort
}