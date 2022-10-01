import React from 'react';
const exports = {};

// Player views must be extended.
// It does not have its own Wrapper view.
exports.GiveNum = class extends React.Component {
    render() {
        const { parent, playable, given } = this.props;
        return (
            <div>
                <h3>Please give a number: </h3>
                {given ? 'It was a draw! Pick a number again.' : ''}
                <br />
                {!playable ? 'Please wait...' : ''}
                <br />
                <button
                    //disable if !playable is false, means kenut play liao
                    disabled={!playable}
                    onClick={() => parent.playGive('ZERO')}
                >Zero</button>
                <button
                    disabled={!playable}
                    onClick={() => parent.playGive('ONE')}
                >One</button>
                <button
                    disabled={!playable}
                    onClick={() => parent.playGive('TWO')}
                >Two</button>
                <br />
                <button
                    disabled={!playable}
                    onClick={() => parent.playGive('THREE')}
                >Three</button>
                <button
                    disabled={!playable}
                    onClick={() => parent.playGive('FOUR')}
                >Four</button>
                <button
                    disabled={!playable}
                    onClick={() => parent.playGive('FIVE')}
                >Five</button>
            </div>
        );
    }
}

exports.GuessNum = class extends React.Component {
    render() {
        const { parent, playable, guess } = this.props;
        console.log(this.props);
        return (
            <div>
                <h3>Please guess the total number:</h3>
                {guess ? 'Pick a guess again.' : ''}
                <br />
                {!playable ? 'Please wait...' : ''}
                <br />
                <button
                    //disable if !playable is false, means kenut play liao
                    disabled={!playable}
                    onClick={() => parent.playGuess('ZERO')}
                >Zero</button>
                <button
                    disabled={!playable}
                    onClick={() => parent.playGuess('ONE')}
                >One</button>
                <button
                    disabled={!playable}
                    onClick={() => parent.playGuess('TWO')}
                >Two</button>
                <button
                    disabled={!playable}
                    onClick={() => parent.playGuess('THREE')}
                >Three</button>
                <button
                    disabled={!playable}
                    onClick={() => parent.playGuess('FOUR')}
                >Four</button>
                <button
                    disabled={!playable}
                    onClick={() => parent.playGuess('FIVE')}
                >Five</button>
                <br />
                <button
                    disabled={!playable}
                    onClick={() => parent.playGuess('SIX')}
                >Six</button>
                <button
                    disabled={!playable}
                    onClick={() => parent.playGuess('SEVEN')}
                >Seven</button>
                <button
                    disabled={!playable}
                    onClick={() => parent.playGuess('EIGHT')}
                >Eight</button>
                <button
                    disabled={!playable}
                    onClick={() => parent.playGuess('NINE')}
                >Nine</button>
                <button
                    disabled={!playable}
                    onClick={() => parent.playGuess('TEN')}
                >Ten</button>
            </div>
        );
    }
}


exports.WaitingForResults = class extends React.Component {
    render() {
        return (
            <div>
                Waiting for results...
            </div>
        );
    }
}

exports.Done = class extends React.Component {
    render() {
        const { outcome } = this.props; //what means
        return (
            <div>
                Thank you for playing. The outcome of this game was:
                <br />{outcome || 'Unknown'}
            </div>
        );
    }
}

exports.Timeout = class extends React.Component {
    render() {
        return (
            <div>
                There's been a timeout. (Someone took too long.)
            </div>
        );
    }
}

export default exports;