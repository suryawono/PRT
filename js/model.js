function Record(jumlah, deskripsi, waktu, jenis, kategori) {
    this.jumlah = jumlah;
    this.deskripsi = deskripsi;
    this.waktu = new Waktu(waktu);
    this.jenis = jenis;
    this.kategori = kategori;
}

Record.prototype.validate = function () {
    if (this.jumlah == "") {
        alert(this.jenis + " harus diisi");
        return false;
    } else if (this.kategori == "empty") {
        alert("Kategori harus diisi");
        return false;
    }
    return true;
}

Record.prototype.getJumlah = function () {
    if (typeof this.jumlah == "string") {
        return parseFloat(this.jumlah.replace(/\./g, ""));
    }
    return this.jumlah;
}

Record.prototype.getWaktu = function () {
    return this.waktu;
}

Record.prototype.reCon = function (o) {
    this.jumlah = o.jumlah;
    this.deskripsi = o.deskripsi;
    this.waktu = new Waktu(o.waktu);
    this.jenis = o.jenis;
    this.kategori = o.kategori;
}

function Waktu(timestamp) {
    this.timestamp = timestamp;
    this.date = new Date(timestamp);
}

Waktu.prototype.isBulan = function (bulan) {
    return (this.date.getMonth() + 1 == bulan);
}

Waktu.prototype.getBulan = function () {
    return this.date.getMonth() + 1;
}

Waktu.prototype.isTahun = function (tahun) {
    return (this.date.getUTCFullYear() == tahun);
}

Waktu.prototype.getTahun = function () {
    return this.date.getUTCFullYear();
}

function Pembukuan() {
}

Pembukuan.prototype.add = function (record) {
    db.transaction(function (tx) {
        tx.executeSql('insert into Buku(jumlah,deskripsi,waktu,jenis,kategori) values(?,?,?,?,?)', [record.jumlah, record.deskripsi, record.waktu.timestamp, record.jenis, record.kategori]);
    })
}

Pembukuan.prototype.query = function (q, fn) {
    db.transaction(function (tx) {
        tx.executeSql(q, [], function (tx, results) {
            if (typeof fn == "function") {
                fn(results);
            }
        })
    })
}


Pembukuan.prototype.viewTotal = function (callback) {
    this.query("select sum(case when jenis='pemasukan' then jumlah end) as totalPemasukan,sum(case when jenis='pengeluaran' then jumlah end) as totalPengeluaran from Buku", function (results) {
        totalPemasukan = results.rows.item(0).totalPemasukan || 0;
        totalPengeluaran = results.rows.item(0).totalPengeluaran || 0;
        if (typeof callback == "function") {
            callback();
        }
    });
}

Pembukuan.prototype.clear = function () {
    buku.query("delete from Buku");
}