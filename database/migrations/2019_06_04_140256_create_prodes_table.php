<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProdesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('prodes', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->timestamps();
            $table->string('octavos');
            $table->string('cuartos');
            $table->string('semis');
            $table->string('final');
            $table->string('user_id');
            $table->string('campeon');


        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('prodes');
    }
}