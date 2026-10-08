<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Training_Company;

class TrainingCompanyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
          $companies = Training_Company::with([
        'user:id,name,email',
        'trainingRequests:id,company_id,status'
    ])->paginate(10);

    return response()->json($companies);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
         $request->validate([
            'user_id' => 'required|exists:users,id|unique:training_companies,user_id',
            'company_name' => 'required|string',
            'address' => 'nullable|string',
            'industry' => 'nullable|string',
            'contact_person' => 'nullable|string',
            'contact_phone' => 'nullable|string',
            'contact_email' => 'nullable|email'
        ]);

        $company = Training_Company::create($request->only([
            'user_id','company_name','address','industry',
            'contact_person','contact_phone','contact_email'
        ]));

        return response()->json($company, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
           $company = Training_Company::with('user', 'trainingRequests')->find($id);
        if(!$company){
            return response()->json(['message'=>'Company not found'],404);
        }
        return response()->json($company);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $company = Training_Company::find($id);
        if(!$company){
            return response()->json(['message'=>'Company not found'],404);
        }

        $request->validate([
            'company_name' => 'sometimes|string',
            'address' => 'nullable|string',
            'industry' => 'nullable|string',
            'contact_person' => 'nullable|string',
            'contact_phone' => 'nullable|string',
            'contact_email' => 'nullable|email'
        ]);

        $company->update($request->all());
        return response()->json($company);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
         $company = Training_Company::find($id);
        if(!$company){
            return response()->json(['message'=>'Company not found'],404);
        }

        $company->delete();
        return response()->json(['message'=>'Company deleted successfully']);
    
    }
}
