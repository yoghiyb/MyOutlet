import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BASE_URL, $ } from '../Constant.js'
import axios from 'axios'

function Product() {

    const [products, setProducts] = useState([])

    const getProducts = async () => {
        try {
            let endpoint = `${BASE_URL}/product`
            let response = await axios.get(endpoint)

            if (response.status === 200) {
                setProducts(response.data.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const deleteProduct = async (id) => {
        try {
            let endpoint = `${BASE_URL}/product/${id}`
            let response = await axios.delete(endpoint)

            if (response.status === 200) {
                getProducts()
                alert("data berhasil dihapus")
            }
        } catch (error) {

        }
    }

    useEffect(() => {
        getProducts()
    }, [])

    const prettyDate = (date) => {
        return `${date.split("T")[0]}`
    }

    return (
        <div>
            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0 text-dark">Manajemen Produk</h1>
                            </div>
                            <div className="col-sm-6">
                                <div className="float-sm-right">
                                    <Link to={`/product/add`} className="btn btn-sm btn-primary mx-auto">Tambah Produk</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12 ">
                            <div className="table-responsive mt-3">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Nama Produk</th>
                                            <th>Stok</th>
                                            <th>Harga</th>
                                            <th>Kategori</th>
                                            <th>Last Update</th>
                                            <th>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.length != 0 ?

                                            products.map((product, i) => (
                                                <tr key={i} >
                                                    <td>{i + 1}</td>
                                                    <td>{product.name}</td>
                                                    <td>{product.stock}</td>
                                                    <td>{product.price}</td>
                                                    <td>{product.category.name}</td>
                                                    <td>{prettyDate(product.updated_at)}</td>
                                                    <td>
                                                        <Link className="btn btn-warning btn-sm" to={`/product/${product.id}`} ><i className="fa fa-edit"></i></Link>
                                                        <button className="btn btn-danger btn-sm" onClick={() => deleteProduct(product.id)} ><i className="fa fa-trash"></i></button>
                                                    </td>
                                                </tr>
                                            ))

                                            : <tr>
                                                <td colSpan="4" className="text-center">Tidak ada data</td>
                                            </tr>}

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Product
