import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router';
import { BASE_URL, $ } from '../Constant.js'
import { Redirect } from 'react-router-dom'
import axios from 'axios'

function ProductDetail() {

    let { id } = useParams();

    const [categories, setCategories] = useState([])
    const [redirect, setRedirect] = useState(false)

    const codeElRef = useRef()
    const nameElRef = useRef()
    const descElRef = useRef()
    const stockElRef = useRef()
    const priceElRef = useRef()
    const categoryElRef = useRef()


    const getCategory = async () => {
        try {
            let endpoint = `${BASE_URL}/categories`
            let response = await axios.get(endpoint)

            if (response.status === 200) {
                setCategories(response.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const addProduct = async () => {
        const code = codeElRef.current.value
        const name = nameElRef.current.value
        const description = descElRef.current.value
        const stock = +stockElRef.current.value
        const price = +priceElRef.current.value
        const category_id = categoryElRef.current.value

        if (code.trim().length === 0 || name.trim().length === 0 || description.trim().length === 0 || stock <= 0 || price <= 0 || category_id.trim().length === 0) return

        let body = { code, name, description, stock, price, category_id }

        try {
            let endpoint = `${BASE_URL}/product`
            let response = await axios.post(endpoint, body)

            if (response.status === 200) {
                setRedirect(true)
                alert("data berhasil ditambahkan")
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getProductDetail = async () => {
        try {
            let endpoint = `${BASE_URL}/product/${id}/edit`
            let response = await axios.get(endpoint)

            if (response.status === 200) {
                let { product } = response.data
                console.log(response.data)
                codeElRef.current.value = product.code
                nameElRef.current.value = product.name
                descElRef.current.value = product.description
                stockElRef.current.value = +product.stock
                priceElRef.current.value = +product.price
                categoryElRef.current.value = product.category_id
            }
        } catch (error) {
            console.log(error)
        }
    }

    const updateProduct = async () => {
        const code = codeElRef.current.value
        const name = nameElRef.current.value
        const description = descElRef.current.value
        const stock = +stockElRef.current.value
        const price = +priceElRef.current.value
        const category_id = categoryElRef.current.value

        if (code.trim().length === 0 || name.trim().length === 0 || description.trim().length === 0 || stock <= 0 || price <= 0 || category_id.trim().length === 0) return

        let body = { code, name, description, stock, price, category_id }

        console.log(body)

        try {
            let endpoint = `${BASE_URL}/product/${id}`
            let response = await axios.patch(endpoint, body)

            if (response.status === 200) {
                setRedirect(true)
                alert("data berhasil diperbarui")
            }
        } catch (error) {
            console.log(error)
        }
    }

    const deleteProduct = async () => {
        try {
            let endpoint = `${BASE_URL}/product/${id}`
            let response = await axios.delete(endpoint)

            if (response.status === 200) {
                setRedirect(true)
                alert("data berhasil dihapus")
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getCategory()
        if (id != 'add' && id != null) {
            getProductDetail()
        }
    }, [])

    return (
        <div>
            {redirect && <Redirect to="/product" />}
            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                {id === 'add' && <h1 className="m-0 text-dark">Tambah Produk</h1>}
                                {id !== 'add' && <h1 className="m-0 text-dark">Detail Produk</h1>}
                            </div>
                            <div className="col-sm-6">

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12 ">
                            <form>
                                <div className="form-group">
                                    <label htmlFor="">Kode Produk</label>
                                    <input type="text" name="code" id="code" required
                                        maxLength="10"
                                        className="form-control" ref={codeElRef} />
                                    {/* <p className="text-danger">{{ $errors->first('code') }}</p> */}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="name">Nama Produk</label>
                                    <input type="text" name="name" id="name" required
                                        className="form-control " ref={nameElRef} />
                                    {/* <p className="text-danger">{{ $errors->first('name') }}</p> */}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="description">Deskripsi</label>
                                    <textarea name="description" id="description"
                                        cols="5" rows="5"
                                        className="form-control " ref={descElRef} ></textarea>
                                    {/* <p className="text-danger">{{ $errors->first('description') }}</p> */}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="stock">Stok</label>
                                    <input type="number" name="stock" id="stock" required
                                        className="form-control " ref={stockElRef} />
                                    {/* <p className="text-danger">{{ $errors->first('stock') }}</p> */}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="price">Harga</label>
                                    <input type="number" name="price" id="price" required
                                        className="form-control " ref={priceElRef} />
                                    {/* <p className="text-danger">{{ $errors->first('price') }}</p> */}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="category_id">Kategori</label>
                                    <select name="category_id" id="category_id"
                                        required className="form-control " ref={categoryElRef} >
                                        <option value="">Pilih</option>
                                        {
                                            categories.length != 0 ? categories.map((cat, index) => (
                                                <option key={index} value={cat.id} >{cat.name}</option>
                                            ))
                                                : ''
                                        }
                                        {/* <option value="{{ $row->id }}">{{ ucfirst($row->name) }}</option> */}

                                    </select>
                                    {/* <p className="text-danger">{{ $errors->first('category_id') }}</p> */}
                                </div>
                                {/* <div className="form-group">
                                    <label for="">Foto</label>
                                    <input type="file" name="photo" className="form-control">
                                    <p className="text-danger">{{ $errors->first('photo') }}</p>
                                </div> */}
                            </form>
                            <div className="form-group">
                                {id == 'add' ?
                                    <button className="btn btn-primary btn-sm" onClick={() => addProduct()} >
                                        <i className="fa fa-send"></i> Simpan
                                    </button>
                                    : <button className="btn btn-primary btn-sm" onClick={() => updateProduct()} >
                                        <i className="fa fa-send"></i> Perbarui
                                    </button>
                                }
                                {id != 'add' && id != null && <button className="btn btn-danger btn-sm ml-3" onClick={() => deleteProduct()} >
                                    <i className="fa fa-send"></i> Hapus
                                    </button>}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ProductDetail
