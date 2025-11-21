import React, {useState, useEffect} from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function Admin(){
  const [password, setPassword] = useState('')
  const [files, setFiles] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [products, setProducts] = useState([])
  const [editingProduct, setEditingProduct] = useState(null)
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '' })
  const [media, setMedia] = useState([])

  const headers = { password }

  function handleLogin(e) {
    e.preventDefault();
    axios.get(API + '/api/media', { headers })
      .then(() => {
        setIsLoggedIn(true);
        fetchProducts();
        fetchMedia();
      })
      .catch(() => alert('Invalid password'));
  }

  function handleUpload(e){
    e.preventDefault();
    if(!files) return alert('Choose files first')
    
    setUploading(true);
    const form = new FormData()
    Array.from(files).forEach(f => form.append('files', f))
    
    axios.post(API + '/api/upload', form, { headers })
      .then(r => {
        alert('Upload successful! ' + r.data.files.length + ' files uploaded')
        setFiles(null)
        setUploading(false)
        fetchMedia()
        e.target.reset()
      })
      .catch(err => {
        alert('Upload failed: ' + (err.response?.data?.error || err.message))
        setUploading(false)
      })
  }

  function fetchProducts() {
    axios.get(API + '/api/products')
      .then(r => setProducts(r.data.products))
      .catch(err => console.log('Failed to load products:', err))
  }

  function fetchMedia() {
    axios.get(API + '/api/media')
      .then(r => setMedia(r.data.media))
      .catch(err => console.log('Failed to load media:', err))
  }

  function deleteMedia(filename) {
    if (confirm('Are you sure you want to delete this file?')) {
      axios.delete(API + '/api/uploads/' + filename, { headers })
        .then(() => {
          alert('File deleted successfully!')
          fetchMedia()
        })
        .catch(err => alert('Failed to delete file: ' + (err.response?.data?.error || err.message)))
    }
  }

  function updateProduct(productId, updates) {
    axios.put(API + '/api/products/' + productId, updates, { headers })
      .then(() => {
        alert('Price updated successfully!')
        fetchProducts()
        setEditingProduct(null)
      })
      .catch(err => alert('Update failed: ' + (err.response?.data?.error || err.message)))
  }

  function addProduct() {
    if (!newProduct.name || !newProduct.price) {
      alert('Please enter product name and price')
      return
    }

    axios.post(API + '/api/products', newProduct, { headers })
      .then(() => {
        alert('Product added successfully!')
        setNewProduct({ name: '', price: '', description: '' })
        fetchProducts()
      })
      .catch(err => alert('Failed to add product: ' + (err.response?.data?.error || err.message)))
  }

  function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
      axios.delete(API + '/api/products/' + productId, { headers })
        .then(() => {
          alert('Product deleted successfully!')
          fetchProducts()
        })
        .catch(err => alert('Failed to delete product: ' + (err.response?.data?.error || err.message)))
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="page container">
        <div className="login-container">
          <h2>Admin Login</h2>
          <p>Enter admin password to manage content</p>
          <form onSubmit={handleLogin} className="card">
            <div className="form-group">
              <label>Admin Password:</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="Enter admin password"
                required 
              />
            </div>
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="page container">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <button onClick={() => setIsLoggedIn(false)} className="logout-btn">Logout</button>
      </div>

      {/* Media Upload Section */}
      <div className="card">
        <h3>Upload Timber Images & Videos</h3>
        <p>Upload timber photos, site pictures, or demonstration videos (max 200MB each)</p>
        <form onSubmit={handleUpload}>
          <div className="form-group">
            <label>Select files:</label>
            <input 
              type="file" 
              multiple 
              onChange={e => setFiles(e.target.files)} 
              accept="image/*,video/*"
              disabled={uploading}
            />
          </div>
          <button type="submit" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload Selected Files'}
          </button>
        </form>
      </div>

      {/* Media Management Section */}
      <div className="card">
        <h3>Manage Timber Gallery ({media.length} files)</h3>
        <p>View and delete uploaded timber photos and videos</p>
        
        {media.length === 0 ? (
          <p>No files uploaded yet.</p>
        ) : (
          <div className="gallery-management">
            {media.map((item, index) => (
              <div key={index} className="gallery-management-item">
                {item.type === 'video' ? (
                  <div className="video-management">
                    <video controls width="200">
                      <source src={API + item.url} type="video/mp4" />
                    </video>
                  </div>
                ) : (
                  <img src={API + item.url} alt="Timber gallery" />
                )}
                <div className="media-management-info">
                  <div className="filename">{item.filename}</div>
                  <div className="file-type">{item.type}</div>
                  <button 
                    onClick={() => deleteMedia(item.filename)} 
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Management Section */}
      <div className="card">
        <h3>Manage Product Prices</h3>
        <p>Update prices, add new products, or remove existing ones</p>
        
        <div className="products-management">
          <div className="add-product-form">
            <h4>Add New Product</h4>
            <div className="form-row">
              <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={e => setNewProduct({...newProduct, name: e.target.value})}
              />
              <input
                type="text"
                placeholder="Price (e.g., $15 per meter)"
                value={newProduct.price}
                onChange={e => setNewProduct({...newProduct, price: e.target.value})}
              />
              <input
                type="text"
                placeholder="Description"
                value={newProduct.description}
                onChange={e => setNewProduct({...newProduct, description: e.target.value})}
              />
              <button onClick={addProduct} className="add-btn">Add Product</button>
            </div>
          </div>

          <div className="products-list">
            <h4>Current Products</h4>
            {products.map(product => (
              <div key={product.id} className="product-item">
                {editingProduct === product.id ? (
                  <div className="edit-form">
                    <input
                      type="text"
                      value={product.name}
                      onChange={e => updateProduct(product.id, { name: e.target.value })}
                    />
                    <input
                      type="text"
                      value={product.price}
                      onChange={e => updateProduct(product.id, { price: e.target.value })}
                    />
                    <input
                      type="text"
                      value={product.description}
                      onChange={e => updateProduct(product.id, { description: e.target.value })}
                    />
                    <button onClick={() => setEditingProduct(null)} className="cancel-btn">
                      Done
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="product-info">
                      <strong>{product.name}</strong>
                      <span className="product-price">{product.price}</span>
                      <span className="product-description">{product.description}</span>
                    </div>
                    <div className="product-actions">
                      <button 
                        onClick={() => setEditingProduct(product.id)} 
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => deleteProduct(product.id)} 
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}