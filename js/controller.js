var buku = new Pembukuan();
var namaBulan = ["", "Januari", "Febuari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
var jenis_kategori = ["", "pemasukan", "pengeluaran"];
var hubungan_anggota = [];
var jenis_anggota = [];
var kategori = [];
var totalPemasukan, totalPengeluaran;
var credential = {};
var anggotaDetail = null;

function simpan(jenis) {
    switch (jenis) {
        case "pemasukan":
            var data = $("#pemasukan").serializeArray();
            var tanggal = new Date(data[3].value);
            if (isNaN(tanggal.getTime())) {
                var timestamp = $.now();
            } else {
                var timestamp = tanggal.getTime();
            }
            var r = new Record(data[0].value, data[2].value, timestamp, "pemasukan", data[1].value);
            if (!r.validate()) {
                break;
            }
            buku.add(r);
            transaksi = {kategori_id: data[1].value, besaran: data[0].value, deskripsi: data[2].value, waktu: toSqlDatetime(timestamp), anggota_id: credential.anggota.id};
            sendTransaksi(transaksi);
            alert("Berhasil disimpan");
            $("#pemasukan").trigger("reset");
            break;
        case "pengeluaran":
            var data = $("#pengeluaran").serializeArray();
            var tanggal = new Date(data[3].value);
            if (isNaN(tanggal.getTime())) {
                var timestamp = $.now();
            } else {
                var timestamp = tanggal.getTime();
            }
            var r = new Record(data[0].value, data[2].value, timestamp, "pengeluaran", data[1].value);
            if (!r.validate()) {
                break;
            }
            buku.add(r);
            transaksi = {kategori_id: data[1].value, besaran: data[0].value, deskripsi: data[2].value, waktu: toSqlDatetime(timestamp), anggota_id: credential.anggota.id};
            sendTransaksi(transaksi);
            alert("Berhasil disimpan");
            $("#pengeluaran").trigger("reset");
            break;
    }
}