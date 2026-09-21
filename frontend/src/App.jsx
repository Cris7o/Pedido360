import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { IconBag, IconClock, IconClose, IconFlame, IconMinus, IconPlus, IconSearch, IconStar, IconTruck } from './components/Icons'
import PanelPedidos from './views/PanelPedidos'
import PanelAdmin from './views/PanelAdmin'

/** Muestra un respaldo cuando el producto no trae imagen o la URL falla. */
function ProductImage({ src, nombre }) {
  const [falló, setFalló] = useState(false)

  if (!src || falló) {
    return (
      <div className="product-image-fallback" role="img" aria-label={`Sin foto de ${nombre}`}>
        <IconBag width={26} height={26} />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      width="400"
      height="260"
      onError={() => setFalló(true)}
    />
  )
}

const ROLE_PROFILES = {
  CLIENTE: { sub: 'cliente-demo', nombre: 'Ana García', email: 'ana@dev.local', label: 'CLIENTE' },
  COCINA: { sub: 'cocina-demo', nombre: 'Lucía Cocina', email: 'cocina@dev.local', label: 'COCINA' },
  REPARTIDOR: { sub: 'repartidor-demo', nombre: 'Mateo Delivery', email: 'delivery@dev.local', label: 'REPARTIDOR' },
  ADMIN: { sub: 'admin-demo', nombre: 'Admin Pedido360', email: 'admin@dev.local', label: 'ADMIN' },
}

const STATUS_LABELS = {
  PENDIENTE: 'Pendiente',
  EN_PREPARACION: 'En preparación',
  LISTO: 'Listo',
  EN_REPARTO: 'En reparto',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado',
}

const EMPTY_PRODUCT_FORM = {
  id: null,
  nombre: '',
  descripcion: '',
  precio: '',
  disponible: true,
}

const EMPTY_LOGIN_FORM = {
  email: '',
  password: '',
}

const DEMO_ACCOUNTS = [
  { email: 'cliente@dev.local', password: '123456', role: 'CLIENTE' },
  { email: 'cocina@dev.local', password: '123456', role: 'COCINA' },
  { email: 'delivery@dev.local', password: '123456', role: 'REPARTIDOR' },
  { email: 'admin@dev.local', password: '123456', role: 'ADMIN' },
]

const CATEGORY_ITEMS = [
  {
    id: 'burgers',
    label: 'Hamburguesas',
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'pizzas',
    label: 'Pizzas',
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'drinks',
    label: 'Bebidas',
    image:
      'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'desserts',
    label: 'Postres',
    image:
      'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=400&q=80',
  },
]

const DEMO_PRODUCTS = [
  {
    id: 1,
    nombre: 'Burger Doble',
    descripcion: 'Doble carne, cheddar, cebolla crispy y salsa house.',
    precio: 12990,
    tiempo: '20-30 min',
    rating: 4.8,
    disponible: true,
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 2,
    nombre: 'Pizza Pepperoni',
    descripcion: 'Masa fina, salsa pomodoro, mozzarella y pepperoni.',
    precio: 17990,
    tiempo: '25-35 min',
    rating: 4.9,
    disponible: true,
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 3,
    nombre: 'Coca Cola 500ml',
    descripcion: 'Refrescante y bien fría para acompañar tu pedido.',
    precio: 1800,
    tiempo: '10-15 min',
    rating: 4.7,
    disponible: true,
    image:
      'https://images.unsplash.com/photo-1622483767028-3f66f2b0c8f5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 4,
    nombre: 'Cheesecake',
    descripcion: 'Clásico cheesecake con frutos rojos y toque de vainilla.',
    precio: 5900,
    tiempo: '15-20 min',
    rating: 4.8,
    disponible: true,
    image:
      'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 5,
    nombre: 'Papas Gourmet',
    descripcion: 'Papas fritas gourmet con queso y alioli.',
    precio: 6500,
    tiempo: '15-25 min',
    rating: 4.6,
    disponible: true,
    image:
      'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 6,
    nombre: 'Wrap Veggie',
    descripcion: 'Envoltura fresca con hummus, palta y vegetales.',
    precio: 9900,
    tiempo: '20-25 min',
    rating: 4.8,
    disponible: true,
    image:
      'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=1200&q=80',
  },
]

function buildHeaders(role) {
  const profile = ROLE_PROFILES[role]
  return {
    'Content-Type': 'application/json',
    'X-Usuario-Sub': profile.sub,
    'X-Nombre': profile.nombre,
    'X-Email': profile.email,
    'X-Rol': role,
  }
}

async function apiRequest(path, options = {}, role = 'CLIENTE') {
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: {
      ...buildHeaders(role),
      ...(options.headers || {}),
    },
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || 'Ocurrió un error en la solicitud')
  }

  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return response.json()
  }

  return null
}

function formatMoney(value) {
  const numericValue = Number(value ?? 0)
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(numericValue)
}

function normalizeRole(role) {
  return (role || 'CLIENTE').toUpperCase()
}

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeRole, setActiveRole] = useState('CLIENTE')
  const [products, setProducts] = useState(DEMO_PRODUCTS)
  const [adminProducts, setAdminProducts] = useState([])
  const [cart, setCart] = useState([])
  const [myOrders, setMyOrders] = useState([])
  const [adminOrders, setAdminOrders] = useState([])
  const [kitchenOrders, setKitchenOrders] = useState([])
  const [deliveryOrders, setDeliveryOrders] = useState([])
  const [adminUsers, setAdminUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT_FORM)
  const [loginForm, setLoginForm] = useState(EMPTY_LOGIN_FORM)
  const [loginError, setLoginError] = useState('')
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [pedidoEnProceso, setPedidoEnProceso] = useState(null)

  const currentProfile = ROLE_PROFILES[normalizeRole(currentUser?.rol || activeRole)] || ROLE_PROFILES.CLIENTE
  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.precio) * Number(item.cantidad), 0),
    [cart],
  )

  const showToast = (text, kind = 'success') => {
    setToast({ text, kind })
    window.clearTimeout(showToast.timeout)
    showToast.timeout = window.setTimeout(() => setToast(null), 2600)
  }

  const loadDashboard = async (role = activeRole) => {
    setLoading(true)

    try {
      const productList = await apiRequest('/productos', {}, role)
      setProducts(productList && productList.length ? productList : DEMO_PRODUCTS)

      const profileResponse = await apiRequest('/usuarios/me', {}, role)
      setCurrentUser(profileResponse)
      setActiveRole(normalizeRole(profileResponse?.rol || role))

      if (role === 'CLIENTE') {
        const myPedidoList = await apiRequest('/pedidos/mios', {}, role)
        setMyOrders(myPedidoList || [])
      }

      if (role === 'ADMIN') {
        const [adminPedidoList, adminUserList, adminProductList] = await Promise.all([
          apiRequest('/admin/pedidos', {}, role),
          apiRequest('/admin/usuarios', {}, role),
          apiRequest('/admin/productos', {}, role),
        ])

        setAdminOrders(adminPedidoList || [])
        setAdminUsers(adminUserList || [])
        setAdminProducts(adminProductList || [])
      }

      if (role === 'COCINA') {
        const kitchenPedidoList = await apiRequest('/cocina/pedidos', {}, role)
        setKitchenOrders(kitchenPedidoList || [])
      }

      if (role === 'REPARTIDOR') {
        const deliveryPedidoList = await apiRequest('/repartidor/pedidos', {}, role)
        setDeliveryOrders(deliveryPedidoList || [])
      }
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated && currentUser?.rol) {
      const role = normalizeRole(currentUser.rol)
      setActiveRole(role)
      loadDashboard(role)
      return
    }

    setProducts(DEMO_PRODUCTS)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  useEffect(() => {
    if (!showLoginForm) return undefined

    const cerrarConEscape = (event) => {
      if (event.key === 'Escape') setShowLoginForm(false)
    }

    window.addEventListener('keydown', cerrarConEscape)
    return () => window.removeEventListener('keydown', cerrarConEscape)
  }, [showLoginForm])

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase()

    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        (selectedCategory === 'burgers' && /burger|hamburguesa/.test(product.nombre.toLowerCase())) ||
        (selectedCategory === 'pizzas' && /pizza/.test(product.nombre.toLowerCase())) ||
        (selectedCategory === 'drinks' && /bebida|cola|refresco/.test(product.nombre.toLowerCase())) ||
        (selectedCategory === 'desserts' && /postre|cheesecake|cake/.test(product.nombre.toLowerCase()))

      const matchesSearch =
        !normalizedQuery ||
        product.nombre?.toLowerCase().includes(normalizedQuery) ||
        product.descripcion?.toLowerCase().includes(normalizedQuery)

      return matchesCategory && matchesSearch
    })
  }, [products, selectedCategory, searchTerm])

  const addToCart = (product) => {
    if (!isAuthenticated) {
      setShowLoginForm(true)
      return
    }

    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === product.id)
      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item,
        )
      }

      return [...currentCart, { ...product, cantidad: 1, precio: Number(product.precio) }]
    })

    showToast(`${product.nombre} agregado al carrito`, 'success')
  }

  const updateCartQuantity = (productId, delta) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId ? { ...item, cantidad: Math.max(0, item.cantidad + delta) } : item,
        )
        .filter((item) => item.cantidad > 0),
    )
  }

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      setShowLoginForm(true)
      return
    }

    if (!cart.length) {
      showToast('Agrega productos antes de confirmar tu pedido', 'error')
      return
    }

    setCheckoutLoading(true)

    try {
      await apiRequest(
        '/pedidos',
        {
          method: 'POST',
          body: JSON.stringify({
            items: cart.map((item) => ({ productoId: item.id, cantidad: item.cantidad })),
          }),
        },
        activeRole,
      )

      setCart([])
      showToast('Pedido confirmado con éxito', 'success')
      if (currentUser?.rol) await loadDashboard(currentUser.rol)
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setCheckoutLoading(false)
    }
  }

  const cambiarEstadoPedido = async (pedido, accion) => {
    setPedidoEnProceso(pedido.id)

    try {
      await apiRequest(
        `/pedidos/${pedido.id}/estado`,
        { method: 'PATCH', body: JSON.stringify({ estado: accion.hacia }) },
        activeRole,
      )
      showToast(`Pedido #${pedido.id}: ${accion.etiqueta.toLowerCase()}`, 'success')
      await loadDashboard(activeRole)
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setPedidoEnProceso(null)
    }
  }

  const crearProducto = async (producto) => {
    await apiRequest(
      '/admin/productos',
      { method: 'POST', body: JSON.stringify(producto) },
      activeRole,
    )
    showToast(`${producto.nombre} agregado al catálogo`, 'success')
    await loadDashboard(activeRole)
  }

  const desactivarProducto = async (producto) => {
    try {
      await apiRequest(`/admin/productos/${producto.id}`, { method: 'DELETE' }, activeRole)
      showToast(`${producto.nombre} ya no está disponible`, 'success')
      await loadDashboard(activeRole)
    } catch (error) {
      showToast(error.message, 'error')
    }
  }

  const handleLogin = (event) => {
    event.preventDefault()

    const email = loginForm.email.trim().toLowerCase()
    const password = loginForm.password
    const account = DEMO_ACCOUNTS.find(
      (item) => item.email.toLowerCase() === email && item.password === password,
    )

    if (!account) {
      setLoginError('No hay ninguna cuenta creada. Inicia sesión con una cuenta válida o contacta al administrador.')
      return
    }

    const profile = ROLE_PROFILES[account.role]
    const user = { ...profile, rol: account.role }

    setCurrentUser(user)
    setActiveRole(account.role)
    setIsAuthenticated(true)
    setShowLoginForm(false)
    setLoginError('')
    setLoginForm(EMPTY_LOGIN_FORM)
    showToast(`Bienvenido ${profile.nombre}`, 'success')
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setIsAuthenticated(false)
    setActiveRole('CLIENTE')
    setCart([])
    setLoginForm(EMPTY_LOGIN_FORM)
    setLoginError('')
    setShowLoginForm(true)
    showToast('Inicia sesión para continuar', 'success')
  }

  const deliveryFee = Math.min(cartTotal * 0.08, 3500)
  const totalWithFee = cartTotal + deliveryFee

  return (
    <div className="pedido-shell">
      <header className="topbar">
        <div className="brand-block">
          <div className="brand-mark">P</div>
          <div className="brand-copy">
            <span className="brand-name">Pedido360</span>
            <button type="button" className="location-pill">
              Entregar en: Santiago ▾
            </button>
          </div>
        </div>

        <div className="search-wrap">
          <IconSearch className="search-icon" width={18} height={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar platos o locales"
            aria-label="Buscar platos o locales"
          />
        </div>

        <div className="user-area">
          <div className="profile-box">
            <span>{isAuthenticated ? currentUser?.email || currentProfile.email : 'invitado@pedido360.cl'}</span>
            <span className="role-pill">
              {isAuthenticated ? currentProfile.label : 'VISITANTE'}
            </span>
          </div>
          <button
            type="button"
            className="session-button"
            onClick={() => (isAuthenticated ? handleLogout() : setShowLoginForm(true))}
          >
            {isAuthenticated ? 'Cerrar sesión' : 'Iniciar sesión'}
          </button>
        </div>
      </header>

      {showLoginForm && !isAuthenticated && (
        <div className="login-overlay" onClick={() => setShowLoginForm(false)}>
          <div
            className="login-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-titulo"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="login-close"
              onClick={() => setShowLoginForm(false)}
              aria-label="Cerrar inicio de sesión"
            >
              <IconClose width={20} height={20} />
            </button>
            <div className="login-header">
              <span className="brand-name login-brand">Pedido360</span>
            </div>
            <h2 id="login-titulo">Iniciar sesión</h2>
            <p className="login-copy">
              Inicia sesión con tus credenciales para hacer tu pedido.
            </p>

            <form className="login-form" onSubmit={handleLogin}>
              <label>
                <span>Email</span>
                <input
                  type="email"
                  value={loginForm.email}
                  placeholder="cliente@pedido360.cl"
                  autoComplete="email"
                  required
                  aria-invalid={Boolean(loginError)}
                  aria-describedby={loginError ? 'login-error' : undefined}
                  onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })}
                />
              </label>

              <label>
                <span>Contraseña</span>
                <input
                  type="password"
                  value={loginForm.password}
                  autoComplete="current-password"
                  required
                  aria-invalid={Boolean(loginError)}
                  aria-describedby={loginError ? 'login-error' : undefined}
                  onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
                />
              </label>

              {loginError && (
                <p className="login-error" id="login-error" role="alert">
                  {loginError}
                </p>
              )}

              <button type="submit" className="primary-button login-button">
                Iniciar sesión
              </button>

              <button
                type="button"
                className="secondary-button demo-button"
                onClick={() => {
                  setLoginForm({ email: 'cliente@dev.local', password: '123456' })
                  setLoginError('')
                }}
              >
                Usar cuenta demo
              </button>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className={`toast toast-${toast.kind}`} role="status" aria-live="polite">
          {toast.text}
        </div>
      )}

      {activeRole === 'COCINA' && (
        <main className="panel-shell">
          <h1 className="sr-only">Pedido360 — panel de cocina</h1>
          <PanelPedidos
            rol="COCINA"
            titulo="Cocina"
            descripcion="Pedidos por preparar, en orden de llegada."
            icono={<IconFlame width={22} height={22} />}
            pedidos={kitchenOrders}
            cargando={loading}
            pedidoEnProceso={pedidoEnProceso}
            onCambiarEstado={cambiarEstadoPedido}
            vacioTitulo="No hay pedidos en cocina"
            vacioTexto="Cuando un cliente haga un pedido va a aparecer acá."
          />
        </main>
      )}

      {activeRole === 'REPARTIDOR' && (
        <main className="panel-shell">
          <h1 className="sr-only">Pedido360 — panel de reparto</h1>
          <PanelPedidos
            rol="REPARTIDOR"
            titulo="Reparto"
            descripcion="Pedidos listos para salir y entregas en curso."
            icono={<IconTruck width={22} height={22} />}
            pedidos={deliveryOrders}
            cargando={loading}
            pedidoEnProceso={pedidoEnProceso}
            onCambiarEstado={cambiarEstadoPedido}
            vacioTitulo="No hay pedidos para repartir"
            vacioTexto="Cuando la cocina marque un pedido como listo va a aparecer acá."
          />
        </main>
      )}

      {activeRole === 'ADMIN' && (
        <main className="panel-shell">
          <h1 className="sr-only">Pedido360 — panel de administración</h1>
          <PanelAdmin
            pedidos={adminOrders}
            productos={adminProducts}
            usuarios={adminUsers}
            cargando={loading}
            pedidoEnProceso={pedidoEnProceso}
            onCambiarEstado={cambiarEstadoPedido}
            onCrearProducto={crearProducto}
            onDesactivarProducto={desactivarProducto}
          />
        </main>
      )}

      {activeRole === 'CLIENTE' && (
      <main className="content-shell">
        <h1 className="sr-only">Pedido360 — catálogo y pedidos</h1>

        <section className="catalog-panel" aria-labelledby="catalogo-titulo">
          <div className="category-strip" role="group" aria-label="Filtrar por categoría">
            {CATEGORY_ITEMS.map((categoryItem) => (
              <button
                key={categoryItem.id}
                type="button"
                className={`category-card ${selectedCategory === categoryItem.id ? 'active' : ''}`}
                onClick={() =>
                  setSelectedCategory(selectedCategory === categoryItem.id ? 'all' : categoryItem.id)
                }
                aria-pressed={selectedCategory === categoryItem.id}
              >
                <img src={categoryItem.image} alt="" loading="lazy" width="120" height="120" />
                <span>{categoryItem.label}</span>
              </button>
            ))}
          </div>

          <div className="catalog-head">
            <h2 id="catalogo-titulo">Menú</h2>
            <p className="catalog-count" aria-live="polite">
              {loading
                ? 'Cargando platos…'
                : `${filteredProducts.length} ${filteredProducts.length === 1 ? 'plato' : 'platos'}`}
            </p>
          </div>

          {loading && (
            <div className="product-grid" aria-hidden="true">
              {[0, 1, 2, 3, 4, 5].map((slot) => (
                <div key={slot} className="product-card skeleton-card">
                  <div className="skeleton skeleton-image" />
                  <div className="product-body">
                    <div className="skeleton skeleton-line skeleton-line-lg" />
                    <div className="skeleton skeleton-line" />
                    <div className="skeleton skeleton-line skeleton-line-sm" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="catalog-empty">
              <IconSearch width={28} height={28} />
              <h3>No encontramos platos</h3>
              <p>
                {searchTerm
                  ? `No hay resultados para "${searchTerm}".`
                  : 'No hay platos en esta categoría por ahora.'}
              </p>
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                }}
              >
                Ver todo el menú
              </button>
            </div>
          )}

          <div className="product-grid" hidden={loading || filteredProducts.length === 0}>
            {filteredProducts.map((product) => (
              <article key={product.id} className="product-card">
                <div className="product-image-wrap">
                  <ProductImage src={product.image} nombre={product.nombre} />
                  <div className="image-badges">
                    {product.tiempo && (
                      <span>
                        <IconClock />
                        {product.tiempo}
                      </span>
                    )}
                    {product.rating && (
                      <span>
                        <IconStar />
                        <span className="sr-only">Calificación </span>
                        {product.rating}
                      </span>
                    )}
                  </div>
                </div>

                <div className="product-body">
                  <h3>{product.nombre}</h3>
                  <p>{product.descripcion}</p>
                  <div className="product-footer">
                    <strong>{formatMoney(product.precio)}</strong>
                    <button
                      type="button"
                      className="add-button"
                      onClick={() => addToCart(product)}
                      aria-label={`Agregar ${product.nombre} al carrito`}
                    >
                      <IconPlus width={22} height={22} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {isAuthenticated && activeRole === 'CLIENTE' && (
            <PanelPedidos
              rol="CLIENTE"
              titulo="Mis pedidos"
              descripcion="Sigue el estado de lo que pediste."
              icono={<IconBag width={22} height={22} />}
              pedidos={myOrders}
              cargando={loading}
              pedidoEnProceso={pedidoEnProceso}
              onCambiarEstado={cambiarEstadoPedido}
              vacioTitulo="Todavía no tienes pedidos"
              vacioTexto="Cuando confirmes tu primer pedido vas a poder seguirlo desde acá."
            />
          )}
        </section>

        <aside className="cart-panel">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">
                <IconBag width={30} height={30} />
              </div>
              <h3>Tu carrito está vacío</h3>
              <p>Agrega tus platos favoritos para continuar.</p>
            </div>
          ) : (
            <>
              <div className="cart-header">
                <div>
                  <p className="eyebrow">Tu pedido</p>
                  <h3>Comanda</h3>
                </div>
                <span className="cart-count">{cart.length} items</span>
              </div>

              <div className="cart-items-wrap">
                {cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      <strong>{item.nombre}</strong>
                      <span>{formatMoney(item.precio)} c/u</span>
                    </div>

                    <div className="quantity-control">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.id, -1)}
                        aria-label={`Quitar una unidad de ${item.nombre}`}
                      >
                        <IconMinus />
                      </button>
                      <span aria-label={`${item.cantidad} unidades`}>{item.cantidad}</span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.id, 1)}
                        aria-label={`Agregar una unidad de ${item.nombre}`}
                      >
                        <IconPlus />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="summary-box">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <strong>{formatMoney(cartTotal)}</strong>
                </div>
                <div className="summary-row">
                  <span>Delivery</span>
                  <strong>{formatMoney(deliveryFee)}</strong>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <strong>{formatMoney(totalWithFee)}</strong>
                </div>
              </div>

              <button
                type="button"
                className="primary-button checkout-button"
                onClick={handleCheckout}
                disabled={checkoutLoading}
              >
                {checkoutLoading ? 'Confirmando…' : 'Confirmar pedido'}
              </button>
            </>
          )}
        </aside>
      </main>
      )}
    </div>
  )
}

export default App
