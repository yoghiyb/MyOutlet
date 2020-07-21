<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Validator;

class RoleController extends Controller
{
    public function index()
    {
        $role = Role::orderBy('created_at', 'DESC')->paginate(10);
        return response()->json($role, 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make(request()->all(), [
            'name' => 'required|string|max:50'
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors()->toJson(), 400);
        }
        $role = Role::firstOrCreate(['name' => $request->name]);
        return response()->json(['success' => $role->name . ' Ditambahkan!']);
    }

    public function destroy($id)
    {
        try {
            $role = Role::findOrFail($id);
            $role->delete();
        } catch (\Throwable $th) {
            return response()->json(['error' => 'Gagal menghapus data']);
        }
        return response()->json(['success' => $role->name . ' Dihapus']);
    }
}
