import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

export default class Confirmation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: this.props.activeItem,
      useShares: true,
      nameInvalid: false,
      symbolInvalid: false,
      priceInvalid: false,
      sharesInvalid: false,
      valueInvalid: false,
      disableSave: true,
      relationInvalid: false,
    };
  }

  render() {
    const { open, toggle, onSave, orderItem, useShares } = this.props;
    let shares = useShares ? orderItem.shares : orderItem.value / orderItem.price;
    let value = !useShares ? orderItem.value : orderItem.shares * orderItem.price;

    return (
      <Modal isOpen={open} toggle={toggle}>
        <ModalHeader toggle={toggle}>Confirm Order</ModalHeader>
        <ModalBody>
          Company Name: {orderItem.name}
          <br />
          Company Symbol: {orderItem.symbol}
          <br />
          Action: {orderItem.action}
          <br />
          Expiration Date: {orderItem.gtc ? "Good 'Till Canceled" : orderItem.exp_date.split('T')[0]}
          <br />
          Price: ${parseFloat(orderItem.price).toFixed(4)}
          <br />
          Shares: {parseFloat(shares).toFixed(6)}
          <br />
          Order Value: ${value}
        </ModalBody>
        <ModalFooter>
          <Button
            color="success"
            onClick={() => onSave(orderItem)}
          >
            Save
          </Button>
          <Button
            onClick={() => toggle()}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
