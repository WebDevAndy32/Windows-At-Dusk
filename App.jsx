//build base structure - missing menu

//start base functionality - 50%

//Do basic styling - started

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
      return tempState;  
    }
    //attempting to dynamically set the initial state with above function
    this.state = stateBuilder(maxDim);
    //console.log('this state @ l-30: ', this.state);
    this.clickSquare = this.clickSquare.bind(this);
    this.menuBuilder = this.menuBuilder.bind(this);
    this.boxBuilder = this.boxBuilder.bind(this);
    this.findAdjacent = this.findAdjacent.bind(this);
    this.checkForWin = this.checkForWin.bind(this);
  }

  //uses state keys to make the square grids  
  boxBuilder = () => {
    //console.log('boxBuilder called @ l-40');
    let stateKeys = Object.keys(this.state);
    //console.log('stateKeys: ', stateKeys);
    let elementArray = stateKeys.map(key => {
      
      return (
        <div id={key} key={key} 
          className='square-front'
          style={{gridRow: key[2], gridColumn: key[0]}} 
          onClick={this.clickSquare}>
          <div className={this.state[key] === true ? 'light-square-on' : 'light-square-off'} >
            {key}
          </div>
          <div className='square-back' />
        </div>
        
      );
    });
    return elementArray;
  };

  menuBuilder = () => {
    return(
    <div id='menu-icon'>
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
    
    if(stateValues.indexOf(true) == -1){
      console.log('you win!');
    }else{
      console.log('no winner yet');
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
  
  componentDidUpdate(){
    this.checkForWin();
  }
  
  render(
    
  ){
    return(
      <div>
        <header>
          <h1>Windows At Dusk</h1>
          <h2>Help turn off all the lights</h2>
          {this.menuBuilder()}
        </header>
        <div id='light-square-container'>
          {this.boxBuilder()}
        </div>  
      </div>
    );
  }
}

ReactDOM.render(React.createElement(App), document.getElementById('react-container'));
