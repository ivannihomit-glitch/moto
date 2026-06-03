// ---------- МОТОЦИКЛЫ (каталог) ----------
const bikes = [
    { id: 1, name: "Yamaha MT-09", desc: "Трехцилиндровый зверь, 890 куб.см, электроника", price: 899000, img: "imag/image1.jpg" },
    { id: 2, name: "Honda CB650R", desc: "Нейкий спорт-нью-ретро, 4 цилиндра", price: 785000, img: "imag/image2.jpg" },
    { id: 3, name: "Kawasaki Ninja 650", desc: "Спорт-туризм, 649 куб.см, идеальный баланс", price: 759900, img: "imag/image3.jpg" },
    { id: 4, name: "Suzuki V-Strom 650", desc: "Эндуро/туринг, надежный V2", price: 829000, img: "imag/image4.jpg" },
    { id: 5, name: "BMW R 1250 GS", desc: "Легендарный 'Гусь', 1254 куб.см", price: 1899000, img: "imag/image5.jpg" },
    { id: 6, name: "Ducati Monster 937", desc: "Итальянский характер, 937 куб.см", price: 1295000, img: "imag/image6.jpg" }
];

// корзина (храним объекты: id, name, price, quantity)
let cart = [];

// отзывы (предзаполненные)
let reviews = [
    { id: 101, name: "Максим Орлов", text: "Купил Yamaha MT-09, эмоции зашкаливают! Отличный сервис, доставили за 3 дня.", stars: 5 },
    { id: 102, name: "Елена Соколова", text: "Взяла Honda CB650R в подарок мужу. Консультанты помогли с выбором, спасибо!", stars: 5 },
    { id: 103, name: "Дмитрий Лавров", text: "Катаю на Kawasaki Ninja 650 — полный восторг. Рекомендую магазин!", stars: 4 }
];

// вспомогательные функции
function saveCartToLocal() {
    localStorage.setItem("motoCart", JSON.stringify(cart));
}
function loadCartFromLocal() {
    const saved = localStorage.getItem("motoCart");
    if (saved) {
        try {
            cart = JSON.parse(saved);
        } catch(e) { cart = []; }
    } else {
        cart = [];
    }
    updateCartUI();
}

function updateCartUI() {
    const countSpan = document.getElementById("cartCount");
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    if(countSpan) countSpan.innerText = totalItems;
    renderCartModal();
}

function renderCartModal() {
    const container = document.getElementById("cartItemsList");
    const totalPriceSpan = document.getElementById("cartTotalPrice");
    if(!container) return;
    if(cart.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding: 2rem;">🛒 Корзина пуста, добавьте мотоциклы!</div>`;
        if(totalPriceSpan) totalPriceSpan.innerText = `Итого: 0 ₽`;
        return;
    }
    let total = 0;
    let html = '';
    cart.forEach((item) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        html += `
            <div class="cart-item">
                <div><strong>${escapeHtml(item.name)}</strong><br>${item.price.toLocaleString()} ₽ x ${item.quantity}</div>
                <div>${itemTotal.toLocaleString()} ₽ 
                    <button class="remove-one-item" data-id="${item.id}" style="background:#e53e3e; border:none; border-radius:30px; padding:4px 12px; margin-left:8px; color:white; cursor:pointer;">−</button>
                    <button class="add-one-item" data-id="${item.id}" style="background:#2c7a4d; border:none; border-radius:30px; padding:4px 12px; margin-left:4px; cursor:pointer;">+</button>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
    if(totalPriceSpan) totalPriceSpan.innerText = `Итого: ${total.toLocaleString()} ₽`;

    // кнопки удаления/добавления в модалке
    document.querySelectorAll('.remove-one-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.id);
            const index = cart.findIndex(i => i.id === id);
            if(index !== -1) {
                if(cart[index].quantity > 1) {
                    cart[index].quantity -= 1;
                } else {
                    cart.splice(index, 1);
                }
                saveCartToLocal();
                updateCartUI();
                showToast("Корзина обновлена");
            }
        });
    });
    document.querySelectorAll('.add-one-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.id);
            const item = cart.find(i => i.id === id);
            if(item) {
                item.quantity += 1;
                saveCartToLocal();
                updateCartUI();
                showToast("Добавлена еще одна единица");
            }
        });
    });
}

function addToCart(bike) {
    const existing = cart.find(item => item.id === bike.id);
    if(existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id: bike.id, name: bike.name, price: bike.price, quantity: 1 });
    }
    saveCartToLocal();
    updateCartUI();
    showToast(`${bike.name} добавлен в корзину!`);
}

function showToast(msg) {
    const toast = document.getElementById("toastMsg");
    toast.innerText = "✓ " + msg;
    toast.style.display = "block";
    setTimeout(() => {
        toast.style.display = "none";
    }, 2000);
}

// отрисовка каталога
function renderCatalog() {
    const container = document.getElementById("catalogContainer");
    if(!container) return;
    container.innerHTML = "";
    bikes.forEach(bike => {
        const card = document.createElement("div");
        card.className = "bike-card";
        card.innerHTML = `
            <img class="bike-img" src="${bike.img}" alt="${bike.name}" onerror="this.src='imag/image7.jpg'">
            <div class="bike-info">
                <div class="bike-name">${escapeHtml(bike.name)}</div>
                <div class="bike-desc">${escapeHtml(bike.desc)}</div>
                <div class="price">${bike.price.toLocaleString()} ₽</div>
                <button class="add-to-cart" data-id="${bike.id}">➕ В корзину</button>
            </div>
        `;
        container.appendChild(card);
    });
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.id);
            const bike = bikes.find(b => b.id === id);
            if(bike) addToCart(bike);
        });
    });
}

// отрисовка отзывов
function renderReviews() {
    const container = document.getElementById("reviewsContainer");
    if(!container) return;
    container.innerHTML = "";
    [...reviews].reverse().forEach(rev => {
        const starsHtml = "★".repeat(rev.stars) + "☆".repeat(5-rev.stars);
        const card = document.createElement("div");
        card.className = "review-card";
        card.innerHTML = `
            <div class="review-name">${escapeHtml(rev.name)}</div>
            <div class="review-stars">${starsHtml}</div>
            <div class="review-text">"${escapeHtml(rev.text)}"</div>
        `;
        container.appendChild(card);
    });
}

function escapeHtml(str) { 
    return str.replace(/[&<>]/g, function(m){
        if(m==='&') return '&amp;'; 
        if(m==='<') return '&lt;'; 
        if(m==='>') return '&gt;'; 
        return m;
    }); 
}

// добавление нового отзыва через модал
function promptAddReview() {
    const name = prompt("Ваше имя:", "Дмитрий");
    if(!name) return;
    const text = prompt("Ваш отзыв о мотоциклах / магазине:");
    if(!text) return;
    let stars = 5;
    const starsInput = prompt("Оценка от 1 до 5 (поставьте цифру):", "5");
    if(starsInput && !isNaN(parseInt(starsInput))) {
        stars = Math.min(5, Math.max(1, parseInt(starsInput)));
    }
    const newReview = {
        id: Date.now(),
        name: name.slice(0, 30),
        text: text.slice(0, 300),
        stars: stars
    };
    reviews.push(newReview);
    renderReviews();
    showToast("Спасибо за ваш отзыв!");
}

// обратная связь
function sendFeedback() {
    const name = document.getElementById("feedbackName").value.trim();
    const email = document.getElementById("feedbackEmail").value.trim();
    const message = document.getElementById("feedbackMsg").value.trim();
    if(!name || !email || !message) {
        showToast("Пожалуйста, заполните все поля");
        return;
    }
    if(!email.includes("@")) {
        showToast("Введите корректный Email");
        return;
    }
    // Имитация отправки
    console.log(`Обратная связь: ${name}, ${email}, ${message}`);
    showToast(`Спасибо, ${name}! Мы ответим вам на ${email}`);
    document.getElementById("feedbackMsg").value = "";
}

// модалка корзины
function openCartModal() {
    const modal = document.getElementById("cartModal");
    if(modal) {
        renderCartModal();
        modal.style.display = "flex";
    }
}
function closeCartModal() {
    const modal = document.getElementById("cartModal");
    if(modal) modal.style.display = "none";
}

function checkoutOrder() {
    if(cart.length === 0) {
        showToast("Корзина пуста, добавьте мотоциклы");
        return;
    }
    const total = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const itemsList = cart.map(i => `${i.name} x${i.quantity}`).join(", ");
    alert(`🚀 Заказ оформлен!\nТовары: ${itemsList}\nИтого: ${total.toLocaleString()} ₽\nНаш менеджер свяжется с вами в ближайшее время.`);
    // очищаем корзину после заказа
    cart = [];
    saveCartToLocal();
    updateCartUI();
    closeCartModal();
    showToast("Заказ успешно отправлен! Спасибо за покупку!");
}

// скролл к каталогу
function scrollToCatalog() {
    const catalogSection = document.getElementById("catalog");
    if(catalogSection) catalogSection.scrollIntoView({ behavior: "smooth" });
}

// инициализация
document.addEventListener("DOMContentLoaded", () => {
    loadCartFromLocal();
    renderCatalog();
    renderReviews();

    // модалка корзины
    const cartIconBtn = document.getElementById("cartIcon");
    if(cartIconBtn) cartIconBtn.addEventListener("click", openCartModal);
    const closeModalBtn = document.getElementById("closeCartModal");
    if(closeModalBtn) closeModalBtn.addEventListener("click", closeCartModal);
    window.addEventListener("click", (e) => {
        const modal = document.getElementById("cartModal");
        if(e.target === modal) closeCartModal();
    });
    const checkoutButton = document.getElementById("checkoutBtn");
    if(checkoutButton) checkoutButton.addEventListener("click", checkoutOrder);

    // кнопка оставить отзыв
    const addReviewBtn = document.getElementById("addReviewBtn");
    if(addReviewBtn) addReviewBtn.addEventListener("click", promptAddReview);

    // кнопка обратной связи
    const sendFeed = document.getElementById("sendFeedbackBtn");
    if(sendFeed) sendFeed.addEventListener("click", sendFeedback);

    // кнопка explore
    const exploreBtn = document.getElementById("exploreCatalogBtn");
    if(exploreBtn) exploreBtn.addEventListener("click", scrollToCatalog);
});
