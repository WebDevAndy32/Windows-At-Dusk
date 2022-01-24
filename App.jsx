//build base structure

//start base functionality

//Do basic styling

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
      console.log('statekeys @ l-19: ', stateKeys);
      let tempState = {};
      
      stateKeys.forEach(squareKey => {
        tempState[squareKey] = true;
      });
      console.log('tempState @ l-25: ', tempState);
      return tempState;  
    }
    //attempting to dynamically set the initial state with above function
    this.state = stateBuilder(5);
    console.log('this state @ l-30: ', this.state);
    this.clickSquare = this.clickSquare.bind(this);
    this.menuBuilder = this.menuBuilder.bind(this);
    this.boxBuilder = this.boxBuilder.bind(this);
  }
  
  
  
  //uses state keys to make the square grids  
  boxBuilder = () => {
    console.log('boxBuilder called @ l-40');
    let stateKeys = Object.keys(this.state);
    console.log('stateKeys: ', stateKeys);
    let elementArray = stateKeys.map(key => {
      return (
        <div id={key} key={key} className='light-square' onClick={this.clickSquare}>
          {key}
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


  clickSquare = (event) => {
    console.log(event.target.id);
  }
  render(
    
  ){
    return(
      <div>
        <header>
          <h1>Windows At Dusk</h1>
          <h2>Help turn off all the lights</h2>
          {this.menuBuilder}
        </header>
        <div id='light-square-container'>
          {this.boxBuilder()}
        </div>  
      </div>
    );
  }
}

ReactDOM.render(React.createElement(App), document.getElementById('react-container'));
