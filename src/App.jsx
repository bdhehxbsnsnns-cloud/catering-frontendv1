import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Plus, Minus, ArrowLeft, CheckCircle, Calendar, Users, Phone, User as UserIcon, ChefHat, Lock, Edit2, Trash2, Image as ImageIcon, Save, X } from 'lucide-react';

const MENU_CATEGORIES = [
  { id: 'all', name: 'Все товары' },
  { id: 'grill', name: 'Гриль зона' },
  { id: 'menu', name: 'Меню' }
];

// Ссылка на ваш рабочий сервер Railway
const BACKEND_URL = 'https://catering-backendv14-production.up.railway.app';
const ADMIN_PASSWORD = 'cateringMiniApp'; // Пароль для входа в админку

export default function App() {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [cart, setCart] = useState({});
  const [activeCategory, setActiveCategory] = useState('all');
  const [view, setView] = useState('menu'); // menu, checkout, success, admin_login, admin_dashboard
  const [expandedItems, setExpandedItems] = useState({});
  const [toastMessage, setToastMessage] = useState('');
  const toastTimeout = useRef(null);
  
  const [formData, setFormData] = useState({ guests: '', date: '', name: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- СОСТОЯНИЯ АДМИНКИ ---
  const [adminPassInput, setAdminPassInput] = useState('');
  const [adminForm, setAdminForm] = useState({ name: '', category: 'grill', price: '', desc: '', image: '' });
  const [editingId, setEditingId] = useState(null);

  // Загружаем товары из базы данных при старте
  useEffect(() => {
    fetchMenu();
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
    }
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/menu`);
      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      console.error('Ошибка загрузки меню:', error);
      showToast('Ошибка загрузки меню ❌');
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => setToastMessage(''), 3000);
  };

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
      const item = menuItems.find(item => item._id === id);
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
    showToast('Добавлено в заказ! ✨');
  };

  const toggleExpand = (itemId) => {
    setExpandedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e) => {
    if (e) e.preventDefault();
    
    if (!formData.guests || !formData.date || !formData.name || !formData.phone) {
      showToast('Заполните все поля ❗️');
      return;
    }

    setIsSubmitting(true);

    const orderItems = Object.entries(cart).map(([id, qty]) => {
      const item = menuItems.find(i => i._id === id);
      return { name: item.name, price: item.price, quantity: qty };
    });

    const orderData = {
      details: formData,
      items: orderItems,
      total: cartTotal
    };

    try {
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
      showToast('Сервер недоступен ❌');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- ФУНКЦИИ АДМИНКИ ---
  const handleAdminLogin = () => {
    if (adminPassInput === ADMIN_PASSWORD) {
      setView('admin_dashboard');
      setAdminPassInput('');
    } else {
      showToast('Неверный пароль ❌');
    }
  };

  const saveMenuItem = async () => {
    if (!adminForm.name || !adminForm.price || !adminForm.image) {
      showToast('Заполните название, цену и фото ❗️');
      return;
    }

    const isEditing = editingId !== null;
    const url = isEditing ? `${BACKEND_URL}/api/menu/${editingId}` : `${BACKEND_URL}/api/menu`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...adminForm, price: Number(adminForm.price) })
      });

      if (response.ok) {
        showToast(isEditing ? 'Изменено! ✅' : 'Добавлено! ✅');
        setAdminForm({ name: '', category: 'grill', price: '', desc: '', image: '' });
        setEditingId(null);
        fetchMenu(); // Обновляем список
      }
    } catch (error) {
      showToast('Ошибка сохранения ❌');
    }
  };

  const deleteMenuItem = async (id) => {
    if (!window.confirm('Точно удалить этот товар?')) return;
    try {
      await fetch(`${BACKEND_URL}/api/menu/${id}`, { method: 'DELETE' });
      showToast('Удалено! 🗑');
      fetchMenu();
    } catch (error) {
      showToast('Ошибка удаления ❌');
    }
  };

  const startEditing = (item) => {
    setEditingId(item._id);
    setAdminForm({
      name: item.name,
      category: item.category,
      price: item.price,
      desc: item.desc,
      image: item.image
    });
    window.scrollTo(0, 0);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setAdminForm({ name: '', category: 'grill', price: '', desc: '', image: '' });
  };

  // --- ГЛОБАЛЬНЫЙ ТОСТЕР (Уведомления) ---
  const ToastComponent = () => (
    <div className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${toastMessage ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none'}`}>
      <div className="bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl border border-white/10">
        <span className="font-semibold text-sm uppercase">{toastMessage}</span>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-orange-500">
        <ChefHat size={48} className="animate-bounce" />
      </div>
    );
  }

  // ==========================================
  // ВИД 1: ГЛАВНОЕ МЕНЮ
  // ==========================================
  if (view === 'menu') {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-gray-50 pb-28 font-sans text-gray-800 relative">
        <ToastComponent />

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
          {menuItems.length === 0 ? (
             <div className="text-center py-10 text-gray-400">
               <p>Меню пока пусто.</p>
               <p className="text-sm mt-2">Администратор скоро добавит вкусные блюда!</p>
             </div>
          ) : (
            menuItems
              .filter(item => activeCategory === 'all' || item.category === activeCategory)
              .map(item => {
                const qty = cart[item._id] || 0;
                const isExpanded = expandedItems[item._id];
                const isLong = item.desc && item.desc.length > 100;
                const displayDesc = isExpanded || !isLong ? item.desc : item.desc.slice(0, 100).trim() + '...';

                return (
                  <div key={item._id} className="bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col transition-transform active:scale-[0.99]">
                    <div className="h-52 relative bg-gray-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=Нет+Фото' }} />
                      <div className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full shadow-sm font-bold text-gray-900">
                        {item.price} ₽
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-bold text-lg text-gray-900 mb-1.5">{item.name}</h3>
                      <div className="mb-4 text-gray-500 text-sm leading-relaxed whitespace-pre-line">
                        {displayDesc}
                        {isLong && (
                          <button onClick={() => toggleExpand(item._id)} className="text-orange-500 font-medium ml-1">
                            {isExpanded ? 'Свернуть' : 'Читать далее'}
                          </button>
                        )}
                      </div>
                      <div className="mt-auto pt-2">
                        {qty === 0 ? (
                          <button onClick={() => handleAddToCart(item._id)} className="w-full bg-gray-900 text-white py-2.5 rounded-xl flex justify-center items-center shadow-md active:scale-95 transition-all">
                            <Plus size={24} />
                          </button>
                        ) : (
                          <div className="flex items-center justify-between bg-gray-900 rounded-xl p-1.5">
                            <button onClick={() => updateCart(item._id, -1)} className="p-2 text-white/80 hover:bg-white/10 rounded-lg"><Minus size={20} /></button>
                            <span className="font-bold text-white text-lg w-10 text-center">{qty}</span>
                            <button onClick={() => updateCart(item._id, 1)} className="p-2 text-white hover:bg-white/10 rounded-lg"><Plus size={20} /></button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
            })
          )}
        </div>

        {/* КНОПКА ВХОДА В АДМИНКУ */}
        <div className="py-8 flex justify-center">
          <button onClick={() => setView('admin_login')} className="p-3 text-gray-300 hover:text-gray-400 transition-colors">
            <Lock size={16} />
          </button>
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

  // ==========================================
  // ВИД 2: ОФОРМЛЕНИЕ ЗАКАЗА
  // ==========================================
  if (view === 'checkout') {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-gray-50 flex flex-col font-sans">
        <ToastComponent />
        <div className="bg-white shadow-sm p-4 flex items-center gap-3 sticky top-0 z-20">
          <button onClick={() => setView('menu')} className="p-2 -ml-2 text-gray-400"><ArrowLeft size={24} /></button>
          <h1 className="text-xl font-bold">Оформление</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
          <div className="bg-white rounded-3xl p-5 shadow-sm">
            <h2 className="font-bold text-lg mb-4">Ваш заказ</h2>
            <div className="space-y-4">
              {Object.entries(cart).map(([id, qty]) => {
                const item = menuItems.find(i => i._id === id);
                if (!item) return null;
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
          <button onClick={handleSubmitOrder} disabled={isSubmitting} className={`w-full text-white rounded-2xl py-4 font-bold text-lg transition-all ${isSubmitting ? 'bg-gray-400' : 'bg-gray-900 active:scale-95'}`}>
            {isSubmitting ? 'Отправляем...' : 'Оставить заявку'}
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // ВИД 3: УСПЕШНЫЙ ЗАКАЗ
  // ==========================================
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

  // ==========================================
  // ВИД 4: АВТОРИЗАЦИЯ АДМИНА
  // ==========================================
  if (view === 'admin_login') {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8 font-sans">
        <ToastComponent />
        <div className="w-full bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center">
          <Lock size={48} className="text-gray-900 mb-4" />
          <h1 className="text-2xl font-bold mb-6 text-gray-900">Админ-панель</h1>
          <input 
            type="password" 
            placeholder="Введите пароль" 
            className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 text-center text-lg mb-4 outline-none focus:border-gray-900 transition-colors"
            value={adminPassInput}
            onChange={(e) => setAdminPassInput(e.target.value)}
          />
          <button onClick={handleAdminLogin} className="w-full bg-gray-900 text-white rounded-xl py-3 font-bold active:scale-95 transition-transform">
            Войти
          </button>
          <button onClick={() => setView('menu')} className="mt-4 text-gray-400 text-sm font-medium">Вернуться в меню</button>
        </div>
      </div>
    );
  }

  // ==========================================
  // ВИД 5: ПАНЕЛЬ УПРАВЛЕНИЯ (АДМИНКА)
  // ==========================================
  if (view === 'admin_dashboard') {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-gray-50 flex flex-col font-sans">
        <ToastComponent />
        <div className="bg-gray-900 text-white p-4 flex items-center justify-between sticky top-0 z-20">
          <h1 className="text-xl font-bold flex items-center gap-2"><Lock size={20} /> Управление меню</h1>
          <button onClick={() => { setView('menu'); fetchMenu(); }} className="text-gray-300 hover:text-white"><X size={24} /></button>
        </div>

        <div className="p-4 space-y-6 pb-20">
          {/* Форма добавления/редактирования */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800">
              {editingId ? <><Edit2 size={18} className="text-orange-500" /> Редактирование</> : <><Plus size={18} className="text-green-500" /> Новый товар</>}
            </h2>
            <div className="space-y-3 text-sm">
              <input type="text" placeholder="Название (Сет шашлыка XXL)" className="w-full border rounded-xl px-4 py-2.5 outline-none bg-gray-50 focus:bg-white" value={adminForm.name} onChange={e => setAdminForm({...adminForm, name: e.target.value})} />
              
              <div className="flex gap-3">
                <input type="number" placeholder="Цена (₽)" className="w-1/2 border rounded-xl px-4 py-2.5 outline-none bg-gray-50 focus:bg-white" value={adminForm.price} onChange={e => setAdminForm({...adminForm, price: e.target.value})} />
                <select className="w-1/2 border rounded-xl px-4 py-2.5 outline-none bg-gray-50" value={adminForm.category} onChange={e => setAdminForm({...adminForm, category: e.target.value})}>
                  <option value="grill">Гриль зона</option>
                  <option value="menu">Меню</option>
                </select>
              </div>

              <textarea placeholder="Описание блюда (состав, вес)..." rows="3" className="w-full border rounded-xl px-4 py-2.5 outline-none bg-gray-50 focus:bg-white resize-none" value={adminForm.desc} onChange={e => setAdminForm({...adminForm, desc: e.target.value})}></textarea>
              
              <div className="relative">
                <ImageIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Ссылка на фото (https://...)" className="w-full border rounded-xl pl-11 pr-4 py-2.5 outline-none bg-gray-50 focus:bg-white" value={adminForm.image} onChange={e => setAdminForm({...adminForm, image: e.target.value})} />
              </div>

              {adminForm.image && (
                <div className="mt-2 text-center text-xs text-gray-500">
                  Превью фото: <br/>
                  <img src={adminForm.image} alt="preview" className="mt-1 h-20 object-cover rounded-lg mx-auto inline-block border" onError={(e) => e.target.style.display = 'none'} />
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button onClick={saveMenuItem} className="flex-1 bg-green-500 text-white rounded-xl py-3 font-bold flex justify-center items-center gap-2 active:scale-95 transition-transform">
                  <Save size={18} /> Сохранить
                </button>
                {editingId && (
                  <button onClick={cancelEditing} className="flex-1 bg-gray-200 text-gray-700 rounded-xl py-3 font-bold active:scale-95 transition-transform">
                    Отмена
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Список существующих товаров */}
          <div>
            <h2 className="font-bold text-gray-500 uppercase text-xs mb-3 tracking-wider px-2">Существующие товары ({menuItems.length})</h2>
            <div className="space-y-3">
              {menuItems.map(item => (
                <div key={item._id} className="bg-white p-3 rounded-2xl flex items-center gap-3 shadow-sm border border-gray-50">
                  <img src={item.image} alt="" className="w-16 h-16 rounded-xl object-cover bg-gray-100" onError={(e) => { e.target.src = 'https://placehold.co/100?text=Нет' }} />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 truncate">{item.name}</h4>
                    <p className="text-gray-500 text-sm font-medium">{item.price} ₽ <span className="text-xs text-gray-400 ml-1">({item.category === 'grill' ? 'Гриль' : 'Меню'})</span></p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => startEditing(item)} className="p-2.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 active:scale-90"><Edit2 size={18} /></button>
                    <button onClick={() => deleteMenuItem(item._id)} className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 active:scale-90"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
