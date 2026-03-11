import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Plus, Minus, ArrowLeft, CheckCircle, Calendar, Users, Phone, User as UserIcon, ChefHat, Info } from 'lucide-react';

const MENU_CATEGORIES = [
  { id: 'all', name: 'Все товары' },
  { id: 'grill', name: 'Гриль зона' },
  { id: 'menu', name: 'Меню' }
];

const MENU_ITEMS = [
  // --- ГРИЛЬ ЗОНА ---
  { 
    id: 1, 
    category: 'grill', 
    name: 'Сет шашлыка XXL', 
    price: 6000, 
    desc: 'Большой мясной микс от Catering-Кудряшова — для тех, кто любит сытно, вкусно и по-мужски.\n\nСостав:\n• Люля-кебаб (говядина + баранина)\n• Шашлык из говядины\n• Шашлык из ягнёнка\n• Шашлык из курицы\n• Картофель фри\n• Лук, зелень\n• Фирменный соус (7 шт.) + Лепешки\n\n⚖️ Вес сета: 2200–2600 г', 
    image: '/set-xxl.jpg' 
  },
  { 
    id: 2, 
    category: 'grill', 
    name: 'Сет шашлыка XL', 
    price: 4000, 
    desc: 'Большой мясной микс. В одном блюде собраны топовые позиции.\n\nСостав:\n• Люля-кебаб\n• Шашлык из говядины\n• Шашлык из ягнёнка\n• Шашлык из курицы\n• Картофель фри\n• Лук, зелень\n• Фирменный соус (5 шт.)\n\n⚖️ Вес сета: 1200-1500 г', 
    image: '/set-xl.jpg' 
  },
  {
    id: 6,
    category: 'grill',
    name: 'Шашлык учпанжа',
    price: 1130,
    desc: 'Сочное мраморное мясо, маринованное в специях и обжаренное на мангале до идеальной корочки.\n\n🍽 Подача: лук + фирменный соус.\n\n⚖️ Вес: ≈ 400г',
    image: '/Shashlyk-uchpanzha.jpg'
  },
  {
    id: 7,
    category: 'grill',
    name: 'Шашлык из бараньей корейки',
    price: 920,
    desc: 'Премиальный шашлык из корейки молодого ягнёнка — мясо на косточке, обжаренное на живом огне.\n\n🍽 В подачу входит:\n• лук с зеленью\n• фирменный соус\n\n⚖️ Вес порции: ≈ 260-300 г',
    image: '/Shashlyk-iz-baranyey-koreyki.jpg'
  },
  {
    id: 8,
    category: 'grill',
    name: 'Шашлык рулет с фаршем',
    price: 520,
    desc: 'Оригинальный шашлык в виде мясных рулетиков — снаружи нежнейшее мясо, внутри сочный фарш.\n\n⚖️ Вес порции: ≈ 200 г',
    image: '/Shashlyk-rulet-s-farshem.jpg'
  },
  {
    id: 9,
    category: 'grill',
    name: 'Шашлык рулет из говядины',
    price: 520,
    desc: 'Нежное филе говядины с прослойкой курдючного сала сворачивается в спираль и обжаривается до хруста.\n\n⚖️ Вес порции: ≈ 200 г',
    image: '/Shashlyk-rulet-iz-govyadiny.jpg'
  },
  {
    id: 10,
    category: 'grill',
    name: 'Шашлык из телячьей мякоти',
    price: 420,
    desc: 'Отборная говядина, маринованная по авторскому рецепту с добавлением кусочков сала для сочности.\n\n⚖️ Вес порции: ≈ 200-220 г',
    image: '/Shashlyk-iz-telyachyey-myakoti.jpg'
  },
  {
    id: 11,
    category: 'grill',
    name: 'Шашлык наполеон нежный',
    price: 510,
    desc: 'Фирменный узбекский шашлык — мясо нарезано слоями (баранина, говядина и курдюк).\n\n⚖️ Вес порции: ≈ 190-200г',
    image: '/Shashlyk-napoleon-nezhnyy.jpg'
  },
  {
    id: 12,
    category: 'grill',
    name: 'Люля-кебаб из телятины',
    price: 420,
    desc: 'Мелкий рубленый фарш (говядина + баранина), специи и лук. Готовим на мангале.\n\n⚖️ Вес порции: ≈ 180-200 г',
    image: '/Lyulya-kebab-iz-telyatiny.jpg'
  },
  {
    id: 13,
    category: 'grill',
    name: 'Шашлык из куриных крылышек',
    price: 410,
    desc: 'Сочные крылышки в ароматном маринаде, жарим на мангале.\n\n⚖️ Вес: 230 г',
    image: '/Shashlyk-iz-kurinykh-krylyshek.jpg'
  },
  {
    id: 14,
    category: 'grill',
    name: 'Шашлык куриный',
    price: 410,
    desc: 'Классика в авторском маринаде. Курица остается сочной внутри и подрумяненной снаружи.\n\n⚖️ Вес порции: ≈ 200–220 г',
    image: '/Shashlyk-kurinyy.jpg'
  },
  {
    id: 15,
    category: 'grill',
    name: 'Грибочки на углях',
    price: 330,
    desc: 'Ароматные шампиньоны с румяной корочкой. Идеальный гарнир.\n\n⚖️ Вес порции: ≈ 190-220г',
    image: '/Gribochki-a-uglyakh.jpg'
  },
  {
    id: 16,
    category: 'grill',
    name: 'Шашлык из овощей гриль',
    price: 480,
    desc: 'Баклажан, кабачок, перец и шампиньон, обжаренные до мягкости.\n\n⚖️ Вес порции: ≈ 250г',
    image: '/Shashlyk-iz-ovoshchey-gril.jpg'
  },
  {
    id: 17,
    category: 'grill',
    name: 'Картошечка фри',
    price: 180,
    desc: 'Золотистая и хрустящая — идеальный гарнир.\n\n⚖️ Порция: 150 г',
    image: '/Kartoshechka-fri.jpg'
  },
  {
    id: 18,
    category: 'grill',
    name: 'Лепешка тандыр',
    price: 130,
    desc: 'Свежая, румяная лепешка из тандыра.\n\n⚖️ Порция: 1 шт',
    image: '/Lepeshka-tandyr.jpg'
  },

  // --- МЕНЮ ---
  { 
    id: 3, 
    category: 'menu', 
    name: 'Плов', 
    price: 550, 
    desc: 'Настоящий узбекский плов с мясом, нутом и изюмом. Подается с салатом и лепешкой.\n\n⚖️ Вес: ≈ 370г', 
    image: '/plov.jpg' 
  },
  { 
    id: 4, 
    category: 'menu', 
    name: 'Казан кебаб', 
    price: 600, 
    desc: 'Томлёная говядина с картофелем и специями. Подано с овощами и соусом.\n\n⚖️ Вес: ≈ 400г', 
    image: '/kazan-kebab.jpg' 
  },
  {
    id: 19,
    category: 'menu',
    name: 'Долма',
    price: 580,
    desc: 'Виноградные листья с мясом и рисом. Подаётся со сметаной.\n\n⚖️ Порция: 7 штук',
    image: '/Dolma.jpg'
  },
  {
    id: 20,
    category: 'menu',
    name: 'Жиз',
    price: 620,
    desc: 'Нежное отварное мясо с картофелем и луком. Традиционный вкус.\n\n⚖️ Вес: 350 г',
    image: '/Zhiz.jpg'
  },
  {
    id: 21,
    category: 'menu',
    name: 'Лагман жаренный',
    price: 500,
    desc: 'Обжаренная лапша с мясом и овощами. Очень сытно.',
    image: '/Lagman-zharennyy.jpg'
  },
  {
    id: 22,
    category: 'menu',
    name: 'Манты',
    price: 510,
    desc: 'Сочная говядина и лук в тонком тесте. На пару.\n\n⚖️ Порция: 5 штук',
    image: '/Manty.jpg'
  },
  { 
    id: 23, 
    category: 'menu', 
    name: 'Манты жареные', 
    price: 540, 
    desc: 'Хрустящая корочка и сочная начинка. Подаются со сметаной.\n\n⚖️ Порция: 5 штук', 
    image: '/Manty-zharenye.jpg' 
  },
  {
    id: 24,
    category: 'menu',
    name: 'Борщ',
    price: 460,
    desc: 'Домашний борщ на мясном бульоне со сметаной.\n\n⚖️ Вес: 500 г',
    image: '/Borshch.jpg'
  },
  {
    id: 25,
    category: 'menu',
    name: 'Мастава',
    price: 480,
    desc: 'Густой узбекский рисовый суп с говядиной.',
    image: '/Mastava.jpg'
  },
  {
    id: 26,
    category: 'menu',
    name: 'Лагман',
    price: 480,
    desc: 'Домашняя лапша с тушёным мясом и овощами.',
    image: '/Lagman.jpg'
  },
  {
    id: 27,
    category: 'menu',
    name: 'Салат цезарь',
    price: 330,
    desc: 'Куриное филе, сухарики, черри и пармезан.\n\n⚖️ Порция: 200 г',
    image: '/Salat-tsezar.jpg'
  },
  {
    id: 28,
    category: 'menu',
    name: 'Картошечка фри',
    price: 180,
    desc: 'Золотистая и хрустящая картошечка фри.\n\n⚖️ Порция: 150 г',
    image: '/Kartoshechka-fri.jpg'
  },
  {
    id: 29,
    category: 'menu',
    name: 'Лепешка тандыр',
    price: 130,
    desc: 'Свежая, румяная лепешка из тандыра.\n\n⚖️ Порция: 1 шт',
    image: '/Lepeshka-tandyr.jpg'
  },
  {
    id: 30,
    category: 'menu',
    name: 'Наггетсы',
    price: 310,
    desc: '🔥 Обжарка до румяной корочки\n🥩 Мясо куриное, натуральное\n🍗 Количество: 6 штук',
    image: '/Naggetsy.jpg'
  },
  {
    id: 31,
    category: 'menu',
    name: 'Бургер сочная котлета',
    price: 430,
    desc: '🔥 Приготовление на мангале или гриле\n🥩 Только свежие продукты\n🍔 Вес бургера: ≈ 350 г',
    image: '/Burger-sochnaya-kotleta.jpg'
  }
];

// ВНИМАНИЕ! После того как задеплоите бэкенд (server.js), вставьте сюда ссылку:
// Например: const BACKEND_URL = 'https://my-backend-server.onrender.com';
const BACKEND_URL = 'catering-backendv14-production.up.railway.app'; // Пока оставил локалхост для разработки

export default function App() {
  const [cart, setCart] = useState({});
  const [activeCategory, setActiveCategory] = useState('all');
  const [view, setView] = useState('menu'); 
  const [expandedItems, setExpandedItems] = useState({});
  const [toastMessage, setToastMessage] = useState('');
  const toastTimeout = useRef(null);
  
  const [formData, setFormData] = useState({
    guests: '',
    date: '',
    name: '',
    phone: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
    }
  }, []);

  const updateCart = (itemId, delta) => {
    setCart(prev => {
      const currentQty = prev[itemId] || 0;
      const newQty = currentQty + delta;
      if (newQty <= 0) {
        const newCart = { ...prev };
        delete newCart[itemId];
        return newCart;
      }
      return { ...prev, [itemId]: newQty };
    });
  };

  const getCartTotal = () => {
    let total = 0;
    let count = 0;
    Object.entries(cart).forEach(([id, qty]) => {
      const item = MENU_ITEMS.find(item => item.id === parseInt(id));
      if (item) {
        total += item.price * qty;
        count += qty;
      }
    });
    return { total, count };
  };

  const { total: cartTotal, count: cartCount } = getCartTotal();

  const handleAddToCart = (itemId) => {
    updateCart(itemId, 1);
    setToastMessage('Правильный выбор! ✨');
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => setToastMessage(''), 2000);
  };

  const toggleExpand = (itemId) => {
    setExpandedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!formData.guests || !formData.date || !formData.name || !formData.phone) {
      setToastMessage('Заполните все поля ❗️');
      if (toastTimeout.current) clearTimeout(toastTimeout.current);
      toastTimeout.current = setTimeout(() => setToastMessage(''), 3000);
      return;
    }

    setIsSubmitting(true);

    const orderItems = Object.entries(cart).map(([id, qty]) => {
      const item = MENU_ITEMS.find(i => i.id === parseInt(id));
      return { name: item.name, price: item.price, quantity: qty };
    });

    const orderData = {
      details: formData,
      items: orderItems,
      total: cartTotal
    };

    try {
      // ИСПОЛЬЗУЕМ ПЕРЕМЕННУЮ BACKEND_URL ЗДЕСЬ
      const response = await fetch(`${BACKEND_URL}/api/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        setView('success');
        setCart({});
        setFormData({ guests: '', date: '', name: '', phone: '' });
      } else {
        throw new Error('Ошибка сервера');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      setToastMessage('Сервер недоступен ❌');
      if (toastTimeout.current) clearTimeout(toastTimeout.current);
      toastTimeout.current = setTimeout(() => setToastMessage(''), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (view === 'menu') {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-gray-50 pb-28 font-sans text-gray-800 relative">
        <div className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${toastMessage ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none'}`}>
          <div className="bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl border border-white/10">
            <span className="font-semibold text-sm uppercase">{toastMessage}</span>
          </div>
        </div>

        <div className="relative h-48 bg-gray-900 flex items-center justify-center overflow-hidden">
          <img src="https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=600" alt="Catering" className="absolute inset-0 w-full h-full object-cover opacity-40" />
          <div className="relative z-10 text-center px-4">
            <ChefHat size={32} className="text-orange-400 mx-auto mb-2" />
            <h1 className="text-2xl font-bold text-white tracking-wide">Catering-Кудряшова</h1>
            <p className="text-gray-300 text-sm mt-1">Идеальный вкус вашего мероприятия</p>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-20 border-b border-gray-100">
          <div className="flex overflow-x-auto px-4 py-3 gap-2 hide-scrollbar">
            {MENU_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeCategory === cat.id ? 'bg-gray-900 text-white shadow-md scale-105' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 space-y-5">
          {MENU_ITEMS
            .filter(item => {
              if (activeCategory === 'all') {
                if (item.category === 'menu' && (item.name === 'Картошечка фри' || item.name === 'Лепешка тандыр')) return false;
                return true;
              }
              return item.category === activeCategory;
            })
            .map(item => {
              const qty = cart[item.id] || 0;
              const isExpanded = expandedItems[item.id];
              const isLong = item.desc.length > 100;
              const displayDesc = isExpanded || !isLong ? item.desc : item.desc.slice(0, 100).trim() + '...';

              return (
                <div key={item.id} className="bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col transition-transform active:scale-[0.99]">
                  <div className="h-52 relative">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full shadow-sm font-bold text-gray-900">
                      {item.price} ₽
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-lg text-gray-900 mb-1.5">{item.name}</h3>
                    <div className="mb-4 text-gray-500 text-sm leading-relaxed whitespace-pre-line">
                      {displayDesc}
                      {isLong && (
                        <button onClick={() => toggleExpand(item.id)} className="text-orange-500 font-medium ml-1">
                          {isExpanded ? 'Свернуть' : 'Читать далее'}
                        </button>
                      )}
                    </div>
                    <div className="mt-auto pt-2">
                      {qty === 0 ? (
                        <button onClick={() => handleAddToCart(item.id)} className="w-full bg-gray-900 text-white py-2.5 rounded-xl flex justify-center items-center shadow-md active:scale-95 transition-all">
                          <Plus size={24} />
                        </button>
                      ) : (
                        <div className="flex items-center justify-between bg-gray-900 rounded-xl p-1.5">
                          <button onClick={() => updateCart(item.id, -1)} className="p-2 text-white/80 hover:bg-white/10 rounded-lg">
                            <Minus size={20} />
                          </button>
                          <span className="font-bold text-white text-lg w-10 text-center">{qty}</span>
                          <button onClick={() => updateCart(item.id, 1)} className="p-2 text-white hover:bg-white/10 rounded-lg">
                            <Plus size={20} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
          })}
        </div>

        {cartCount > 0 && (
          <div className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto p-4 z-30">
            <button onClick={() => setView('checkout')} className="w-full bg-orange-500 text-white rounded-2xl py-4 font-bold shadow-xl flex items-center justify-between px-6 active:scale-95 transition-all">
              <div className="flex items-center gap-3">
                <ShoppingCart size={22} />
                <div className="flex flex-col items-start">
                  <span className="text-xs font-medium text-orange-100">Ваш заказ</span>
                  <span className="leading-none">{cartCount} позиций</span>
                </div>
              </div>
              <span className="text-xl">{cartTotal} ₽</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  if (view === 'checkout') {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-gray-50 flex flex-col font-sans">
        <div className="bg-white shadow-sm p-4 flex items-center gap-3 sticky top-0 z-20">
          <button onClick={() => setView('menu')} className="p-2 -ml-2 text-gray-400"><ArrowLeft size={24} /></button>
          <h1 className="text-xl font-bold">Оформление</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
          <div className="bg-white rounded-3xl p-5 shadow-sm">
            <h2 className="font-bold text-lg mb-4">Ваш заказ</h2>
            <div className="space-y-4">
              {Object.entries(cart).map(([id, qty]) => {
                const item = MENU_ITEMS.find(i => i.id === parseInt(id));
                return (
                  <div key={id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">{qty} шт × {item.name}</span>
                    <span className="font-bold">{item.price * qty} ₽</span>
                  </div>
                );
              })}
            </div>
            <div className="border-t pt-4 mt-4 flex justify-between items-end">
              <span className="text-gray-500">Итого:</span>
              <span className="font-black text-2xl">{cartTotal} ₽</span>
            </div>
          </div>
          
          <div className="space-y-4">
             <div className="bg-white rounded-3xl p-5 shadow-sm space-y-4">
               <h2 className="font-bold text-lg">Детали</h2>
               <div className="relative">
                 <Users size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                 <input type="number" name="guests" placeholder="Гостей" className="w-full bg-gray-50 border rounded-2xl pl-12 pr-4 py-3 outline-none" value={formData.guests} onChange={handleInputChange} />
               </div>
               <div className="relative">
                 <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                 <input type="date" name="date" className="w-full bg-gray-50 border rounded-2xl pl-12 pr-4 py-3 outline-none" value={formData.date} onChange={handleInputChange} />
               </div>
               <div className="relative">
                 <UserIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                 <input type="text" name="name" placeholder="Ваше Имя" className="w-full bg-gray-50 border rounded-2xl pl-12 pr-4 py-3 outline-none" value={formData.name} onChange={handleInputChange} />
               </div>
               <div className="relative">
                 <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                 <input type="tel" name="phone" placeholder="Телефон" className="w-full bg-gray-50 border rounded-2xl pl-12 pr-4 py-3 outline-none" value={formData.phone} onChange={handleInputChange} />
               </div>
             </div>
          </div>
        </div>
        <div className="p-4 bg-white border-t sticky bottom-0">
          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className={`w-full text-white rounded-2xl py-4 font-bold text-lg transition-all ${
              isSubmitting ? 'bg-gray-400' : 'bg-gray-900 active:scale-95'
            }`}
          >
            {isSubmitting ? 'Отправляем...' : 'Оставить заявку'}
          </button>
        </div>
      </div>
    );
  }

  if (view === 'success') {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center font-sans">
        <CheckCircle size={64} className="text-green-500 mb-6 animate-bounce" />
        <h1 className="text-3xl font-black mb-4">Принято!</h1>
        <p className="text-gray-500 mb-8">Менеджер свяжется с вами по номеру <b>{formData.phone}</b> в ближайшее время.</p>
        <button onClick={() => window.Telegram?.WebApp?.close()} className="w-full bg-gray-100 py-4 rounded-2xl font-bold">Закрыть</button>
      </div>
    );
  }

  return null;
}
