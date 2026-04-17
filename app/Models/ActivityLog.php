<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    protected $fillable = [
        'type', 'action', 'description',
        'subject_type', 'subject_id',
        'admin_id', 'user_id',
        'ip_address', 'meta',
    ];

    protected $casts = ['meta' => 'array'];

    public function admin()   { return $this->belongsTo(Admin::class); }
    public function user()    { return $this->belongsTo(User::class); }
    public function subject() { return $this->morphTo(); }

    // Helper to log quickly from anywhere
    public static function log(
        string $type,
        string $action,
        string $description,
        array  $meta    = [],
        ?int   $adminId = null,
        ?int   $userId  = null,
    ): void {
        static::create([
            'type'        => $type,
            'action'      => $action,
            'description' => $description,
            'meta'        => $meta,
            'admin_id'    => $adminId,
            'user_id'     => $userId,
            'ip_address'  => request()->ip(),
        ]);
    }
}