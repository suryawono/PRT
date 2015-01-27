var buku = new Pembukuan();
var namaBulan = ["", "Januari", "Febuari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
var totalPemasukan, totalPengeluaran;

function simpan(jenis) {
    switch (jenis) {
        case "pemasukan":
            var data = $("#pemasukan").serializeArray();
            console.log(data);
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
            alert("Berhasil disimpan");
            $("#pengeluaran").trigger("reset");
            break;
    }
}