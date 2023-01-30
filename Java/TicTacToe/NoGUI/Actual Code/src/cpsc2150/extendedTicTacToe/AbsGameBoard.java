package cpsc2150.extendedTicTacToe;

public abstract class AbsGameBoard implements IGameBoard{
    /**
     *
     * @return String That returns a string representation of the GameBoard
     */
    public String toString()
    {
        String x = "   ";
        //Row 0
        Integer i;
        for(i = 0; i < this.getNumColumns(); i++)
        {
            if(i < 10)
            {
                x = x.concat(" ");
                x = x.concat(i.toString());
                x = x.concat("|");
            }
            else
            {
                x = x.concat(i.toString());
                x = x.concat("|");
            }
        }
        x = x.concat("\n");

        for(i = 0; i < this.getNumRows(); i++)
        {
            if(i < 10)
            {
                x = x.concat(" ");
            }
            x = x.concat(i.toString());
            x = x.concat("|");

            for(int j = 0; j < this.getNumColumns(); j++)
            {
                BoardPosition pos = new BoardPosition(i, j);
                x = x.concat(whatsAtPos(pos).toString());
                x = x.concat(" |");
            }
            x = x.concat("\n");
        }
        return x;
    }
}
