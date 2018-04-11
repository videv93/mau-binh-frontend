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
      cards: [],
      results: [
        "Mậu Thầu", //0
        "Đôi", //1
        "Thú", //2
        "Xám chi", //3
        "Sảnh", //4
        "Thùng", //5
        "Cù lũ", //6
        "Tứ quý", //7
        "Thùng phá sảnh" //8
      ],
      cardResults : [],
      selectIndex: -1
    }
  }
  componentDidMount() {
    this.update();
  }
  getCard(i) {
    const ranks = [2,3,4,5,6,7,8,9,10,'J', 'Q', 'K', 'A'];
    const suits = ["spade", "clubs", "diamond", "heart"];
    return {rank: ranks[Math.floor(i / 4)], suit: suits[i % 4], isSelected: false};
  }
  swap() {
    var tt = this.state.cards;
    var t = tt[0][0];
    tt[0][0] = tt[0][1];
    tt[0][1] = t;
    this.setState(
      {
        tt
      }
    )
  }
  subOne(obj, i) {
    var t;
    for (var key in obj) {
      if (obj.hasOwnProperty(key) && key == i) {
        break;
      } else {
        t = key;
      }
    }
    return t;
  }
  foo(arr) {
    const ranks = [2,3,4,5,6,7,8,9,10,'J', 'Q', 'K', 'A'];
    const suits = ["spade", "clubs", "diamond", "heart"];
    var rankMap = [];
    var suitMap = [];
    for (var i = 0; i < ranks.length; i++) {
      rankMap[ranks[i]] = 0;
    }
    for (var i = 0; i < suits.length; i++) {
      suitMap[suits[i]] = 0;
    }
    for (var i = 0; i < arr.length; i++) {
      var rank = arr[i].rank;
      var suit = arr[i].suit;
      console.log(rank + ' ' + suit);
      rankMap[rank]++;
      suitMap[suit]++;
    }

    var ans = this.state.results[0];
    var has3 = false, has2 = false;
    var straight = 0;
    var thung = false, sanh = false;

    // "Thùng"
    for (var i in suitMap) {
      if (suitMap[i] == arr.length) {
        ans = this.state.results[5];
        thung = true;
        break;
      }
    }
    for (var i in rankMap) {
      // "Sảnh"
      if (rankMap.hasOwnProperty(this.subOne(rankMap, i)) && rankMap[i] > 0 && rankMap[i] == rankMap[this.subOne(rankMap, i)]) {
        ++straight;
        if ((arr.length == 5 && straight == 4)
        || (arr.length == 3 && straight == 2)) {
          sanh = true;
          ans = this.state.results[4];
          break;
        }
      } else {
        straight = 0;
      }

      // calculate "Đôi", "Thú", "Sám chi", "Cù lũ", "Tứ quí"
      if (rankMap[i] > 3) {
        ans = this.state.results[7];
        break;
      } else if (rankMap[i] > 2) {
        if (has2) {
          ans = this.state.results[6];
          break;
        } else {
          has3 = true;
        }
      } else if (rankMap[i] > 1) {
        if (has3) {
          ans = this.state.results[6];
          break;
        } else if (has2) {
          ans = this.state.results[2];
          break;
        } else {
          has2 = true;
        }
      }
    }
    if (thung && sanh) {
      ans = this.state.results[8];
    } else if (ans == this.state.results[0] && has3) {
      ans = this.state.results[3];
    } else if (ans == this.state.results[0] && has2) {
      ans = this.state.results[1];
    }
    return ans;
  }
  calculate(cards) {
    var steps = [[0,5],[5,10],[10,13],[13,18],[18,23],[23,26],[26,31],[31,36],[36,39],[39,44],[44,49],[49,52]];
    var ans = [];
    for (var i = 0; i < 12; i++) {
      var start = steps[i][0];
      var end = steps[i][1];
      ans[i] = this.foo(cards.slice(start, end));
    }
    return ans;
  }
  handleClick(id) {
    // alert('onClick ' + id);
    if (this.state.selectIndex != -1) {
      // alert(this.state.selectIndex);
      var cards = this.state.cards;
      var selectedIdex = this.state.selectIndex;

      var t = cards[selectedIdex];
      cards[selectedIdex] = cards[id];
      cards[id] = t;

      // set selected attribute of selectIndex card to false
      cards[id].isSelected = false;

      // update cards result
      var cardResults = this.calculate(cards);

      this.setState({
        cards: cards,
        cardResults: cardResults,
        selectIndex: -1
      });
    } else {
      // alert('Set slected index to ' + id);
      this.state.cards[id].isSelected = true;
      this.state.selectIndex = id;
      this.forceUpdate();
      /*this.setState({
         cards: cardsUpdate,
         selectIndex: id
      })*/
    }
  }
  update() {
    var cardHolders = [];
    var cards = [];
    var minimum = 0, maximum = 51;

    for (var i = 0; i < 52; i++) {
      cardHolders[i] = false;
    }
    for (var i = 0; i < 52; i++) {
      var rand = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
      while (cardHolders[rand]) {
        rand = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
      }
      cardHolders[rand] = true;
      cards[i] = this.getCard(rand);
    }

    var cardResults = this.calculate(cards);

    this.setState(
      {
        cards : cards,
        cardResults: cardResults
      }
    )
  }
  render() {
    var player1 = {
      chi1: this.state.cards.slice(0,5),
      chi2: this.state.cards.slice(5,10),
      chi3: this.state.cards.slice(10,13),
    };

    var player2 = {
      chi1: this.state.cards.slice(13,18),
      chi2: this.state.cards.slice(18,23),
      chi3: this.state.cards.slice(23,26),
    };

    var player3 = {
      chi1: this.state.cards.slice(26,31),
      chi2: this.state.cards.slice(31,36),
      chi3: this.state.cards.slice(36,39),
    };

    var player4 = {
      chi1: this.state.cards.slice(39,44),
      chi2: this.state.cards.slice(44,49),
      chi3: this.state.cards.slice(49),
    };
    return (
      <div style={{background: 'green'}}>
        <div>
          <button onClick={() => {this.update();}}>Start</button>
          <button onClick={() => {this.swap();}}>Swap</button>
        </div>
        <table style={{width:'100%'}}>
          <tbody>
            <tr>
              <td></td>
              <td>
                <h1>Player 1</h1>
                <div>
                  {player1.chi3.map((o, i) => <Card id={10+i} onClick={() => {this.handleClick(10+i)}} styleName={Card1} rank={o.rank} suit={o.suit} isSelected={o.isSelected}/>)}
                  <div style={{marginLeft: '5px'}}><span style={{color: 'white'}}>{this.state.cardResults[2]}</span></div>
                  </div>
                <div>
                  {player1.chi2.map((o, i) => <Card id={5+i} onClick={() => {this.handleClick(5+i)}} styleName={Card1} rank={o.rank} suit={o.suit} isSelected={o.isSelected}/>)}
                  <div style={{marginLeft: '5px'}}><span style={{color: 'white'}}>{this.state.cardResults[1]}</span></div>
                  </div>
                <div>
                  {player1.chi1.map((o, i) => <Card id={i} onClick={() => {this.handleClick(i)}} styleName={Card1} rank={o.rank} suit={o.suit} isSelected={o.isSelected}/>)}
                  <div style={{marginLeft: '5px'}}><span style={{color: 'white'}}>{this.state.cardResults[0]}</span></div>
                </div>
              </td>
              <td></td>
            </tr>
            <tr>
              <td>
                <h1>Player 2</h1>
                <div>
                  {player2.chi3.map((o, i) => <Card id={23+i} onClick={() => {this.handleClick(23+i)}} styleName={Card1} rank={o.rank} suit={o.suit} isSelected={o.isSelected}/>)}
                  <div style={{marginLeft: '5px'}}><span style={{color: 'white'}}>{this.state.cardResults[5]}</span></div>
                </div>
                <div>
                  {player2.chi2.map((o, i) => <Card id={18+i} onClick={() => {this.handleClick(18+i)}} styleName={Card1} rank={o.rank} suit={o.suit} isSelected={o.isSelected}/>)}
                  <div style={{marginLeft: '5px'}}><span style={{color: 'white'}}>{this.state.cardResults[4]}</span></div>
                  </div>
                <div>
                  {player2.chi1.map((o, i) => <Card id={13+i} onClick={() => {this.handleClick(13+i)}} styleName={Card1} rank={o.rank} suit={o.suit} isSelected={o.isSelected}/>)}
                  <div style={{marginLeft: '5px'}}><span style={{color: 'white'}}>{this.state.cardResults[3]}</span></div>
                  </div>
              </td>
              <td></td>
              <td>
                <h1>Player 3</h1>
                <div>
                  {player3.chi3.map((o, i) => <Card id={36+i} onClick={() => {this.handleClick(36+i)}} styleName={Card1} rank={o.rank} suit={o.suit} isSelected={o.isSelected}/>)}
                  <div style={{marginLeft: '5px'}}><span style={{color: 'white'}}>{this.state.cardResults[8]}</span></div>
                  </div>
                <div>
                  {player3.chi2.map((o, i) => <Card id={31+i} onClick={() => {this.handleClick(31+i)}} styleName={Card1} rank={o.rank} suit={o.suit} isSelected={o.isSelected}/>)}
                  <div style={{marginLeft: '5px'}}><span style={{color: 'white'}}>{this.state.cardResults[7]}</span></div>
                  </div>
                <div>
                  {player3.chi1.map((o, i) => <Card id={26+i} onClick={() => {this.handleClick(26+i)}} styleName={Card1} rank={o.rank} suit={o.suit} isSelected={o.isSelected}/>)}
                  <div style={{marginLeft: '5px'}}><span style={{color: 'white'}}>{this.state.cardResults[6]}</span></div>
                  </div>
              </td>
            </tr>
            <tr>
              <td></td>
              <td>
                <h1>Player 4</h1>
                <div>
                  {player4.chi3.map((o, i) => <Card id={49+i} onClick={() => {this.handleClick(49+i)}} styleName={Card1} rank={o.rank} suit={o.suit} isSelected={o.isSelected}/>)}
                  <div style={{marginLeft: '5px'}}><span style={{color: 'white'}}>{this.state.cardResults[11]}</span></div>
                  </div>
                <div>
                  {player4.chi2.map((o, i) => <Card id={44+i} onClick={() => {this.handleClick(44+i)}} styleName={Card1} rank={o.rank} suit={o.suit} isSelected={o.isSelected}/>)}
                  <div style={{marginLeft: '5px'}}><span style={{color: 'white'}}>{this.state.cardResults[10]}</span></div>
                </div>
                <div>
                  {player4.chi1.map((o, i) => <Card id={39+i} onClick={() => {this.handleClick(39+i)}} styleName={Card1} rank={o.rank} suit={o.suit} isSelected={o.isSelected}/>)}
                  <div style={{marginLeft: '5px'}}><span style={{color: 'white'}}>{this.state.cardResults[9]}</span></div>
                </div>
                </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}



class Card extends Component {

  constructor(props) {
    super(props);
  }

  /**
   *  transform: scale(1.1);
   transition: transform ease 0.25s;
   * @returns {*}
   */
  render() {
    var imgSrc = require('./png/' + this.props.rank + "_" + this.props.suit + ".png");
    if (this.props.isSelected) {
      return (
        <span id={this.props.id} style={{
          marginLeft: '5px',
          marginRight: '5px'
        }}>
          <img src={imgSrc} alt={""} style={{
            height: 'auto',
            width: 'auto',
            maxWidth: '70px',
            maxHeight: '110px',
            border: 'solid 1px red',
            backgroundColor: 'white',
            transform: 'scale(1.25, 1.25)',
            transition: 'transform ease 0.25s'}}
            onClick={() => this.props.onClick(this.props.id)}
          />
        </span>
      );
    }
    return (
      <span id={this.props.id} style={{marginLeft: '5px', marginRight: '5px'}}>
        <img src={imgSrc} alt={""} style={{
          height: 'auto',
          width: 'auto',
          maxWidth: '70px',
          maxHeight: '110px',
          border: 'solid 1px red',
          backgroundColor: 'white'}}
          onClick={() => this.props.onClick(this.props.id)}
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
