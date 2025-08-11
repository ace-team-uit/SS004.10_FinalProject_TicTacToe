const TTT_AI = {
  nextMove(board) {
    // TODO: implement minimax; placeholder picks first empty
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null || board[i] === "") return i;
    }
    return -1;
  },
};
