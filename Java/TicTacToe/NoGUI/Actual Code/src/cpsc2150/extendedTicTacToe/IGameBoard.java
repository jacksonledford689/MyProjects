package cpsc2150.extendedTicTacToe;

public interface IGameBoard {

    /**
     * This interface is a type of Tic-Tac-Toe GameBoard
     */
    public static final int MAX_ROW = 100;
    public static final int MAX_COLUMN = 100;
    public static final int MIN_ROW = 3;
    public static final int MIN_COLUMN = 3;
    public static final int MIN_NUMTOWIN = 3;
    public static final int MAX_NUMTOWIN = 25;
    /**
     * This method checks to make sure position pos is available on the gameBoard
     * @pre 0 <= pos.getRow <= this.numRow AND 0 <= pos.getColumn <= this.numColumn
     * @param pos BoardPosition that stores a position on the board
     * @return boolean whether the column has a spot open
     * @post checkSpace = true iff gameBoard[pos.getRow][pos.getColumn] == ' ' OR
     * checkSpace = false iff gameBoard[pos.getRow][pos.getColumn] != ' '
     */
    public default boolean checkSpace(BoardPosition pos)
    {
        if(whatsAtPos(pos) == ' ')
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    /**
     * This method places a token at an empty board position
     * @pre 0 <= pos.getRow <= this.numRow AND 0 <= pos.getColumn <= this.numColumn
     * @pre checkSpace(pos) == true
     * @param p char stores which player's turn it is
     * @param pos BoardPosition that stores a position on the board
     * @post gameBoard[pos.getRow][pos.getColumn] = p
     */
    public void placeMarker(char p, BoardPosition pos);

    /**
     * This method checks to see if there was a win at position pos
     * @pre 0 <= pos.getRow <= this.numRows AND 0 <= pos.getColumn <= this.numColumns
     * @param pos BoardPosition that stores the most recent position played on the board
     * @return boolean that tells whether there was a win or not at position pos
     * @post checks to see if a Diagonal win occurred at position pos
     * checks to see if a Horizontal win occurred at position pos
     * checks to see if a Vertical win occurred at position pos
     */
    public default boolean checkForWinner(BoardPosition pos)
    {
        char player = whatsAtPos(pos);

        if(checkVerticalWin(pos, player))
        {
            return true;
        }
        else if(checkHorizontalWin(pos, player))
        {
            return true;
        }
        else if(checkDiagonalWin(pos, player))
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    /**
     * This methods checks to see if there is a draw
     * @pre none
     * @return boolean that tells whether a tie has occurred
     * @post checkForDraw = true iff [there are no positions left and there are no wins] AND
     * checkForDraw = false iff [there are positions left on the board]
     */
    public default boolean checkForDraw()
    {
        for(int i = 0; i < getNumRows(); i++)
        {
            for(int j = 0; j < getNumColumns(); j++)
            {
                BoardPosition pos = new BoardPosition(i, j);
                if(checkSpace(pos))
                {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * This method checks to see if there was a horizontal win at position pos
     * @pre 0 <= lastPos.getColumn < this.numColumns
     *      0 <= lastPos.getRow < this.numRows
     * @param lastPos BoardPositon which stores the position of the most recent play
     * @param player char stores which player's turn it is
     * @return boolean that stores whether a win was found at position lastPos for player p
     * @post checkHorizontalWin = true iff [the placement of lastPos resulted in a win] AND
     * checkHorizontalWin = false iff [the placement of lastPos did not result in a win]
     */
    public default boolean checkHorizontalWin(BoardPosition lastPos, char player)
    {
        int column = lastPos.getColumn();
        int row = lastPos.getRow();
        int count = 0;

        while(count < this.getNumToWin())
        {
            while(column >= 0)
            {
                BoardPosition pos = new BoardPosition(row, column);
                if(isPlayerAtPos(pos, player))
                {
                    count++;
                    column--;
                }
                else
                {
                    break;
                }
            }
            column = lastPos.getColumn() + 1;

            while(column < getNumColumns())
            {
                BoardPosition pos = new BoardPosition(row, column);
                if(isPlayerAtPos(pos, player))
                {
                    count++;
                    column++;
                }
                else
                {
                    break;
                }
            }
            if(count < this.getNumToWin())
            {
                return false;
            }
        }
        return true;
    }

    /**
     * This method checks to see if there was a vertical win at position pos
     * @pre 0 <= lastPos.getColumn < this.numColumns
     *      0 <= lastPos.getRow < this.numRows
     * @param lastPos boardPosition which stores the position of the most recent play
     * @param player char stores which player's turn it is
     * @return boolean that stores whether a win was found at position pos for player p
     * @post checkVerticalWin = true iff [the placement of lastPos resulted in a win] AND
     *       checkVerticalWin = false iff [the placement of lastPos did not result in a win]
     */
    public default boolean checkVerticalWin(BoardPosition lastPos, char player)
    {
        int column = lastPos.getColumn();
        int row = lastPos.getRow();
        int count = 0;

        while(count < this.getNumToWin())
        {
            while(row >= 0)
            {
                BoardPosition pos = new BoardPosition(row, column);
                if(isPlayerAtPos(pos, player))
                {
                    count++;
                    row--;
                }
                else
                {
                    break;
                }
            }
            row = lastPos.getRow() + 1;

            while(row < getNumRows())
            {
                BoardPosition pos = new BoardPosition(row, column);
                if(isPlayerAtPos(pos, player))
                {
                    count++;
                    row++;
                }
                else
                {
                    break;
                }
            }
            if(count < this.getNumToWin())
            {
                return false;
            }
        }
        return true;
    }

    /**
     * This method checks to see if there was a diagonal win at position pos
     * @pre 0 <= lastPos.getColumn < this.numColumns
     *      0 <= lastPos.getRow < this.numRows
     * @param lastPos BoardPosition which stores the position of the most recent play
     * @param player char stores which player's turn it is
     * @return boolean that stores whether a win was found at position pos for player p
     * @post checkDiagonalWin = true iff [the placement of lastPos resulted in a win] AND
     *       checkDiagonalWin = false iff [the placement of lastPos did not result in a win]
     */
    public default boolean checkDiagonalWin(BoardPosition lastPos, char player)
    {
        int column = lastPos.getColumn();
        int row = lastPos.getRow();
        int count1 = 0;
        int count2 = 0;

        while((row >= 0) && (column >= 0))
        {
            BoardPosition pos = new BoardPosition(row, column);
            if(isPlayerAtPos(pos, player))
            {
                count1++;
                row--;
                column--;
            }
            else
            {
                break;
            }
        }
        row = lastPos.getRow() + 1;
        column = lastPos.getColumn() + 1;

        while((row < getNumRows()) && (column < getNumColumns()))
        {
            BoardPosition pos = new BoardPosition(row, column);
            if(isPlayerAtPos(pos, player))
            {
                count1++;
                row++;
                column++;
            }
            else
            {
                break;
            }
        }
        row = lastPos.getRow();
        column = lastPos.getColumn();

        while((row < getNumRows()) && (column >= 0))
        {
            BoardPosition pos = new BoardPosition(row, column);
            if(isPlayerAtPos(pos, player))
            {
                count2++;
                row++;
                column--;
            }
            else
            {
                break;
            }
        }
        row = lastPos.getRow() - 1;
        column = lastPos.getColumn() + 1;

        while((row >= 0) && (column < getNumColumns()))
        {
            BoardPosition pos = new BoardPosition(row, column);
            if(isPlayerAtPos(pos, player))
            {
                count2++;
                row--;
                column++;
            }
            else
            {
                break;
            }
        }
        if((count1 >= getNumToWin()) || (count2 >= getNumToWin()))
        {
            return true;
        }
        else
        {
            return false;
        }

    }

    /**
     * This method checks to see what Character is at position pos
     * @pre 0 <= pos.getRow() < this.numRows and 0 <= pos.getColumn() < this.numColumns
     * @param pos BoardPosition which stores the position that is being passed in
     * @return returns a Character based on which player has a token at
     * @post whatsAtPos = the Character at position pos
     */
    public Character whatsAtPos(BoardPosition pos);

    /**
     * This methods checks to see if Player player is at position pos
     * @pre 0 <= pos.getRow() < this.numRows AND
     * 0 <= pos.getColumn() < this.numColumns
     * @param pos BoardPosition which stores the position that is being passed in
     * @param player is character of a player
     * @return returns true iff [player is at position]
     * @post isPlayerAtPos = true iff gameBoard[pos.getRow][pos.getColumn] = player
     * isPlayerAtPos = false iff gameBoard[pos.getRow][pos.getColumn] != player
     */
    public default boolean isPlayerAtPos(BoardPosition pos, char player)
    {
        if(whatsAtPos(pos) == player)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    /**
     * @return void
     * @pre none
     * @post        [gameBoard is cleared]
     */
    public void clearBoard();

    /**
     * @pre none
     * @return String that represents gameBoard
     * @post returns a string representation of the gameBoard
     */
    public String toString();

    /**
     *
     * @return returns the number of rows on the board
     */
    public int getNumRows();

    /**
     *
     * @return returns the number of columns on the board
     */
    public int getNumColumns();

    /**
     *
     * @return returns the number of tokens required for a win
     */
    public int getNumToWin();

}
