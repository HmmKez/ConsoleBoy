<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = ['order_id','method','payment_channel','status','amount','reference_number','proof_url','paid_at'];

    public function order() { return $this->belongsTo(Order::class); }
}
