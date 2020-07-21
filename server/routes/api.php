<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('register', 'API\UserController@register');
Route::post('login', 'API\UserController@login');
Route::get('book', 'API\TestController@userTest');

Route::resource('category', 'API\CategoryController')->except(['create', 'show']);
Route::get('categories', 'API\CategoryController@categories');
Route::resource('product', 'API\ProductController')->except(['show']);

Route::resource('role', 'API\RoleController')->except([
    'create', 'show', 'edit', 'update'
]);

Route::resource('users', 'API\UserController')->except([
    'show'
]);

Route::post('users/permission', 'API\UserController@addPermission')->name('users.add_permission');
Route::get('users/role-permission', 'API\UserController@rolePermission')->name('users.roles_permission');

Route::get('users/roles/{id}', 'API\UserController@roles')->name('users.roles');

// kasir
Route::get('order', 'API\OrderController@getAllProducts');
Route::get('product/{id}', 'API\OrderController@getProduct');

Route::post('cart', 'API\OrderController@addToCart');
Route::get('cart', 'API\OrderController@getCart');
Route::delete('cart/{id}', 'API\OrderController@removeCart');

Route::post('/customer/search', 'API\CustomerController@search');

Route::post('/checkout', 'API\OrderController@storeOrder')->name('order.storeOrder');

Route::middleware('jwt.verify')->group(function () {
    Route::get('alluser', 'API\TestController@userAuth');
    Route::get('user', 'API\UserController@getAuthenticatedUser');
});
