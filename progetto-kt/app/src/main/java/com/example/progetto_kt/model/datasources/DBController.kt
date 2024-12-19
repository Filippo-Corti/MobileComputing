package com.example.progetto_kt.model.datasources

import android.content.Context
import androidx.room.Dao
import androidx.room.Database
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Room
import androidx.room.RoomDatabase
import com.example.progetto_kt.model.dataclasses.MenuImageWithVersion


@Dao
interface MenuImageDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMenuImage(newData : MenuImageWithVersion)

    @Query("SELECT * FROM MenuImageWithVersion WHERE menuId = :menuId AND version = :imageVersion LIMIT 1")
    suspend fun getMenuImageByVersion(menuId : Int, imageVersion : Int) : MenuImageWithVersion?

}

@Database(entities = [MenuImageWithVersion::class], version = 1)
abstract class AppDatabase : RoomDatabase() {
    abstract fun menuImageDao() : MenuImageDao
}

class DBController(
    context : Context
) {

    private val database = Room.databaseBuilder(
        context,
        AppDatabase::class.java,
        "images-database"
    ).build()

    val dao = database.menuImageDao()

}