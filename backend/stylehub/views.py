from django.http import HttpResponse, JsonResponse

HTML_API_PORTAL = r"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StyleHub Interactive REST API Portal</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-dark: #0a0b0e;
            --bg-card: #12141c;
            --bg-card-hover: #1a1d29;
            --accent-gold: #d4af37;
            --accent-gold-glow: rgba(212, 175, 55, 0.25);
            --text-primary: #f8fafc;
            --text-muted: #94a3b8;
            --border-subtle: rgba(255, 255, 255, 0.08);
            --badge-get: #10b981;
            --badge-post: #3b82f6;
            --badge-auth: #f59e0b;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; }
        body { background: var(--bg-dark); color: var(--text-primary); min-height: 100vh; padding: 40px 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        header { text-align: center; margin-bottom: 30px; }
        .logo-title { font-family: 'Outfit', sans-serif; font-size: 2.8rem; font-weight: 800; background: linear-gradient(135deg, #f3e0a3, #d4af37, #aa820a); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .subtitle { color: var(--text-muted); font-size: 1rem; margin-top: 8px; }
        .status-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); padding: 6px 16px; border-radius: 9999px; font-size: 0.85rem; font-weight: 700; margin-top: 16px; }
        
        .nav-actions { display: flex; justify-content: center; gap: 16px; margin: 24px 0; flex-wrap: wrap; }
        .btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; border-radius: 9999px; font-weight: 700; text-decoration: none; transition: all 0.2s ease; font-size: 0.9rem; cursor: pointer; border: none; }
        .btn-gold { background: linear-gradient(135deg, #f3e0a3 0%, #d4af37 50%, #aa820a 100%); color: #000; box-shadow: 0 4px 15px var(--accent-gold-glow); }
        .btn-gold:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4); }
        .btn-outline { background: transparent; color: var(--text-primary); border: 1px solid var(--border-subtle); }
        .btn-outline:hover { border-color: var(--accent-gold); color: var(--accent-gold); background: var(--bg-card); }

        .search-bar { width: 100%; max-width: 500px; margin: 0 auto 30px auto; display: block; background: var(--bg-card); border: 1px solid var(--border-subtle); padding: 14px 20px; border-radius: 9999px; color: #fff; font-size: 0.95rem; outline: none; }
        .search-bar:focus { border-color: var(--accent-gold); }

        .section-title { font-family: 'Outfit', sans-serif; font-size: 1.5rem; font-weight: 700; margin: 30px 0 20px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 10px; display: flex; justify-content: space-between; align-items: center; }
        
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 20px; }
        .card { background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 16px; padding: 20px; transition: all 0.3s ease; color: inherit; display: flex; flex-direction: column; justify-content: space-between; }
        .card:hover { background: var(--bg-card-hover); border-color: var(--accent-gold); transform: translateY(-3px); }
        .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
        .card-title { font-family: 'Outfit', sans-serif; font-size: 1.15rem; font-weight: 700; }
        .method { font-size: 0.75rem; font-weight: 800; padding: 4px 10px; border-radius: 6px; text-transform: uppercase; }
        .method.get { background: rgba(16, 185, 129, 0.2); color: var(--badge-get); }
        .method.post { background: rgba(59, 130, 246, 0.2); color: var(--badge-post); }
        .method.auth { background: rgba(245, 158, 11, 0.2); color: var(--badge-auth); }
        .endpoint-url { font-family: monospace; font-size: 0.85rem; color: var(--accent-gold); background: rgba(0,0,0,0.4); padding: 8px 12px; border-radius: 8px; margin-top: 12px; word-break: break-all; }
        
        .card-actions { display: flex; gap: 10px; margin-top: 16px; }
        .action-btn { flex: 1; padding: 8px 12px; border-radius: 8px; font-size: 0.8rem; font-weight: 700; text-align: center; border: 1px solid var(--border-subtle); text-decoration: none; cursor: pointer; transition: all 0.2s ease; }
        .action-btn-primary { background: rgba(212, 175, 55, 0.15); color: var(--accent-gold); border-color: rgba(212, 175, 55, 0.3); }
        .action-btn-primary:hover { background: var(--accent-gold); color: #000; }
        .action-btn-secondary { background: rgba(255,255,255,0.05); color: var(--text-muted); }
        .action-btn-secondary:hover { color: #fff; background: rgba(255,255,255,0.1); }

        /* Modal Tester Overlay */
        .modal-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); z-index: 100; align-items: center; justify-content: center; padding: 20px; }
        .modal-overlay.active { display: flex; }
        .modal-content { background: var(--bg-card); border: 1px solid var(--accent-gold); border-radius: 20px; width: 100%; max-width: 800px; max-height: 85vh; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.8); }
        .modal-header { padding: 20px; border-bottom: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.3); }
        .modal-title { font-family: 'Outfit', sans-serif; font-size: 1.3rem; font-weight: 700; color: var(--accent-gold); }
        .close-btn { background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer; }
        .modal-body { padding: 20px; overflow-y: auto; flex: 1; }
        .response-box { background: #07080a; border: 1px solid var(--border-subtle); border-radius: 12px; padding: 16px; font-family: monospace; font-size: 0.85rem; color: #38bdf8; overflow-x: auto; white-space: pre-wrap; max-height: 400px; }
        .response-status { display: inline-block; padding: 4px 12px; border-radius: 6px; font-weight: 700; margin-bottom: 12px; font-size: 0.85rem; }
        .status-200 { background: rgba(16, 185, 129, 0.2); color: #10b981; }
        .status-401 { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
        .status-405 { background: rgba(239, 68, 68, 0.2); color: #ef4444; }

        footer { text-align: center; color: var(--text-muted); font-size: 0.85rem; margin-top: 60px; padding-top: 20px; border-top: 1px solid var(--border-subtle); }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1 class="logo-title">STYLEHUB REST API</h1>
            <p class="subtitle">High-Performance Modular Fashion E-Commerce Backend Service</p>
            <div class="status-badge">🟢 15 Modular API Services Active & Operational</div>
        </header>

        <div class="nav-actions">
            <a href="http://localhost:5173" class="btn btn-gold" target="_blank">🚀 Launch Frontend App (Port 5173)</a>
            <a href="/admin/" class="btn btn-outline" target="_blank">⚙️ Django Admin Dashboard</a>
            <a href="/api/?format=json" class="btn btn-outline">📄 Raw JSON Directory</a>
        </div>

        <input type="text" id="search" class="search-bar" placeholder="🔍 Search API endpoints by keyword, method, or path..." onkeyup="filterEndpoints()">

        <div class="section-title">
            <span>Core API Endpoints Directory</span>
            <span style="font-size: 0.9rem; color: var(--text-muted);" id="count">15 Endpoints</span>
        </div>

        <div class="grid" id="endpointGrid"></div>

        <footer>
            StyleHub Fashion E-Commerce Architecture &copy; 2026 | Powered by Django 5, DRF & React Vite
        </footer>
    </div>

    <!-- Modal Tester Overlay -->
    <div class="modal-overlay" id="testModal">
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-title" id="modalTitle">API Response Playground</div>
                <button class="close-btn" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div id="modalStatus"></div>
                <pre class="response-box" id="modalPayload">Testing API connection...</pre>
            </div>
        </div>
    </div>

    <script>
        const ENDPOINTS = [
            { name: "Products Catalog", path: "/api/catalog/products/", method: "GET", auth: false, desc: "Retrieve full product catalog, search queries, pagination & filter options." },
            { name: "Categories Hierarchy", path: "/api/catalog/categories/", method: "GET", auth: false, desc: "Explore fashion taxonomy tree, parent & child category hierarchies." },
            { name: "Luxury Brands", path: "/api/catalog/brands/", method: "GET", auth: false, desc: "List designer luxury fashion brands and seller profiles." },
            { name: "Shopping Cart", path: "/api/cart/", method: "GET / POST", auth: false, desc: "Manage cart items, quantities, and persistent session carts." },
            { name: "Customer Reviews", path: "/api/reviews/", method: "GET", auth: false, desc: "Customer ratings, reviews, verified purchases and feedback." },
            { name: "Personalized Recommendations", path: "/api/recommendations/", method: "GET", auth: false, desc: "AI-driven personalized product feeds and similar style matches." },
            { name: "JWT Authentication", path: "/api/auth/token/", method: "POST", auth: false, desc: "JWT Token obtain, refresh & secure authentication endpoints." },
            { name: "User Saved Wishlist", path: "/api/wishlist/", method: "GET / POST", auth: true, desc: "Manage customer saved items and personal wishlists." },
            { name: "Orders & Checkout", path: "/api/orders/", method: "GET / POST", auth: true, desc: "Order processing, shipment tracking, and customer order history." },
            { name: "Inventory Management", path: "/api/inventory/", method: "GET", auth: true, desc: "Warehouse stock levels, SKU tracking and inventory movements." },
            { name: "Seller Profiles & Stores", path: "/api/sellers/", method: "GET", auth: true, desc: "Vendor store management, seller profiles, and commissions." },
            { name: "Executive Analytics", path: "/api/analytics/", method: "GET", auth: true, desc: "Sales reporting, revenue metrics, conversion rates & insights." },
            { name: "System Audit Logs", path: "/api/audit/", method: "GET", auth: true, desc: "Security auditing, access logging, and system transaction trails." },
            { name: "Payments Gateway", path: "/api/payments/", method: "POST", auth: true, desc: "Mock payment authorization, charge capture, and refund processing." },
            { name: "Promotions & Coupons", path: "/api/promotions/", method: "POST", auth: false, desc: "Coupon validation (STYLE20, VIP50) and seasonal promo campaigns." }
        ];

        function renderGrid(items) {
            const grid = document.getElementById('endpointGrid');
            grid.innerHTML = items.map(ep => `
                <div class="card">
                    <div>
                        <div class="card-header">
                            <span class="card-title">${ep.name}</span>
                            <span class="method ${ep.auth ? 'auth' : ep.method.toLowerCase().includes('get') ? 'get' : 'post'}">${ep.method}</span>
                        </div>
                        <p style="font-size: 0.85rem; color: var(--text-muted);">${ep.desc}</p>
                    </div>
                    <div>
                        <div class="endpoint-url">${ep.path}</div>
                        <div class="card-actions">
                            <button class="action-btn action-btn-primary" onclick="testEndpoint('${ep.path}', '${ep.name}')">⚡ Test Payload</button>
                            <a class="action-btn action-btn-secondary" href="${ep.path}" target="_blank">↗️ Open Raw</a>
                        </div>
                    </div>
                </div>
            `).join('');
            document.getElementById('count').textContent = `${items.length} Endpoints`;
        }

        function filterEndpoints() {
            const q = document.getElementById('search').value.toLowerCase();
            const filtered = ENDPOINTS.filter(ep => ep.name.toLowerCase().includes(q) || ep.path.toLowerCase().includes(q) || ep.method.toLowerCase().includes(q) || ep.desc.toLowerCase().includes(q));
            renderGrid(filtered);
        }

        async function testEndpoint(path, name) {
            const modal = document.getElementById('testModal');
            const modalTitle = document.getElementById('modalTitle');
            const modalStatus = document.getElementById('modalStatus');
            const modalPayload = document.getElementById('modalPayload');

            modalTitle.textContent = `Testing: ${name} (${path})`;
            modalStatus.innerHTML = `<span class="response-status status-200">⏳ Fetching live response...</span>`;
            modalPayload.textContent = 'Sending request to ' + path + '...';
            modal.classList.add('active');

            const start = performance.now();
            try {
                const res = await fetch(path);
                const elapsed = Math.round(performance.now() - start);
                const statusClass = res.status === 200 ? 'status-200' : res.status === 401 ? 'status-401' : 'status-405';
                modalStatus.innerHTML = `<span class="response-status ${statusClass}">HTTP ${res.status} ${res.statusText || ''} (${elapsed} ms)</span>`;

                let data;
                try {
                    data = await res.json();
                    modalPayload.textContent = JSON.stringify(data, null, 2);
                } catch {
                    data = await res.text();
                    modalPayload.textContent = data;
                }
            } catch (err) {
                modalStatus.innerHTML = `<span class="response-status status-405">Network Error</span>`;
                modalPayload.textContent = String(err);
            }
        }

        function closeModal() {
            document.getElementById('testModal').classList.remove('active');
        }

        renderGrid(ENDPOINTS);
    </script>
</body>
</html>
"""

def api_root(request):
    if 'format=json' in request.GET or request.headers.get('Accept') == 'application/json':
        return JsonResponse({
            "name": "StyleHub E-Commerce REST API",
            "version": "1.0.0",
            "status": "Online",
            "endpoints": {
                "auth": request.build_absolute_uri('/api/auth/token/'),
                "catalog_products": request.build_absolute_uri('/api/catalog/products/'),
                "catalog_categories": request.build_absolute_uri('/api/catalog/categories/'),
                "catalog_brands": request.build_absolute_uri('/api/catalog/brands/'),
                "inventory": request.build_absolute_uri('/api/inventory/'),
                "cart": request.build_absolute_uri('/api/cart/'),
                "wishlist": request.build_absolute_uri('/api/wishlist/'),
                "orders": request.build_absolute_uri('/api/orders/'),
                "payments": request.build_absolute_uri('/api/payments/'),
                "promotions": request.build_absolute_uri('/api/promotions/'),
                "reviews": request.build_absolute_uri('/api/reviews/'),
                "recommendations": request.build_absolute_uri('/api/recommendations/'),
                "notifications": request.build_absolute_uri('/api/notifications/'),
                "sellers": request.build_absolute_uri('/api/sellers/'),
                "analytics": request.build_absolute_uri('/api/analytics/'),
                "audit": request.build_absolute_uri('/api/audit/'),
            }
        })
    
    return HttpResponse(HTML_API_PORTAL)
