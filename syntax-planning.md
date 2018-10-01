```
// sum anonymous vectors elemnt-wise
[5, 5] + 2

```

# TODO

* Operator precedence (inspiration here https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence)
* Variable initialization (no separate declaration). Assignment operator "=".
* Function declaration. Body definition with "{" and "}".
    ```
    { // start of the body
    // multiline space for instructions
    f 1
    g 5
    k 300
    } // end of the body
    ```
    ```
    // assign body to variable aka argumentless function
    f = { /* instructions here */ }
    f = a1 a2
    ```
* Working with graphs:
    const g = 1 -> 2 -> 3 -> 4
    const g = 1 {} -> 2 {} // indexed graph
    const subg <- (1, g) // retrieve subgraph
* Built in functions for detecting array intersections, differences, merge etc.
* Communication with JS environment (expose functions, return result of a program, stdout)
* Range operator ":":
    1:5 // to create a range from 1 to 5 (1,2,3,4,5)
    1:5:2 // to create a range from 1 to 5 with a step of 2 (1,3,5)
* Group token with parenthesis "()". Might be used as tuple.
    (1,2,'string', {set})
* "astify" function to return AST of the object (function, structure).
* Brackets to create and operate on vectors.
    [1,2,3] // 3D vector
    [1,2,3] + 4 // element-wise addition
* Rest / spread operators
    (...args), [...arr]
* Pipe operator to pass results of one function to another. Can use anonymous functions.
    ```
    f | g | f2 | g2 | (...args) => args.length | num ::
        print 'total arguments count:' num
    ::
    ```
* Matrix operator
    m = 3 X 5 // create 2D matrix with 3 rows and 5 columns filled with zeros
* Operator configuration "_". Token for configuring particular usage of operator.
    m = 3 X _1:5_ 3 // create matrix filled with random number in specified range
    m = 3 X _0:1:0.01_ 3
* Groupless function invocation.
    ```
    f 1 2
    means f 1, 2
    means f (1, 2)
    ```
    ```
    f
    means f()
    ```
* Loops.
    ```
    // run 5 cycles
    for 5 {
        f
    }
    // run cycles with pipes to get current index
    for 5 | index {
        f index
    }
    // run through the string
    for of 'string' | char index {
        print 'character ' char 'at position' index
    }
    ```
* Named vector parts
    ```
    v = 1i + 2j + 3k
    v2 = 3a + 1b - 4c + 5d + 6e
    ```