import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import Products from './pages/Products'
import Contact from './pages/Contact'
import Admin from './pages/Admin'

export default function App(){
  return (
    <div>
      <Nav />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/products" element={<Products/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/admin" element={<Admin/>} />
      </Routes>
    </div>
  )
}