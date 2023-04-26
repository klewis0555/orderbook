import './App.css';

import React, { Component } from 'react';
import { Button, Card } from 'reactstrap';
import { PencilIcon, TrashIcon } from '@primer/octicons-react';
import axios from 'axios';
import Modal from "./components/Modal";


class App extends Component {
  initialItem = {
    name: "",
    symbol: "",
    side: "Buy",
    gtc: true,
    exp_date: "",
    price: "",
    shares: "",
    value: "",
  }
  state = {
    orderItems: [],
    modal: false,
    activeItem: this.initialItem,
  }

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  handleSubmit = (item) => {
    this.toggle();

    if (item.id) {
      axios.put(`http://localhost:8000/api/orders/${item.id}/`, {
        name: item.name,
        symbol: item.symbol,
        side: item.side.toUpperCase(),
        gtc: item.gtc,
        exp_date: item.gtc ? null : item.exp_date.split('T')[0],
        shares: parseFloat(item.shares || (item.value / item.price)).toPrecision(6),
        price: parseFloat(item.price).toPrecision(4)
      })
      .then(res => this.getOrderList())
      .catch(err => {
        console.log(err)
      });
      return;
    }

    axios.post("http://localhost:8000/api/orders/", {
      name: item.name,
      symbol: item.symbol,
      side: item.side.toUpperCase(),
      gtc: item.gtc,
      exp_date: item.gtc ? null : item.exp_date.split('T')[0],
      shares: parseFloat(item.shares || (item.value / item.price)).toPrecision(6),
      price: parseFloat(item.price).toPrecision(4)
    })
    .then(res => this.getOrderList())
    .catch(err => {
      console.log(err)
    });
  };

  getOrderList = () => {
    axios.get("http://localhost:8000/api/orders/")
    .then(res => {
      this.setState({ orderItems: res.data });
    })
    .catch(err => {
      console.log(err)
    });
  }

  handleDelete = (item) => {
    axios.delete(`http://localhost:8000/api/orders/${item.id}/`)
    .then( res => this.getOrderList())
  };

  createItem = () => {
    this.setState({ activeItem: this.initialItem, modal: !this.state.modal });
  };

  editItem = (item) => {
    item = { ...item, exp_date: `${item.exp_date}T12:00:00.000Z`}
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  componentDidMount() {
    this.getOrderList()
  }

  render() {
    return (
      <div className="App">
        <h1 className="App-header"
          >Order Book
        </h1>
        <Button
          color="primary"
          onClick={this.createItem}
        >
          Add Order
        </Button>
        <Card>
          <table id="orders">
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Symbol</th>
                <th>Action</th>
                <th>Exiration Date</th>
                <th>Price</th>
                <th>Shares</th>
                <th>Order Value</th>
                <th>Edit/Delete</th>
              </tr>
            </thead>
            <tbody>
              {this.state.orderItems.map((val, key) => {
                return (
                  <tr key={key}>
                    <td>{val.name}</td>
                    <td>{val.symbol}</td>
                    <td>{val.side}</td>
                    <td>{val.exp_date || "Good 'Till Canceled"}</td>
                    <td>${val.price}</td>
                    <td>{val.shares}</td>
                    <td>${val.value}</td>
                    <td
                      style={{width: '101px'}}
                    >
                    <Button
                      color="info"
                      onClick={() => this.editItem(val)}
                    >
                      <PencilIcon />
                    </Button>
                    <Button
                      color="danger"
                      onClick={() => this.handleDelete(val)}
                    >
                      <TrashIcon />
                    </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Card>
        {this.state.modal ? (
          <Modal
            activeItem={this.state.activeItem}
            toggle={this.toggle}
            onSave={this.handleSubmit}
          />
        ) : null}
      </div>
    )
  }
}

export default App;
