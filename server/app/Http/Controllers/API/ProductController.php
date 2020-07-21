<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Category;
use App\Product;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;
use Intervention\Image\Facades\Image;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('category')->orderBy('created_at', 'DESC')->paginate(10);
        return response()->json($products, 200);
    }

    public function store(Request $request)
    {
        //validasi data
        $validator = Validator::make($request->all(), [

            'code' => 'required|string|max:10|unique:products',
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|max:100',
            'stock' => 'required|integer',
            'price' => 'required|integer',
            'category_id' => 'required|exists:categories,id',
            'photo' => 'nullable|image|mimes:jpg,png,jpeg'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->toJson(), 400);
        }

        try {
            //default $photo = null
            $photo = null;
            //jika terdapat file (Foto / Gambar) yang dikirim
            if ($request->hasFile('photo')) {
                //maka menjalankan method saveFile()
                $photo = $this->saveFile($request->name, $request->file('photo'));
            }


            //Simpan data ke dalam table products
            $product = Product::create([
                'code' => $request->code,
                'name' => $request->name,
                'description' => $request->description,
                'stock' => $request->stock,
                'price' => $request->price,
                'category_id' => $request->category_id,
                'photo' => $photo
            ]);

            // jika berhasil ditambahkan
            return response()->json(['success' => $product->name . ' Ditambahkan'], 200);
        } catch (\Exception $e) {
            //jika gagal beri pesan error
            return response()->json(['error' => $e->getMessage()]);
        }
    }

    private function saveFile($name, $photo)
    {
        //set nama file adalah gabungan antara nama produk dan time(). Ekstensi gambar tetap dipertahankan
        $images = Str::slug($name) . time() . '.' . $photo->getClientOriginalExtension();
        //set path untuk menyimpan gambar
        $path = public_path('uploads/product');
        //cek jika uploads/product bukan direktori / folder
        if (!File::isDirectory($path)) {
            //maka folder tersebut dibuat
            File::makeDirectory($path, 0777, true, true);
        }
        //simpan gambar yang diuplaod ke folrder uploads/produk
        Image::make($photo)->save($path . '/' . $images);
        //mengembalikan nama file yang ditampung divariable $images
        return $images;
    }

    public function destroy($id)
    {
        //query select berdasarkan id
        $products = Product::findOrFail($id);
        //mengecek, jika field photo tidak null / kosong
        if (!empty($products->photo)) {
            //file akan dihapus dari folder uploads/produk
            File::delete(public_path('uploads/product/' . $products->photo));
        }
        //hapus data dari table
        $products->delete();

        return response()->json(['success' => $products->name . 'Telah Dihapus!']);
    }

    public function edit($id)
    {
        try {
            //query select berdasarkan id
            $product = Product::findOrFail($id);
            $categories = Category::orderBy('name', 'ASC')->get();
        } catch (\Exception $e) {
            return response()->json(['error' => 'Data tidak ditemukan!']);
        }
        return response()->json(compact('product', 'categories'), 200);
    }

    public function update(Request $request, $id)
    {
        //validasi
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|max:10|exists:products,code',
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|max:100',
            'stock' => 'required|integer',
            'price' => 'required|integer',
            'category_id' => 'required|exists:categories,id',
            'photo' => 'nullable|image|mimes:jpg,png,jpeg'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->toJson(), 400);
        }

        try {
            //query select berdasarkan id
            $product = Product::findOrFail($id);
            $photo = $product->photo;


            //cek jika ada file yang dikirim dari form
            if ($request->hasFile('photo')) {
                //cek, jika photo tidak kosong maka file yang ada di folder uploads/product akan dihapus
                !empty($photo) ? File::delete(public_path('uploads/product/' . $photo)) : null;
                //uploading file dengan menggunakan method saveFile() yg telah dibuat sebelumnya
                $photo = $this->saveFile($request->name, $request->file('photo'));
            }


            //perbaharui data di database
            $product->update([
                'name' => $request->name,
                'description' => $request->description,
                'stock' => $request->stock,
                'price' => $request->price,
                'category_id' => $request->category_id,
                'photo' => $photo
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()]);
        }

        return response()->json(['success' => 'Diperbaharui'], 200);
    }
}
