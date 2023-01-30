package cpsc2150.extendedTicTacToe;

import java.util.Scanner;

public class GameScreen {

    public static final int MAX_NUM_PLAYERS = 10;
    public static final int MIN_NUM_PLAYERS = 2;

    /**
     * This is the main function that initiates and plays tic tac toe
     * @pre none
     * @post [A game of tic tac toe has been played!]
     */
    public static void main(String[] args)
    {
        int row;
        int column;
        Character players[];
        int numPlayers = 0;
        int currPlayer = 0;
        String keepPlaying = "Y";
        boolean firstTurn = true;
        int numRow;
        int numColumn;
        int numToWin;
        IGameBoard board;

        Scanner input = new Scanner(System.in);

        while(keepPlaying.charAt(0) == 'Y')
        {
            //sets Player Count
            while(true)
            {
                System.out.println("How many players?");
                numPlayers = input.nextInt();
                input.nextLine();

                if(numPlayers > MAX_NUM_PLAYERS)
                {
                    System.out.println("Must be 10 players or fewer");
                }
                else if(numPlayers < MIN_NUM_PLAYERS)
                {
                    System.out.println("Must be at least 2 players");
                }
                else
                {
                    break;
                }
            }
            players = new Character[numPlayers];

            //sets the characters to represent each player
            char temp;
            for(int i = 0; i < numPlayers; i++)
            {
                System.out.println("Enter the character to represent player " + (i + 1));
                temp = input.nextLine().toUpperCase().charAt(0);
                players[i] = temp;
                for(int j = i - 1; j >= 0; j--)
                {
                    if((players[j] == temp))
                    {
                        System.out.println(temp + " is already taken as a player token!");
                        i--;
                        break;
                    }
                }

            }

            //Sets the number of Rows
            while(true)
            {
                System.out.println("How many rows?");
                numRow = input.nextInt();
                input.nextLine();

                if((numRow > IGameBoard.MAX_ROW) || (numRow < IGameBoard.MIN_ROW))
                {
                    System.out.println("Rows must be between 3 and 100");
                }
                else
                {
                    break;
                }
            }

            //Sets the number of Columns
            while(true)
            {
                System.out.println("How many Columns?");
                numColumn = input.nextInt();
                input.nextLine();

                if((numColumn > IGameBoard.MAX_COLUMN) || (numColumn < IGameBoard.MIN_COLUMN))
                {
                    System.out.println("Columns must be between 3 and 100");
                }
                else
                {
                    break;
                }
            }

            //Sets the number of markers required to win
            while(true)
            {
                System.out.println("How many in a row to win??");
                numToWin = input.nextInt();
                input.nextLine();

                if((numToWin > IGameBoard.MAX_NUMTOWIN) || (numToWin < IGameBoard.MIN_NUMTOWIN))
                {
                    System.out.println("Number in a row to win must be between 3 and 25");
                }
                else
                {
                    break;
                }
            }

            //Sets whether a game will be Memory efficient or fast
            while(true)
            {
                System.out.println("Would you like a Fast Game (F/f) or a Memory Efficient Game (M/m)?");
                temp = input.nextLine().toUpperCase().charAt(0);
                if(temp == 'F')
                {
                    board = new GameBoard(numRow, numColumn, numToWin);
                    break;
                }
                else if(temp == 'M')
                {
                    board = new GameBoardMem(numRow, numColumn, numToWin);
                    break;
                }
                else
                {
                    System.out.println("Please enter F or M");
                }
            }

            while(true)
            {
                if(firstTurn)
                {
                    System.out.println(board.toString());
                }
                System.out.println("Player " + players[currPlayer].toString() + " Please enter your ROW");
                row = input.nextInt();
                input.nextLine();
                System.out.println("Player " + players[currPlayer].toString() + " Please enter your Column");
                column = input.nextInt();
                input.nextLine();

                if((row >= board.getNumRows()) || (column >= board.getNumColumns()) || (row < 0) || (column < 0))
                {
                    System.out.println("That space is unavailable, please pick again");
                    firstTurn = false;
                }
                else
                {
                    BoardPosition pos = new BoardPosition(row, column);

                    if(board.checkSpace(pos))
                    {
                        board.placeMarker(players[currPlayer], pos);
                        if(board.checkForWinner(pos))
                        {
                            System.out.println("Player " + players[currPlayer] + " wins!");
                            System.out.println(board.toString());
                            System.out.println("Would you like to play again? Y/N");
                            keepPlaying = input.nextLine().toUpperCase();
                            currPlayer = numPlayers;
                            board.clearBoard();
                            firstTurn = true;
                            currPlayer = 0;
                            break;
                        }
                        else if(board.checkForDraw())
                        {
                            System.out.println("Draw!");
                            System.out.println(board.toString());
                            System.out.println("Would you like to play again? Y/N");
                            keepPlaying = input.nextLine().toUpperCase();
                            currPlayer = numPlayers;
                            board.clearBoard();
                            firstTurn = true;
                            currPlayer = 0;
                            break;
                        }
                        else
                        {
                            System.out.println(board.toString());
                            firstTurn = false;
                        }

                        currPlayer++;
                        if(currPlayer >= numPlayers)
                        {
                            currPlayer = 0;
                        }
                    }
                    else
                    {
                        System.out.println("That space is unavailable, please pick again");
                    }
                }
            }
        }
    }
}
