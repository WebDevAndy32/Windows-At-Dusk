
class App extends React.Component{
  constructor(props){
    super(props);
    const maxDim = 5;
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
      //onsole.log('tempState @ l-25: ', tempState);
      tempState['winner'] = 'no';
      return tempState;  
    }
    //attempting to dynamically set the initial state with above function
    this.state = stateBuilder(maxDim);
    //console.log('this state @ l-30: ', this.state);
    this.clickSquare = this.clickSquare.bind(this);
    this.menuHandler = this.menuHandler.bind(this);
    this.menuBuilder = this.menuBuilder.bind(this);
    this.boxBuilder = this.boxBuilder.bind(this);
    this.findAdjacent = this.findAdjacent.bind(this);
    this.checkForWin = this.checkForWin.bind(this);
    this.sendGridSquareSize = this.sendGridSquareSize.bind(this);
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

  findAdjacent = (keyValue) => {
    let adjSquares = [];
    const xCoord = parseInt(keyValue[0]),
          yCoord = parseInt(keyValue[2]);
    
    for(var i = -1; i <= 1; i++){
      let newX = xCoord + i, newY = yCoord + i;
      //conditionals filter out new squares that are outside the boundaries / don't exist
      //******change 5 to maxdim at some point
      if(newX >= 1 && newX <= 5){
        adjSquares.push('' + newX + '-' + yCoord + '');
      } 
      if(newY >= 1 && newY <= 5){
        adjSquares.push('' + xCoord + '-' + newY + '');
      } 
    }

    let result = adjSquares.filter(x => {
      return x !== keyValue;
    });
   	result.push(keyValue);
    return result;
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
  
  sendGridSquareSize = () => {
    let width = window.innerWidth;
    let height = window.innerHeight;
    const cssRootVariables = document.querySelector(':root').style;
   //
    cssRootVariables.setProperty('--square-grid-value', 
                                   width < height ? '98vw' : '98vh'
                                );
    
    
    /*let squareSize = document.getElementById('1-1').clientWidth;
    let tanVal = Math.tan(45 * Math.PI / 180);
    //cutoff is the height change from skewing before and after elements so the top can be adjusted by that much
    let cutoff = Math.floor((squareSize * .15) * tanVal);
    cssRootVariables.setProperty('--tan-size-cutoff', cutoff + 'px');*/

  }
  componentDidMount(){
    this.sendGridSquareSize();
  }
  componentDidUpdate(){
    this.checkForWin();
  }
  
  render(){
    const winningScreen = (
      <div id='winningScreen'>
       <h1>Congratulations!</h1>
       <hr />
       <h2>You won the game!</h2>
      </div>
    );
    const blankSpace = (
      <div id='blankSpace' />
    );
    const menu = (
      <div id='menu'>
        <div>Reset</div>
        <div>Change Dimension</div>
        <div>Random Pattern</div>
      </div>
    );
      
    return(
      <div>
        <header>
          <h1>Windows At Dusk</h1>
          <h2>Help turn off all the lights</h2>
          {this.menuBuilder()}
        </header>
        <div id='light-square-container'>
          {this.boxBuilder()}
          {menu}
          {this.state.winner == 'yes' ? winningScreen : blankSpace }
        </div>
      </div>
    );
  }
}

ReactDOM.render(React.createElement(App), document.getElementById('react-container'));
