import React, { useState, useEffect } from "react";
import { X, Plus, Edit, Trash2, MapPin } from "lucide-react";
import { Product, Category } from "../types";
import { createCompany, deleteCompany, getCompany } from "../Api/companyAPI";
import { CompanyType } from "../types/companyType";
import { ProductType } from "../types/productsType";


interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductType[];
  categories: Category[];
  //onAddProduct: (product: Omit<Product, 'id'>) => void;
  //onEditProduct: (id: string, product: Omit<Product, 'id'>) => void;
  //onDeleteProduct: (id: string) => void;
  onAddCategory: (category: Omit<Category, "id">) => void;
  onEditCategory: (id: string, category: Omit<Category, "id">) => void;
  onDeleteCategory: (id: string) => void;
  config: CompanyType;
  onUpdateConfig: (config: CompanyType) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  products,
  categories,
  //onAddProduct,
  //onEditProduct,
  //onDeleteProduct,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  config,
  onUpdateConfig,
}) => {
  const [productNameCompany, setproductNameCompany] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [numberWhatsapp, setNumberWhatsapp] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [baseValue, setBaseValue] = useState<number>(0);
  const [additionalValue, setAdditionalValue] = useState<number>(0);
  const [logo, setLogo] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<
    "products" | "categories" | "config"
  >("config");
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [configData, setConfigData] = useState<CompanyType | null>(null);
  const [productForm, setProductForm] = useState({
    productName: "",
    description: "",
    price: 0,
    category: categories[0]?.productName || "food",
    image: "",
  });
  const [categoryForm, setCategoryForm] = useState({
    productName: "",
    displayproductName: "",
  });

  useEffect(() => {
    const fetchCompanyData = async () => {
      const company = await getCompany();
      if (company) {
        setConfigData(company);
        setproductNameCompany(company.productNameCompany);
        setNumberWhatsapp(company.numberWhatsapp);
        setLongitude(company.longitude);
        setLatitude(company.latitude);
        setBaseValue(company.baseValue);
        setAdditionalValue(company.additionalValue);
      }
    };

    if (isOpen) {
      fetchCompanyData();
    }
  }, [isOpen]);

  const handleDeleteConfig = async () => {
    if (configData && configData.companyId) {
      const confirmation = window.confirm(
        "¿Estás seguro de que deseas eliminar esta configuración? Esta acción no se puede deshacer."
      );
      if (confirmation) {
        try {
          await deleteCompany(configData.companyId);
          alert("Configuración eliminada correctamente.");
         
          setConfigData(null);
          setproductNameCompany(""); 
          setNumberWhatsapp(""); 
          setLongitude(""); 
          setLatitude(""); 
          setBaseValue(0); 
          setAdditionalValue(0); 
          setLogo(null); 
        } catch (error) {
          console.error("Error al eliminar la configuración:", error);
          alert("Hubo un error al eliminar la configuración.");
        }
      }
    }
  };

  if (!isOpen) return null;
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        onUpdateConfig({ ...config, logoUrl: imageUrl });
      };
      reader.readAsDataURL(file);
    } else {
      console.log("No se ha seleccionado ningún archivo.");
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();

    const whatsappNumber = numberWhatsapp.replace(/\D/g, "");
    if (!whatsappNumber) {
      alert("Por favor, ingresa un número de WhatsApp válido.");
      return;
    }

    const formData = new FormData();

    if (logo) {
      formData.append("logo", logo);
    } else {
      alert("Por favor, agrega un logo.");
      return;
    }

    formData.append("productNameCompany", productNameCompany);
    formData.append("numberWhatsapp", whatsappNumber);
    formData.append("longitude", longitude);
    formData.append("latitude", latitude);
    formData.append("baseValue", String(baseValue));
    formData.append("additionalValue", String(additionalValue));

    try {
      await createCompany(formData);
      console.log("Configuración guardada correctamente");
    } catch (error) {
      console.error("Error al guardar la configuración:", error);
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toString();
          const long = position.coords.longitude.toString();
          setLatitude(lat);
          setLongitude(long);
          onUpdateConfig({ ...config, latitude: lat, longitude: long });
        },
        (error) => {
          console.error("Error al obtener la ubicación:", error);
          alert("No se pudo obtener la ubicación.");
        }
      );
    } else {
      alert("La geolocalización no es compatible con este navegador.");
    }
  };

  /*const handleProductSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (editingProduct) {
        onEditProduct(editingProduct.id, productForm);
        setEditingProduct(null);
      } else {
        onAddProduct(productForm);
      }
      setProductForm({ productName: '', description: '', price: 0, category: categories[0]?.productName || 'food', image: '' });
      setShowProductForm(false);
    };*/

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      onEditCategory(editingCategory.id, categoryForm);
      setEditingCategory(null);
    } else {
      onAddCategory(categoryForm);
    }
    setCategoryForm({ productName: "", displayproductName: "" });
    setShowCategoryForm(false);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      productName: product.productName,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
    });
    setShowProductForm(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      productName: category.productName,
      displayproductName: category.displayproductName,
    });
    setShowCategoryForm(true);
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "product" | "logo"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (type === "product") {
          setProductForm((prev) => ({ ...prev, image: result }));
        } else {
          onUpdateConfig({ ...config, logoUrl: result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const colorOptions = [
    "#ef4444",
    "#10b981",
    "#8b5cf6",
    "#f97316",
    "#3b82f6",
    "#ec4899",
    "#475569",
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      <div className="absolute inset-4 bg-white rounded-lg shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Panel de Administración</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex border-b">
          {/* 
<button
  onClick={() => setActiveTab('products')}
  className={`px-6 py-3 font-medium ${
    activeTab === 'products' 
      ? 'border-b-2 border-slate-700 text-slate-700' 
      : 'text-gray-500 hover:text-gray-700'
  }`}
>
  Gestión de Productos
</button>
<button
  onClick={() => setActiveTab('categories')}
  className={`px-6 py-3 font-medium ${
    activeTab === 'categories' 
      ? 'border-b-2 border-slate-700 text-slate-700' 
      : 'text-gray-500 hover:text-gray-700'
  }`}
>
  Gestión de Categorías
</button>
*/}
          <button
            onClick={() => setActiveTab("config")}
            className={`px-6 py-3 font-medium ${
              activeTab === "config"
                ? "border-b-2 border-slate-700 text-slate-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Configuración
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "products" && (
            <div>
              {/* 
  <div className="flex justify-between items-center mb-6">
    <h3 className="text-lg font-semibold">Productos</h3>
    <button
      onClick={() => setShowProductForm(true)}
      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
    >
      <Plus className="h-4 w-4" />
      <span>Agregar Producto</span>
    </button>
  </div>
*/}

              {showProductForm && (
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h4 className="text-lg font-semibold mb-4">
                    {editingProduct ? "Editar Producto" : "Nuevo Producto"}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del Producto
                      </label>
                      <input
                        type="text"
                        required
                        value={productForm.productName}
                        onChange={(e) =>
                          setProductForm((prev) => ({
                            ...prev,
                            productName: e.target.value,
                          }))
                        }
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                        placeholder="Ej: Hamburguesa Clásica"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Precio (COP)
                      </label>
                      <input
                        type="number"
                        required
                        value={productForm.price}
                        onChange={(e) =>
                          setProductForm((prev) => ({
                            ...prev,
                            price: Number(e.target.value),
                          }))
                        }
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoría
                    </label>
                    <select
                      value={productForm.category}
                      onChange={(e) =>
                        setProductForm((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.productName}>
                          {category.displayproductName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Imagen
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "product")}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    />
                    {productForm.image && (
                      <img
                        src={productForm.image}
                        alt="Preview"
                        className="mt-2 w-20 h-20 object-cover rounded"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      value={productForm.description}
                      onChange={(e) =>
                        setProductForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      placeholder="Describe tu producto..."
                    />
                  </div>

                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      {editingProduct
                        ? "Actualizar Producto"
                        : "Guardar Producto"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowProductForm(false);
                        setEditingProduct(null);
                        setProductForm({
                          productName: "",
                          description: "",
                          price: 0,
                          category: categories[0]?.productName || "food",
                          image: "",
                        });
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
              {/* 
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white border rounded-lg overflow-hidden"
                  >
                    <img
                      // src={product.image}
                      alt={product.productName}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-4">
                      <h4 className="font-semibold">{product.productName}</h4>

                      <p className="font-bold text-lg">
                        {formatPrice(product.price)}
                      </p>
                      <p className="text-xs text-gray-500 mb-2">
                        Categoría:{" "}
                        {categories.find((cat) => cat.productName === product.category)
                          ?.displayproductName || product.category}
                      </p>

                      <div className="flex space-x-2 mt-3">
                        <button
                          //onClick={() => handleEditProduct(product)}
                          className="flex-1 bg-blue-600 text-white py-1 px-2 rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                        >
                          <Edit className="h-3 w-3" />
                          <span>Editar</span>
                        </button>
                        <button
                          //onClick={() => onDeleteProduct(product.id)}
                          className="flex-1 bg-red-600 text-white py-1 px-2 rounded text-sm hover:bg-red-700 transition-colors flex items-center justify-center space-x-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
*/}
            </div>
          )}

          {activeTab === "categories" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Categorías</h3>
                <button
                  onClick={() => setShowCategoryForm(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Agregar Categoría</span>
                </button>
              </div>

              {showCategoryForm && (
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h4 className="text-lg font-semibold mb-4">
                    {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
                  </h4>

                  <form onSubmit={handleCategorySubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre Interno (sin espacios)
                        </label>
                        <input
                          type="text"
                          required
                          value={categoryForm.productName}
                          onChange={(e) =>
                            setCategoryForm((prev) => ({
                              ...prev,
                              productName: e.target.value
                                .toLowerCase()
                                .replace(/\s+/g, "-"),
                            }))
                          }
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                          placeholder="Ej: postres"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Se usará interproductNamente para identificar la categoría
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre para Mostrar
                        </label>
                        <input
                          type="text"
                          required
                          value={categoryForm.displayproductName}
                          onChange={(e) =>
                            setCategoryForm((prev) => ({
                              ...prev,
                              displayproductName: e.target.value,
                            }))
                          }
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                          placeholder="Ej: Postres"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Este nombre aparecerá en los botones del menú
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        {editingCategory
                          ? "Actualizar Categoría"
                          : "Guardar Categoría"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCategoryForm(false);
                          setEditingCategory(null);
                          setCategoryForm({ productName: "", displayproductName: "" });
                        }}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="bg-white border rounded-lg p-4"
                  >
                    <h4 className="font-semibold text-lg">
                      {category.displayproductName}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      ID: {category.productName}
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      Productos:{" "}
                      {
                        products.filter((p) => p.category === category.productName)
                          .length
                      }
                    </p>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                      >
                        <Edit className="h-3 w-3" />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => {
                          if (
                            confirm(
                              `¿Estás seguro de eliminar la categoría "${category.displayproductName}"? Esto también eliminará todos los productos de esta categoría.`
                            )
                          ) {
                            onDeleteCategory(category.id);
                          }
                        }}
                        className="flex-1 bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700 transition-colors flex items-center justify-center space-x-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "config" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">
                  Configuración del Restaurante
                </h3>
                <button
                  onClick={handleDeleteConfig}
                  className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Eliminar configuración
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Restaurante
                  </label>
                  <input
                    type="text"
                    value={productNameCompany}
                    onChange={(e) => setproductNameCompany(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logo del Restaurante
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Peso máximo 10MB</p>
                  {config.logoUrl && (
                    <img
                      src={config.logoUrl}
                      alt="Logo preview"
                      className="mt-2 w-16 h-16 object-contain border rounded"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Color Principal del Tema
                  </label>
                  <div className="flex space-x-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        onClick={() =>
                          onUpdateConfig({ ...config, primaryColor: color })
                        }
                        className={`w-8 h-8 rounded-full border-2 ${
                          config.primaryColor === color
                            ? "border-gray-800"
                            : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Color actual: {config.primaryColor}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de WhatsApp (opcional)
                  </label>
                  <input
                    type="tel"
                    value={numberWhatsapp}
                    onChange={(e) => setNumberWhatsapp(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    placeholder="Ej: +573001234567"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Incluye el código de país. Los pedidos se enviarán a este
                    número.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor base
                  </label>
                  <input
                    type="number"
                    value={baseValue}
                    onChange={(e) => setBaseValue(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor adicional por kilómetro
                  </label>
                  <input
                    type="number"
                    value={additionalValue}
                    onChange={(e) => setAdditionalValue(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ubicación
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={getLocation}
                      className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                    >
                      <MapPin className="h-5 w-5" />
                    </button>
                    <span>{`Latitud: ${latitude}, Longitud: ${longitude}`}</span>
                  </div>
                </div>

                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={handleSaveConfig}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Guardar Configuración
                  </button>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Vista Previa</h4>
                  <div
                    className="flex items-center space-x-3 p-3 rounded text-white"
                    style={{ backgroundColor: config.primaryColor }}
                  >
                    {config.logoUrl ? (
                      <img
                        src={config.logoUrl}
                        alt={productNameCompany}
                        className="h-8 w-8 object-contain"
                      />
                    ) : (
                      <div className="h-8 w-8 bg-white bg-opacity-20 rounded flex items-center justify-center">
                        <span className="text-sm font-bold">{productNameCompany}</span>
                      </div>
                    )}
                    <span className="font-bold">{productNameCompany}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
