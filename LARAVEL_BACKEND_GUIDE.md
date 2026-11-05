# 📘 Panduan Integrasi Backend Laravel — Sistem Helpdesk

Dokumen ini disusun untuk memudahkan rekan backend dalam membangun RESTful API Laravel yang kompatibel 100% dengan frontend React Helpdesk ini.

---

## 🛠️ Ringkasan Arsitektur
- **Frontend**: React 19 + Vite (`http://localhost:5173`)
- **Backend**: Laravel 10 / 11 (`http://localhost:8000/api`)
- **Autentikasi**: Laravel Sanctum (`Authorization: Bearer <token>`)
- **Format Pertukaran Data**: JSON (`Accept: application/json`, `Content-Type: application/json`)

---

## 1. Konfigurasi Awal Laravel

### A. Install Laravel Sanctum
```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

Di `app/Models/User.php`:
```php
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable {
    use HasApiTokens, HasFactory, Notifiable;
    // ...
}
```

### B. Konfigurasi CORS (`config/cors.php`)
Pastikan frontend React diizinkan mengakses API:
```php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

---

## 2. Struktur Database & Migrasi (Migrations)

### 1. Tabel `users`
```php
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->unique();
    $table->string('password');
    $table->enum('role', ['karyawan', 'admin', 'owner'])->default('karyawan');
    $table->string('dept')->nullable(); // contoh: 'IT', 'Finance', 'HR'
    $table->string('avatar')->nullable(); // contoh: inisial 'AF' atau path foto
    $table->boolean('active')->default(true);
    $table->rememberToken();
    $table->timestamps();
});
```

### 2. Tabel `categories`
```php
Schema::create('categories', function (Blueprint $table) {
    $table->id();
    $table->string('name'); // contoh: 'Infrastruktur IT'
    $table->string('color')->default('#2563eb');
    $table->timestamps();
});
```

### 3. Tabel `priorities`
```php
Schema::create('priorities', function (Blueprint $table) {
    $table->id();
    $table->string('name'); // 'Rendah', 'Sedang', 'Tinggi', 'Kritis'
    $table->string('color'); // '#16a34a', '#ea580c', dll
    $table->string('badge')->default('b-blue');
    $table->timestamps();
});
```

### 4. Tabel `complaints`
```php
Schema::create('complaints', function (Blueprint $table) {
    $table->string('id')->primary(); // format: 'HDK-001', 'HDK-002'
    $table->string('title');
    $table->text('description');
    $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
    $table->foreignId('priority_id')->constrained('priorities')->onDelete('cascade');
    $table->enum('status', ['Baru', 'Sedang Diproses', 'Menunggu Owner', 'Selesai', 'Ditutup'])->default('Baru');
    $table->foreignId('submitted_by')->constrained('users')->onDelete('cascade');
    $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null');
    $table->foreignId('forwarded_to')->nullable()->constrained('users')->onDelete('set null');
    $table->unsignedTinyInteger('rating')->nullable(); // 1 - 5
    $table->boolean('reopened')->default(false);
    $table->timestamps();
});
```

### 5. Tabel `complaint_logs` (Audit Trail)
```php
Schema::create('complaint_logs', function (Blueprint $table) {
    $table->id();
    $table->string('complaint_id');
    $table->foreign('complaint_id')->references('id')->on('complaints')->onDelete('cascade');
    $table->string('action'); // contoh: 'Pengaduan dibuat', 'Status → Sedang Diproses'
    $table->foreignId('by')->constrained('users')->onDelete('cascade');
    $table->timestamp('created_at')->useCurrent();
});
```

### 6. Tabel `comments`
```php
Schema::create('comments', function (Blueprint $table) {
    $table->id();
    $table->string('complaint_id');
    $table->foreign('complaint_id')->references('id')->on('complaints')->onDelete('cascade');
    $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
    $table->text('text');
    $table->timestamp('created_at')->useCurrent();
});
```

---

## 3. Daftar Endpoint API (`routes/api.php`)

```php
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ComplaintController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\PriorityController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\AssistantController;

// ── Public Routes ──
Route::post('/login', [AuthController::class, 'login']);

// ── Protected Routes (Sanctum) ──
Route::middleware('auth:sanctum')->group(function () {
    // Auth & Profil
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
    Route::put('/user/password', [AuthController::class, 'updatePassword']);

    // Complaints
    Route::get('/complaints', [ComplaintController::class, 'index']);
    Route::post('/complaints', [ComplaintController::class, 'store']);
    Route::get('/complaints/{id}', [ComplaintController::class, 'show']);
    Route::patch('/complaints/{id}/status', [ComplaintController::class, 'updateStatus']);
    Route::patch('/complaints/{id}/assign', [ComplaintController::class, 'assign']);
    Route::patch('/complaints/{id}/forward', [ComplaintController::class, 'forward']);
    Route::patch('/complaints/{id}/close', [ComplaintController::class, 'close']);
    Route::patch('/complaints/{id}/reopen', [ComplaintController::class, 'reopen']);
    Route::post('/complaints/{id}/comments', [ComplaintController::class, 'addComment']);
    Route::post('/complaints/{id}/rate', [ComplaintController::class, 'rate']);

    // Data Master
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('priorities', PriorityController::class)->only(['index', 'store', 'destroy']);

    // User Management (Admin)
    Route::apiResource('users', UserController::class);
    Route::patch('/users/{id}/toggle-active', [UserController::class, 'toggleActive']);

    // Laporan & Statistik
    Route::get('/reports/stats', [ReportController::class, 'stats']);
    Route::get('/reports/export', [ReportController::class, 'export']);

    // Asisten Virtual AI
    Route::post('/assistant/ask', [AssistantController::class, 'ask']);
});
```

---

## 4. Contoh Response JSON yang Diharapkan Frontend

### A. Response Login (`POST /api/login`)
```json
{
  "token": "1|qXyZ789abc...",
  "user": {
    "id": 1,
    "name": "Ahmad Fauzi",
    "email": "ahmad@perusahaan.co.id",
    "role": "karyawan",
    "dept": "IT",
    "avatar": "AF",
    "active": true
  }
}
```

### B. Response Detail Pengaduan (`GET /api/complaints/{id}`)
```json
{
  "id": "HDK-001",
  "title": "Komputer tidak bisa menyala",
  "description": "Komputer di meja saya mati total.",
  "categoryId": 4,
  "priorityId": 4,
  "status": "Sedang Diproses",
  "submittedBy": 1,
  "assignedTo": 4,
  "forwardedTo": null,
  "rating": null,
  "reopened": false,
  "createdAt": "2026-10-22T08:00:00.000Z",
  "updatedAt": "2026-10-22T09:30:00.000Z",
  "comments": [
    {
      "id": 1,
      "userId": 4,
      "text": "Teknisi sedang menuju lokasi.",
      "createdAt": "2026-10-22T09:35:00.000Z"
    }
  ],
  "logs": [
    {
      "id": 1,
      "action": "Pengaduan dibuat",
      "by": 1,
      "at": "2026-10-22T08:00:00.000Z"
    },
    {
      "id": 2,
      "action": "Status → Sedang Diproses",
      "by": 4,
      "at": "2026-10-22T09:30:00.000Z"
    }
  ]
}
```

---

## 5. Cara Menghubungkan Frontend ke Laravel

1. Di file `.env` frontend:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   VITE_USE_MOCK=false
   ```
2. Jalankan Laravel backend:
   ```bash
   php artisan serve --port=8000
   ```
3. Frontend React (`npm run dev`) akan otomatis memanggil API Laravel dengan token Sanctum Bearer pada setiap request!
