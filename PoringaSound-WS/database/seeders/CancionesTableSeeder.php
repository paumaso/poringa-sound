<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CancionesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('canciones')->insert([
            [
                'titulo' => 'Canción 1',
                'album_id' => null,
                'genero' => 2,
                'duracion' => null,
                'user_id' => 1, 
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'titulo' => 'Canción 2',
                'album_id' => null,
                'genero' => '1',
                'duracion' => null,
                'user_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
