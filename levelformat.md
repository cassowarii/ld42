a level is a JSON object with 5 keys:

**'title'**, which is the title of the level.

**'lv'**, which is a 15x15 two-dimensional array where 0 is empty, 1 is wall, 2 is player, 3/4/5/6/7 are yellow/orange/turquoise/pink/purple boxes.

**'goals'**, which is an array of strings specifying goal shapes. They use the characters 'y', 'o', 't', 'p', and 'v' to specify box colors ('v' for 'violet'), which are separated by 'L', 'U', 'R', or 'D' which says where the next one is. So for example 'pRpUpLt' is a 2x2 box which is pink except for the upper left corner, which is turquoise.

This is basically the same format as a T in Y world rule, which I didn't think of when I was making this, or else I would have used \<\>^v. Oh well.

The goal strings aren't actually case sensitive.

There's also '\*', which matches anything, '\_', which matches only empty spaces, and ' ' (a blank space), which can be used for backtracking and shows up as invisible on the display. (e.g. `pRpUpD Rp` is a tetris T-piece pointing up.)

**'text'**, which is optional, and contains some text to be displayed on the level.

**'congration'**, which is also optional, and contains text to be displayed when the level is completed.
