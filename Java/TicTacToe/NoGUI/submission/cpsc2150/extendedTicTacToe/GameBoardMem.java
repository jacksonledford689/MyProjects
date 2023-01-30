package cpsc2150.extendedTicTacToe;

import java.util.*;


public class GameBoardMem extends AbsGameBoard implements IGameBoard{
    /**
     * @invariants      MIN_COLUMN < numColumn < MAX_COLUMN
     *                  MINCOLUMN < numRow < MAX_ROW
     *
     * @coreespondance self.numRow = numRow AND self.numColumn = numColumn AND self.numToWin = numToWin
     */

    private int numRow;
    private int numColumn;
    private int numToWin;
    private Map<Character, List<BoardPosition>> gameBoard = new HashMap<Character, List<BoardPosition>>();

    /**
     * @post: gameBoard is initialized
     *      numRow = r
     *      numColumn = c
     *      numToWin = w
     */
    public GameBoardMem(int r, int c, int w) {
        numRow = r;
        numColumn = c;
        numToWin = w;
    }
    public void placeMarker(char p, BoardPosition pos) {
        if (!gameBoard.containsKey(p))
        {
            List<BoardPosition> list = new ArrayList<BoardPosition>();
            list.add(pos);
            gameBoard.put(p, list);
        }
        else
        {
            gameBoard.get(p).add(pos);
        }
    }

    public Character whatsAtPos(BoardPosition pos) {
        for (HashMap.Entry<Character, List<BoardPosition>> map : gameBoard.entrySet())
        {
            for(BoardPosition temp : gameBoard.get(map.getKey())){
                if(temp.equals(pos)){
                    return map.getKey();
                }
            }
        }
        return ' ';
    }

    public void clearBoard() {
        gameBoard.clear();
    }

    public int getNumRows() {
        return numRow;
    }

    public int getNumColumns() {
        return numColumn;
    }

    public int getNumToWin() {
        return numToWin;
    }
}
