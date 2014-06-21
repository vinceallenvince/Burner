var test = require('tape'),
    Vector, obj;

test('load Vector.', function(t) {
  Vector = require('../src/Vector').Vector;
  t.ok(Vector, 'object loaded');
  t.end();
});

test('should clone vectors.', function(t) {
  obj = new Vector(22, 10);
  var clone = obj.clone();
  t.equal(clone.x, 22);
  t.equal(clone.y, 10);
  t.end();
});

test('should create vectors.', function(t) {
  obj = new Vector(22, 10);
  t.equal(obj.x, 22);
  t.equal(obj.y, 10);
  t.end();
});

test('VectorAdd() should add two vectors.', function(t) {
  obj = new Vector(22, 10);
  objA = new Vector(1, 1);
  t.equal(Vector.VectorAdd(obj, objA).x, 23);
  t.equal(Vector.VectorAdd(obj, objA).y, 11);
  t.end();
});

test('add() should add a vector.', function(t) {
  obj = new Vector(22, 10);
  obj.add(new Vector(1, 1));
  t.equal(obj.x, 23);
  t.equal(obj.y, 11);
  t.end();
});

test('VectorSub() should subtract two vectors.', function(t) {
  obj = new Vector(22, 10);
  objA = new Vector(1, 1);
  t.equal(Vector.VectorSub(obj, objA).x, 21);
  t.equal(Vector.VectorSub(obj, objA).y, 9);
  t.end();
});

test('sub() should subtract a vector.', function(t) {
  obj = new Vector(22, 10);
  obj.sub(new Vector(1, 1));
  t.equal(obj.x, 21);
  t.equal(obj.y, 9);
  t.end();
});

test('VectorMult() should multiply a vector by a scalar value.', function(t) {
  obj = new Vector(22, 10);
  t.equal(Vector.VectorMult(obj, 2).x, 44);
  t.equal(Vector.VectorMult(obj, 2).y, 20);
  t.end();
});

test('mult() should multiply a vector.', function(t) {
  obj = new Vector(22, 10);
  obj.mult(2);
  t.equal(obj.x, 44);
  t.equal(obj.y, 20);
  t.end();
});

test('VectorDiv() should divide a vector by a scalar value.', function(t) {
  obj = new Vector(22, 10);
  t.equal(Vector.VectorDiv(obj, 2).x, 11);
  t.equal(Vector.VectorDiv(obj, 2).y, 5);
  t.end();
});

test('div() should divide a vector.', function(t) {
  obj = new Vector(22, 10);
  obj.div(2);
  t.equal(obj.x, 11);
  t.equal(obj.y, 5);
  t.end();
});

test('mag() should calculate the magnitude of a vector.', function(t) {
  obj = new Vector(10, 10);
  t.equal(obj.mag(), 14.142135623730951);
  t.end();
});

test('limit() should limit the magnitude of a vector.', function(t) {
  obj = new Vector(10, 10);
  t.equal(Math.round(obj.limit(5).mag()), 5);
  obj = new Vector(1, 1);
  t.equal(Math.round(obj.limit(5, 4).mag()), 4);
  t.end();
});

test('normalize() should divide a vector by its magnitude to reduce its magnitude to 1.', function(t) {
  obj = new Vector(3, 4);
  t.equal(obj.normalize().x, 0.6);
  t.equal(obj.normalize().y, 0.8);
  t.end();
});

test('VectorDistance(v1, v2) should return the distance between two vectors.', function(t) {
  objA = new Vector(50, 100);
  objB = new Vector(100, 100);
  t.equal(Vector.VectorDistance(objA, objB), 50);
  t.end();
});

test('distance() should calculate the distance between this vector and a passed vector.', function(t) {
  obj = new Vector(5, 0);
  t.equal(obj.distance(new Vector(1, 0)), 4);
  t.end()
});

test('rotate() should rotate a vector using a passed angle in radians.', function(t) {
  obj = new Vector(10, 0);
  t.equal(obj.rotate(Math.PI).x, -10);
  t.end();
});

test('VectorMidPoint(v1, v2) should return the midpoint between two vectors.', function(t) {
  objA = new Vector(50, 100);
  objB = new Vector(100, 200);
  t.equal(Vector.VectorMidPoint(objA, objB).x, 75);
  t.equal(Vector.VectorMidPoint(objA, objB).y, 150);
  t.end();
});

test('midpoint() should return the midpoint between this vector and a passed vector.', function(t) {
  objA = new Vector(50, 100);
  objB = new Vector(100, 200);
  t.equal(objA.midpoint(objB).x, 75);
  t.equal(objA.midpoint(objB).y, 150);
  t.end();
});

test('Vector.VectorAngleBetween should return the angle between two Vectors.', function(t) {
  objA = new Vector(50, 0);
  objB = new Vector(50, 180);
  t.equal(Math.round(Vector.VectorAngleBetween(objA, objB)), 1);
  t.end();
});
