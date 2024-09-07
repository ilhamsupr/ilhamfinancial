// Menangani proses login ketika tombol login diklik
document.getElementById('login-btn').addEventListener('click', function () {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Cek apakah username dan password cocok
  if (username === 'admin' && password === 'admin123') {
    // Simpan status login ke localStorage
    localStorage.setItem('isLoggedIn', 'true');
    // Sembunyikan form login dan tampilkan aplikasi utama
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('app-container').style.display = 'block';
  } else {
    // Tampilkan pesan kesalahan jika username atau password salah
    document.getElementById('login-error').textContent = 'Username atau kata sandi salah!';
  }
});

// Memeriksa apakah pengguna sudah login saat halaman dimuat
window.onload = function () {
  if (localStorage.getItem('isLoggedIn') === 'true') {
    // Jika sudah login, sembunyikan form login dan tampilkan aplikasi utama
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('app-container').style.display = 'block';
  } else {
    // Jika belum login, tampilkan form login dan sembunyikan aplikasi utama
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('app-container').style.display = 'none';
  }

  // Tampilkan inventaris saat halaman dimuat
  displayInventory();
};

// Menangani proses logout ketika tombol logout diklik
document.getElementById('logout-btn').addEventListener('click', function () {
  // Hapus status login dari localStorage dan muat ulang halaman
  localStorage.removeItem('isLoggedIn');
  window.location.reload();
});

// Menangani penambahan item ke inventaris
document.getElementById('add-item').addEventListener('click', function () {
  const itemName = document.getElementById('item-name').value;
  const itemPrice = parseFloat(document.getElementById('item-price').value);
  const itemQuantity = parseInt(document.getElementById('item-quantity').value);

  // Cek validitas input
  if (itemName && !isNaN(itemPrice) && !isNaN(itemQuantity)) {
    // Ambil data inventaris dari localStorage atau buat array baru jika belum ada
    let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    // Tambahkan item baru ke array inventaris
    inventory.push({ name: itemName, price: itemPrice, quantity: itemQuantity });
    // Simpan inventaris ke localStorage
    localStorage.setItem('inventory', JSON.stringify(inventory));
    // Tampilkan inventaris yang diperbarui
    displayInventory();
    // Kosongkan input form setelah menambah item
    document.getElementById('item-name').value = '';
    document.getElementById('item-price').value = '';
    document.getElementById('item-quantity').value = '';
  }
});

// Menangani pencatatan penjualan
document.getElementById('record-sale').addEventListener('click', function () {
  const saleItem = document.getElementById('sale-item').value;
  const saleQuantity = parseInt(document.getElementById('sale-quantity').value);

  // Cek validitas input
  if (saleItem && !isNaN(saleQuantity)) {
    // Ambil data penjualan dari localStorage atau buat array baru jika belum ada
    let sales = JSON.parse(localStorage.getItem('sales')) || [];
    // Tambahkan penjualan baru ke array penjualan
    sales.push({ name: saleItem, quantity: saleQuantity });
    // Simpan penjualan ke localStorage
    localStorage.setItem('sales', JSON.stringify(sales));
    // Kosongkan input form setelah mencatat penjualan
    document.getElementById('sale-item').value = '';
    document.getElementById('sale-quantity').value = '';
  }
});

// Menampilkan inventaris dalam tabel
function displayInventory() {
  // Ambil data inventaris dari localStorage
  let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
  let inventoryList = document.getElementById('inventory-list');
  inventoryList.innerHTML = '';

  // Iterasi melalui setiap item dalam inventaris dan tambahkan ke tabel
  inventory.forEach((item, index) => {
    let row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.name}</td>
      <td>Rp${item.price.toLocaleString('id-ID')}</td>
      <td>${item.quantity}</td>
      <td><button class="delete-item" onclick="deleteItem(${index})">Hapus</button></td>
    `;
    inventoryList.appendChild(row);
  });
}

// Menghapus item dari inventaris
function deleteItem(index) {
  // Ambil data inventaris dari localStorage
  let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
  // Hapus item berdasarkan indeks
  inventory.splice(index, 1);
  // Simpan inventaris yang diperbarui ke localStorage
  localStorage.setItem('inventory', JSON.stringify(inventory));
  // Tampilkan inventaris yang diperbarui
  displayInventory();
}

// Menghasilkan laporan berdasarkan data penjualan
function generateReport() {
  // Ambil data penjualan dan inventaris dari localStorage
  let sales = JSON.parse(localStorage.getItem('sales')) || [];
  let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
  let reportOutput = document.getElementById('report-output');
  reportOutput.innerHTML = '';

  // Cek apakah ada penjualan
  if (sales.length > 0) {
    let totalSales = sales.length; // Total jumlah transaksi
    let totalAmount = sales.reduce((total, sale) => {
      let item = inventory.find(i => i.name === sale.name);
      return total + (item ? item.price * sale.quantity : 0);
    }, 0);

    // Tampilkan total penjualan dan total uang yang dihasilkan
    reportOutput.innerHTML = `
      <p>Total Penjualan: ${totalSales} transaksi</p>
      <p>Total Uang yang Dihasilkan: Rp${totalAmount.toLocaleString('id-ID')}</p>
    `;
  } else {
    // Tampilkan pesan jika tidak ada penjualan
    reportOutput.innerHTML = '<p>Belum ada penjualan.</p>';
  }
}

// Menangani klik tombol generate report
document.getElementById('generate-report').addEventListener('click', generateReport);

// Mengatur ulang semua data inventaris dan penjualan
document.getElementById('reset').addEventListener('click', function () {
  // Hapus data inventaris dan penjualan dari localStorage
  localStorage.removeItem('inventory');
  localStorage.removeItem('sales');
  // Tampilkan inventaris kosong
  displayInventory();
});
