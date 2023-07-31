const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server'); // Assuming your server file is named 'server.js'

chai.use(chaiHttp);
const expect = chai.expect;

// Test cases for user functionalities
describe('User Functionality Tests', () => {
  // Store the user ID for testing purposes
  let userId;

  it('Should create a new user account', (done) => {
    chai.request(server)
      .post('/api/user/create')
      .send({ userId: 'user123' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('User account created successfully.');
        userId = 'user123'; // Store the user ID for other test cases
        done();
      });
  });

  it('Should fetch all products and services information with their prices', (done) => {
    chai.request(server)
      .get('/api/products')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('products');
        expect(res.body).to.have.property('services');
        done();
      });
  });

  it('Should add a product or service to the cart', (done) => {
    chai.request(server)
      .post('/api/user/cart/add')
      .send({ userId, itemId: 1, quantity: 2 }) // Assuming item with ID 1 is added to the cart
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Item added to the cart successfully.');
        done();
      });
  });

  it('Should view the total bill during checkout', (done) => {
    chai.request(server)
      .get('/api/user/cart/totalBill')
      .query({ userId })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('cartItems');
        expect(res.body).to.have.property('totalBill');
        expect(res.body.cartItems).to.be.an('array');
        expect(res.body.totalBill).to.be.a('number');
        done();
      });
  });

  it('Should remove a product or service from the cart', (done) => {
    chai.request(server)
      .post('/api/user/cart/remove')
      .send({ userId, itemId: 1 }) // Assuming item with ID 1 is removed from the cart
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Item removed from the cart successfully.');
        done();
      });
  });

  it('Should clear the cart', (done) => {
    chai.request(server)
      .post('/api/user/cart/clear')
      .send({ userId })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Cart cleared successfully.');
        done();
      });
  });

  it('Should confirm the order', (done) => {
    chai.request(server)
      .post('/api/user/cart/confirmOrder')
      .send({ userId })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Order confirmed successfully.');
        done();
      });
  });
});

// Test cases for admin functionalities
describe('Admin Functionality Tests', () => {
  it('Should fetch all orders made by users', (done) => {
    chai.request(server)
      .get('/api/admin/orders')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('orders');
        expect(res.body.orders).to.be.an('array');
        done();
      });
  });
});
