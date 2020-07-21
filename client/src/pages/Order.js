import React, { useState, useEffect, useRef } from 'react'
import { BASE_URL, $ } from '../Constant'
import axios from 'axios'

function Order() {

    const [porductList, setProductList] = useState([])
    const [productId, setProductId] = useState(0)
    const [product, setProduct] = useState(null)
    const [shoppingCart, setShoppingCart] = useState([])
    const [submitChart, setSubmitChart] = useState(false)

    //step 2
    const [formCustomer, setFormCustomer] = useState(false)
    const [resultStatus, setResultStatus] = useState(false)

    const qtyELRef = useRef(1)
    const customerEmailElRef = useRef('')

    const [customer, setCustomer] = useState(null)

    const nameElRef = useRef()
    const adderssElRef = useRef()
    const phoneElRef = useRef()

    const searchCustomer = async () => {
        try {
            let endpoint = `${BASE_URL}/customer/search`
            let email = { email: customerEmailElRef.current.value }
            let response = await axios.post(endpoint, email)

            if (response.status === 200 || response.data.status == 'success') {
                // console.log(data)
                setCustomer(response.data.data)
                // adderssElRef.current.value = data.address
                // phoneElRef.current.value = +data.phone
                // setCustomer(response.data.data)
                setResultStatus(true)
            }
            setFormCustomer(true)
        } catch (error) {
            console.log(error)
        }
    }

    const sendOrder = async () => {
        if (customer.email != '' && customer.name != '' && customer.phone != '' && customer.address != '') {
            let result = window.confirm("Yakin lanjutkan?")
            if (result) {
                let endpoint = `${BASE_URL}/checkout`;
                let response = await axios.post(endpoint, customer)

                if (response.status == 200) {
                    getCart()
                    setCustomer(null)
                }
            }
        } else {
            alert('semua inputan tidak boleh kosong');
        }
    }

    const getCart = async () => {
        try {
            let endpoint = `${BASE_URL}/cart`

            let response = await axios.get(endpoint)

            if (response.status === 200) {
                console.log(response.data)
            }

        } catch (error) {
            console.log(error)
        }
    }

    const addToChart = async () => {

        let chart = { product_id: productId, qty: qtyELRef.current.value }

        console.log(chart)
        try {
            let endpoint = `${BASE_URL}/cart`
            let response = await axios.post(endpoint, chart)

            if (response.status === 200) {

                let data = response.data
                let value = Object.values(data)
                setShoppingCart(old => [...old, value[0]])
                // console.log(value)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const removeChart = async (id) => {
        let result = window.confirm("Hapus?");
        if (result) {
            try {
                let endpoint = `${BASE_URL}/cart/${id}`
                let response = await axios.delete(endpoint)

                if (response.status === 200) {
                    getCart()
                }
            } catch (error) {

            }
        }
    }

    const getProductList = async () => {
        try {
            let endpoint = `${BASE_URL}/order`
            let response = await axios.get(endpoint)

            if (response.status === 200) {
                setProductList(response.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getProduct = async () => {
        try {
            let endpoint = `${BASE_URL}/product/${productId}`
            let response = await axios.get(endpoint)

            if (response.status === 200) {
                setProduct(response.data)
            }
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        qtyELRef.current.value = 1
        getProductList()
        getCart()
        $('#product_id').on('change', () => {
            let val = $('#product_id').val()
            setProductId(+val)
        })
    }, [])

    useEffect(() => {
        getProduct()
    }, [productId])

    return (
        <div>
            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0 text-dark">{submitChart ? 'Checkout' : 'Transaksi'}</h1>
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
                        <div className="col-md-8">
                            <div className="row">
                                {/* kondisi sebelum checkout */}
                                {!submitChart &&
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="product_id">Produk</label>
                                            <select name="product_id" id="product_id" className="form-control" required width="100%">
                                                <option value="">Pilih</option>
                                                {
                                                    porductList.length != 0 && porductList.map((product, index) => (
                                                        <option key={index} value={product.id}>{product.code} - {product.name}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="qty">Qty</label>
                                            <input type="number" name="qty" id="qty" min="1" className="form-control" ref={qtyELRef} />
                                        </div>
                                        <div className="form-group">
                                            <button className="btn btn-primary btn-sm" onClick={() => addToChart()} >
                                                <i className="fa fa-shopping-cart"></i> Ke Keranjang
                                        </button>
                                        </div>
                                    </div>
                                }
                                {!submitChart && <div className="col-md-5">
                                    <h4>Detail Produk</h4>
                                    {product != null &&
                                        <div>
                                            <table className="table table-stripped">
                                                <tbody>
                                                    <tr>
                                                        <th>Kode</th>
                                                        <td>:</td>
                                                        <td>{product.code}</td>
                                                    </tr>
                                                    <tr>
                                                        <th width="3%">Produk</th>
                                                        <td width="2%">:</td>
                                                        <td>{product.name}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Harga</th>
                                                        <td>:</td>
                                                        <td>{product.price}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    }
                                </div>
                                }
                                {/* kondisi sesudah checkout */}
                                {submitChart &&
                                    <div className="col-md-8">
                                        <div className="form-group">
                                            <label htmlFor="email">Email</label>
                                            <input type="text" name="email" id="email" className="form-control" required ref={customerEmailElRef} />
                                            <p>Tekan enter untuk mengecek email.</p>
                                        </div>

                                        {formCustomer &&
                                            <div>
                                                <div className="form-group">
                                                    <label htmlFor="name">Nama Pelanggan</label>
                                                    <input type="text" name="name" id="name" className="form-control" required ref={nameElRef} />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="adderss">Alamat</label>
                                                    <textarea name="address" id="adderss" className="form-control" cols="5" rows="5" required ref={adderssElRef}></textarea>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="phone">No Telp</label>
                                                    <input type="text" name="phone" id="phone" ref={phoneElRef}
                                                        className="form-control" required />
                                                </div>
                                            </div>
                                        }

                                        {customer == null && <button className="btn btn-primary btn-sm float-right" onClick={() => searchCustomer()} >
                                            Check
                                        </button>}
                                        {customer != null && <button className="btn btn-primary btn-sm float-right" onClick={() => sendOrder()} >
                                            Order Now
                                        </button>}
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card text-center">
                                <div className="card-header">
                                    Keranjang
                                </div>
                                <div className="card-body">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Produk</th>
                                                <th>Harga</th>
                                                <th>Qty</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {shoppingCart.length != 0 && shoppingCart.map((item, index) => (
                                                <tr key={index} >
                                                    <td>{item.name} - {item.code}</td>
                                                    <td>{item.price}</td>
                                                    <td>{item.qty}</td>
                                                    <td>
                                                        <button
                                                            onClick={() => removeChart(item.id)}
                                                            className="btn btn-danger btn-sm">
                                                            <i className="fa fa-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="card-footer">


                                    {shoppingCart.length != 0 ?
                                        !submitChart ?
                                            <button onClick={() => setSubmitChart(true)} className="btn btn-success btn-sm float-right">Checkout</button>
                                            :
                                            <button onClick={() => setSubmitChart(false)} className="btn btn-success btn-sm float-right">Kembali</button>
                                        : ''
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Order
