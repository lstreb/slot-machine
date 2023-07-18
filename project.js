//1. deposit money
//2. determine number of lines to bet on
//3. collect a bet amount
//4. spin the slot machine
//5. check if the user won
//6. give the user their winnings
//7. play again

//to be able to get user input
const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    A: 2,
    B: 4,
    C: 6,
    D: 8,
}

//if it gets a line of As the bet multiply by 5
const SYMBOL_VALUES = {
    A: 5,
    B: 4,
    C: 3,
    D: 2,
}



const deposit = () => {
    while(true) {
        const deposit_value = prompt("Enter a deposit amount: ");
        //converts to a number because it'll be a string
        //if the string is not a number it'll return NaN
        const number_deposit_value = parseFloat(deposit_value);

        if(isNaN(number_deposit_value) || number_deposit_value <= 0) {
            console.log("Invalid deposit amount, try again.");
        }
        else return number_deposit_value;
    }
};

const get_number_of_lines = () => {
    while(true) {
        const lines = prompt("Enter the number of lines to bet on (1 to 3): ");
        const number_lines = parseFloat(lines);

        if(isNaN(number_lines) || number_lines < 1 || number_lines > 3 ) {
            console.log("Invalid number of lines, try again.");
        }
        else return number_lines;
    }
}

//can't bet more than you have in your balance
const get_bet = (money, number_lines) => {
    while(true) {
        const bet = prompt("Enter the bet per line: ");
        const number_bet = parseFloat(bet);

        if(isNaN(number_bet) || number_bet <= 0 || number_bet > money / number_lines ) {
            console.log("Invalid value, try again.");
        }
        else return number_bet;
    }
}

const spin = () => {
    const symbols = [];
    for(const [symbol, count] of Object.entries(SYMBOLS_COUNT)){
        for(let i = 0; i < count; i++){
            symbols.push(symbol);
        }
    }

    //array inside of an array
    //each one is a column
    const reels = [];
    //generating whats inside of the column
    for(let i = 0; i < COLS; i++){
        reels.push([]);
        //randomly selects symbol and removes from the available symbols
        const reel_symbols = [...symbols];
        //rows
        for(let j = 0; j < ROWS; j++){
            const random_index = Math.floor(Math.random() * reel_symbols.length);
            const selcted_symbol =  reel_symbols[random_index];
            reels[i].push(selcted_symbol);
            //removing it
            reel_symbols.splice(random_index, 1);
        }
    }
    return reels;
};

//[[A B C], [D D D], [A A A]]
// A D A
// B D A
//C D A
const transpose = (reels) => {
    const rows = [];

    for(let i = 0; i < ROWS; i++){
        rows.push([]);
        for(let j = 0; j < COLS; j++){
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
}

const print_rows = (rows) => {
    //going through every single row
    for(const row of rows){
        let row_string = "";
        for(const[i, symbol] of row.entries()){
            row_string += symbol;
            //if it's the las number is not going to print the |
            if(i != row.length - 1){
                row_string += " | ";
            }
        }
        console.log(row_string);
    }
}

const get_winnings = (rows, bet, lines) => {
    let winnings = 0;

    for(let row = 0; row < lines; row++){
        const symbols = rows[row];
        //if the user didn't win the variable will be false
        let the_same = true;

        for(const symbol of symbols){
            //comparing to the firs symbol, if all of them are
            //equal to the fist symbol, then they're all the same
            if(symbol != symbols[0]){
                the_same = false;
                break;
            }
        }
        //multiply to know the winnings
        if(the_same){
            winnings += bet * SYMBOL_VALUES[symbols[0]];
        }
    }
    return winnings;
}

const game = () => {
    let money = deposit();

    while(true){
        console.log("Your balance: $" + money)
        const number_lines = get_number_of_lines();
        const bet = get_bet(money, number_lines);
        money -= bet * number_lines;

        const reels = spin();
        const rows = transpose(reels);
        print_rows(rows);

        const winnings = get_winnings(rows, bet, number_lines);
        
        money += winnings;
        console.log("You won $" + winnings.toString());

        if(money <= 0){
            console.log("You ran out of money!");
            break;
        }

        const replay = prompt("Do you want to play again (y/n)?");
        if(replay != "y") break;
    } 
}

game();





