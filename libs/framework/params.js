
function Params() {

}

Params.prototype.update = function(jsonString) {
  var obj = {};
  try{
    obj = JSON.parse(jsonString);
  } catch(err) {
    console.log("Error", err);
  }
  for (var key in obj) {
    this[key] = obj[key];
  }
}