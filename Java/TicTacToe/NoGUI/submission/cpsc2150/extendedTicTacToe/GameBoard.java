package cpsc2150.extendedTicTacToe;

public class GameBoard extends AbsGameBoard implements IGameBoard{

    /**
     * @invariants MIN_ROW <= numRow <= MAX_ROW AND MIN_COLUMN <= numColumn <= MAX_COLUMN AND MIN_NUMTOWIN <= numToWin <= MAX_NUMTOWIN
     * @correspondences self = gameBoard[0..5][0..8] AND this.numRow = numRow AND this.numColumn = numColumn AND this.numToWin = numToWin
     */
    private Character gameBoard[][];
    private int numRow;
    private int numColumn;
    private int numToWin;

    /**
     * This constructor creates a GameBoard object with 5 rows and 8 columns
     * @post this.numRow = 5 AND this.numColumn = 8 AND [gameBoard is initialized with each position on the
     * board being set equal to " "]
     */
    public GameBoard(int r, int c, int w)
    {
        numRow = r;
        numColumn = c;
        numToWin = w;

        gameBoard = new Character[numRow][numColumn];

        for(int i = 0; i < numRow; i++)
        {
            for(int j = 0; j < numColumn; j++)
            {
                gameBoard[i][j] = ' ';
            }
        }

    }

    public void placeMarker(char p, BoardPosition pos)
    {
        gameBoard[pos.getRow()][pos.getColumn()] = p;
    }

    public Character whatsAtPos(BoardPosition pos)
    {
        return gameBoard[pos.getRow()][pos.getColumn()];
    }

    public void clearBoard()
    {
        for(int i = 0; i < this.getNumRows(); i++)
        {
            for(int j = 0; j < this.getNumColumns(); j++)
            {
                gameBoard[i][j] = ' ';
            }
        }
    }

    public int getNumRows()
    {
        return numRow;
    }

    public int getNumColumns()
    {
        return numColumn;
    }

    public int getNumToWin()
    {
        return numToWin;
    }


}
