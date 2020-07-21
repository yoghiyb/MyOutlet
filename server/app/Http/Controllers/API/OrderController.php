<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Product;
use App\Order;
use App\Order_detail;
use Cookie;
use DB;
use App\Customer;

class OrderController extends Controller
{
    public function getAllProducts()
    {
        try {
            $products = Product::orderBy('created_at', 'DESC')->get();
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()]);
        }
        return response()->json($products, 200);
    }

    public function getProduct($id)
    {
        try {
            $products = Product::findOrFail($id);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()]);
        }
        return response()->json($products, 200);
    }

    public function addToCart(Request $request)
    {
        //validasi data yang diterima
        //dari ajax request addToCart mengirimkan product_id dan qty
        $this->validate($request, [
            'product_id' => 'required|exists:products,id',
            'qty' => 'required|integer'
        ]);

        //mengambil data product berdasarkan id
        $product = Product::findOrFail($request->product_id);
        //mengambil cookie cart dengan $request->cookie('cart')
        $getCart = json_decode($request->cookie('cart'), true);

        //jika datanya ada
        if ($getCart) {
            //jika key nya exists berdasarkan product_id
            if (array_key_exists($request->product_id, $getCart)) {
                //jumlahkan qty barangnya
                $getCart[$request->product_id]['qty'] += $request->qty;
                //dikirim kembali untuk disimpan ke cookie
                return response()->json($getCart, 200)
                    ->cookie('cart', json_encode($getCart), 120);
            }
        }


        //jika cart kosong, maka tambahkan cart baru
        $getCart[$request->product_id] = [
            'code' => $product->code,
            'name' => $product->name,
            'price' => $product->price,
            'qty' => $request->qty
        ];
        //kirim responsenya kemudian simpan ke cookie
        return response()->json($getCart, 200)
            ->cookie('cart', json_encode($getCart), 120);
    }

    public function getCart()
    {
        //mengambil cart dari cookie
        $cart = json_decode(request()->cookie('cart'), true);
        //mengirimkan kembali dalam bentuk json untuk ditampilkan dengan vuejs
        return response()->json($cart, 200);
    }

    public function removeCart($id)
    {
        $cart = json_decode(request()->cookie('cart'), true);
        //menghapus cart berdasarkan product_id
        unset($cart[$id]);
        //cart diperbaharui
        return response()->json($cart, 200)->cookie('cart', json_encode($cart), 120);
    }

    public function storeOrder(Request $request)
    {
        //validasi
        $this->validate($request, [
            'email' => 'required|email',
            'name' => 'required|string|max:100',
            'address' => 'required',
            'phone' => 'required|numeric'
        ]);
        //mengambil list cart dari cookie
        $cart = json_decode($request->cookie('cart'), true);
        //memanipulasi array untuk menciptakan key baru yakni result dari hasil perkalian price * qty
        $result = collect($cart)->map(function ($value) {
            return [
                'code' => $value['code'],
                'name' => $value['name'],
                'qty' => $value['qty'],
                'price' => $value['price'],
                'result' => $value['price'] * $value['qty']
            ];
        })->all();

        //database transaction
        DB::beginTransaction();
        try {
            //menyimpan data ke table customers
            $customer = Customer::firstOrCreate([
                'email' => $request->email
            ], [
                'name' => $request->name,
                'address' => $request->address,
                'phone' => $request->phone
            ]);
            //menyimpan data ke table orders
            $order = Order::create([
                'invoice' => $this->generateInvoice(),
                'customer_id' => $customer->id,
                'user_id' => auth()->user()->id,
                'total' => array_sum(array_column($result, 'result'))
                //array_sum untuk menjumlahkan value dari result
            ]);
            //looping cart untuk disimpan ke table order_details
            foreach ($result as $key => $row) {
                $order->order_detail()->create([
                    'product_id' => $key,
                    'qty' => $row['qty'],
                    'price' => $row['price']
                ]);
            }
            //apabila tidak terjadi error, penyimpanan diverifikasi
            DB::commit();
            //me-return status dan message berupa code invoice, dan menghapus cookie
            return response()->json([
                'status' => 'success',
                'message' => $order->invoice,
            ], 200)->cookie(Cookie::forget('cart'));
        } catch (\Exception $e) {
            //jika ada error, maka akan dirollback sehingga tidak ada data yang tersimpan
            DB::rollback();
            //pesan gagal akan di-return
            return response()->json([
                'status' => 'failed',
                'message' => $e->getMessage()
            ], 400);
        }
    }
    public function generateInvoice()
    {
        //mengambil data dari table orders
        $order = Order::orderBy('created_at', 'DESC');
        //jika sudah terdapat records
        if ($order->count() > 0) {
            //mengambil data pertama yang sdh dishort DESC
            $order = $order->first();
            //explode invoice untuk mendapatkan angkanya
            $explode = explode('-', $order->invoice);
            //angka dari hasil explode di +1
            return 'INV-' . $explode[1] + 1;
        }
        //jika belum terdapat records maka akan me-return INV-1
        return 'INV-1';
    }
}
