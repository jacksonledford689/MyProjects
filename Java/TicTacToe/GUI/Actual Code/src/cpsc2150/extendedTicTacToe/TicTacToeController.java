package cpsc2150.extendedTicTacToe;

/**
 * The TicTacToe controller class will handle communication between our TicTacToeView and our Model (IGameBoard and BoardPosition)
 * <p>
 * This is where you will write code
 * <p>
 * You will need to include your BoardPosition class, the IGameBoard interface
 * and the implementations from previous homeworks
 * If your code was correct you will not need to make any changes to your IGameBoard classes
 */
public class TicTacToeController {

    //our current game that is being played
    private IGameBoard curGame;

    //The screen that provides our view
    private TicTacToeView screen;

    public static final int MAX_PLAYERS = 10;
    //our play tokens are hard coded. We could make a screen to get those from the user, but

    private int numPlayers;

    private Character[] players;

    private int playerTurn = 0;

    private boolean win = false;

    private boolean tie = false;

    /**
     * @param model the board implementation
     * @param view  the screen that is shown
     * @post the controller will respond to actions on the view using the model.
     */
    TicTacToeController(IGameBoard model, TicTacToeView view, int np) {
        this.curGame = model;
        this.screen = view;
        numPlayers = np;
        players = new Character[]{'X', 'Y', 'O', 'P', 'T', 'W', 'S', 'H', 'J', 'K'};
    }

    /**
     * @param col the column of the activated button
     * @post will allow the player to place a token in the column if it is not full, otherwise it will display an error
     * and allow them to pick again. Will check for a win as well. If a player wins it will allow for them to play another
     * game hitting any button
     */
    public void processButtonClick(int row, int column) {
        BoardPosition pos = new BoardPosition(row, column);

        if(win || tie) {
            playerTurn = 0;
            tie = false;
            win = false;
            this.newGame();
            return;
        }

        if(!curGame.checkSpace(pos)) {
            screen.setMessage("Space is Taken!");
            return;
        }

        curGame.placeMarker(players[playerTurn], pos);
        screen.setMarker(pos.getRow(), pos.getColumn(), players[playerTurn]);

        if(curGame.checkForWinner(pos)) {
            screen.setMessage("Player " + players[playerTurn] + " Wins!\nPress any Button to Start a new game.");
            win = true;
        }

        if(curGame.checkForDraw()) {
            screen.setMessage("It is a tie!\nPress any Button to Start a new game.");
            tie = true;
        }

        if(win || tie) {
            return;
        }
        else if(playerTurn + 1 < numPlayers) {
            playerTurn++;
            screen.setMessage("It is " + players[playerTurn] + "\'s turn. ");
        }
        else {
            playerTurn = 0;
            screen.setMessage("It is " + players[playerTurn] + "\'s turn. ");
        }
    }

    /**
     * This method will start a new game by returning to the setup screen and controller
     */
    private void newGame() {
        //close the current screen
        screen.dispose();
        //start back at the set up menu
        GameSetupScreen screen = new GameSetupScreen();
        GameSetupController controller = new GameSetupController(screen);
        screen.registerObserver(controller);
    }
}