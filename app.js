const gameBoard = (()=>{
    
    //Create empty array for storing player moves
    const boards = new Array(9);

    //create human object
    const human = () => {
        const sign = "X";
        const getSign = () => sign;
        let turn = true;
        const getTurn = () => turn;
        const setTurn = (newTurn) => turn = newTurn;
        const play = (e) => {
            let index = e.target.dataset.index;
            boards[index] = sign;
            e.target.classList.add('player-section');
            ai.setTurn(true);
        }
        const isWinner = false; 
        return {getSign, getTurn, setTurn, play, isWinner};
    }
    
    //create computer object
    const computer = (isMinimax) => {
        const sign = "O";
        const getSign = () => sign;
        const getTurn = () => turn;
        const setTurn = (newTurn) => turn = newTurn;
        const play = () =>  {
            //check whether the player selected ai for difficulty
            if(isMinimax){
            /*--------- Conduct minimax for best move-------- */
                let currBdSt = [...boards];
                currBdSt = currBdSt.map((item,index) =>{
                    if(item != "X" && item != "O"){
                        return index;
                    }else{
                        return item;
                    }
                })
                const miniMaxIndexFinder = minimax(currBdSt, sign);
                boards[miniMaxIndexFinder.index] = sign;
                Array.from(buttons).forEach(button => {
                    if(button.dataset.index == miniMaxIndexFinder.index){
                        button.classList.add('computer-section');
                        button.addEventListener('transitionend', (a)=>{
                        player.setTurn(true);  
                        })
                    }
                });
            }else{
                // for the easy computer select random indexes for next move
                const emptyBoard = [];
                for(let i = 0; i<boards.length; i++){
                    if(boards[i] == undefined){
                        emptyBoard.push(i);
                    }
                }
                let index = emptyBoard[Math.round(Math.random()*(emptyBoard.length-1))];
                boards[index] = sign;
                Array.from(buttons).forEach(button => {
                    if(button.dataset.index == index){
                        button.classList.add('computer-section');
                        button.addEventListener('transitionend', (a)=>{
                            player.setTurn(true);  
                        })
                    }
                });
            }
        }
        const isWinner = false;
        return {getSign, getTurn, setTurn, play, isWinner, isMinimax};
    }

   /*-------------------minimax algorithm for finding the best possible move-------------------------------------------------------------------------------------*/
   /*-------------------Note: modified on script available at https://www.freecodecamp.org/news/minimax-algorithm-guide-how-to-create-an-unbeatable-ai/ ---------*/
    function minimax(currBdSt, currMark) {

        //Store the indexes of all empty cells:
        const availCellsIndexes = (() =>{
            const emptyBoard = [];
            for(let i = 0; i<currBdSt.length; i++){
                if(currBdSt[i] != player.getSign() && currBdSt[i] != ai.getSign()){
                    emptyBoard.push(i);
                }
            }
            return emptyBoard;
        })();

        //Check if there is a terminal state:
            if(checkResult.isEnd(currBdSt)){
                if(player.isWinner){
                    return {score: -1};
                }else{
                    return {score: 1};
                }
            }else if(availCellsIndexes.length === 0){
                return {score: 0};
            }
        

        // Create a place to record the outcome of each test drive:

        const allTestPlayInfos = [];
        
        //Create a for-loop statement that will loop through each of the empty cells:
        for (let i = 0; i < availCellsIndexes.length; i++) {

            //Create a place to store this test-play’s terminal score:
            const currentTestPlayInfo = {};
            
            //Save the index number of the cell this for-loop is currently processing:
            currentTestPlayInfo.index = currBdSt[availCellsIndexes[i]];

            //Place the current player’s mark on the cell for-loop is currently processing:
            currBdSt[availCellsIndexes[i]] = currMark;

            if (currMark === ai.getSign()) {

                //Recursively run the minimax function for the new board:
                const result = minimax(currBdSt, player.getSign());

                //Save the result variable’s score into the currentTestPlayInfo object:
                currentTestPlayInfo.score = result.score;
            } else {

                //Recursively run the minimax function for the new board:
                const result = minimax(currBdSt, ai.getSign());

                //Save the result variable’s score into the currentTestPlayInfo object:
                currentTestPlayInfo.score = result.score;
            }
            
            //Reset the current board back to the state it was before the current player made its move:
            currBdSt[availCellsIndexes[i]] = currentTestPlayInfo.index;

            //Save the result of the current player’s test-play for future use:
            allTestPlayInfos.push(currentTestPlayInfo);
        }
        
        //Create a store for the best test-play’s reference:
        let bestTestPlay = null;
        
        //Get the reference to the current player’s best test-play:
        if (currMark === ai.getSign()) {
            let bestScore = -Infinity;
            for (let i = 0; i < allTestPlayInfos.length; i++) {
                if (allTestPlayInfos[i].score > bestScore) {
                    bestScore = allTestPlayInfos[i].score;
                    bestTestPlay = i;
                }
            }
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < allTestPlayInfos.length; i++) {
                if (allTestPlayInfos[i].score < bestScore) {
                    bestScore = allTestPlayInfos[i].score;
                    bestTestPlay = i;
                }
            }
        }
        
        //Get the object with the best test-play score for the current player:
        return allTestPlayInfos[bestTestPlay];
    } 

    //Update html container with the current moves
    const display = (boards) =>{
        (Array.from(buttons)).map((button,index) =>{
            if(boards[index] != player.getSign() && boards[index] != ai.getSign()){
                button.innerText = "";
            }else{
                button.innerText = boards[index];
            }
        });
    }

    //Function for determining if there is a winner
    const checkResult = (() =>{

        //Function for checking rows
        const checkRows = (boards) =>{
            let check;
            let row = [];
            for(let i = 0; i<= 7; i+=3){
                row[0] = boards[i];
                for(let j = 1; j<= 2; j++){
                    row.push(boards[i+j]);
                }
                if(row.join("") == "XXX" || row.join("") == "OOO"){
                    check = true;
                    if(row.join("") == "XXX"){
                        player.isWinner = true;
                        ai.isWinner = false;
                    }else{
                        ai.isWinner = true;
                        player.isWinner = false;
                    }
                    break;
                }else{
                    check = false;
                    row = [];
                }
            }
            return check;
        }

        //Function for checking columns
        const checkColumns = (boards) =>{
            let check;
            let row = [];
            for(let i = 0; i<= 2; i++){
                row[0] = boards[i];
                for(let j = 3; j<= 6; j+=3){
                    row.push(boards[i+j]);
                }
                if(row.join("") == "XXX" || row.join("") == "OOO"){
                    check = true;
                    if(row.join("") == "XXX"){
                        player.isWinner = true;
                        ai.isWinner = false;
                    }else{
                        ai.isWinner = true;
                        player.isWinner = false;
                    }
                    break;
                }else{
                    check = false;
                    row = [];
                }
            }
            return check;
        }

        //Function for checking diagonals
        const checkDiagonal = (boards) =>{
            let diag1 = [boards[0], boards[4], boards[8]];
            let diag2 = [boards[2], boards[4], boards[6]];
            if(diag1.join("") == "XXX" || diag1.join("") == "OOO" || diag2.join("") == "XXX" || diag2.join("") == "OOO"){
                if(diag1.join("") == "XXX" || diag2.join("") == "XXX"){
                    player.isWinner = true;
                    ai.isWinner = false;
                }else{
                    ai.isWinner = true;
                    player.isWinner = false;
                }
                return true;
            }else{
                return false;
            }
        }

        //Function for check if the game has ended with tie
        const isLastRound = (boards) =>{
            for(let i = 0; i<boards.length; i++){
                if(boards[i] != player.getSign() && boards[i] != ai.getSign()){
                    return false;
                }
            }
            return true;
        }

        //Return if the game has ended
        const isEnd = (boards) =>{
            if(checkRows(boards) || checkColumns(boards) || checkDiagonal(boards)){
                return true;
            }else{
                player.isWinner = false;
                ai.isWinner = false;
                return false;
            }
        }

        return {isEnd, isLastRound};
    })();

    //Triggered function when any available button is selected for next move by player
    const play = (e) =>{
        let isEnd = checkResult.isEnd(boards);
        if(e.target.innerText == "" && player.getTurn() && !isEnd){
            player.play(e);
            player.setTurn(false);
            isEnd = checkResult.isEnd(boards);
       }
        if(ai.getTurn() && !isEnd){
            ai.play();
            ai.setTurn(false);
        }
        display(boards);
        if(checkResult.isEnd(boards) || checkResult.isLastRound(boards)){
            endGame();
        }
    }

    // Triggered function when the game is over, and it sets some styles for displaying winner
    const endGame = () =>{
        if(checkResult.isEnd(boards)){
            let winnerButtons = Array.from(buttons);
            winnerButtons = winnerButtons.filter(button => {
                if(player.isWinner){
                    return button.innerText == "X";
                }else{
                    return button.innerText == "O";
                }
            });
            winnerButtons.forEach(button => button.style.fontSize = "7rem");
            window.setTimeout(function(){
                endGameDisplayText.innerText = (player.isWinner) ? "You Win !" : "You Lose :(";
                endGameDisplayText.style.color = (player.isWinner) ? "rgb(24, 32, 41)" : "rgb(60, 22, 22)";
                if(ai.isMinimax){
                    endGameDifficultyChangeAiButton.style.backgroundColor = "rgba(164, 119, 123, 0.568)";
                }else{
                    endGameDifficultyChangeEasyButton.style.backgroundColor = "rgba(143, 164, 119, 0.568)";
                }
                endGameDisplay.classList.add('end-game-declare-trigger');
                container.classList.add('end-game-container-move');
            }, 1000);
        }else if(checkResult.isLastRound(boards)){
            window.setTimeout(function(){
                endGameDisplayText.innerText = "Tie !";
                endGameDisplayText.style.color = "rgb(196, 215, 236)";
                endGameDisplay.classList.add('end-game-declare-trigger');
                container.classList.add('end-game-container-move');
            }, 1000);
        }
    };

    //When again is selected by player, all info and styles are reseted by resetGame() function.
    const resetGame = ()=>{
        for(let i = 0; i<boards.length; i++){boards[i]=undefined}
        endGameDisplay.classList.remove('end-game-declare-trigger');
        container.classList.remove('end-game-container-move');
        buttons.forEach(button =>{
            button.classList.remove('player-section');
            button.classList.remove('computer-section');
            button.style.fontSize = "";
        });
        player.setTurn(true);
        player.isWinner = false;
        ai.setTurn(false);
        ai.isWinner = false; 
        display(boards);
    }

    //Create player object for human
    const player = human();

    //Create empty ai object that is configured accordingly later depending on difficulty selection.
    const ai = {};

    //Below variables are html elements for styling.
    const buttons = document.querySelectorAll('.board');
    const againButton = document.querySelector('#again-button');
    const endGameDisplay = document.querySelector('#end-game-declare');
    const endGameDisplayText = document.querySelector('#end-game-declare-text');
    const container = document.querySelector('#container');
    const difficultyButtons = Array.from(document.querySelectorAll('.start-game-button'));
    const startGameSection = document.querySelector('#start-game');
    const endGameDifficultyChangeAiButton = document.querySelector('#end-game-declare-difficulty-button-ai');
    const endGameDifficultyChangeEasyButton =  document.querySelector('#end-game-declare-difficulty-button-easy');

    //Add listener for each empty board in DOM for next move.
    buttons.forEach(button => button.addEventListener('click', play));

    //Add listener to again button for reseting the game. 
    againButton.addEventListener('click',resetGame);

    //Listen difficulty buttons in both start screen and end game screen
    //Asign computer object to empty ai object considering player diffulty selection
    //Add some styles for these buttons
    difficultyButtons.forEach(button => button.addEventListener('click', (e)=>{
        startGameSection.classList.add('start-game-remove');
        if(e.target.id == "easy" || e.target.id == "end-game-declare-difficulty-button-easy"){
            Object.assign(ai,computer(false));
            endGameDifficultyChangeEasyButton.style.backgroundColor = "rgba(143, 164, 119, 0.568)";
            endGameDifficultyChangeAiButton.style.backgroundColor ="";

        }else{
             Object.assign(ai,computer(true));
             endGameDifficultyChangeEasyButton.style.backgroundColor = "";
             endGameDifficultyChangeAiButton.style.backgroundColor ="rgba(164, 119, 123, 0.568)";
        }
    }));


    
})();


