<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GeneroSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $genero = [
            ['nombre' => 'Rock'],
            ['nombre' => 'Pop'],
            ['nombre' => 'Reggaeton'],
            ['nombre' => 'Hip-Hop'],
            ['nombre' => 'Jazz'],
            ['nombre' => 'Blues'],
            ['nombre' => 'Country'],
            ['nombre' => 'Electrónica'],
            ['nombre' => 'Clásica'],
            ['nombre' => 'Metal'],
        ];

        DB::table('genero')->insert($genero);
    }
}
