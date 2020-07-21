<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Category;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::orderBy('created_at', 'DESC')->paginate(10);
        return response()->json($categories, 200);
    }

    public function categories()
    {
        $categories = Category::orderBy('name', 'ASC')->get();
        return response()->json($categories, 200);
    }

    public function store(Request $request)
    {
        //validasi form
        $this->validate($request, [
            'name' => 'required|string|max:50',
            'description' => 'nullable|string'
        ]);

        try {
            $categories = Category::firstOrCreate([
                'name' => $request->name
            ], [
                'description' => $request->description
            ]);
            return response()->json(['success' => 'Kategori: ' . $categories->name . ' Ditambahkan'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        try {
            $categories = Category::findOrFail($id);
            $categories->delete();
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()]);
        }
        return response()->json(['success' => 'Kategori: ' . $categories->name . ' Telah Dihapus'], 200);
    }

    public function edit($id)
    {

        try {
            $categories = Category::findOrFail($id);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Data tidak ditemukan']);
        }

        return response()->json($categories, 200);
    }

    public function update(Request $request, $id)
    {
        //validasi form
        $this->validate($request, [
            'name' => 'required|string|max:50',
            'description' => 'nullable|string'
        ]);

        try {
            //select data berdasarkan id
            $categories = Category::findOrFail($id);
            //update data
            $categories->update([
                'name' => $request->name,
                'description' => $request->description
            ]);
        } catch (\Exception $e) {
            //jika gagal, redirect ke form yang sama lalu membuat flash message error
            return redirect()->back()->with(['error' => $e->getMessage()]);
        }

        return response()->json(['success' => 'Kategori: ' . $categories->name . ' Diperbarui']);
    }
}
