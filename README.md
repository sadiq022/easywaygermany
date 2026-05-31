# EasyWay Germany – Flask Website

A premium, conversion-focused Flask website for selling digital resources for Masters in Germany applicants.

## Features
- 🛒 **Digital product store** – University lists, SOPs, LORs, CVs, Guides
- 🔐 **Secure downloads** – Files only accessible after payment
- 👤 **Auth system** – Register, Login, Google OAuth (setup required)
- 💳 **Checkout flow** – Stripe/Razorpay integration-ready
- 📊 **Admin panel** – Manage products, categories, orders
- 📱 **Fully responsive** – Mobile-first design
- 🎨 **Premium design** – Red/white German theme, Playfair Display + DM Sans

## Quick Setup

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Run the app
python app.py

# 3. Open browser
http://localhost:5000
```

## Default Admin Login
- Email: `admin@easywaygermany.com`
- Password: `admin123`
- URL: `http://localhost:5000/admin`

## Project Structure
```
easywaygermany/
├── app.py                  # Main Flask app (routes, models, config)
├── requirements.txt
├── secure_files/           # Uploaded product files (NOT public)
├── static/
│   ├── css/style.css       # All styles
│   └── js/main.js          # Interactions & animations
└── templates/
    ├── base.html           # Navbar, footer, flash messages
    ├── index.html          # Homepage
    ├── products.html       # Product listing with filters
    ├── product_detail.html # Individual product page
    ├── checkout.html       # Purchase flow
    ├── dashboard.html      # User dashboard + downloads
    ├── services.html       # Services page
    ├── about.html          # About page
    ├── contact.html        # Contact + consultation form
    ├── auth/
    │   ├── login.html
    │   └── register.html
    └── admin/
        ├── dashboard.html  # Admin overview
        ├── products.html   # Product management
        ├── add_product.html
        └── categories.html
```

## Adding Products (Admin)
1. Login as admin → go to `/admin`
2. Add categories first → `/admin/categories`
3. Add products with file upload → `/admin/products/add`
4. Files are stored in `secure_files/` — never publicly accessible

## Payment Integration

Replace the demo checkout in `app.py` at the `checkout_confirm` route:

### Stripe (recommended for EU)
```python
import stripe
stripe.api_key = 'sk_live_...'

# Create payment intent
intent = stripe.PaymentIntent.create(
    amount=int(product.price * 100),
    currency='eur',
    metadata={'product_id': product_id, 'user_id': current_user.id}
)
```

### Razorpay (India)
```python
import razorpay
client = razorpay.Client(auth=("KEY_ID", "KEY_SECRET"))
order = client.order.create({'amount': int(product.price * 100), 'currency': 'INR'})
```

## Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Install: `pip install flask-dance`
4. Add callback URL: `http://yourdomain.com/login/google/authorized`

```python
from flask_dance.contrib.google import make_google_blueprint, google
google_bp = make_google_blueprint(
    client_id="YOUR_CLIENT_ID",
    client_secret="YOUR_CLIENT_SECRET",
    scope=["profile", "email"]
)
app.register_blueprint(google_bp, url_prefix="/login")
```

## Deployment (Production)

### Using Gunicorn + Nginx
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 app:app
```

### Environment Variables (production)
```bash
export SECRET_KEY="your-super-secret-key-here"
export DATABASE_URL="postgresql://user:pass@localhost/easywaygermany"
```

### Database (PostgreSQL for production)
```python
# In app.py, change:
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///easywaygermany.db')
```

## Security Notes
- `secure_files/` is outside `static/` — files cannot be accessed via URL
- Downloads are served via Flask's `send_file()` only after purchase verification
- Admin routes are protected by `@admin_required` decorator
- Passwords are hashed with Werkzeug's `generate_password_hash`

## Customization
- **Colors**: Edit CSS variables in `static/css/style.css` (`:root` block)
- **Logo**: Replace the "EW" text logo with an `<img>` tag in `base.html`
- **Products**: Add via admin panel or seed data in `app.py`
- **Contact form**: Wire up email (Flask-Mail) or Formspree

---
Built with ❤️ for EasyWay Germany | Flask + SQLAlchemy + Vanilla JS
