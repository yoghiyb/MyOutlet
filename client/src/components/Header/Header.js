import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import './Header.css'

function Header() {
    return (
        <header className="header" >
            <Link to="/" className="header__logo" >
                <h1>MyOutlet</h1>
            </Link>
            <nav className="header__items" >
                <ul>
                    <li>
                        <NavLink to="/order" >Order</NavLink>
                    </li>
                    <li>
                        <NavLink to="/product" >Produk</NavLink>
                    </li>
                    <li>
                        <NavLink to="/category" >Category</NavLink>
                    </li>
                    <li>
                        <NavLink to="/user" >User</NavLink>
                    </li>
                    <li>
                        <NavLink to="/role" >Role</NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Header
