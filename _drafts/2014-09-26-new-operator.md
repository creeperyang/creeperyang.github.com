##What the ‘new’ operator means in Javascript

http://www.elfsternberg.com/2008/07/29/what-the-new-operator-means-in-javascript/

A few months ago, I asked a group of web deveropers what the new operator does in Javascript. There wasn’t much of a response, but I did eventually figure it out. Sometimes you just have to wade through the specifications. Here’s the outcome of my research:

[ECMA Version 3 (1999), section 11.2.2, page 56]

The production NewExpression : new NewExpression is evaluated as follows:

1. Evaluate NewExpression.
2. Call GetValue(Result(1)).
3. If Type(Result(2)) is not Object, throw a TypeError exception.
4. If Result(2) does not implement the internal [[Construct]] method, throw a TypeError exception.
5. Call the [[Construct]] method on Result(2), providing no arguments (that is, an empty list of arguments).
6. Return Result(5).

[Section 13.2.2, page 86]

When the [[Construct]] property for a Function object F is called, the following steps are taken:

1. Create a new native ECMAScript object.
2. Set the [[Class]] property of Result(1) to “Object”.
3. Get the value of the prototype property of the F.
4. If Result(3) is an object, set the [[Prototype]] property of Result(1) to Result(3).
5. If Result(3) is not an object, set the [[Prototype]] property of Result(1) to the original Object prototype object as described in 15.2.3.1.
6. Invoke the [[Call]] property of F, providing Result(1) as the this value and providing the argument list passed into [[Construct]] as the argument values.
7. If Type(Result(6)) is Object then return Result(6).
8. Return Result(1).

I just wanted to put that somewhere where it wouldn’t get lost.

It also took me a while to realize that Result(N) means “the product after performing the operation of step N.

The new keyword allows you to define objects with prototypes, so that you can have a class heirarchy that doesn’t require external maintenence. I strongly suspect that Doug Crockford’s lecture on “prototypal inheritance” would be edifying here.