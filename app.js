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
        }
        const isWinner = false; 
        return {getSign, getTurn, setTurn, play, isWinner};
    }
    
    const computer = () => {
        const sign = "O";
        const getSign = () => sign;
        const play = () =>  {
            let emptyBoard = [];
            for(let i = 0; i<boards.length; i++){
                if(boards[i] == undefined){
                    emptyBoard.push(i);
                }
            }
            let index = emptyBoard[Math.round(Math.random()*(emptyBoard.length-1))];
            boards[index] = sign;
        }
        const isWinner = false;
        return {getSign, play, isWinner};
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
        const isEnd = () =>{
            if(checkRows() || checkColumns() || checkDiagonal()){
                return true;
            }else{
                return false;
            }
        }

        return {isEnd};
    })();

    const play = (e) =>{
        let isEnd = checkResult.isEnd();
        if(e.target.innerText == "" && player.getTurn() && !isEnd){
            player.play(e);
            player.setTurn(false);
        }
        if(!player.getTurn() && !isEnd){
            ai.play();
            player.setTurn(true);
        }
        display(boards);
    }

    const endGame = () =>{
        if(checkResult.isEnd()){
            let winner;
            if(player.isWinner){
                winner = "player";
            }else if(ai.isWinner){
                winner = "ai";
            }
            console.log(`Game is over: ${checkResult.isEnd()} and the Winner: ${winner}`);
        }
    };

    const player = human();
    const ai = computer();
    const buttons = document.querySelectorAll('.board');
    buttons.forEach(button => button.addEventListener('click', play));
    buttons.forEach(button => button.addEventListener('click', endGame));
})();

/*
1- Add div that declares winner and blur the body of the page.
2- Add restart button on that div which resets the game
3- Add style to the page
4- Implement max-min for real ai player.
*/


