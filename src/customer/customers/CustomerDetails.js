import React, { Component, createRef } from "react";
import { withRouter } from "react-router";
import CustomerOrders from "./CustomerOrders";
import { Grid } from "semantic-ui-react";
import ShoppingCart from "./ShoppingCart";
import APIManager from "../../api/APIManager";
import { notify } from "react-notify-toast";
import CustomerListings from "./CustomerListings";
import CustomerProfile from "./CustomerProfile";
import CustomerPayments from "./CustomerPayments";

class CustomerDetails extends Component {
  state = {
    orders: [],
    cart: null,
    paymentOptions: [],
    customer: null,
    paymentTypes: []
  };

  componentDidMount() {
    const { customerId } = this.props.match.params;
    this.fetchAllData(customerId);
  }

  fetchAllData = customerId => {
    APIManager.getOrdersByCustomer(customerId)
      .then(orders => {
        const pastOrders = orders.filter(o => !!o.userPaymentId);
        this.setState({
          orders: pastOrders
        });
      })
      .catch(_err => {
        notify.show("There was an error getting customer data", "error");
      });

    this.getShoppingCart(customerId);
    this.getCustomer(customerId);
    this.getCustomerPaymentOptions(customerId);
    this.getPaymentTypes();
  };

  getCustomerPaymentOptions = customerId => {
    APIManager.getCustomerPaymentTypes(customerId)
      .then(paymentOptions => {
        const options = paymentOptions.map(p => {
          return {
            text: `Card ending in ${p.acctNumber.slice(-4)}`,
            acctNumber: p.acctNumber,
            paymentTypeId: p.paymentTypeId,
            value: p.id
          };
        });
        this.setState({ paymentOptions: options });
      })
      .catch(_err => {
        notify.show(
          "There was an error getting customer payment options",
          "error"
        );
      });
  };

  getShoppingCart = customerId => {
    APIManager.getCustomerShoppingCart(customerId)
      .then(cart => {
        this.setState({ cart });
      })
      .catch(_err => {
        notify.show(
          "There was an error getting the customer's shopping cart",
          "error"
        );
      });
  };

  getCustomer = customerId => {
    APIManager.getDataWithProduct("customers", customerId)
      .then(customer => {
        this.setState({ customer });
      })
      .catch(_err => {
        notify.show("There was an error getting customer data", "error");
      });
  };

  updateCustomer = updated => {
    return APIManager.updateData("customers", updated).then(({ id }) => {
      this.getCustomer(id);
    });
  };

  removeItemFromCart = id => {
    const { customerId } = this.props.match.params;
    APIManager.removeItemFromCart(this.state.cart.id, id).then(() =>
      this.fetchAllData(customerId)
    );
  };

  purchaseCart = userPaymentId => {
    const { id, customerId } = this.state.cart;
    const cart = {
      id,
      customerId,
      userPaymentId
    };
    APIManager.purchaseCart(cart).then(() => {
      this.fetchAllData(customerId);
    });
  };

  addProductToCart = productId => {
    const { customerId } = this.props.match.params;
    return APIManager.addToCart({
      customerId,
      productId
    })
      .then(() => {
        this.getShoppingCart(customerId);
      })
      .catch(_err => {
        notify.show(
          "There was an error adding the product to the cart",
          "error"
        );
      });
  };

  getPaymentTypes = () => {
    APIManager.getAll("paymentTypes")
      .then(paymentTypes => {
        this.setState({ paymentTypes });
      })
      .catch(_err => {
        notify.show("There was an error getting credit card options", "error");
      });
  };

  addCard = c => {
    const { customerId } = this.props.match.params;
    const card = {
      ...c,
      customerId: +customerId
    };
    return APIManager.addData("userPaymentTypes", card)
      .then(() => this.getCustomerPaymentOptions(customerId))
      .catch(_err => {
        notify.show("There was an error saving the card");
      });
  };

  updateCard = c => {
    const { customerId } = this.props.match.params;
    const card = {
      ...c,
      customerId: +customerId
    };
    return APIManager.updateData("userPaymentTypes", card)
      .then(() => this.getCustomerPaymentOptions(customerId))
      .catch(_err => {
        notify.show("There was an error saving the card");
      });
  };

  deleteCard = id => {
    const { customerId } = this.props.match.params;
    return APIManager.deleteData("userPaymentTypes", id)
      .then(() => this.getCustomerPaymentOptions(customerId))
      .catch(_err => {
        notify.show("There was an error removing the card");
      });
  };

  componentDidUpdate(prevProps) {
    const oldId = prevProps.match.params.customerId;
    const newId = this.props.match.params.customerId;
    if (newId !== oldId) this.fetchAllData(newId);
  }

  contextRef = createRef();

  render() {
    return (
      <>
        <h1 className="viewHeader">Customer Details</h1>
        <Grid>
          <Grid.Row columns="equal">
            <Grid.Column width={10}>
              <Grid.Row columns="equal">
                <Grid.Column width={10}>
                  <div className="card-margin">
                    <CustomerOrders
                      className="card-margin"
                      orders={this.state.orders}
                    />
                  </div>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={10}>
                  <div className="card-margin">
                    <ShoppingCart
                      addProduct={this.addProductToCart}
                      cart={this.state.cart}
                      paymentOptions={this.state.paymentOptions}
                      remove={this.removeItemFromCart}
                      purchase={this.purchaseCart}
                    />
                  </div>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={10}>
                  <div className="card-margin">
                    <CustomerListings
                      customerId={this.props.match.params.customerId}
                      onProductAdd={() =>
                        this.getCustomer(this.props.match.params.customerId)
                      }
                      products={
                        this.state.customer ? this.state.customer.products : []
                      }
                    />
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid.Column>
            <Grid.Column>
              {this.state.customer && (
                <>
                  <CustomerProfile
                    onProfileChange={this.updateCustomer}
                    customer={this.state.customer}
                  />
                  <CustomerPayments
                    payments={this.state.paymentOptions}
                    paymentTypes={this.state.paymentTypes}
                    addCard={this.addCard}
                    editCard={this.updateCard}
                    deleteCard={this.deleteCard}
                  />
                </>
              )}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </>
    );
  }
}

export default withRouter(CustomerDetails);
