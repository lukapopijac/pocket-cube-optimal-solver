Pocket Cube Optimal Solver
==========================

_This readme describes version 2 of the project. For version 1 refer to brach TODO `v1`._

This is an optimal solver for the [Pocket Cube][1] (2x2 Rubik's cube). For a
given state of the cube, the application shows how to solve it optimally
(with minimum number of moves possible), with step-by-step 3D animations.

![Screenshot page 1](/screenshot/screenshot-a-small-tiny.png "Screenshot page 1") 
![Screenshot page 2](/screenshot/screenshot-b-small-tiny.png "Screenshot page 2")


Try It Yourself
---------------
[https://lukapopijac.github.io/pocket-cube-optimal-solver/](https://lukapopijac.github.io/pocket-cube-optimal-solver/)



How to Set Up for Development
-----------------------------
Please, take a look at [src/README.md](src/README.md)



Motivation
----------

This project is made as an exercise with several different goals in mind:
 
 - Experimenting with different search algorithms: DFS, BFS, A\*, IDA\*.
 - Experimenting with heuristics and pruning tables.
 - Tweaking the search to optimize the performance while minimizing the 
   memory usage. In general, those two goals contradict each other, so the 
   satisfying compromise was to be found.
 - Writing REST API with `Node.js` and `Express`, and deploying to AWS
   (only version 1).
 - Exploring Web Components for building UI.
 - Exploring 3D graphics and animation with pure CSS.
 - Preparing for the bigger challenge in the future project: Optimal
   solver for standard Rubik's Cube.



Pocket Cube Technicalities
--------------------------

The cube consists of 8 smaller cubies, each one with 3 color stickers on it.
Any permutation of the cubies is possible, and 7 of them can be independently
oriented in three ways. If we fix one cubie to have a chosen position and 
orientation, we can allow any permutation of the remaining 7 cubies and any
orientation of 6 cubies (the orientation of the first cubie is fixed, 6 cubies 
can be independently oriented, and the orientation of the last one is 
determined by the other). The number of possible states is:

	7! * 3^6 = 3674160

This is a fairly small amount of states, and it can be easily saved in a 
computer memory, in which case the search algorithm becomes trivial. As the 
purpose of this experiment was to try different search algorithms, the amount 
of memory was intentionally limited.

In case of a standard Rubik's cube, the number of possible states is 
vastly larger, and enumerating all the states is infeasible.



About the Search Algorithm
--------------------------

The idea of the implemented search algorithm is based on [IDA*][2] search. In
short, IDA* works similarly like a regular iterative deepening search, but
instead of exploring every node, it utilizes heuristics to prune some branches
in the search three. As such it is very memory efficient and it provides an
optimal solution as long as the heuristics is [admissible][3].

Heuristic calculation is done using pattern database. For each state of the 
cube, the pattern can be extracted and its value can be found in the pattern
database. That value represents the minimum number of moves required to solve
the cube starting from the corresponding state. It is always preferable to
have larger values as it would lead to better performance, but that also
implies bigger database in general. The pattern database used in this project
was selected to preserve good performance without using too much of memory.

IDA* search uses heuristics to prune branches which are guaranteed to lack 
a solution within the allowed depth. As heuristics calculation made with 
pattern databases is not [consistent][4], it is possible to have a situation 
where IDA* will explore the subtree of what will appear to be a good node, 
too much. That will happen when the node has an excessively underestimated 
heuristics value.

To improve the IDA* search in this regard, I adjusted the search algorithm
to provide more efficient pruning. I will explain the main idea with the 
following example.

Assume that a part of the search tree looks like in the picture below, and 
assume that the maximum depth is `8`. Nodes `A`, `B` and `C` are positioned 
at depths `3`, `4` and `5`, respectively. Heuristic values of these nodes 
obtained from the pattern databases are `h(A)=5`, `h(B)=4` and `h(C)=8`.

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
`depth + heuristics <= maxDepth` (`3+5<=8`). This leads to expansion of the 
node `A` into its children. The first child to handle is the node `B`. The 
similar situation happens with this node, as `4+4<=8`, so the node `B` gets 
expanded. Again, its first child is the node `C`. Now, for the node `C` we 
can see that depth plus heuristic exceeds the maximum depth (`5+8>8`), so 
this part of the tree can be pruned. Furthermore, as the node `C` is just 
one step away from the node `B`, we know that the minimum number of steps 
required to get to the goal node cannot differ by more than one step. This 
leads to conclusion that the minimum number of steps to get to the goal from 
the node `B` is at least `7`, so the heuristic value for the node `B` can be
updated to that value. At this point, IDA* would continue with exploring the
next child of the node `B`. My algorithm doesn't continue exploring the next
child as it concludes from the updated heuristic value of the node `B` that 
the node does not satisfy requirement `depth + heuristic <= maxDepth` anymore:
`4+7>8`. The whole branch of `A` with the child `B` gets pruned at this point.
The same procedure continues. As the node `B` is just one step away from the 
node `A`, heuristic of the node `A` can be updated to the value `6`. Now even
the node `A` does not satisfy the condition anymore, as `3+6>8`. That means 
that at this point, we can prune the whole subtree which includes the node `A`.

It is straightforward to generalize this algorithm in the case when step costs
are different than `1`. I didn't bother with those details here as for the
Rubik's cube, cost of one move is always `1`.

There is one theoretical advantage of IDA* which is not present in my
algorithm. As IDA* explores all the children of an expanded node, if the
solution is not found in this subtree, it gains information about the
minimum number of steps needed to find the solution in this subtree. That 
information can be used in the iterative deepening to set the `maxDepth` for
the next iteration to be more than `1` step bigger than previous. However, 
this is just a theoretical advantage which is very unlikely to be useful in 
the case of Rubik's cube, as it almost always needs to increment the maximum
depth of the next iteration just by one. As a result, when applied on the 
Rubik's cube, my algorithm basically doesn't lose any advantage of IDA*, but
it improves the effectiveness of pruning mechanism.



Some Results
------------

The number of moves needed to solve the Pocket Cube is 11 in the worst case.
For such cases, this app written in JavaScript, finds an optimal solution in 
less than 10ms on my modest laptop from 2011. In other cases it works much 
faster, as expected. It uses pattern database which compressed has size 109KB.

The implemented search algorithm is about 30% faster than standard IDA* search.
Implementation of both algorithms can be found in files [search.js](/search/search.js)
and [search_idastar.js](/search/search_idastar.js).



License
-------

This software is released under the MIT license.




[1]: https://en.wikipedia.org/wiki/Pocket_Cube              "Pocket Cube"
[2]: https://en.wikipedia.org/wiki/Iterative_deepening_A*   "Iterative deepening A*"
[3]: https://en.wikipedia.org/wiki/Admissible_heuristic     "Admissible heuristic"
[4]: https://en.wikipedia.org/wiki/Consistent_heuristic     "Consistent heuristic"
