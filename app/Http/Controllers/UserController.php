<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Student;
use App\Models\Supervisor;
use App\Models\Training_Company;
use App\Models\Training_Request;

use App\Http\Resources\UserResource;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\Activity;
use Carbon\Carbon;

class UserController extends Controller
{

    /*
    |--------------------------------------------------------------------------
    | عرض جميع المستخدمين
    |--------------------------------------------------------------------------
    */

    public function index()
    {
        $auth = Auth::user();

        if (!$auth || $auth->user_type != 'admin') {
            abort(403, 'Access denied');
        }

        $users = User::with([
            'student',
            'supervisor',
            'training_company'
        ])->paginate(20);

        return UserResource::collection($users);
    }

    /*
    |--------------------------------------------------------------------------
    | إنشاء مستخدم جديد
    |--------------------------------------------------------------------------
    */

    public function store(StoreUserRequest $request)
    {

        $data = $request->validated();

        $data['password'] = Hash::make($data['password']);

        $user = User::create($data);

        $this->createProfile($user);

        return (new UserResource(
            $user->load([
                'student',
                'supervisor',
                'training_company'
            ])
        ))
        ->additional([
            'message' => 'User created successfully'
        ])
        ->response()
        ->setStatusCode(201);

    }

    /*
    |--------------------------------------------------------------------------
    | عرض مستخدم محدد
    |--------------------------------------------------------------------------
    */

    public function show(User $user)
    {

        $auth = Auth::user();

        if (!$auth || $auth->user_type != 'admin') {
            abort(403, 'Access denied');
        }

        $user->load([
            'student',
            'supervisor',
            'training_company'
        ]);

        return new UserResource($user);

    }

    /*
    |--------------------------------------------------------------------------
    | تعديل مستخدم
    |--------------------------------------------------------------------------
    */

    public function update(
        UpdateUserRequest $request,
        User $user
    )
    {

        $auth = Auth::user();

        if (!$auth || $auth->user_type != 'admin') {
            abort(403, 'Access denied');
        }

        $data = $request->validated();

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);

        return (new UserResource($user))
            ->additional([
                'message' => 'User updated successfully'
            ]);

    }

    /*
    |--------------------------------------------------------------------------
    | حذف مستخدم
    |--------------------------------------------------------------------------
    */

    public function destroy(User $user)
    {

        $auth = Auth::user();

        if (!$auth || $auth->user_type != 'admin') {
            abort(403, 'Access denied');
        }

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully'
        ], 200);

    }

    /*
    |--------------------------------------------------------------------------
    | Register
    |--------------------------------------------------------------------------
    */

    public function register(Request $request)
    {

        $request->validate([

            'name' => 'required|string|max:255',

            'email' => 'required|email|unique:users,email',

            'password' => 'required|string|min:6',

            'user_type' =>
                'required|string|in:student,supervisor,training_companies'

        ]);

        $user = User::create([

            'name' => $request->name,

            'email' => $request->email,

            'password' => Hash::make($request->password),

            'user_type' => $request->user_type

        ]);

        $this->createProfile($user);

        $token = $user
            ->createToken('auth_token')
            ->plainTextToken;

        return response()->json([

            'message' => 'تم التسجيل بنجاح 🎉',

            'user' => $user,

            'token' => $token

        ], 201);

    }

    /*
    |--------------------------------------------------------------------------
    | Login
    |--------------------------------------------------------------------------
    */

    public function login(Request $request)
    {

        $request->validate([

            'email' => 'required|email',

            'password' => 'required'

        ]);

        $user = User::where(
            'email',
            $request->email
        )->first();

        if (
            !$user ||
            !Hash::check($request->password, $user->password)
        ) {

                return response()->json([
                'message' => 'البريد الإلكتروني أو كلمة المرور غير صحيحة، يرجى إعادة المحاولة.'
            ], 401);

        }

        $token = $user
            ->createToken('auth_token')
            ->plainTextToken;

        return response()->json([

            'message' => 'Login successful',

            'token' => $token,

            'user' => $user

        ]);

    }

    /*
    |--------------------------------------------------------------------------
    | Dashboard Admin
    |--------------------------------------------------------------------------
    */
public function adminDashboard()
{
    // ضبط توقيت كربون للغة العربية ليظهر الوقت بشكل احترافي ومفهوم
    Carbon::setLocale('ar');

    return response()->json([

        /*
        | Statistics
        */
        'students' => Student::count(),
        'supervisors' => Supervisor::count(),
        'companies' => Training_Company::count(),

        /*
        | Training Requests Stats
        */
        'active' => Training_Request::where('status', 'approved')->count(),
        'completed' => Training_Request::where('status', 'completed')->count(),
        'pending' => Training_Request::where('status', 'pending')->count(),

        /*
        | Activities
        */
        'activities' => Activity::latest()
            ->take(10)
            ->get()
            ->map(function ($activity) {
                return [
                    'type' => $activity->type,
                    'message' => $activity->message,
                    'time' => $activity->created_at->diffForHumans()
                ];
            }),
    ]);
}

    /*
    |--------------------------------------------------------------------------
    | Create Related Profile
    |--------------------------------------------------------------------------
    */

    private function createProfile(User $user)
    {

        switch ($user->user_type) {

            /*
            | Student
            */

            case 'student':

                Student::create([

                    'user_id' => $user->id,

                    'university_number' => null,

                    'major' => '',

                    'academic_year' => '',

                    'name' => $user->name,

                    'supervisor_id' => null

                ]);

                break;

            /*
            | Supervisor
            */

            case 'supervisor':

                Supervisor::create([

                    'user_id' => $user->id,

                    'employee_number' => null,

                    'department' => '',

                    'max_students' => 30,

                    'name' => $user->name

                ]);

                break;

            /*
            | Training Company
            */

            case 'training_companies':

                Training_Company::create([

                    'user_id' => $user->id,

                    'name' => $user->name,

                    'address' => '',

                    'phone' => '',

                    'industry' => '',

                    'contact_person' => '',

                    'contact_email' => $user->email

                ]);

                break;

        }

    }

}