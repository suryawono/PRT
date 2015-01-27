var db = openDatabase("pembukuan", "1.0", "Database untuk pembukuan", 2 * 1024 * 1024);
db.transaction(function (tx) {
    tx.executeSql('create table if not exists Buku(id integer primary key,jumlah double ,deskripsi,waktu timestamp,jenis,kategori)');
 });