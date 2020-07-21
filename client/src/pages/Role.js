import React, { useState } from 'react'

function Role() {

    const [role, setRole] = useState()
    const [isUpdate, setIsUpdate] = useState(false)



    return (
        <div>
            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0 text-dark">Manajemen Akses</h1>
                            </div>
                            <div className="col-sm-6">
                                <div className="float-sm-right">
                                    <button className="btn btn-sm btn-primary mx-auto" data-toggle="modal" data-target="#roleModal" onClick={() => setIsUpdate(false)}>Tambah Akses</button>
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
                                            <td>Role</td>
                                            <td>Aksi</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* {categoryList.length != 0 ?

                                            categoryList.map((cat, i) => (
                                                <tr key={i} >
                                                    <td>{i + 1}</td>
                                                    <td>{cat.name}</td>
                                                    <td>
                                                        <button className="btn btn-warning btn-sm" data-toggle="modal" data-target="#addModal" onClick={() => editCategory(cat.id)} ><i className="fa fa-edit"></i></button>
                                                        <button className="btn btn-danger btn-sm" onClick={() => deleteCategory(cat.id)} ><i className="fa fa-trash"></i></button>
                                                    </td>
                                                </tr>
                                            ))

                                            : <tr>
                                                <td colSpan="4" className="text-center">Tidak ada data</td>
                                            </tr>} */}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* modal */}
            <div className="modal" id="roleModal" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Tambah Akses</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="col-md-12">
                                {/* <form role="form">
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
                                </form> */}
                            </div>
                        </div>
                        <div className="modal-footer">
                            {!isUpdate ?
                                <button type="button" className="btn btn-primary" >Simpan</button>
                                :
                                <button type="button" className="btn btn-primary" >Update</button>
                            }
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Role
