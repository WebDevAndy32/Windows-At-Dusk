
class App extends React.Component{
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
      return tempState;  
    }
    //set the initial state with above function

    this.state = {
      maxDim: 5,
      threeDim: stateBuilder(3),
      fiveDim: stateBuilder(5),
      sevenDim: stateBuilder(7)
    }
    //console.log('initial app states: ', this.state);

    //three interchanging pre-made states stored in threeDim, fiveDim, sevenDim, change to maxDim pushes state down to lightbox.
    // state stores only active buttons and they are pushed from their value when de-activated. win criteria is a blank array in activeSquares state


    this.menuHandler = this.menuHandler.bind(this);
    this.menuBuilder = this.menuBuilder.bind(this);
    this.sendGridSquareSize = this.sendGridSquareSize.bind(this);
    this.changeDimension = this.changeDimension.bind(this);
    this.selectPattern = this.selectPattern.bind(this);
  }

  menuHandler = () => {
    document.getElementById('menu-icon').classList.toggle('menu-toggle-on');
    
    let menu = document.getElementById('menu');
    let blankSpace = document.getElementById('blankSpace');
    if(menu.style.display === 'flex'){
      menu.style.display = 'none';
      blankSpace.style.display = 'none';
    }else{
      menu.style.display = 'flex';
      blankSpace.style.display = 'flex';
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
    //conditional prevents a misclick from breaking the app
    if(event.target.value !== undefined){
      let newNumber = parseInt(event.target.value, 10);
      this.setState({
        maxDim: newNumber
      });
    } 
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
      
    return(
      <div id='container-pre-render'>
        <header>
          <h1>Windows At Dusk</h1>
          <h2>Help turn off all the lights</h2>
          {this.menuBuilder()}
        </header>
        { this.state.maxDim === 7 ? <LightBox maxDim={this.state.maxDim} 
                                      gridKeys={this.state.sevenDim} 
                                      changeDimension={this.changeDimension} /> :
            this.state.maxDim === 3 ? <LightBox maxDim={this.state.maxDim} 
                                        gridKeys={this.state.threeDim} 
                                        changeDimension={this.changeDimension} /> :
                                        <LightBox maxDim={this.state.maxDim} 
                                          gridKeys={this.state.fiveDim} 
                                          changeDimension={this.changeDimension} /> 
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

    this.state = {
      winner: 'no',
      dimTemplate: {},
      activeSquares: []
    }

    this.boxBuilder = this.boxBuilder.bind(this);
    this.checkForWin = this.checkForWin.bind(this);
    this.findAdjacent = this.findAdjacent.bind(this);
    this.clickSquare = this.clickSquare.bind(this);
    this.reset = this.reset.bind(this);
    this.clickOut = this.clickOut.bind(this);

  }

  //uses state keys to make the square grids  
  boxBuilder = () => {
    //console.log('stateKeys: ', stateKeys);    
    let stateKeys = Object.keys(this.state.dimTemplate);
    let squareStates = stateKeys.filter(key => {
      return key !== 'winner';
    });

    let elementArray = squareStates.map(key => {  

      return (
        <div id={key} key={key} 
          className='square-front'
          style={{gridRow: key[2], gridColumn: key[0]}} 
          onClick={this.clickSquare}>
          <div className={this.state.activeSquares.indexOf(key) !== -1 ? 'light-square-on' : 'light-square-off'} >
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

/*clicking square changes activeSquare state to have it's id or not. Tetr Cond. in boxBuilder checks index of activeSquare state to turn square off or on*/
clickSquare = (event) => {
  let squareArray = this.findAdjacent(event.currentTarget.id);
  let aSqr = this.state.activeSquares;

  squareArray.forEach(currentSquare => {
    if(aSqr.indexOf(currentSquare) == -1){
      aSqr.push(currentSquare);
    }else{
      aSqr.splice(aSqr.indexOf(currentSquare), 1);
    }
  });

  this.setState({
    activeSquares: aSqr 
  });
  
}

  reset = () => {
    //setstate to default
    //console.log('RESETTING!');
    let stateKeys = Object.keys(this.state.dimTemplate);
    let squareStates = stateKeys.filter(key => {
      return key !== 'winner';
    });

    this.setState({
      activeSquares: squareStates,
      winner: 'no'
    });

  }
  
  clickOut = () => {
    let menu = document.getElementById('menu');
    let blankSpace = document.getElementById('blankSpace');
    
    menu.style.display = 'none';
    blankSpace.style.display = 'none';
  }
  
  checkForWin = () => {
    let stateValues = this.state.activeSquares;
    /* ***without state.winner added conditional, this infinite loops on win*** */
    if(stateValues.length == 0 && this.state.winner == 'no'){
      this.setState({
          winner: 'yes'
        });
    }
  }

  componentDidMount(){
    this.setState({
      dimTemplate: this.props.gridKeys,
      activeSquares: Object.keys(this.props.gridKeys)
    });
  }

  componentDidUpdate(prevProps){
    this.checkForWin();
    //pulls changed dimension values from parent state, pushes them to local state and component re-renders
    if(prevProps.maxDim !== this.props.maxDim){
      this.setState({
         dimTemplate: this.props.gridKeys,
          activeSquares: Object.keys(this.props.gridKeys)
      });
      //updates grid in scss
      const cssRootVariables = document.querySelector(':root').style;
      cssRootVariables.setProperty('--max-dimension', this.props.maxDim);
    }

  }

  render(){

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
      <div id='blankSpace' onClick={this.clickOut}/>
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
        {/*<div onClick={this.selectPattern}>Select Starting Pattern</div>*/}
      </div>
    );

    return(
      <div id='light-square-container'>
          {this.boxBuilder()}
          {blankSpace}
          {menu}
          {this.state.winner == 'yes' ? winningScreen : blankSpace }
        </div> 
    );
  }
}
ReactDOM.render(React.createElement(App), document.getElementById('react-container'));
