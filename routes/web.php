<?php

use Illuminate\Support\Facades\Route;
    
Route::get('/', function () {
    // حددنا المسار ليدخل جوا مجلد front بعدين يفتح index.html
    $path = public_path('index.html');

    if (file_exists($path)) {
        return file_get_contents($path);
    }

    return "تأكدي إن ملف index.html موجود داخل مجلد public/front";
});
