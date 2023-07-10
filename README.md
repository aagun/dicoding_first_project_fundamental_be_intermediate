# Requirement

1. NodeJs versi >= 16

2. Docker

3. Postgresql client [PG Admin](https://www.pgadmin.org/download/)

# Konfigurasi Database

1. Downoad dan install docker [Docker](https://www.docker.com)

2. Download docker image postgresql `docker pull image postgres:15`

3. Jalankan script berikut pada `terminal` atau `cmd` namun sebelum itu sesuaikan value `<NAMA_CONTAINER>`, `<NAMA_DATABASE>`, `<NAMA_USER>` dan `<PASSWORD_DATABASE>` dengan konfigurasi kalian inginkan

```bash
  docker run -it --rm \
    --name <NAMA_CONTAINER> \
    -e POSTGRES_DB=<NAMA_DATABASE> \
    -e POSTGRES_USER=<NAMA_USER> \
    -e POSTGRES_PASSWORD=<PASSWORD_DATABASE>\
    -e PGDATA=/var/lib/postgresql/data/pgdata \
    -v "./open-music-data/:/var/lib/postgresql/data" \
    -p 5432:5432 \
    postgres:15
```

# Menjalankan Aplikasi

1. Clone repo `https://github.com/aagun/dicoding_first_project_fundamental_be_intermediate.git`

2. Masuk ke dalam folder `dicoding_first_project_fundamental_be_intermediate`

3. Rename file `.env.example` menjadi `.env`

4. Buka file `.env` lalu konfigurasi `PORT` dan `HOST` server yang akan digunakan juga sesuai kan konfigurasi database pada file `.env` dengan konfigurasi database yang telah dibuat seperti pada langkah `Konfigurasi Database`

5. Buka `terminal` atau `cmd` lalu ketikkan perintah `npm install` dan tunggu proses install `dependencies` selesai

6. Ketikkan `npm run start-dev` untuk menjalankan aplikasi.

# Mengakses Database

1. Buka tab `terminal` atau `cmd` baru

2. Masuk ke dalam folder `dicoding_first_project_fundamental_be_intermediate`

3. Ketikan perintah `npm run migrate up`

4. Akses database menggunakan postgres client dengan cara `psql -h localhost -p 5432 -U dicoding -d open_music_db -W`

5. Masukkan password database `vb3Blbl9tdXNpYwsxFYXsL56wR`
