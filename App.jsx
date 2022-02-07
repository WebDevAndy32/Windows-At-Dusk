
class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      //winner: 'no',
      maxDim: 5
    }

    //console.log('this state @ l-30: ', this.state);

    this.menuHandler = this.menuHandler.bind(this);
    this.menuBuilder = this.menuBuilder.bind(this);
    this.sendGridSquareSize = this.sendGridSquareSize.bind(this);
    this.changeDimension = this.changeDimension.bind(this);
    this.selectPattern = this.selectPattern.bind(this);
  }

  menuHandler = () => {
    document.getElementById('menu-icon').classList.toggle('menu-toggle-on');
    
    let menu = document.getElementById('menu');
    if(menu.style.display === 'flex'){
      menu.style.display = 'none';
    }else{
      menu.style.display = 'flex';
    }
    
  }
  menuBuilder = () => {
    return(
    <div id='menu-icon' className='menu-toggle' onClick={this.menuHandler}>
      <i class="fas fa-bars"></i>
    </div>
    );
  };

  changeDimension = () => {
    console.log('changeDimension Function!', event.target.id, event.target.value);
    let newNumber = parseInt(event.target.value, 10);
    this.setState({
      maxDim: newNumber
    })
  }

  selectPattern = () => {
    console.log('selectPattern Function!');
  }
  
  sendGridSquareSize = () => {
    let width = window.innerWidth;
    let height = window.innerHeight;
    const cssRootVariables = document.querySelector(':root').style;
   //
    cssRootVariables.setProperty('--square-grid-value', 
                                  width < height ? '85vw' : '85vh'
                                );
    cssRootVariables.setProperty('--max-dimension', this.state.maxDim);

  }
  componentDidMount(){
    this.sendGridSquareSize();
  }
  
  render(){
      console.log(this.state);
    return(
      <div id='container-pre-render'>
        <header>
          <h1>Windows At Dusk</h1>
          <h2>Help turn off all the lights</h2>
          {this.menuBuilder()}
        </header>
        { this.state.maxDim === 7 ? <LightBox maxDim={7} changeDimension={this.changeDimension} /> :
            this.state.maxDim === 3 ? <LightBox maxDim={3} changeDimension={this.changeDimension} /> :
              <LightBox maxDim={5} changeDimension={this.changeDimension} /> 
        }
      </div>
    );
  }
}
/*==//==//==//==//==//==//==//==//==//==//==//==//==//==//==*/
/*==//==//==//==//==//==//==//==//==//==//==//==//==//==//==*/
class LightBox extends React.Component{
  constructor(props){
    super(props);
    let stateBuilder = (maxDimension) => {
      let stateKeys = [];
      
      for(var x = 1; x <= maxDimension; x++){
        for(var y = 1; y <= maxDimension; y++){
          stateKeys.push('' + x + '-' + y + '');
        }
      }
      //console.log('statekeys @ l-19: ', stateKeys);
      let tempState = {};
      
      stateKeys.forEach(squareKey => {
        tempState[squareKey] = true;
      });
      //console.log('tempState @ l-25: ', tempState);
      tempState['winner'] = 'no';
      return tempState;  
    }
    //dynamically set the initial state with above function
    this.state = stateBuilder(this.props.maxDim);

    this.boxBuilder = this.boxBuilder.bind(this);
    this.checkForWin = this.checkForWin.bind(this);
    this.findAdjacent = this.findAdjacent.bind(this);
    this.clickSquare = this.clickSquare.bind(this);
    this.reset = this.reset.bind(this);

  }

  //uses state keys to make the square grids  
  boxBuilder = () => {
    //console.log('boxBuilder called @ l-40');
    //console.log('stateKeys: ', stateKeys);    
    let stateKeys = Object.keys(this.state);
    let squareStates = stateKeys.filter(key => {
      return key !== 'winner';
    });
    //console.log('squareState: ', squareStates);
    let elementArray = squareStates.map(key => {  
      return (
        <div id={key} key={key} 
          className='square-front'
          style={{gridRow: key[2], gridColumn: key[0]}} 
          onClick={this.clickSquare}>
          <div className={this.state[key] === true ? 'light-square-on' : 'light-square-off'} >
            {/*{key}*/}
          </div>
          <div className='square-back' />
        </div>
        
      );
    });
    return elementArray;
  };
  
  findAdjacent = (keyValue) => {
    let adjSquares = [];
    const xCoord = parseInt(keyValue[0]),
          yCoord = parseInt(keyValue[2]);
    
    for(var i = -1; i <= 1; i++){
      let newX = xCoord + i, newY = yCoord + i;
      //conditionals filter out new squares that are outside the boundaries / don't exist
      //******change 5 to maxdim at some point
      if(newX >= 1 && newX <= this.props.maxDim){
        adjSquares.push('' + newX + '-' + yCoord + '');
      } 
      if(newY >= 1 && newY <= this.props.maxDim){
        adjSquares.push('' + xCoord + '-' + newY + '');
      } 
    }

    let result = adjSquares.filter(x => {
      return x !== keyValue;
    });
    result.push(keyValue);
    return result;
  }

/*clicking square changes state associate to id of element to false or true, which changes the class of element to "on" or "off"*/
clickSquare = (event) => {
  let squareArray = this.findAdjacent(event.currentTarget.id);

  squareArray.forEach(currentSquare => {
    let stateSwitch = this.state[currentSquare] === true ? false : true;
      this.setState({
        [currentSquare]: stateSwitch
      });
  });
}

  reset = () => {
    //setstate to default
    console.log('RESETTING!');
    let stateKeys = Object.keys(this.state);
    let squareStates = stateKeys.filter(key => {
      return key !== 'winner';
    });
    squareStates.forEach(key => {
      this.setState({
        [key]: true
      });
    });
    this.setState({
      winner: 'no'
    });
    console.log('state: ', this.state);
  }
  
  checkForWin = () => {
    let stateValues = Object.values(this.state);
    /* ***without state.winner added conditional, this infinite loops on win*** */
    if(stateValues.indexOf(true) == -1 && this.state.winner == 'no'){
      this.setState({
          winner: 'yes'
        });
    }
  }

  componentDidUpdate(){
    this.checkForWin();
  }

  render(){
    console.log('light box state: ', this.state);
    const winningScreen = (
      <div id='winningScreen'>
        <h1>Congratulations!</h1>
        <br />
        <h2>You won the game!</h2>
        <br />
        <h3>Press "Reset" in Menu to Play Again</h3>
      </div>
    );
    const blankSpace = (
      <div id='blankSpace' />
    );
    const menu = (
      <div id='menu'>
        <div onClick={this.reset}>Reset</div>
        <div>
          <form onClick={this.props.changeDimension}>
            <field>Change Dimension</field>
            <br/>            
            <label for='three'>3</label>
            <input type='radio' name='dim-select' id='three' value='3' />
            <label for='five'>5</label>
            <input type='radio' name='dim-select' id='five' value='5' />
            <label for='seven'>7</label>
            <input type='radio' name='dim-select' id='seven' value='7' />
          </form>
        </div>
        <div onClick={this.selectPattern}>Select Starting Pattern</div>
      </div>
    );

    return(
      <div id='light-square-container'>
          {this.boxBuilder()}
          {menu}
          {this.state.winner == 'yes' ? winningScreen : blankSpace }
        </div> 
    );
  }
}
ReactDOM.render(React.createElement(App), document.getElementById('react-container'));
