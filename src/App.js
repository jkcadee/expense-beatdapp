import React, { Component } from 'react';
import './App.css';

class ExpenseDeleter extends Component {
  constructor(props) {
    super(props);
      this.deleteID = React.createRef();

      this.deletingElements = this.deletingElements.bind(this);
  }

  deletingElements(event) {
    event.preventDefault();
    let self = this;

    fetch('/express_backend', {
      method: 'DELETE',
      body: JSON.stringify({
        id: self.deleteID.current.value
      }),
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    }).then(res => res.json())
    .then(function(body) {  
      console.log(body);
    }).catch(function(err) {
      console.error(err);
    });;
  }

  render() {
    return (
      <form onSubmit={this.deletingElements}>
      <label>Input the id of expense you want deleted here.</label>
      <br />
      <input className="Delete" type="text" ref={this.deleteID}/>
      <br />
      <input type="submit" value="Delete"/>
    </form>
  );
    }
}

class ExpenseDisplayer extends Component {
  constructor(props) {
    super(props);
    this.state = {data: []};
  }

  componentDidMount() {
    fetch('/express_backend')
    .then((response)=>response.json())
    .then((foundData) => {
      this.setState({
        data: foundData
      });
    });
  }

  render() {
    let renderedData = this.state.data;
    console.log(this.state);
    return (
      <table id="main-table">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Cost</th>
                  <th>Category</th>
                </tr>
          {renderedData.map(dynData =>
                <tr>
                  <td>{dynData.id}</td>
                  <td>{dynData.name}</td>
                  <td>{dynData.item_cost}</td>
                  <td>{dynData.category}</td>
                </tr>
        )}
        </table>
    );
  }
}

const formInputParsers = {
  cost(input) {
    return parseFloat(input);
  },
};

class ExpenseRecorder extends Component {
  constructor(props) {
    super(props);
    this.state = {userInput: {}};

    this.handleText = this.handleText.bind(this);
    this.handleSubmission = this.handleSubmission.bind(this);

    this.nameField = React.createRef();
    this.costField = React.createRef();
    this.categoryField = React.createRef();  
  }
  
  handleText(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleSubmission(event) {
    event.preventDefault();
    let self = this;

    console.log(self);
    fetch('/express_backend', {
      method: "POST",
      body: JSON.stringify({
        name: self.nameField.current.value,
        cost: self.costField.current.value,
        category: self.categoryField.current.value,   
      }),
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    })
    .then(function(response) {
      return response.json(); 
    }).then(function(body) {  
      console.log(body);
    }).catch(function(err) {
      console.error(err);
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmission}>
        <label className="expenseRecorderLabel">
          Expense Name:
        </label>
        
        <input name="Name" type="text" onChange={this.handleText} ref={this.nameField}/>

        <br />

        <label className="expenseRecorderLabel">
          Expense Cost:
        </label>

        <input name="Cost" type="text" onChange={this.handleText} ref={this.costField}/>
        <br />


        <label className="expenseRecorderLabel">
          Item Category:
        </label>

        <input name="Category" type="text" onChange={this.handleText} ref={this.categoryField}/>
        
        <br />

        <input type="submit" value="Submit"/>
      </form>
    );
  }
}

class App extends Component {
state = {
    data: null
  };

  componentDidMount() {
      // Call our fetch function below once the component mounts
    this.callBackendAPI()
      .then(res => this.setState({ data: res.express }))
      .catch(err => console.log(err));
  }
    // Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from server.js
  callBackendAPI = async () => {
    const response = await fetch('/express_backend');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Expense Tracker</h1>
        </header>
        <div className="App-body">
          <ExpenseRecorder />
          <br />  
        </div>
        <div className="App-display">
        <ExpenseDisplayer /> 
        </div>
        <div className="App-delete">
        <ExpenseDeleter />
        </div>
        <p className="App-intro">{this.state.data}</p>
      </div>
    );
  }
}

export default App;
