package cpsc2150.extendedTicTacToe;

import org.junit.Test;
import static org.junit.Assert.*;

public class TestGameBoard {

    private IGameBoard MakeAGameBoard(int r, int c, int w) {

        return new GameBoard(r, c, w);

    }

    private String arrayToString(Character gameBoard[][], int row, int column) {
        String x = "   ";
        //Row 0
        Integer i;
        for(i = 0; i < column; i++)
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

        for(i = 0; i < row; i++)
        {
            if(i < 10)
            {
                x = x.concat(" ");
            }
            x = x.concat(i.toString());
            x = x.concat("|");

            for(int j = 0; j < column; j++)
            {
                x = x.concat(gameBoard[i][j].toString());
                x = x.concat(" |");
            }
            x = x.concat("\n");
        }
        return x;
    }

    @Test
    public void testCase_GameBoard_Constructor1() {
        //input values
        int row = 32;
        int column = 25;
        int numToWin = 13;

        //constructor call
        IGameBoard gameBoard = MakeAGameBoard(row, column, numToWin);

        //assertion
        assertTrue((gameBoard.getNumRows() == row) && (gameBoard.getNumColumns() == column) && (gameBoard.getNumToWin() == numToWin));
    }

    @Test
    public void testCase_GameBoard_Constructor2() {
        //input values
        int row = 3;
        int column = 3;
        int numToWin = 3;

        //constructor call
        IGameBoard gameBoard = MakeAGameBoard(row, column, numToWin);

        //assertion
        assertTrue((gameBoard.getNumRows() == row) && (gameBoard.getNumColumns() == column) && (gameBoard.getNumToWin() == numToWin));
    }

    @Test
    public void testCase_GameBoard_Constructor3() {
        //input values
        int row = 100;
        int column = 100;
        int numToWin = 25;

        //constructor call
        IGameBoard gameBoard = MakeAGameBoard(row, column, numToWin);

        //assertion
        assertTrue((gameBoard.getNumRows() == row) && (gameBoard.getNumColumns() == column) && (gameBoard.getNumToWin() == numToWin));
    }

    @Test
    public void testCase_checkSpace_minCheck() {
        //input values
        int row = 5;
        int column = 5;
        int numToWin = 3;

        //constructor call
        IGameBoard gameBoard = MakeAGameBoard(row, column, numToWin);

        int aRow = 0;
        int aColumn = 0;

        BoardPosition spot = new BoardPosition(aRow, aColumn);

        gameBoard.placeMarker('X', spot);

        //assertion
        assertTrue(!gameBoard.checkSpace(spot));
    }

    @Test
    public void testCase_checkSpace_maxCheck() {
        //input values
        int row = 5;
        int column = 5;
        int numToWin = 3;

        //constructor call
        IGameBoard gameBoard = MakeAGameBoard(row, column, numToWin);

        int aRow = 4;
        int aColumn = 4;

        BoardPosition spot = new BoardPosition(aRow, aColumn);

        gameBoard.placeMarker('X', spot);

        //assertion
        assertTrue(!gameBoard.checkSpace(spot));
    }

    @Test
    public void testCase_checkSpace_emptyMax() {
        //input values
        int row = 5;
        int column = 5;
        int numToWin = 3;

        //constructor call
        IGameBoard gameBoard = MakeAGameBoard(row, column, numToWin);

        int aRow = 4;
        int aColumn = 4;

        BoardPosition spot = new BoardPosition(aRow, aColumn);

        //assertion
        assertTrue(gameBoard.checkSpace(spot));
    }

    @Test
    public void testCase_checkHorizontalWin_SpaceBetweenWin() {
        //input values
        int row = 5;
        int column = 5;
        int numToWin = 5;

        //constructor call
        IGameBoard gameBoard = MakeAGameBoard(row, column, numToWin);

        //sets up board
        BoardPosition spot = new BoardPosition(0, 0);
        gameBoard.placeMarker('x', spot);

        spot = new BoardPosition(0, 1);
        gameBoard.placeMarker('x', spot);

        spot = new BoardPosition(0, 3);
        gameBoard.placeMarker('x', spot);

        spot = new BoardPosition(0, 4);
        gameBoard.placeMarker('x', spot);

        BoardPosition right = new BoardPosition(0, 4);
        BoardPosition left = new BoardPosition(0, 1);

        //assertion
        assertTrue(!gameBoard.checkHorizontalWin(right, 'x'));
        assertTrue(!gameBoard.checkHorizontalWin(left, 'x'));
    }

    @Test
    public void testCase_checkHorizontalWin_NormalWin() {
        //input values
        int row = 5;
        int column = 5;
        int numToWin = 5;

        //constructor call
        IGameBoard gameBoard = MakeAGameBoard(row, column, numToWin);

        //sets up board
        BoardPosition spot = new BoardPosition(0, 0);
        gameBoard.placeMarker('x', spot);

        spot = new BoardPosition(0, 1);
        gameBoard.placeMarker('x', spot);

        spot = new BoardPosition(0, 2);
        gameBoard.placeMarker('x', spot);

        spot = new BoardPosition(0, 3);
        gameBoard.placeMarker('x', spot);

        spot = new BoardPosition(0, 4);
        gameBoard.placeMarker('x', spot);

        //assertion
        assertTrue(gameBoard.checkHorizontalWin(spot, 'x'));
    }

    @Test
    public void testCase_checkHorizontalWin_BigWin() {
        //input values
        int row = 100;
        int column = 100;
        int numToWin = 25;

        //constructor call
        IGameBoard gameBoard = MakeAGameBoard(row, column, numToWin);
        BoardPosition spot = new BoardPosition(0, 0);

        for(int i = 0; i < 25; i++)
        {
            spot = new BoardPosition(0, i);
            gameBoard.placeMarker('x', spot);
        }

        //assertion
        assertTrue(gameBoard.checkHorizontalWin(spot, 'x'));
    }

    @Test
    public void testCase_checkHorizontalWin_WinFromAnyPosition() {
        //input values
        int row = 5;
        int column = 5;
        int numToWin = 5;

        //constructor call
        IGameBoard gameBoard = MakeAGameBoard(row, column, numToWin);

        BoardPosition one = new BoardPosition(0, 0);
        BoardPosition two = new BoardPosition(0, 1);
        BoardPosition three = new BoardPosition(0, 2);
        BoardPosition four = new BoardPosition(0, 3);
        BoardPosition five = new BoardPosition(0, 4);

        gameBoard.placeMarker('x', one);
        gameBoard.placeMarker('x', two);
        gameBoard.placeMarker('x', three);
        gameBoard.placeMarker('x', four);
        gameBoard.placeMarker('x', five);

        //assertion
        assertTrue(gameBoard.checkHorizontalWin(one, 'x'));
        assertTrue(gameBoard.checkHorizontalWin(two, 'x'));
        assertTrue(gameBoard.checkHorizontalWin(three, 'x'));
        assertTrue(gameBoard.checkHorizontalWin(four, 'x'));
        assertTrue(gameBoard.checkHorizontalWin(five, 'x'));

    }

    @Test
    public void testCase_checkVerticalWin_spaceBetween() {
        //input values
        int row = 5;
        int column = 5;
        int numToWin = 5;

        //constructor call
        IGameBoard gameBoard = MakeAGameBoard(row, column, numToWin);

        //sets up board
        BoardPosition spot = new BoardPosition(0, 0);
        gameBoard.placeMarker('x', spot);

        spot = new BoardPosition(1, 0);
        gameBoard.placeMarker('x', spot);

        spot = new BoardPosition(3, 0);
        gameBoard.placeMarker('x', spot);

        spot = new BoardPosition(4, 0);
        gameBoard.placeMarker('x', spot);

        BoardPosition bottom = new BoardPosition(4, 0);
        BoardPosition top = new BoardPosition(0, 0);

        //assertion
        assertTrue(!gameBoard.checkHorizontalWin(bottom, 'x'));
        assertTrue(!gameBoard.checkHorizontalWin(top, 'x'));
    }

    @Test
    public void testCase_checkVerticalWin_NormalWin() {
        //input values
        int row = 5;
        int column = 5;
        int numToWin = 3;

        //constructor call
        IGameBoard gameBoard = MakeAGameBoard(row, column, numToWin);

        BoardPosition spot = new BoardPosition(0, 0);

        for(int i = 0; i < 3; i++)
        {
            spot = new BoardPosition(i, 0);
            gameBoard.placeMarker('x', spot);
        }

        BoardPosition win = new BoardPosition(2, 0);

        //assertion
        assertTrue(gameBoard.checkVerticalWin(win, 'x'));
    }

    @Test
    public void testCase_checkVerticalWin_BigWin() {
        //input values
        int row = 100;
        int column = 100;
        int numToWin = 25;

        //constructor call
        IGameBoard gameBoard = MakeAGameBoard(row, column, numToWin);

        BoardPosition spot = new BoardPosition(0, 0);

        for(int i = 0; i < 25; i++)
        {
            spot = new BoardPosition(i, 0);
            gameBoard.placeMarker('x', spot);
        }

        //assertion
        assertTrue(gameBoard.checkVerticalWin(spot, 'x'));
    }

    @Test
    public void testCase_checkVerticalWin_winFromAnyPostion() {
        //input values
        int row = 5;
        int column = 5;
        int numToWin = 5;

        //constructor call
        IGameBoard gameBoard = MakeAGameBoard(row, column, numToWin);

        BoardPosition one = new BoardPosition(0, 0);
        BoardPosition two = new BoardPosition(1, 0);
        BoardPosition three = new BoardPosition(2, 0);
        BoardPosition four = new BoardPosition(3, 0);
        BoardPosition five = new BoardPosition(4, 0);

        gameBoard.placeMarker('x', one);
        gameBoard.placeMarker('x', two);
        gameBoard.placeMarker('x', three);
        gameBoard.placeMarker('x', four);
        gameBoard.placeMarker('x', five);

        //assertion
        assertTrue(gameBoard.checkVerticalWin(one, 'x'));
        assertTrue(gameBoard.checkVerticalWin(two, 'x'));
        assertTrue(gameBoard.checkVerticalWin(three, 'x'));
        assertTrue(gameBoard.checkVerticalWin(four, 'x'));
        assertTrue(gameBoard.checkVerticalWin(five, 'x'));
    }

    @Test
    public void testCase_checkDiagonalWin_SpaceBetweenWin_leftToRight() {
        //input values
        int row = 5;
        int column = 5;
        int numToWin = 5;

        //constructor call
        IGameBoard gameBoard = MakeAGameBoard(row, column, numToWin);

        //sets up board
        BoardPosition spot = new BoardPosition(0, 0);
        gameBoard.placeMarker('x', spot);

        spot = new BoardPosition(1, 1);
        gameBoard.placeMarker('x', spot);

        spot = new BoardPosition(3, 3);
        gameBoard.placeMarker('x', spot);

        spot = new BoardPosition(4, 4);
        gameBoard.placeMarker('x', spot);


        BoardPosition right = new BoardPosition(4, 4);
        BoardPosition left = new BoardPosition(1, 1);

        //assertion
        assertTrue(!gameBoard.checkDiagonalWin(right, 'x'));
        assertTrue(!gameBoard.checkDiagonalWin(left, 'x'));

        //sets up board
        spot = new BoardPosition(2, 2);
        gameBoard.placeMarker('x', spot);
        BoardPosition mid = new BoardPosition(2, 2);

        //assertion
        assertTrue(gameBoard.checkDiagonalWin(mid, 'x'));
    }

    @Test
    public void testCase_checkDiagonalWin_SpaceBetweenWin_rightToLeft() {
        //input values
        int row = 5;
        int column = 5;
        int numToWin = 5;

        //constructor call
        IGameBoard gameBoard = MakeAGameBoard(row, column, numToWin);

        //sets up board
        BoardPosition spot = new BoardPosition(4, 0);
        gameBoard.placeMarker('x', spot);

        spot = new BoardPosition(3, 1);
        gameBoard.placeMarker('x', spot);

        spot = new BoardPosition(1, 3);
        gameBoard.placeMarker('x', spot);

        spot = new BoardPosition(0, 4);
        gameBoard.placeMarker('x', spot);


        BoardPosition right = new BoardPosition(4, 0);
        BoardPosition left = new BoardPosition(0, 4);

        //assertion
        assertTrue(!gameBoard.checkDiagonalWin(right, 'x'));
        assertTrue(!gameBoard.checkDiagonalWin(left, 'x'));

        //sets up board
        spot = new BoardPosition(2, 2);
        gameBoard.placeMarker('x', spot);
        BoardPosition mid = new BoardPosition(2, 2);

        //assertion
        assertTrue(gameBoard.checkDiagonalWin(mid, 'x'));
    }

    @Test
    public void testCase_checkDiagonalWin_NormalWin_leftToRight() {
        //input values
        int row = 5;
        int column = 5;
        int numToWin = 3;

        //constructor call
        IGameBoard gameBoard = MakeAGameBoard(row, column, numToWin);

        //sets up board
        BoardPosition spot = new BoardPosition(0, 0);
        gameBoard.placeMarker('x', spot);

        spot = new BoardPosition(1, 1);
        gameBoard.placeMarker('x', spot);

        spot = new BoardPosition(2, 2);
        gameBoard.placeMarker('x', spot);

        //assertion
        assertTrue(gameBoard.checkDiagonalWin(spot, 'x'));
    }

    @Test
    public void testCase_checkDiagonalWin_NormalWin_rightToLeft() {
        //input values
        int row = 5;
        int column = 5;
        int numToWin = 3;

        //constructor call
        IGameBoard gameBoard = MakeAGameBoard(row, column, numToWin);

        //sets up board
        BoardPosition spot = new BoardPosition(4, 0);
        gameBoard.placeMarker('x', spot);

        spot = new BoardPosition(3, 1);
        gameBoard.placeMarker('x', spot);

        spot = new BoardPosition(2, 2);
        gameBoard.placeMarker('x', spot);

        //assertion
        assertTrue(gameBoard.checkDiagonalWin(spot, 'x'));
    }

    @Test
    public void testCase_checkDiagonalWin_BigWin_LeftToRight() {
        //input values
        int row = 100;
        int column = 100;
        int numToWin = 25;

        IGameBoard gameBoard = MakeAGameBoard(row, column, numToWin);

        BoardPosition spot = new BoardPosition(0, 0);

        for(int i = 0; i < 25; i++)
        {
            spot = new BoardPosition(i, i);
            gameBoard.placeMarker('x', spot);
        }

        assertTrue(gameBoard.checkDiagonalWin(spot, 'x'));
    }

    @Test
    public void testCase_checkDiagonalWin_WinDivided_rightToLeft() {
        //input values
        int row = 100;
        int column = 100;
        int numToWin = 25;

        IGameBoard gameBoard = MakeAGameBoard(row, column, numToWin);

        BoardPosition spot = new BoardPosition(0, 0);

        for(int i = 24; i >= 0; i--)
        {
            spot = new BoardPosition(24 - i, i);
            gameBoard.placeMarker('x', spot);
        }

        assertTrue(gameBoard.checkDiagonalWin(spot, 'x'));
    }

    @Test
    public void testCase_checkDiagonalWin_checkForV() {
        //input values
        int row = 5;
        int column = 5;
        int numToWin = 3;

        //constructor call
        IGameBoard gameBoard = MakeAGameBoard(row, column, numToWin);

        BoardPosition spot = new BoardPosition(0, 0);
        gameBoard.placeMarker('x', spot);

        spot = new BoardPosition(0, 2);
        gameBoard.placeMarker('x', spot);

        spot = new BoardPosition(1, 1);
        gameBoard.placeMarker('x', spot);

        assertTrue(!gameBoard.checkDiagonalWin(spot, 'x'));
    }

    @Test
    public void testCase_checkForDraw_NormalCase() {
        //input values
        int row = 5;
        int column = 5;
        int numToWin = 5;

        //constructor call
        IGameBoard gameBoard = MakeAGameBoard(row, column, numToWin);

        //sets up board
        for(int i = 0; i < column; i++) {
            for(int j = 0; j < row; j++) {
                BoardPosition spot = new BoardPosition(j, i);
                gameBoard.placeMarker('x', spot);
            }
        }

        assertTrue(gameBoard.checkForDraw());
    }

    @Test
    public void testCase_checkForDraw_AlmostFull() {
        //input values
        int row = 5;
        int column = 5;
        int numToWin = 5;

        //constructor call
        IGameBoard gameBoard = MakeAGameBoard(row, column, numToWin);

        BoardPosition spot = new BoardPosition(0, 0);

        for(int j = 0; j < row; j++) {
            spot = new BoardPosition(j, 0);
            gameBoard.placeMarker('x', spot);
        }
        for(int j = 0; j < row; j++) {
            spot = new BoardPosition(j, 0);
            gameBoard.placeMarker('x', spot);
        }
        for(int j = 0; j < row; j++) {
            spot = new BoardPosition(j, 0);
            gameBoard.placeMarker('x', spot);
        }
        for(int j = 0; j < row; j++) {
            spot = new BoardPosition(j, 0);
            gameBoard.placeMarker('x', spot);
        }

        assertTrue(!gameBoard.checkForDraw());
    }

    @Test
    public void testCase_checkForDraw_maxSize() {
        //input values
        int row = 100;
        int column = 100;
        int numToWin = 25;

        //constructor call
        IGameBoard gameBoard = MakeAGameBoard(row, column, numToWin);

        //sets up board
        for(int i = 0; i < column; i++) {
            for(int j = 0; j < row; j++) {
                BoardPosition spot = new BoardPosition(j, i);
                gameBoard.placeMarker('x', spot);
            }
        }

        assertTrue(gameBoard.checkForDraw());
    }

    @Test
    public void testCase_checkForDraw_minSize() {
        //input values
        int row = 3;
        int column = 3;
        int numToWin = 3;

        //constructor call
        IGameBoard gameBoard = MakeAGameBoard(row, column, numToWin);

        //sets up board
        for(int i = 0; i < column; i++) {
            for(int j = 0; j < row; j++) {
                BoardPosition spot = new BoardPosition(j, i);
                gameBoard.placeMarker('x', spot);
            }
        }

        assertTrue(gameBoard.checkForDraw());
    }

    @Test
    public void testCase_whatsAtPosition_normalCase() {
        //input values
        int row = 5;
        int column = 5;
        int numToWin = 5;

        //constructor call
        IGameBoard gameBoard = MakeAGameBoard(row, column, numToWin);

        //sets up board
        BoardPosition spot = new BoardPosition(2, 2);
        gameBoard.placeMarker('x', spot);

        assertEquals(gameBoard.whatsAtPos(spot), (Character)('x'));
    }

    @Test
    public void testCase_whatsAtPosition_maxSize() {
        //input values
        int row = 100;
        int column = 100;
        int numToWin = 25;

        //constructor call
        IGameBoard gameBoard = MakeAGameBoard(row, column, numToWin);

        //sets up board
        BoardPosition spot = new BoardPosition(99, 99);
        gameBoard.placeMarker('x', spot);

        assertEquals(gameBoard.whatsAtPos(spot), (Character)('x'));
    }

    @Test
    public void testCase_whatsAtPosition_minSize() {
        //input values
        int row = 3;
        int column = 3;
        int numToWin = 3;

        //constructor call
        IGameBoard gameBoard = MakeAGameBoard(row, column, numToWin);

        //sets up board
        BoardPosition spot = new BoardPosition(0, 0);
        gameBoard.placeMarker('x', spot);

        assertEquals(gameBoard.whatsAtPos(spot), (Character)('x'));
    }

    @Test
    public void testCase_whatsAtPosition_surrounded() {
        //input values
        int row = 3;
        int column = 3;
        int numToWin = 3;

        //constructor call
        IGameBoard gameBoard = MakeAGameBoard(row, column, numToWin);

        //sets up board
        BoardPosition spot = new BoardPosition(1, 1);
        gameBoard.placeMarker('x', spot);

        spot = new BoardPosition(0, 0);
        gameBoard.placeMarker('o', spot);

        spot = new BoardPosition(0, 1);
        gameBoard.placeMarker('o', spot);

        spot = new BoardPosition(1, 0);
        gameBoard.placeMarker('o', spot);

        spot = new BoardPosition(1, 2);
        gameBoard.placeMarker('o', spot);

        spot = new BoardPosition(2, 1);
        gameBoard.placeMarker('o', spot);

        //spot to check
        spot = new BoardPosition(1, 1);

        assertEquals(gameBoard.whatsAtPos(spot), (Character)('x'));
    }

    @Test
    public void testCase_whatsAtPosition_5() {

    }

    @Test
    public void testCase_isPlayerAtPos_normalCase() {
        //input values
        int row = 5;
        int column = 5;
        int numToWin = 5;

        //constructor call
        IGameBoard gameBoard = MakeAGameBoard(row, column, numToWin);

        //sets up board
        BoardPosition spot = new BoardPosition(2, 2);
        gameBoard.placeMarker('x', spot);

        assertTrue(gameBoard.isPlayerAtPos(spot, 'x'));
    }

    @Test
    public void testCase_isPlayerAtPos_MaxSize() {
        //input values
        int row = 100;
        int column = 100;
        int numToWin = 25;

        //constructor call
        IGameBoard gameBoard = MakeAGameBoard(row, column, numToWin);

        //sets up board
        BoardPosition spot = new BoardPosition(99, 99);
        gameBoard.placeMarker('x', spot);

        assertTrue(gameBoard.isPlayerAtPos(spot, 'x'));
    }

    @Test
    public void testCase_isPlayerAtPos_MinSize() {
        //input values
        int row = 3;
        int column = 3;
        int numToWin = 3;

        //constructor call
        IGameBoard gameBoard = MakeAGameBoard(row, column, numToWin);

        //sets up board
        BoardPosition spot = new BoardPosition(0, 0);
        gameBoard.placeMarker('x', spot);

        assertTrue(gameBoard.isPlayerAtPos(spot, 'x'));
    }

    @Test
    public void testCase_isPlayerAtPos_4() {
        //input values
        int row = 3;
        int column = 3;
        int numToWin = 3;

        //constructor call
        IGameBoard gameBoard = MakeAGameBoard(row, column, numToWin);

        //sets up board
        BoardPosition spot = new BoardPosition(1, 1);
        gameBoard.placeMarker('x', spot);

        spot = new BoardPosition(0, 0);
        gameBoard.placeMarker('o', spot);

        spot = new BoardPosition(0, 1);
        gameBoard.placeMarker('o', spot);

        spot = new BoardPosition(1, 0);
        gameBoard.placeMarker('o', spot);

        spot = new BoardPosition(1, 2);
        gameBoard.placeMarker('o', spot);

        spot = new BoardPosition(2, 1);
        gameBoard.placeMarker('o', spot);

        //spot to check
        spot = new BoardPosition(1, 1);

        assertTrue(gameBoard.isPlayerAtPos(spot, 'x'));
    }

    @Test
    public void testCase_isPlayerAtPos_5() {

    }

    @Test
    public void testCase_placeMarker_normalCase() {
        //input values
        int row = 5;
        int column = 5;
        int numToWin = 5;

        //constructor call
        IGameBoard gameBoard = MakeAGameBoard(row, column, numToWin);
        Character arrayGameBoard[][] = new Character[row][column];

        for(int i = 0; i < row; i++) {
            for(int j = 0; j < column; j++) {
                arrayGameBoard[i][j] = ' ';
            }
        }

        BoardPosition spot = new BoardPosition(3, 3);
        gameBoard.placeMarker('x', spot);
        arrayGameBoard[3][3] = 'x';

        spot = new BoardPosition(2, 4);
        gameBoard.placeMarker('x', spot);
        arrayGameBoard[2][4] = 'x';

        assertEquals(arrayToString(arrayGameBoard, row, column), gameBoard.toString());
    }

    @Test
    public void testCase_placeMarker_maxSize() {
        //input values
        int row = 100;
        int column = 100;
        int numToWin = 25;

        //constructor call
        IGameBoard gameBoard = MakeAGameBoard(row, column, numToWin);
        Character arrayGameBoard[][] = new Character[row][column];

        for(int i = 0; i < row; i++) {
            for(int j = 0; j < column; j++) {
                arrayGameBoard[i][j] = ' ';
            }
        }

        BoardPosition spot = new BoardPosition(99, 99);
        gameBoard.placeMarker('x', spot);
        arrayGameBoard[99][99] = 'x';

        assertEquals(arrayToString(arrayGameBoard, row, column), gameBoard.toString());
    }

    @Test
    public void testCase_placeMarker_minSize() {
        //input values
        int row = 3;
        int column = 3;
        int numToWin = 3;

        //constructor call
        IGameBoard gameBoard = MakeAGameBoard(row, column, numToWin);
        Character arrayGameBoard[][] = new Character[row][column];

        for(int i = 0; i < row; i++) {
            for(int j = 0; j < column; j++) {
                arrayGameBoard[i][j] = ' ';
            }
        }

        BoardPosition spot = new BoardPosition(0, 0);
        gameBoard.placeMarker('x', spot);
        arrayGameBoard[0][0] = 'x';

        assertEquals(arrayToString(arrayGameBoard, row, column), gameBoard.toString());
    }

    @Test
    public void testCase_placeMarker_differentLetters() {
        //input values
        int row = 5;
        int column = 5;
        int numToWin = 5;

        //constructor call
        IGameBoard gameBoard = MakeAGameBoard(row, column, numToWin);
        Character arrayGameBoard[][] = new Character[row][column];

        for(int i = 0; i < row; i++) {
            for(int j = 0; j < column; j++) {
                arrayGameBoard[i][j] = ' ';
            }
        }

        BoardPosition spot = new BoardPosition(3, 3);
        gameBoard.placeMarker('o', spot);
        arrayGameBoard[3][3] = 'o';

        spot = new BoardPosition(2, 4);
        gameBoard.placeMarker('x', spot);
        arrayGameBoard[2][4] = 'x';

        assertEquals(arrayToString(arrayGameBoard, row, column), gameBoard.toString());
    }

    @Test
    public void testCase_placeMarker_5() {

    }

}
