'reach 0.1';

const [isNum, ZERO, ONE, TWO, THREE, FOUR, FIVE] = makeEnum(6);
const [isGuess, ZEROG, ONEG, TWOG, THREEG, FOURG, FIVEG, SIXG, SEVENG, EIGHTG, NINEG, TENG] = makeEnum(11);
const [isOutcome, A_WINS, J_WINS, DRAW] = makeEnum(3);

const winner = (guessA, guessJ, numA, numJ) => {
    const total = numA + numJ;

    //if both have same guess
    if (guessA == guessJ) {
        const result = DRAW;
        return result;
    }
    else {
        if (total == guessA) {
            const result = A_WINS;
            return result;
        }
        else if (total == guessJ) {
            const result = J_WINS;
            return result;
        }
        else {
            //if both guessed wrongly
            const result = DRAW;
            return result;
        }
    }
}

assert(winner(ONEG, SIXG, ZERO, ONE) == A_WINS);
assert(winner(SIXG, EIGHTG, FIVE, THREE) == J_WINS);
assert(winner(FOURG, TENG, ZERO, ZERO) == DRAW); //if both have same guess
assert(winner(FIVEG, FIVEG, THREE, ZERO) == DRAW); //if both guess wrongly

forall(UInt, guessA =>
    forall(UInt, guessJ =>
        forall(UInt, numA =>
            forall(UInt, numJ =>
                assert(isOutcome(winner(guessA, guessJ, numA, numJ)))
            )
        )
    )
);

forall(UInt, guess =>
    forall(UInt, numA =>
        forall(UInt, numJ =>
            assert(isOutcome(winner(guess, guess, numA, numJ)))
        )
    )
);


const Player = {
    ...hasRandom,
    guessNum: Fun([UInt], UInt),
    numGivenByPlayer: Fun([], UInt),
    seeOutcome: Fun([UInt], Null),
    informTimeout: Fun([], Null),
};

export const main = Reach.App(() => {
    const Annie = Participant('Annie', {
        ...Player,
        wager: UInt,
        deadline: UInt,
    });
    const John = Participant('John', {
        ...Player,
        acceptWager: Fun([UInt], Null),
    });
    init();

    const informTimeout = () => {
        each([Annie, John], () => {
            interact.informTimeout();
        })
    };

    Annie.only(() => {
        const wager = declassify(interact.wager);
        const deadline = declassify(interact.deadline);
    });
    Annie.publish(wager, deadline)
        .pay(wager);
    commit();

    John.only(() => {
        interact.acceptWager(wager);
    });
    John.pay(wager)
        .timeout(relativeTime(deadline), () => closeTo(Annie, informTimeout));

    var outcome = DRAW;
    invariant(balance() == 2 * wager && isOutcome(outcome));
    while (outcome == DRAW) {
        commit();

        Annie.only(() => {
            //number given by Annie
            const _numAnnie = interact.numGivenByPlayer();
            const [_commitGivenA, _saltA] = makeCommitment(interact, _numAnnie);
            const commitGivenA = declassify(_commitGivenA);

            //Annie's guess
            const _guessAnnie = interact.guessNum(_numAnnie);
            const [_commitGuessA, _saltGuessA] = makeCommitment(interact, _guessAnnie);
            const commitGuessA = declassify(_commitGuessA);
        });
        Annie.publish(commitGivenA, commitGuessA)
            .timeout(relativeTime(deadline), () => closeTo(John, informTimeout));

        commit();

        unknowable(John, Annie(_numAnnie, _saltA, _guessAnnie, _saltGuessA));

        John.only(() => {
            const numJohn = declassify(interact.numGivenByPlayer());
            const guessJohn = declassify(interact.guessNum(numJohn));
        });
        John.publish(numJohn, guessJohn)
            .timeout(relativeTime(deadline), () => closeTo(Annie, informTimeout));
        commit();

        Annie.only(() => {
            //Annie revelas her secret
            const [saltAnnie, numAnnie] = declassify([_saltA, _numAnnie]);
            const [saltGuessAnnie, guessAnnie] = declassify([_saltGuessA, _guessAnnie]);
        });
        //Annie publishes her number and her guess
        Annie.publish(saltAnnie, numAnnie, saltGuessAnnie, guessAnnie)
            .timeout(relativeTime(deadline), () => { closeTo(John, informTimeout) });

        checkCommitment(commitGivenA, saltAnnie, numAnnie);
        checkCommitment(commitGuessA, saltGuessAnnie, guessAnnie);

        outcome = winner(guessAnnie, guessJohn, numAnnie, numJohn);
        continue;
    }

    assert(outcome == A_WINS || outcome == J_WINS);
    transfer(2 * wager).to(outcome == A_WINS ? Annie : John);
    commit();

    each([Annie, John], () => {
        interact.seeOutcome(outcome);
    });
});