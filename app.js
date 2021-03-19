const gameBoard = (()=>{

    const boards = new Array(9);

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
    
    const computer = () => {
        const sign = "O";
        const getSign = () => sign;
        const getTurn = () => turn;
        const setTurn = (newTurn) => turn = newTurn;
        const play = () =>  {
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
        const isWinner = false;
        return {getSign, getTurn, setTurn, play, isWinner};
    }

    const display = (boards) =>{
        (Array.from(buttons)).map((button,index) =>{
            if(boards[index] == undefined){
                button.innerText = "";
            }else{
                button.innerText = boards[index];
            }
        });
    }

    const checkResult = (() =>{
        let winner;
        const checkRows = () =>{
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
                    }else{
                        ai.isWinner = true;
                    }
                    break;
                }else{
                    check = false;
                    row = [];
                }
            }
            return check;
        }

        const checkColumns = () =>{
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
                        console.log(player.win);
                    }else{
                        ai.isWinner = true;
                    }
                    break;
                }else{
                    check = false;
                    row = [];
                }
            }
            return check;
        }

        const checkDiagonal = () =>{
            let diag1 = [boards[0], boards[4], boards[8]];
            let diag2 = [boards[2], boards[4], boards[6]];
            if(diag1.join("") == "XXX" || diag1.join("") == "OOO" || diag2.join("") == "XXX" || diag2.join("") == "OOO"){
                if(diag1.join("") == "XXX" || diag2.join("") == "XXX"){
                    player.isWinner = true;
                }else{
                    ai.isWinner = true;
                }
                return true;
            }else{
                return false;
            }
        }

        const isLastRound = () =>{
            for(let i = 0; i<boards.length; i++){
                if(boards[i] == undefined){
                    return false;
                }
            }
            return true;
        }

        const isEnd = () =>{
            if(checkRows() || checkColumns() || checkDiagonal()){
                return true;
            }else{
                return false;
            }
        }

        return {isEnd, isLastRound};
    })();

    const play = (e) =>{
        let isEnd = checkResult.isEnd();
        console.log(`is end: ${isEnd}`);
        console.log(`player turn: ${player.getTurn()}`);
        console.log(`target innerText: ${e.target.innerText}`);
        if(e.target.innerText == "" && player.getTurn() && !isEnd){
                player.play(e);
                player.setTurn(false);
                isEnd = checkResult.isEnd();
       }
        if(ai.getTurn() && !isEnd){
            ai.play();
            ai.setTurn(false);
        }
        display(boards);
        console.log(boards);
    }

    const endGame = () =>{
        if(checkResult.isEnd()){
            let winnerButtons = Array.from(buttons);
            winnerButtons = winnerButtons.filter(button => {
                if(player.isWinner){
                    return button.innerText == "X";
                }else{
                    return button.innerText == "O";
                }
            });
            winnerButtons.forEach(button => button.style.fontSize = "9rem");
            window.setTimeout(function(){
                endGameDisplayText.innerText = (player.isWinner) ? "You Win !" : "You Lose :(";
                endGameDisplayText.style.color = (player.isWinner) ? "rgb(24, 32, 41)" : "rgb(60, 22, 22)";
                endGameDisplay.classList.add('end-game-declare-trigger');
                container.classList.add('end-game-container-move');
            }, 1000);
        }else if(checkResult.isLastRound()){
            window.setTimeout(function(){
                endGameDisplayText.innerText = "Tie !";
                endGameDisplayText.style.color = "rgb(196, 215, 236)";
                endGameDisplay.classList.add('end-game-declare-trigger');
                container.classList.add('end-game-container-move');
            }, 1000);
        }
        console.log('aa');
    };

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
        console.log(boards)
        display(boards);
    }


    const player = human();
    const ai = computer();
    const buttons = document.querySelectorAll('.board');
    const againButton = document.querySelector('#again-button');
    const endGameDisplay = document.querySelector('#end-game-declare');
    const endGameDisplayText = document.querySelector('#end-game-declare-text');
    const container = document.querySelector('#container');
    buttons.forEach(button => button.addEventListener('click', play));
    buttons.forEach(button => button.addEventListener('click', endGame));
    againButton.addEventListener('click',resetGame);


    
})();

/*
Implement max-min for real ai player.
*/


