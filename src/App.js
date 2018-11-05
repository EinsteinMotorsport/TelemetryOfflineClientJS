import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Panel from './containers/Panel';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = { dingens: 1 };
  }

  componentDidMount() {
    setTimeout(() => this.setState({dingens: 45}), 200);
  }

  render() {
    return (
      <div className="App">
        <Panel dingens={this.state.dingens}></Panel>
      </div>
    );
  }
}

export default App;
