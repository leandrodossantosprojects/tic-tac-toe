# Winner Logic Approach

1. Store the eight winning plays as an array of plays.
2. Each play contains three coordinates.
3. Each coordinate is an array with two values: `[row, column]`.
4. Use an auxiliary function that receives `row`, `column`, and `token`.
5. The auxiliary function reads the cell from the gameboard and returns whether it contains that token.
6. For each winning play, verify that its three coordinates match the current player's token.
7. If all three coordinates of one play match, that player wins.
8. If no winning play matches, there is no winner yet.

The board is the single source of truth. The winning plays only describe which board coordinates must be checked.
