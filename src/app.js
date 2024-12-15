document.addEventListener('alpine:init', () => {
  // Menu items data
  Alpine.data('menu', () => ({
    items: [
      { id: 1, name: 'Tempe', img: '1.jpg', price: 2000 },
      { id: 2, name: 'Perkedel', img: '2.jpg', price: 2000 },
      { id: 3, name: 'Nasi Rawon', img: '3.jpg', price: 15000 },
      { id: 4, name: 'Nasi Pecel', img: '4.jpg', price: 12000 },
      { id: 5, name: 'Nasi Lodeh', img: '5.jpg', price: 12000 },
      { id: 6, name: 'Nasi Ayam Laos', img: '6.jpg', price: 12000 },
      { id: 7, name: 'Nasi Cumi', img: '7.jpg', price: 15000 },
      { id: 8, name: 'Nasi Soto', img: '8.jpg', price: 12000 },
      { id: 9, name: 'Nasi Babat', img: '9.jpg', price: 18000 },
      { id: 10, name: 'Gorengan', img: '10.jpg', price: 1000 },
      { id: 11, name: 'Telor Ceplok', img: '11.jpg', price: 3000 },
      { id: 12, name: 'Nasi Kari', img: '12.jpg', price: 15000 },
    ],
  }));

  // Cart store
  Alpine.store('cart', {
    items: [],
    total: 0,
    quantity: 0,

    add(newItem) {
      // Check if item already exists in cart
      const cartItem = this.items.find((item) => item.id === newItem.id);

      if (!cartItem) {
        // If item doesn't exist, add to cart
        this.items.push({
          ...newItem,
          quantity: 1,
          total: newItem.price,
        });
        this.quantity++;
        this.total += newItem.price;
      } else {
        // If item exists, increase quantity
        cartItem.quantity++;
        cartItem.total = cartItem.price * cartItem.quantity;
        this.quantity++;
        this.total += cartItem.price;
      }

      this.saveCart();
    },

    remove(id) {
      const cartItem = this.items.find((item) => item.id === id);

      if (cartItem.quantity > 1) {
        // Reduce quantity if more than 1
        cartItem.quantity--;
        cartItem.total = cartItem.price * cartItem.quantity;
        this.quantity--;
        this.total -= cartItem.price;
      } else {
        // Remove item from cart if quantity is 1
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }

      this.saveCart();
    },

    saveCart() {
      // Save cart to localStorage
      localStorage.setItem('cart', JSON.stringify(this.items));
    },

    loadCart() {
      // Load cart from localStorage
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        this.items = parsedCart;
        this.total = parsedCart.reduce((sum, item) => sum + item.total, 0);
        this.quantity = parsedCart.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
      }
    },
  });

  // Initialize cart from localStorage
  Alpine.store('cart').loadCart();
});

// Form validation
document.addEventListener('DOMContentLoaded', () => {
  const checkoutButton = document.querySelector('.checkout-button');
  const form = document.querySelector('#checkoutForm');

  function validateForm() {
    const inputs = form.querySelectorAll('input[required]');
    const allFilled = Array.from(inputs).every(
      (input) => input.value.trim() !== ''
    );

    if (allFilled) {
      checkoutButton.disabled = false;
      checkoutButton.classList.remove('disabled');
    } else {
      checkoutButton.disabled = true;
      checkoutButton.classList.add('disabled');
    }
  }

  // Add event listeners to form inputs
  form.addEventListener('input', validateForm);
  form.addEventListener('change', validateForm);
});

// kirim data
checkoutButton.addEventListener('click', function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);
  const objData = Object.fromEntries(data);
  const message = formatMessage(objData);
  window.open(
    'https://wa.me/62895414159137?text=' + encodeURIComponent(message),
    '_blank'
  );
});

//kirim wa
const formatMessage = (obj) => {
  // Pastikan obj.items adalah string JSON yang valid, default ke array kosong jika tidak ada
  const items = JSON.parse(obj.items || '[]');

  // Periksa apakah items adalah array
  if (!Array.isArray(items)) {
    console.error('Items bukan array:', items);
    return 'Kesalahan pada data pesanan';
  }

  // Buat pesan pesanan berdasarkan data items
  const pesanPesanan = items
    .map((item) => `${item.name} (${item.quantity} x ${rupiah(item.total)})\n`)
    .join('');

  // Format pesan akhir
  return `
  |------------------------------------------------------------
  |Data Customer 
  |Nama: ${obj.name}
  |Email: ${obj.email}
  |No HP: ${obj.phone}
  |------------------------------------------------------------
  |Data Pesanan 
  |${pesanPesanan}
  |-------------------------------------------------------------
  |TOTAL: ${rupiah(obj.total)}
  |-------------------------------------------------------------
  |Silahkan Lakukan pembayaran :
  | - transfer xxxxx666
  | - scan QR code yang ada di warung atau download barcode di bio WA
  |--------------------------------------------------------------
  |Terima kasih telah berbelanja selamat menimati ^_^ 
  |-------------------------------------------------------------
`;
};
// pesan

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#contactForm');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const phone = form.querySelector('[name="phone"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();

    if (!name || !email || !phone || !message) {
      alert('Lengkapi semua data!');
      return;
    }

    const whatsappNumber = '62895414159137';
    const waMessage = `
|----------------------------------------------------------------------
|Nama: ${name}                                         
|Email: ${email}
|No HP: ${phone}
|----------------------------------------------------------------------
|Pesan: ${message}
|----------------------------------------------------------------------
    `;

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMessage)}`,
      '_blank'
    );
  });
});

// //konversi
// const rupiah = (number) => {
//   return new Intl.NumberFormat('id-ID', {
//     style: 'currency',
//     currency: 'IDR',
//     minimumFractionDigits: 0,
//   }).format(number);
// };
