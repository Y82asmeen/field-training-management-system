<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\SupervisorController;
use App\Http\Controllers\TrainingCompanyController;
use App\Http\Controllers\TrainingRequestController;
use App\Http\Controllers\TrainingReportController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\UserController;



Route::apiResource('students', StudentController::class);
Route::apiResource('supervisors', SupervisorController::class);
Route::apiResource('companies', TrainingCompanyController::class);
Route::apiResource('training-requests', TrainingRequestController::class);
Route::apiResource('training-reports', TrainingReportController::class);
Route::apiResource('notifications', NotificationController::class);
Route::apiResource('users', UserController::class);
