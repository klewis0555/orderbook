import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import {DatePicker} from 'reactstrap-date-picker';
import ConfirmationModal from './Confirmation';

export default class OrderModal extends Component {
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
      confirmationModal: false,
    };
  }

  toggleConfirmation = () => {
    this.setState({ confirmationModal: !this.state.confirmationModal });
  }

  handleChange = (e) => {
    let { name, value } = e.target;

    if (e.target.type === "checkbox") {
      value = e.target.checked;
    }

    const activeItem = { ...this.state.activeItem, [name]: value };

    this.setState({ activeItem }, this.disableSaveCheck);
  };

  handleChangeText = (e) => {
    let {name, value } = e.target;

    switch(name) {
      case "name":
        let nameBool = value.length > 120;
        this.setState({ nameInvalid: nameBool});
        break;
      case "symbol":
        let symbolBool = value.length > 10;
        this.setState({ symbolInvalid: symbolBool });
        break;
      default:
        break;
    }

    this.handleChange(e);
  }

  handleChangeNumber = (e) => {
    let {name, value } = e.target;
    switch(name) {
      case "price":
        let priceBool = value <=0 || value >= Math.pow(10, 6) || (value.split('.')[1] && value.split('.')[1].length > 4);
        this.setState({ priceInvalid: priceBool }, this.checkValueShareRelation);
        break;
      case "shares":
        let sharesBool = value <=0 || value >= Math.pow(10, 9) || (value.split('.')[1] && value.split('.')[1].length > 6);
        this.setState({ sharesInvalid: sharesBool }, this.checkValueShareRelation);
        break;
      case "value":
        let valueBool = value <=0 || value >= Math.pow(10, 15) || (value.split('.')[1] && value.split('.')[1].length > 10);
        this.setState({ valueInvalid: valueBool }, this.checkValueShareRelation);
        break;
      default:
        break;
    }

    this.handleChange(e);
  }

  handleChangeDate = (e) => {
    let mockEvent = {
      "target": {
        "name": "exp_date",
        "value": e
      }
    }

    this.handleChange(mockEvent);
  }

  handleAmountToggle = (e) => {
    let { name, value } = e.target;

    value = e.target.checked;
    if (name === "amount-toggle-share") {
      value = e.target.checked;
    }
    else {
      value = !e.target.checked;
    }

    this.setState({ useShares: value }, this.checkValueShareRelation);
  }

  disableSaveCheck = () => {
    let disabled = false;

    if (
      !this.state.activeItem.name || this.state.nameInvalid ||
      !this.state.activeItem.symbol || this.state.symbolInvalid ||
      (!this.state.activeItem.gtc && !this.state.activeItem.exp_date) ||
      !this.state.activeItem.price || this.state.priceInvalid ||
      (this.state.useShares && (!this.state.activeItem.shares || this.state.sharesInvalid)) ||
      (!this.state.useShares && (!this.state.activeItem.value || this.state.valueInvalid)) ||
      this.state.relationInvalid
    ) {
      disabled = true
    }
    
    this.setState({ disableSave: disabled });
  }

  checkValueShareRelation = () => {
    let invalidRelation = false;

    if (this.state.useShares) {
      let orderValue = this.state.activeItem.shares * this.state.activeItem.price;
      invalidRelation = orderValue < 0.0000000001 || orderValue >= Math.pow(10, 15); 
    }
    else {
      let orderShares = this.state.activeItem.value / this.state.activeItem.price;
      invalidRelation = orderShares < 0.000001 || orderShares >= Math.pow(10, 9);
    }

    this.setState({ relationInvalid: invalidRelation }, this.disableSaveCheck)
  }


  render() {
    const { toggle, onSave } = this.props;
    let priceInvalidText = "Price must be between 0 and 1,000,000 and have a maximum precision of 4 decimal places.";
    let sharesInvalidText = "Number of shares must be between 0 and 1,000,000,000 and have a maximum precision of 6 decimal places.";
    let valueInvalidText = "Order Value must be between 0 and 1,000,000,000,000,000 and have a maximum precision of 10 decimal places.";
    let shareRelationText = "The order value must be between 0 and 1,000,000,000,000,000.";
    let valueRelationText = "The number of shares must be between 0 and 1,000,000,000."

    return (
      <Modal isOpen={true} toggle={toggle} backdrop='static'>
        <ModalHeader toggle={toggle}>Order</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="order-name">Company Name</Label>
              <Input
                type="text"
                id="order-name"
                name="name"
                invalid={this.state.nameInvalid}
                value={this.state.activeItem.name}
                onChange={this.handleChangeText}
                placeholder="Enter company name"
              />
              <FormFeedback invalid>Name too long.</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="order-symbol">Symbol</Label>
              <Input
                type="text"
                id="order-symbol"
                name="symbol"
                invalid={this.state.symbolInvalid}
                value={this.state.activeItem.symbol}
                onChange={this.handleChangeText}
                placeholder="Enter company symbol"
              />
              <FormFeedback invalid>Symbol must be less than 10 characters.</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="order-side">
                  Action
              </Label>
              <Input
                  type="select"
                  id="order-side"
                  name="side"
                  value={this.state.activeItem.side}
                  onChange={this.handleChange}
                  defaultValue="Sell"
                  placeholder="Buy"
              >
                <option>
                  Buy
                </option>
                <option>
                  Sell
                </option>
              </Input>
            </FormGroup>
            <FormGroup check>
              <Label>
                <Input
                  type="checkbox"
                  name="gtc"
                  checked={this.state.activeItem.gtc}
                  onChange={this.handleChange}
                />
                Good 'Till Canceled
              </Label>
            </FormGroup>
            {this.state.activeItem.gtc ? null : (
              <FormGroup>
                <Label for="order-exp-date">Expiration Date</Label>
                <DatePicker
                  type="date"
                  id="order-exp-date"
                  name="exp_date"
                  minDate={new Date(new Date().setDate(new Date().getDate() + 1)).toJSON()}
                  showClearButton
                  value={this.state.activeItem.exp_date}
                  onChange={this.handleChangeDate}
                />
              </FormGroup>
            )}
            <FormGroup>
              <Label for="order-price">Price</Label>
              <Input
                type="number"
                id="order-price"
                name="price"
                invalid={this.state.priceInvalid}
                value={this.state.activeItem.price}
                onChange={this.handleChangeNumber}
                placeholder="Enter price per share"
              />
              <FormFeedback invalid>{priceInvalidText}</FormFeedback>
            </FormGroup>
            <FormGroup check inline>
              <Label>
                <Input
                  type="checkbox"
                  name="amount-toggle-share"
                  checked={this.state.useShares}
                  onChange={this.handleAmountToggle}
                />
                Use Shares
              </Label>
            </FormGroup>
            <FormGroup check inline>
              <Label>
                <Input
                  type="checkbox"
                  name="amount-toggle-value"
                  checked={!this.state.useShares}
                  onChange={this.handleAmountToggle}
                />
                Use Value
              </Label>
            </FormGroup>
            {this.state.useShares ? (
                <FormGroup>
                    <Label for="order-shares">Shares</Label>
                    <Input
                        type="number"
                        id="order-shares"
                        name="shares"
                        invalid={this.state.sharesInvalid}
                        value={this.state.activeItem.shares}
                        onChange={this.handleChangeNumber}
                        placeholder="Enter number of shares"
                    />
                    <FormFeedback invalid>{sharesInvalidText}</FormFeedback>
                    <Label for="order-shares">
                      Order Value: ${this.state.activeItem.shares * this.state.activeItem.price}
                    </Label>
                </FormGroup>
            ) : (
                <FormGroup>
                    <Label for="order-value">Value</Label>
                    <Input
                        type="number"
                        id="order-value"
                        name="value"
                        invalid={this.state.valueInvalid}
                        value={this.state.activeItem.value}
                        onChange={this.handleChangeNumber}
                        placeholder="Enter order value"
                    />
                    <FormFeedback invalid>{valueInvalidText}</FormFeedback>
                    <Label for="order-value">
                      Number of Shares: {(this.state.activeItem.value / this.state.activeItem.price) || 0}
                    </Label>
                </FormGroup>
            )}
            {this.state.relationInvalid ? (
              <Label for="order-price" style={{color:'red'}}>
                {this.state.useshares ? shareRelationText: valueRelationText}
              </Label>
            ) : null}
          </Form>
          <br />
          <ConfirmationModal
            toggle={this.toggleConfirmation}
            onSave={onSave}
            open={this.state.confirmationModal}
            orderItem={this.state.activeItem}
            useShares={this.state.useShares}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color="success"
            onClick={() => this.toggleConfirmation()}
            disabled={this.state.disableSave}
          >
            Save
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
