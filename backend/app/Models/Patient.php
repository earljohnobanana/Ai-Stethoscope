<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    protected $fillable = ['name', 'age', 'sport'];

    public function recordings()
    {
        return $this->hasMany(Recording::class);
    }
}
