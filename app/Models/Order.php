<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'order_number','user_id','address_id','status',
        'payment_method','payment_channel','subtotal','shipping_fee','total','order_note',
        'tracking_courier','tracking_number'
    ];

    public function user()    { return $this->belongsTo(User::class); }
    public function address() { return $this->belongsTo(Address::class); }
    public function items()   { return $this->hasMany(OrderItem::class); }
    public function payment() { return $this->hasOne(Payment::class); }
}
