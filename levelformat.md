a level is a JSON object with 3 keys:

- 'lv', which is a 15x15 two-dimensional array where 0 is empty, 1 is wall, 2 is player, 3/4/5/6/7 are yellow/orange/turquoise/pink/purple boxes.
- 'goals', which is an array of strings specifying goal shapes. They use the characters 'y', 'o', 't', 'p', and 'v' to specify box colors ('v' for 'violet'), which are separated by 'L', 'U', 'R', or 'D' which says where the next one is. So for example 'pRpUpLt' is a 2x2 box which is pink except for the upper left corner, which is turquoise. (I guess this is like T in Y world, which I didn't think of when I was making this, or else I would have used \<\>^v. Oh well.) I also want to add maybe '*' for 'anything' and '_' for 'must be blank'.
- 'text', which is optional, and contains some text to be displayed on the level.
