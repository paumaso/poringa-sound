<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            [
                'nombre' => 'pau',
                'email' => 'pau@gmail.com',
                'password' => Hash::make('123456'), 
                'tipo' => 'usuario',
                'imagen_perfil' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'admin',
                'email' => 'admin@gmail.com',
                'password' => Hash::make('123456'),
                'tipo' => 'admin',
                'imagen_perfil' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
