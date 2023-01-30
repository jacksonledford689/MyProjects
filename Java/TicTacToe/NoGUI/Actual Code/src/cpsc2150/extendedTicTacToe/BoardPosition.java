package cpsc2150.extendedTicTacToe;

public class BoardPosition {

    /**
     * @invariants 0 <= row <= gameBoard.getNumRows() AND 0 <= column <= gameBoard.getNumColumns()
     * @correspondences self = [current BoardPosition object] this.row = row this.column = column
     */
    private int row;
    private int column;

    /**
     * This constructor creates a BoardPosition with row of r and a column of c
     * @param r stores the input value for the current row number
     * @param c stores the input value for the current column number
     * @pre 0 <= r <= GameBoard.MAX_ROW AND 0 <= c <= GameBoard.MAX_COLUMN
     * @post self.row = r AND self.column = c
     */
    public BoardPosition(int r, int c)
    {
        row = r;
        column = c;
    }
    /**
     * This method returns an integer that stores row
     * @return returns an int that represents the current row number
     * @post getRow = row
     */
    public int getRow()
    {
        return row;
    }

    /**
     * This method returns an integer that stores column
     * @return returns an int that represents the current column number
     * @post getColumn = column
     */
    public int getColumn()
    {
        return column;
    }

    /**
     * This method returns true or false dependent on whether object x = self or not
     * @param x is an object that we want to compare to self
     * @return returns a boolean that tells whether or not the object passed in equals self
     * @pre x must be an object of type BoardPosition
     * @post equals = [true if x = self and false if x != self]
     */
    public boolean equals(BoardPosition x)
    {
        if((x.getColumn() == this.getColumn()) && (x.getRow() == this.getRow()))
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    /**
     * This method returns a string representation of self
     * @return returns a string that represents self
     * @post toString = [a string representation of self]
     */
    public String toString()
    {
        Integer row = this.getRow();
        Integer column = this.getColumn();
        String position = "";
        position = position.concat(row.toString());
        position = position.concat(", ");
        position = position.concat(column.toString());
        return position;
    }
}
