import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import Header from './components/Header/Header';
import Category from './pages/Category';
import Product from './pages/Product';
import ProductDetail from './pages/ProductDetail';
import User from './pages/User';
import Role from './pages/Role';
import Order from './pages/Order';

function App() {
  return (
    <Router>
      <main className="main-content" >
        <Switch>
          <Route path="/category" >
            <Header />
            <Category />
          </Route>
          <Route path="/product/:id" component={ProductDetail}  >
            <Header />
            <ProductDetail />
          </Route>
          <Route path="/product" >
            <Header />
            <Product />
          </Route>
          <Route path="/user" >
            <Header />
            <User />
          </Route>
          <Route path="/role" >
            <Header />
            <Role />
          </Route>
          <Route path="/order" >
            <Header />
            <Order />
          </Route>
          <Route path="/" >
            <Header />
          </Route>
        </Switch>
      </main>
    </Router>
  );
}

export default App;
