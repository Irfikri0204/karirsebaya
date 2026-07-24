<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $visitorCount = \App\Models\Setting::firstOrCreate(['key' => 'visitor_count'], ['value' => '0']);
    if (!session()->has('visited')) {
        $newVal = ((int)$visitorCount->value) + 1;
        $visitorCount->update(['value' => (string)$newVal]);
        session()->put('visited', true);
    }

    $counselorAuto = \App\Models\Setting::where('key', 'stat_counselors_auto')->value('value') === '1';
    if ($counselorAuto) {
        $counselorsCount = \App\Models\TeamMember::where('is_active', true)->whereIn('category', ['expert', 'peer'])->count();
    } else {
        $counselorsCount = \App\Models\Setting::where('key', 'stat_counselors')->value('value');
    }

    $visitorAuto = \App\Models\Setting::where('key', 'visitor_count_auto')->value('value') === '1';
    $visitorStart = (int)\App\Models\Setting::where('key', 'visitor_count_start')->value('value');
    $totalVisitors = $visitorAuto ? (int)$visitorCount->value : ($visitorStart + (int)$visitorCount->value);

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'usersCount' => \App\Models\User::where('role', 'user')->count(),
        'counselorsCount' => $counselorsCount,
        'visitorCount' => $totalVisitors,
        'features' => \App\Models\Feature::orderBy('order')->get(),
        'services' => \App\Models\Service::orderBy('order')->get(),
        'partners' => \App\Models\Partner::orderBy('order')->get(),
        'testimonials' => \App\Models\Testimonial::where('is_hidden', false)
            ->when(\App\Models\Setting::where('key', 'testimonial_mode')->value('value') === 'manual', function ($query) {
                return $query->where('is_featured', true);
            })
            ->latest()
            ->take(8)
            ->get(),
    ]);
})->name('home');

Route::get('/testimoni', function () {
    return Inertia::render('Testimoni/Index', [
        'testimonials' => \App\Models\Testimonial::where('is_hidden', false)->latest()->get(),
    ]);
})->name('testimoni');

Route::post('/testimoni', [\App\Http\Controllers\TestimonialController::class, 'storePublic'])->name('testimoni.store')->middleware('auth');

Route::get('/tes-karir', [\App\Http\Controllers\RiasecTestController::class, 'index'])->name('tes-karir.index');

Route::get('/modul', [\App\Http\Controllers\ModulController::class, 'index'])->name('modul');
Route::get('/modul/{id}', [\App\Http\Controllers\ModulController::class, 'show'])->name('modul.show');

Route::middleware('auth')->group(function () {
    Route::get('/tes-karir/riwayat', [\App\Http\Controllers\RiasecTestController::class, 'history'])->name('tes-karir.history');
    Route::get('/tes-karir/kerjakan', [\App\Http\Controllers\RiasecTestController::class, 'create'])->name('tes-karir.create');
    Route::post('/tes-karir/kerjakan', [\App\Http\Controllers\RiasecTestController::class, 'store'])->name('tes-karir.store');
    Route::get('/tes-karir/hasil/{result}', [\App\Http\Controllers\RiasecTestController::class, 'show'])->name('tes-karir.result');
});

Route::get('/fikri', [\App\Http\Controllers\FikriController::class, 'index'])->name('fikri');

Route::get('/tim-kami', function () {
    return Inertia::render('TimKami/Index', [
        'teamMembers' => \App\Models\TeamMember::where('is_active', true)->get()
    ]);
})->name('tim-kami');

Route::get('/panduan', function () {
    return Inertia::render('Panduan/Index');
})->name('panduan');

Route::get('/konseling', function () {
    return Inertia::render('Konseling/Index');
})->name('konseling');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', function () {
        $newUsers = \App\Models\User::where('role', 'user')->latest()->take(3)->get();
        
        $recentActivities = collect();
        
        $usersActivity = \App\Models\User::where('role', 'user')->latest()->take(3)->get()->map(function($user) {
            return [
                'type' => 'user',
                'title' => $user->name . ' mendaftar ke platform',
                'description' => 'Email: ' . $user->email,
                'time' => $user->created_at->diffForHumans(),
                'timestamp' => $user->created_at
            ];
        });
        
        $testsActivity = \App\Models\RiasecTestResult::with('user')->latest()->take(3)->get()->map(function($test) {
            return [
                'type' => 'test',
                'title' => ($test->user ? $test->user->name : 'Pengguna') . ' menyelesaikan Tes Minat Karir',
                'description' => 'Hasil: ' . $test->riasec_code,
                'time' => $test->created_at->diffForHumans(),
                'timestamp' => $test->created_at
            ];
        });

        $testimoniActivity = \App\Models\Testimonial::latest()->take(3)->get()->map(function($testi) {
            return [
                'type' => 'testimonial',
                'title' => $testi->name . ' memberikan testimoni',
                'description' => '"' . \Illuminate\Support\Str::limit($testi->message, 50) . '"',
                'time' => $testi->created_at->diffForHumans(),
                'timestamp' => $testi->created_at
            ];
        });

        $recentActivities = $recentActivities->concat($usersActivity)->concat($testsActivity)->concat($testimoniActivity)
            ->sortByDesc('timestamp')
            ->take(5)
            ->values()
            ->all();

        return Inertia::render('Admin/Dashboard/Index', [
            'stats' => [
                'users_count' => \App\Models\User::where('role', 'user')->count(),
                'admins_count' => \App\Models\User::where('role', 'admin')->count(),
                'riasec_tests_count' => \App\Models\RiasecTestResult::count(),
                'modules_count' => \App\Models\Module::count(),
            ],
            'new_users' => $newUsers,
            'recent_activities' => $recentActivities
        ]);
    })->name('dashboard');

    // Pengaturan yang bisa diakses oleh admin dan superadmin
    Route::get('/counseling-settings', [\App\Http\Controllers\Admin\SettingController::class, 'counseling'])->name('counseling-settings.index');
    Route::post('/counseling-settings', [\App\Http\Controllers\Admin\SettingController::class, 'update'])->name('counseling-settings.update');

    Route::middleware('superadmin')->group(function () {
        Route::get('/settings', [\App\Http\Controllers\Admin\SettingController::class, 'index'])->name('settings.index');
        Route::post('/settings', [\App\Http\Controllers\Admin\SettingController::class, 'update'])->name('settings.update');

        Route::get('/fikri-profile', [\App\Http\Controllers\FikriController::class, 'edit'])->name('fikri-profile.index');
        Route::post('/fikri-profile', [\App\Http\Controllers\FikriController::class, 'update'])->name('fikri-profile.update');

        Route::post('features/reorder', [\App\Http\Controllers\FeatureController::class, 'reorder'])->name('features.reorder');
        Route::resource('features', \App\Http\Controllers\FeatureController::class)->except(['create', 'show', 'edit']);
        Route::post('services/reorder', [\App\Http\Controllers\ServiceController::class, 'reorder'])->name('services.reorder');
        Route::resource('services', \App\Http\Controllers\ServiceController::class)->except(['create', 'show', 'edit']);
        
        Route::get('/riasec/categories', [\App\Http\Controllers\Admin\RiasecCategoryController::class, 'index'])->name('riasec.categories.index');
        Route::put('/riasec/categories/{code}', [\App\Http\Controllers\Admin\RiasecCategoryController::class, 'update'])->name('riasec.categories.update');

        Route::resource('riasec/questions', \App\Http\Controllers\Admin\RiasecQuestionController::class, ['as' => 'riasec'])->except(['create', 'show', 'edit']);
    });

    Route::post('team-members/bulk', [\App\Http\Controllers\Admin\TeamMemberController::class, 'bulkAction'])->name('team-members.bulk');
    Route::resource('team-members', \App\Http\Controllers\Admin\TeamMemberController::class)->except(['create', 'show', 'edit']);

    // RIASEC Routes
    Route::get('/riasec/results', [\App\Http\Controllers\Admin\RiasecTestResultsController::class, 'index'])->name('riasec.results.index');
    Route::post('/riasec/results/bulk', [\App\Http\Controllers\Admin\RiasecTestResultsController::class, 'bulkAction'])->name('riasec.results.bulk');
    Route::get('/riasec/results/export', [\App\Http\Controllers\Admin\RiasecTestResultsController::class, 'export'])->name('riasec.results.export');

    // CMS Routes
    Route::post('partners/reorder', [\App\Http\Controllers\PartnerController::class, 'reorder'])->name('partners.reorder');
    Route::post('partners/bulk', [\App\Http\Controllers\PartnerController::class, 'bulkAction'])->name('partners.bulk');
    Route::resource('partners', \App\Http\Controllers\PartnerController::class)->except(['create', 'show', 'edit']);
    
    Route::post('testimonials/bulk', [\App\Http\Controllers\TestimonialController::class, 'bulkAction'])->name('testimonials.bulk');
    Route::get('testimonials/export', [\App\Http\Controllers\TestimonialController::class, 'export'])->name('testimonials.export');
    Route::resource('testimonials', \App\Http\Controllers\TestimonialController::class)->except(['create', 'show', 'edit']);
    
    Route::post('users/bulk', [\App\Http\Controllers\Admin\UserController::class, 'bulkAction'])->name('users.bulk');
    Route::resource('users', \App\Http\Controllers\Admin\UserController::class)->only(['index', 'store', 'destroy']);
    
    Route::resource('modules', \App\Http\Controllers\Admin\ModuleController::class)->except(['create', 'edit']);
    Route::post('modules/reorder', [\App\Http\Controllers\Admin\ModuleController::class, 'reorder'])->name('modules.reorder');
    Route::post('modules/bulk', [\App\Http\Controllers\Admin\ModuleController::class, 'bulkAction'])->name('modules.bulk');
    
    Route::post('modules/{module}/topics', [\App\Http\Controllers\Admin\ModuleTopicController::class, 'store'])->name('topics.store');
    Route::put('topics/{topic}', [\App\Http\Controllers\Admin\ModuleTopicController::class, 'update'])->name('topics.update');
    Route::delete('topics/{topic}', [\App\Http\Controllers\Admin\ModuleTopicController::class, 'destroy'])->name('topics.destroy');
    Route::post('modules/{module}/topics/reorder', [\App\Http\Controllers\Admin\ModuleTopicController::class, 'reorder'])->name('topics.reorder');
    
    Route::get('topics/{topic}/contents', [\App\Http\Controllers\Admin\TopicContentController::class, 'index'])->name('topic-contents.index');
    Route::post('topics/{topic}/contents', [\App\Http\Controllers\Admin\TopicContentController::class, 'store'])->name('topic-contents.store');
    Route::post('contents/{content}', [\App\Http\Controllers\Admin\TopicContentController::class, 'update'])->name('topic-contents.update'); // Using POST for file uploads
    Route::delete('contents/{content}', [\App\Http\Controllers\Admin\TopicContentController::class, 'destroy'])->name('topic-contents.destroy');
    Route::post('topics/{topic}/contents/reorder', [\App\Http\Controllers\Admin\TopicContentController::class, 'reorder'])->name('topic-contents.reorder');
    Route::post('topics/{topic}/contents/bulk', [\App\Http\Controllers\Admin\TopicContentController::class, 'bulkAction'])->name('topic-contents.bulk');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
