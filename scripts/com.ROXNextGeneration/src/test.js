function test(){
    this.init();
}

test.prototype.init = function () {
    console.log("Hello World");
}

module.exports = test;
