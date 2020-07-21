import React, { useState, useRef, useEffect } from 'react'
import { BASE_URL, $ } from '../Constant.js'
import axios from 'axios';

function Category() {

    const [addModal, setAddModalStatus] = useState(true)
    const [loading, setLoading] = useState(false)
    const [categoryList, setCategoryList] = useState([])

    const nameElRef = useRef()
    const descElRef = useRef()
    const idElRef = useRef()

    const addCategory = async () => {

        const name = nameElRef.current.value
        const desc = descElRef.current.value

        if (name.trim().length === 0 || desc.trim().length === 0) return

        const body = { name, description: desc }

        try {
            let endpoint = `${BASE_URL}/category`
            let response = await axios.post(endpoint, body)
            if (response.status === 200) {
                getCategory()
                clearForm()
                $('#addModal').modal('hide');
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getCategory = async () => {
        let endpoint = `${BASE_URL}/category`

        try {
            let response = await axios.get(endpoint)
            console.log(response)

            if (response.status == 200) {
                setCategoryList(response.data.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const editCategory = async (id) => {
        setAddModalStatus(false)
        let endpoint = `${BASE_URL}/category/${id}/edit`
        let response = await axios.get(endpoint)
        // console.log(response.data)
        nameElRef.current.value = response.data.name
        descElRef.current.value = response.data.description
        idElRef.current.value = response.data.id
    }

    const updateCategory = async () => {

        try {
            const name = nameElRef.current.value
            const desc = descElRef.current.value
            const id = idElRef.current.value

            if (name.trim().length === 0 || desc.trim().length === 0) return

            const body = { name, description: desc }

            console.log(body)

            let endpoint = `${BASE_URL}/category/${id}`
            let response = await axios.patch(endpoint, body)

            if (response.status === 200) {
                console.log(response.data.success)
                getCategory()
                clearForm()
                setAddModalStatus(true)
                $('#addModal').modal('hide');
            }
        } catch (error) {
            console.log(error)
        }
    }

    const deleteCategory = async (id) => {
        let result = window.confirm("Hapus data?")
        if (result) {
            let endpoint = `${BASE_URL}/category/${id}`
            let response = await axios.delete(endpoint)

            if (response.status === 200) {
                getCategory()
                alert('Data berhasil dihapus')
            }
        }
    }

    const clearForm = () => {
        nameElRef.current.value = ''
        descElRef.current.value = ''
        idElRef.current.value = ''
    }

    useEffect(() => {
        setLoading(true)
        getCategory()
        setLoading(false)
    }, [])


    return (
        <div>
            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0 text-dark">Manajemen Kategori</h1>
                            </div>
                            <div className="col-sm-6">
                                <div className="float-sm-right">
                                    <button className="btn btn-sm btn-primary mx-auto" data-toggle="modal" data-target="#addModal" onClick={() => setAddModalStatus(true)} >Tambah</button>
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
                                            <td>#</td>
                                            <td>Kategori</td>
                                            <td>Deskripsi</td>
                                            <td>Aksi</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categoryList.length != 0 ?

                                            categoryList.map((cat, i) => (
                                                <tr key={i} >
                                                    <td>{i + 1}</td>
                                                    <td>{cat.name}</td>
                                                    <td>{cat.description}</td>
                                                    <td>
                                                        <button className="btn btn-warning btn-sm" data-toggle="modal" data-target="#addModal" onClick={() => editCategory(cat.id)} ><i className="fa fa-edit"></i></button>
                                                        <button className="btn btn-danger btn-sm" onClick={() => deleteCategory(cat.id)} ><i className="fa fa-trash"></i></button>
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

            {/* Modal */}
            <div className="modal" id="addModal" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            {addModal ?
                                <h5 className="modal-title">Tambah Kategori</h5>
                                :
                                <h5 className="modal-title">Update Kategori</h5>
                            }
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="col-md-12">
                                <form role="form">
                                    {!addModal && <input type="hidden" id="id" ref={idElRef} />}
                                    <div className="form-group">
                                        <label htmlFor="name">Kategori</label>
                                        <input type="text"
                                            name="name"
                                            className="form-control " id="name" required ref={nameElRef} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="description">Deskripsi</label>
                                        <textarea name="description" id="description" cols="5" rows="5" className="form-control " ref={descElRef}></textarea>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="modal-footer">
                            {addModal ?
                                <button type="button" className="btn btn-primary" onClick={addCategory}>Simpan</button>
                                :
                                <button type="button" className="btn btn-primary" onClick={updateCategory} >Update</button>
                            }
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Category
