import React from 'react'
import { Link } from 'react-router-dom'

export default function Nav(){
  return (
    <nav className="nav">
      <div className="brand">Woodcourt Timbers</div>
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/products">Products & Prices</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/admin">Admin</Link>
      </div>
    </nav>
  )
}