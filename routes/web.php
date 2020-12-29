<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::post('/payment', 'App\Http\Controllers\PaymentController@payment')->name('payment');

Route::any('/{path?}', [
    'uses' => 'App\Http\Controllers\ReactController@show',
    'as' => 'react',
    'where' => ['path' => '.*']
]);

Route::get('/', function () {
    return view('welcome');
});

// Route::any('/paymentstatus', function () {
//     return view('test');
// });

Route::post('/paymentstatus', 'App\Http\Controllers\PaymentController@paymentstatus')->name('paymentstatus');

