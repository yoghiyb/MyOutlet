<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;


class TestController extends Controller
{
    public function userTest()
    {
        $data = "Data All User";
        return response()->json($data, 200);
    }

    public function userAuth()
    {
        $data = "Welcome " . Auth::user()->name;
        return response()->json($data, 200);
    }
}
