//array, object
// function in JS is value, so that can be set in array and object.
let f = function () {
    console.log(1 + 1);
}

let a = [f];
a[0]();

var o = {
    func: f
}

o.func();

