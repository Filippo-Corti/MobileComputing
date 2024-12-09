package com.example.api_storage.model

import android.content.Context
import android.view.Menu
import androidx.room.Dao
import androidx.room.Database
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Room
import androidx.room.RoomDatabase
import com.example.api_storage.model.types.MenuImageWithVersion

@Dao
interface MenuImageDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMenuImage(newData : MenuImageWithVersion)

    @Query("SELECT * FROM MenuImageWithVersion WHERE menuId = :menuId AND version = :imageVersion")
    suspend fun getMenuImageByVersion(menuId : Int, imageVersion : Int) : Array<MenuImageWithVersion>

}

@Database(entities = [MenuImageWithVersion::class], version = 1)
abstract class AppDatabase : RoomDatabase() {
    abstract fun menuImageDao() : MenuImageDao
}

object DBController {

    lateinit var database : AppDatabase
    lateinit var dao : MenuImageDao

    fun initDB(context : Context) {
        database = Room.databaseBuilder(
            context,
            AppDatabase::class.java,
            "images-database"
        ).build()


        dao = database.menuImageDao()
    }

}