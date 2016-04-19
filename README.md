Pocket Cube Optimal Solver
==========================

This is an optimal solver for the [Pocket Cube][1] (2x2 Rubik's cube). It
defines Web API written with Node.js and Express. For given state of a cube,
the service returns list of moves which solves the cube optimally, which 
means in the minimum amount of moves possible.


How to Set Up
-------------

You have to have `Node.js` and `npm` installed. Then, to install all the
dependencies just run
```
npm install
```

To start local server run
```
npm start
```

Now you can use the API to solve the cube. For example:
```
http://localhost:3000/cube2?p2=0b01101100&p1=0b00011101&p0=0b10100101&o=0b0100010111010000
```
will return JSON string:
```
{
	"normalize": ["x1","y3"],
	"solution": ["U1","R1","F3","U1","F3","R2","U2","F3"]
}
```

Parameters `p2`, `p1`, `p0` and `o` are defined in [cubestate.js](/search/cubestate.js).

Returned JSON object contains `normalize` and `solution` properties.
`normalize` is a list of moves required to rotate the whole cube in space to 
set the cubie number 7 into its correct position and orientation. These moves 
are just a preparation for the search. After applying `normalize` moves, list
of moves in `solution` will solve the cube optimally.


Motivation
----------

This project is made as an exercise with few different goals in mind:
 
 - Playing with different search algorithms: DFS, BFS, A\*, IDA\*
 - Experimenting with heuristics calculations and pruning tables
 - Optimizing the search to have as better performance as possible with
   use of as little memory as possible. In general, those two requirements
   contradict each other, so the satisfying middle was to be found.
 - Writing REST API with `Node.js` and `Express`
 - Preparing for the bigger challenge in the future project: Optimal
   solver of the standard Rubik's Cube


Pocket Cube Technicalities
--------------------------

The cube consists of 8 smaller cubies, each one with 3 color stickers on it.
Any permutation of the cubies is possible, and 7 of them can be independently
oriented in three ways. If we fix one cubie to have correct position and
correct orientation, we can calculate the number of possible states of the cube
by allowing any permutation of remaining 7 cubies and any orientation of 6
cubies (first cubie is correctly oriented, 6 cubies we can independently orient, 
and the last one is dependent on others). The number of possible states is:

	7! * 3^6 = 3674160

This is fairly small about of states and it can be easily saved in computer
memory, in which case the search algorithm becomes trivial. As the purpose
of this experiment was to try different search algorithms, the amount of
memory was limited intentionally.

In case of the standard Rubik's cube, the number of possible states greatly 
exceeds this number, and numerating all of the states is infeasible.


About the Search Algorithm
--------------------------

The idea of the implemented search algorithm is based on [IDA*][2] search. In
short, IDA* works similarly like a regular iterative deepening search, but
instead of exploring every node, it utilizes heuristics to prune some branches
in the search three. As such it is very memory efficient and it provides an
optimal solution as long as the heuristics is admissible.

Heuristic calculation is done using pattern database. For each state of the
cube, pattern can be extracted and value for it can be found in the pattern 
database. That value represents minimum number of moves required to solve 
the cube starting from the corresponding state. It is always preferable to
have bigger values as it would lead to better performance, but that also
implies bigger database in general. The pattern database used in this
project was selected to preserve good performances without using too much 
of memory.

IDA* search uses heuristics to prune branches which are guaranteed to lack 
a solution withing allowed depth. As heuristic calculation made with 
pattern databases is not [consistent][3], it is possible to have a situation 
where IDA* will explore too much of a subtree of seemingly good node with
small heuristic value __WHICH__ too much underestimate the real distance to the
solution.

To improve the IDA* search in this regard, I adjusted the search algorithm
with few changes that provide more efficient pruning. I will explain the main
idea with the following example.

Assume that we have a part of the search tree that looks like in the picture
below, and assume that the maximum depth is 8. Nodes `A`, `B` and `C` are
__PLACED__ at the depths `3`, `4` and `5`, respectively. Heuristic values of
these nodes obtained from the pattern databases are `h(A)=5`, `h(B)=4` and
`h(C)=8`.

```
depth
-----          /
  3           A       h(A)=5
             /|                     maxDepth = 8
            / |...
  4        B        h(B)=4
          /|
         / |...
  5     C         h(C)=8
       /|\
       ...
```

During the search of this tree, when it comes to explore the node `A`, we can 
see that depth of the node plus its heuristic is acceptable:
`depth + heuristics <= maxDepth` (3+5<=8). This leads to expansion of the 
node `A` to its children. First child to handle is the node `B`. The similar 
situation happens with this node, as 4+4<=8, so the node `B` gets expanded. 
Again, first children of it is the node `C`. Now, for the node `C` we can see 
that depth plus heuristic of it exceeds maximum depth (5+8>8), so this part 
of the tree can be pruned. Furthermore, as the node `C` is just one step away
from the node `B`, we know that minimum number of steps required to get to the
goal node cannot differ for more that one step. This leads to conclusion that 
minimum number of steps to get to the goal from the node `B` is at least 7, 
so the heuristic value for the node `B` can be updated to that value. At this
point, IDA* would continue with exploring the next child of the node `B`.
My algorithm doesn't continue exploring the next child as it concludes from 
the updated heuristic value of the node `B` that the node does not satisfies
requirement `depth + heuristic <= maxDepth` anymore: 7+4>8. The whole branch
of `A` with the child `B` gets pruned at this point. The same procedure
continues. As the node `B` is just one step away from the node `A`, heuristic
of the node `A` can be updated to the value 6. Now, even node `A` does not
satisfy the condition anymore, as 3+6>8. That means, at this time, we can 
prune the whole subtree which includes the node `A`.

It is straight forward to generalize this algorithm in case when step costs
are different that 1. I didn't bother with those details here as for the
Rubik's cube, cost of one move is always 1.

There is one theoretical advantage of IDA* which is not present in my
algorithm. As IDA* explores all the children of an expanded node, if the
solution is not found in this subtree, it gains information about the
minimum number of steps needed to find the solution in this subtree. That
information can be used in the next iteration of the iterative deepening
to set the maxDepth for the next iteration to be for more than 1 step bigger
than previous. However, this is just a theoretical advantage which is very 
unlikely to be useful in case of Rubik's cube, as it almost always needs to 
increment the maximum depth of the next iteration for just by one. As s
results, my algorithm when applied on the Rubik's cube basically doesn't lose
any advantage of IDA*, but it improves effectiveness of pruning mechanism.


Some Results
------------

The number of moves needed to solve the Pocket Cube is 11 in the worst case.
For such cases, this app, written in JavaScript, finds an optimal solution in 
less than 10ms on my modest laptop from 2011. For other cases it works much 
faster, as expected. It uses pattern database which compressed has size 109KB.

The implemented search algorithm is about 30% faster than standard IDA* search.
Implementation of both algorithms can be found in files [search.js](/search/search.js)
and [search_idastar.js](/search/search_idastar.js).


License
-------

This software is released under the MIT license.




[1]: https://en.wikipedia.org/wiki/Pocket_Cube/             "Pocket Cube"
[2]: https://en.wikipedia.org/wiki/Iterative_deepening_A*   "Iterative deepening A*"
[3]: https://en.wikipedia.org/wiki/Consistent_heuristic     "Consistent heuristic"
