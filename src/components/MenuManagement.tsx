import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  LayoutGrid, 
  List, 
  Edit, 
  Trash2,
  Tag,
  GripVertical,
  X,
  Save,
  Image as ImageIcon
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  count: number;
}

interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  inStock: boolean;
  tags: string[];
  variants?: string[];
}

const mockCategories: Category[] = [
  { id: 'c1', name: 'Khai vị', count: 8 },
  { id: 'c2', name: 'Món chính', count: 24 },
  { id: 'c3', name: 'Tráng miệng', count: 12 },
  { id: 'c4', name: 'Đồ uống', count: 18 },
  { id: 'c5', name: 'Rượu vang', count: 35 },
];

const mockItems: MenuItem[] = [
  {
    id: 'm1',
    categoryId: 'c2',
    name: 'Bò Wagyu A5 áp chảo',
    description: 'Thăn bò Wagyu thượng hạng mềm tan trong miệng, quyện cùng sốt tiêu đen nồng nàn và măng tây nướng.',
    price: 1250000,
    image: 'https://picsum.photos/seed/wagyu/400/300',
    inStock: true,
    tags: ["Chef's Choice", 'Best Seller'],
    variants: ['Rare', 'Medium Rare', 'Well Done']
  },
  {
    id: 'm2',
    categoryId: 'c2',
    name: 'Cá hồi Na Uy sốt chanh dây',
    description: 'Cá hồi tươi nướng da giòn, dùng kèm sốt chanh dây chua ngọt và khoai tây nghiền.',
    price: 450000,
    image: 'https://picsum.photos/seed/salmon/400/300',
    inStock: false,
    tags: ['New'],
    variants: ['Sốt chanh dây', 'Sốt bơ tỏi']
  },
  {
    id: 'm3',
    categoryId: 'c1',
    name: 'Súp bí đỏ nấm truffle',
    description: 'Súp bí đỏ kem tươi mịn màng, điểm xuyết hương nấm truffle đặc trưng.',
    price: 180000,
    image: 'https://picsum.photos/seed/soup/400/300',
    inStock: true,
    tags: ['Vegetarian'],
  },
  {
    id: 'm4',
    categoryId: 'c5',
    name: 'Château Margaux 2015',
    description: 'Vang đỏ Pháp thượng hạng với hương thơm phức hợp của trái cây đen, gỗ sồi và vanilla.',
    price: 8500000,
    image: 'https://picsum.photos/seed/wine/400/300',
    inStock: true,
    tags: ['Premium'],
    variants: ['Ly (150ml)', 'Chai (750ml)']
  },
  {
    id: 'm5',
    categoryId: 'c2',
    name: 'Mỳ Ý Hải Sản (Seafood Pasta)',
    description: 'Mỳ Ý sợi dẹt xào cùng tôm sú, mực ống, vẹm xanh và sốt cà chua cay nhẹ.',
    price: 320000,
    image: 'https://picsum.photos/seed/pasta/400/300',
    inStock: true,
    tags: ['Spicy', 'Best Seller'],
  }
];

export default function MenuManagement() {
  const [activeCategory, setActiveCategory] = useState<string>('c2');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [items, setItems] = useState<MenuItem[]>(mockItems);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '',
    price: 0,
    description: '',
    categoryId: 'c2',
    tags: [],
    inStock: true,
    image: ''
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const toggleStock = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, inStock: !item.inStock } : item));
  };



  const handleSaveItem = () => {
    if (!newItem.name || !newItem.price) return;

    if (editingId) {
      // Update existing item
      setItems(items.map(item => item.id === editingId ? {
        ...item,
        categoryId: newItem.categoryId || item.categoryId,
        name: newItem.name!,
        description: newItem.description || '',
        price: newItem.price!,
        image: newItem.image || item.image,
        tags: newItem.tags || item.tags,
        variants: newItem.variants || item.variants
      } : item));
    } else {
      // Add new item
      const item: MenuItem = {
        id: `m${Date.now()}`,
        categoryId: newItem.categoryId || activeCategory,
        name: newItem.name!,
        description: newItem.description || '',
        price: newItem.price!,
        image: newItem.image || `https://picsum.photos/seed/${Date.now()}/400/300`,
        inStock: true,
        tags: newItem.tags || [],
        variants: newItem.variants || []
      };
      setItems([item, ...items]);
    }

    setIsModalOpen(false);
    setEditingId(null);
    setNewItem({
      name: '',
      price: 0,
      description: '',
      categoryId: activeCategory,
      tags: [],
      inStock: true,
      image: ''
    });
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingId(item.id);
    setNewItem({
      name: item.name,
      price: item.price,
      description: item.description,
      categoryId: item.categoryId,
      tags: item.tags,
      inStock: item.inStock,
      image: item.image,
      variants: item.variants
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setNewItem({
      name: '',
      price: 0,
      description: '',
      categoryId: activeCategory,
      tags: [],
      inStock: true,
      image: ''
    });
  };

  const filteredItems = items.filter(item => item.categoryId === activeCategory);

  const getTagColor = (tag: string) => {
    switch (tag) {
      case "Chef's Choice": return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Best Seller': return 'bg-red-100 text-red-700 border-red-200';
      case 'New': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Vegetarian': return 'bg-green-100 text-green-700 border-green-200';
      case 'Spicy': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="flex h-full bg-gray-50 overflow-hidden relative">
      
      {/* Left Sidebar: Categories (Desktop) */}
      <div className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col flex-shrink-0">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-800">Danh mục món</h3>
          <button className="p-1 hover:bg-gray-100 rounded text-gray-500 transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {mockCategories.map(cat => (
            <div 
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors group ${
                activeCategory === cat.id ? 'bg-teal-50 text-teal-700' : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 cursor-grab" />
                <span className="font-medium text-sm">{cat.name}</span>
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                activeCategory === cat.id ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {items.filter(i => i.categoryId === cat.id).length}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content: Items */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="px-4 md:px-6 py-4 bg-white border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4 flex-shrink-0">
          <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                {mockCategories.find(c => c.id === activeCategory)?.name}
              </h2>
              {/* Mobile Add Button (visible only on mobile next to title) */}
              <button 
                onClick={() => setIsModalOpen(true)}
                className="md:hidden flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                Thêm
              </button>
            </div>
            
            <div className="hidden md:block h-6 w-px bg-gray-200"></div>
            
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Tìm món ăn..." 
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
          </div>

          {/* Mobile Categories (Horizontal Scroll) */}
          <div className="md:hidden flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {mockCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`
                  px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border
                  ${activeCategory === cat.id ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-600 border-gray-200'}
                `}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between md:justify-end gap-4">
            {/* View Toggle */}
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="hidden md:flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              Thêm món mới
            </button>
          </div>
        </div>

        {/* Items Grid/List */}
        <div className="flex-1 overflow-y-auto p-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map(item => (
                <div key={item.id} className={`bg-white rounded-xl border overflow-hidden shadow-sm transition-all hover:shadow-md flex flex-col ${!item.inStock ? 'opacity-75 grayscale-[0.5]' : 'border-gray-200'}`}>
                  {/* Image */}
                  <div className="relative h-48 bg-gray-100">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                      {item.tags.map(tag => (
                        <span key={tag} className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wide rounded border shadow-sm backdrop-blur-md bg-white/90 ${getTagColor(tag)}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    {!item.inStock && (
                      <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">HẾT HÀNG</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900 leading-tight">{item.name}</h3>
                      <span className="font-bold text-teal-600 whitespace-nowrap ml-2">{formatPrice(item.price)}</span>
                    </div>
                    
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3 flex-1">
                      {item.description}
                    </p>

                    {item.variants && (
                      <div className="mb-4 flex flex-wrap gap-1">
                        {item.variants.map(v => (
                          <span key={v} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded border border-gray-200">
                            {v}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Actions & Toggles */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-600">Còn hàng</span>
                        <div 
                          onClick={() => toggleStock(item.id)}
                          className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors ${item.inStock ? 'bg-teal-500' : 'bg-gray-300'}`}
                        >
                          <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-sm transform duration-300 ease-in-out ${item.inStock ? 'translate-x-4.5' : ''}`} />
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => handleEditItem(item)}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" 
                          title="Sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                    <th className="px-6 py-4">Món ăn</th>
                    <th className="px-6 py-4">Giá bán</th>
                    <th className="px-6 py-4">Tùy chọn (Variants)</th>
                    <th className="px-6 py-4">Trạng thái</th>
                    <th className="px-6 py-4 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredItems.map(item => (
                    <tr key={item.id} className={`hover:bg-gray-50 transition-colors ${!item.inStock ? 'bg-gray-50/50' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-gray-200" referrerPolicy="no-referrer" />
                          <div>
                            <div className="font-medium text-gray-900">{item.name}</div>
                            <div className="flex gap-1 mt-1">
                              {item.tags.map(tag => (
                                <span key={tag} className={`px-1.5 py-0.5 text-[9px] font-bold uppercase rounded border ${getTagColor(tag)}`}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-teal-600">{formatPrice(item.price)}</td>
                      <td className="px-6 py-4">
                        {item.variants ? (
                          <div className="flex flex-wrap gap-1">
                            {item.variants.map(v => (
                              <span key={v} className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] rounded border border-gray-200">
                                {v}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div 
                          onClick={() => toggleStock(item.id)}
                          className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${item.inStock ? 'bg-teal-500' : 'bg-gray-300'}`}
                        >
                          <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform duration-300 ease-in-out ${item.inStock ? 'translate-x-5' : ''}`} />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleEditItem(item)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" 
                            title="Sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Xóa">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-800">
                {editingId ? 'Cập nhật món ăn' : 'Thêm món mới'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên món ăn</label>
                <input 
                  type="text" 
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="VD: Bò bít tết sốt tiêu đen"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                  <select 
                    value={newItem.categoryId}
                    onChange={(e) => setNewItem({ ...newItem, categoryId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    {mockCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giá bán (VNĐ)</label>
                  <input 
                    type="number" 
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả món ăn</label>
                <textarea 
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  rows={3}
                  placeholder="Mô tả chi tiết về nguyên liệu, hương vị..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh (URL)</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <ImageIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      value={newItem.image}
                      onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Để trống sẽ sử dụng ảnh ngẫu nhiên.</p>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={handleCloseModal}
                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Hủy
              </button>
              <button 
                onClick={handleSaveItem}
                className="px-4 py-2 bg-teal-600 text-white hover:bg-teal-700 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingId ? 'Lưu thay đổi' : 'Lưu món mới'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
