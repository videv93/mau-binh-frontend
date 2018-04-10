import React, {Component} from 'react';
import playingCards from './playing-cards.png';
import './App.css';

class App extends Component {
  render() {
    return (
      <Game />
    );
  }
}

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      players : []
    }
  }
  getCard(i) {
    const ranks = [2,3,4,5,6,7,8,9,10,'J', 'Q', 'K', 'A'];
    const suits = ["spade", "clubs", "diamond", "heart"];
    return {rank: ranks[Math.floor(i / 4)], suit: suits[i % 4]};
  }
  update() {
    var cards = [];
    var minimum = 0, maximum = 51;

    for (var i = 0; i < 52; i++) {
      cards[i] = false;
    }
    var players = [];
    for (let i = 0; i < 4; i++) {
      players[i] = [];
    }
    for (var i = 0; i < 52; i++) {
      var rand = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
      while (cards[rand]) {
        rand = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
      }
      cards[rand] = true;
      players[Math.floor(i / 13)][i % 13] = this.getCard(rand);
    }

    this.setState(
      {
        players : players
      }
    )
  }
  render() {
    return (
      <div>
        <button onClick={() => {this.update();}}>Start</button>
        {this.state.players.map((o, i) => (
          <div>
            <Player chi1={o.slice(0,5)} chi2={o.slice(5,10)} chi3={o.slice(10)}/>
          </div>
          )
        )}
      </div>
    )
  }
}


class Player extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div style={{background: 'green'}}>
        <div style={{borderStyle: '5px green'}}>
          {this.props.chi3.map(o => <Card styleName={Card1} rank={o.rank} suit={o.suit}/>)}
        </div>
        <div style={{borderStyle: '5px green'}}>
          {this.props.chi2.map(o => <Card styleName={Card1} rank={o.rank} suit={o.suit}/>)}
        </div>
        <div style={{borderStyle: '5px green'}}>
          {this.props.chi1.map(o => <Card styleName={Card1} rank={o.rank} suit={o.suit}/>)}
        </div>
      </div>

    )
  }
}



class Card extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isSelect: false
    }
  }

  handleClick(rank, suit) {
    this.setState({
      isSelect: !this.state.isSelect
    });
    alert('onClick ' + rank + ' ' + suit);
  }

  render() {
    var imgSrc = require('./png/' + this.props.rank + "_" + this.props.suit + ".png");
    return (
      <span style={{marginLeft: '5px', marginRight: '5px'}}>
        <img src={imgSrc} alt={""} style={{
          height: 'auto',
          width: 'auto',
          maxWidth: '80px',
          maxHeight: '120px',
          border: 'solid 1px red',
          backgroundColor: 'white'}}
          onClick={() => {this.handleClick(this.props.rank, this.props.suit)}}
        />
      </span>
    );
  }
}

/**
 * top right bottom left
 * 0 100 200 300
 * 75 150 225
 *
 * (0 75 100 0), (0 150, 100, 75), (0, 225, 100, 150)
 * (100 75 200 0), (100 150, 200, 75), (100, 225, 200, 150)
 * (200 75 300 0), (200 150, 300, 75), (200, 225, 300, 150)
 * (300 75 400 0), (300 150, 400, 75), (300, 225, 400, 150)
 */
class Card1 extends Component {

  constructor(props) {
    super(props);
    this.width = 952;
    this.height = 396;
    this.ranks = ["A", "K", "Q", "J", 10, 9, 8, 7, 6, 5, 4, 3, 2];
    this.suits = ["clubs", "heart", "spade", "diamond"];
    for (var i = 0; i < this.ranks.length; i++) {
      for (var j = 0; j < this.suits.length; j++) {
        console.log(this.ranks[i] + "_" + this.suits[j]);
      }
    }
    this.arr = [];
    for (var j = 0; j < 4; j++) {
      this.arr[this.suits[j]] = [];
      for (var i = 0; i < 13; i++) {
        this.arr[this.suits[j]][[this.ranks[i]]] = [this.height / 4 * j, this.width / 13 * (i + 1), this.height / 4 * (j + 1), this.width / 13 * i];
      }
    }
    console.log(this.arr);
    console.log(this.arr['spade']['A']);
    console.log(this.width / 13, this.height / 4);
  }

  render() {

    var arr = this.arr[this.props.suit][this.props.rank];
    var clipStr = "rect(" + arr[0] + "px," + arr[1] + "px," + arr[2] + "px," + arr[3] + "px)";
    console.log(clipStr);
    return (
      <div>
        <img style={{position: "absolute", clip: clipStr}} src={playingCards} alt={""} className="home"/>
      </div>
    );
  }
}

export default App;
