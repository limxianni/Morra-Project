import { loadStdlib } from "@reach-sh/stdlib";
import * as backend from "../build/index.main.mjs";
const stdlib = loadStdlib(process.env);

const startingBalance = stdlib.parseCurrency(100);
const accAnnie = await stdlib.newTestAccount(startingBalance);
const accJohn = await stdlib.newTestAccount(startingBalance);

const fmt = (x) => stdlib.formatCurrency(x, 4);
const getBalance = async (who) => fmt(await stdlib.balanceOf(who));
const beforeAnnie = await getBalance(accAnnie);
const beforeJohn = await getBalance(accJohn);

const ctcAnnie = accAnnie.contract(backend);
const ctcJohn = accJohn.contract(backend, ctcAnnie.getInfo());

const GIVEN = [0, 1, 2, 3, 4, 5];
const GUESSTOTAL = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const OUTCOME = ["Annie wins", "John wins", "Draw"];

const Player = (who) => ({
    ...stdlib.hasRandom,
    numGivenByPlayer: () => {
        const numGiven = Math.floor(Math.random() * 6);
        console.log(`Number given by ${who}: ${GIVEN[numGiven]}`);
        return numGiven;
    },
    guessNum: async (numGiven) => {
        const numGuess = GIVEN[numGiven] + Math.floor((Math.random() * 6));
        console.log(`${who} has guessed number ${GUESSTOTAL[numGuess]}.`);
        // if (Math.random() <= 0.01) {
        //     for (let i = 0; i < 10; i++) {
        //         console.log(`${who} takes their sweet time sending it back...`);
        //         await stdlib.wait(1);
        //     }
        // }
        return numGuess;
        // return GUESSTOTAL[numGuess];
    },
    seeOutcome: (outcome) => {
        console.log(`${who} saw outcome ${OUTCOME[outcome]}.`);
    },
    informTimeout: () => {
        console.log(`${who} observed a timeout.`);
    }
});

await Promise.all([
    ctcAnnie.p.Annie({
        ...Player('Annie'),
        wager: stdlib.parseCurrency(5),
        deadline: 10,
    }),
    ctcJohn.p.John({
        ...Player('John'),
        acceptWager: async (amt) => {
            console.log(`John accepts the wager of ${fmt(amt)}.`);
        }
    })
]);

const afterAnnie = await getBalance(accAnnie);
const afterJohn = await getBalance(accJohn);

console.log(`Annie went from ${beforeAnnie} to ${afterAnnie}.`);
console.log(`John went from ${beforeJohn} to ${afterJohn}.`);
