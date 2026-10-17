import os
import uuid
from datetime import datetime, timezone
from functools import wraps
from flask import (
    Flask, render_template, request, redirect, url_for, 
    flash, abort, send_from_directory, jsonify
)
from flask_sqlalchemy import SQLAlchemy
from flask_login import (
    LoginManager, UserMixin, login_user, logout_user, 
    current_user, login_required
)
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
SECURE_FILES_DIR = os.path.join(BASE_DIR, 'secure_files')
os.makedirs(SECURE_FILES_DIR, exist_ok=True)

def utc_now():
    return datetime.now(timezone.utc)

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'easyway-germany-super-secret-key-2026')

# Intelligent DB config: local SQLite by default, or PostgreSQL if production / FLASK_DATABASE_URL
default_sqlite = f'sqlite:///{os.path.join(BASE_DIR, "easywaygermany.db")}'
flask_db = os.environ.get('FLASK_DATABASE_URL')
if flask_db:
    app.config['SQLALCHEMY_DATABASE_URI'] = flask_db
elif os.environ.get('FLASK_ENV') == 'production' and os.environ.get('DATABASE_URL'):
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = default_sqlite

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB max upload
app.config['SECURE_FILES_DIR'] = SECURE_FILES_DIR

db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.login_message = 'Please log in to access this page.'
login_manager.login_message_category = 'warning'

# -------------------------------------------------------------
# Models
# -------------------------------------------------------------
class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    full_name = db.Column(db.String(100), nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=utc_now)

    orders = db.relationship('Order', backref='user', lazy='dynamic')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def has_purchased(self, product_id):
        if self.is_admin:
            return True
        return self.orders.filter_by(product_id=product_id, status='completed').first() is not None


class Category(db.Model):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    slug = db.Column(db.String(80), unique=True, nullable=False)
    description = db.Column(db.String(255))
    icon = db.Column(db.String(50), default='folder')

    products = db.relationship('Product', backref='category', lazy='dynamic')


class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    slug = db.Column(db.String(200), unique=True, nullable=False)
    short_desc = db.Column(db.String(300), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False, default=0.0)
    original_price = db.Column(db.Float, nullable=True)
    badge = db.Column(db.String(50), default='')  # e.g., 'Best Seller', 'Top Rated'
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    file_name = db.Column(db.String(255), nullable=False)  # stored in secure_files/
    file_original_name = db.Column(db.String(255), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=utc_now)

    orders = db.relationship('Order', backref='product', lazy='dynamic')


class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(36), unique=True, nullable=False, default=lambda: f"EWG-{uuid.uuid4().hex[:8].upper()}")
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(10), default='EUR')
    status = db.Column(db.String(20), default='completed')  # 'completed', 'pending', 'failed'
    payment_method = db.Column(db.String(50), default='demo')
    created_at = db.Column(db.DateTime, default=utc_now)


class ContactMessage(db.Model):
    __tablename__ = 'contact_messages'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(30))
    subject = db.Column(db.String(150))
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=utc_now)


@login_manager.user_loader
def load_user(user_id):
    return db.session.get(User, int(user_id))


# -------------------------------------------------------------
# Decorators
# -------------------------------------------------------------
def admin_required(f):
    @wraps(f)
    @login_required
    def decorated_function(*args, **kwargs):
        if not current_user.is_admin:
            flash('Access restricted to administrators.', 'danger')
            return redirect(url_for('index'))
        return f(*args, **kwargs)
    return decorated_function


# -------------------------------------------------------------
# Context Processors
# -------------------------------------------------------------
@app.context_processor
def inject_global_data():
    categories = Category.query.all()
    return {
        'nav_categories': categories,
        'current_year': datetime.now(timezone.utc).year
    }


# -------------------------------------------------------------
# Public Routes
# -------------------------------------------------------------
@app.route('/')
def index():
    featured_products = Product.query.filter_by(is_active=True).limit(6).all()
    categories = Category.query.all()
    return render_template('index.html', featured_products=featured_products, categories=categories)


@app.route('/products')
def products():
    category_slug = request.args.get('category')
    search_query = request.args.get('q', '').strip()

    query = Product.query.filter_by(is_active=True)

    selected_category = None
    if category_slug:
        selected_category = Category.query.filter_by(slug=category_slug).first()
        if selected_category:
            query = query.filter_by(category_id=selected_category.id)

    if search_query:
        query = query.filter(
            (Product.title.ilike(f'%{search_query}%')) | 
            (Product.short_desc.ilike(f'%{search_query}%'))
        )

    products_list = query.order_by(Product.created_at.desc()).all()
    categories = Category.query.all()

    return render_template(
        'products.html', 
        products=products_list, 
        categories=categories,
        selected_category=selected_category,
        search_query=search_query
    )


@app.route('/products/<slug>')
def product_detail(slug):
    product = Product.query.filter_by(slug=slug, is_active=True).first_or_404()
    related_products = Product.query.filter(
        Product.category_id == product.category_id,
        Product.id != product.id,
        Product.is_active == True
    ).limit(3).all()

    already_purchased = False
    if current_user.is_authenticated:
        already_purchased = current_user.has_purchased(product.id)

    return render_template(
        'product_detail.html', 
        product=product, 
        related_products=related_products,
        already_purchased=already_purchased
    )


@app.route('/services')
def services():
    return render_template('services.html')


@app.route('/about')
def about():
    return render_template('about.html')


@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip()
        phone = request.form.get('phone', '').strip()
        subject = request.form.get('subject', '').strip()
        message = request.form.get('message', '').strip()

        if not name or not email or not message:
            flash('Please fill in all required fields.', 'danger')
        else:
            msg = ContactMessage(name=name, email=email, phone=phone, subject=subject, message=message)
            db.session.add(msg)
            db.session.commit()
            flash('Thank you! Your message and consultation request have been received. We will get back to you within 24 hours.', 'success')
            return redirect(url_for('contact'))

    return render_template('contact.html')


# -------------------------------------------------------------
# Checkout & Secure Download Routes
# -------------------------------------------------------------
@app.route('/checkout/<int:product_id>')
@login_required
def checkout(product_id):
    product = db.get_or_404(Product, product_id)
    if current_user.has_purchased(product.id):
        flash('You already own this digital resource! You can download it directly from your dashboard.', 'info')
        return redirect(url_for('dashboard'))
    return render_template('checkout.html', product=product)


@app.route('/checkout/<int:product_id>/confirm', methods=['POST'])
@login_required
def checkout_confirm(product_id):
    product = db.get_or_404(Product, product_id)
    payment_method = request.form.get('payment_method', 'demo')

    # Check if already purchased
    existing_order = Order.query.filter_by(
        user_id=current_user.id, 
        product_id=product.id, 
        status='completed'
    ).first()

    if existing_order:
        flash('You have already purchased this item.', 'info')
        return redirect(url_for('dashboard'))

    # Payment integration hook
    # For Stripe or Razorpay, verify payment token / webhook here.
    order = Order(
        user_id=current_user.id,
        product_id=product.id,
        amount=product.price,
        currency='EUR',
        status='completed',
        payment_method=payment_method
    )
    db.session.add(order)
    db.session.commit()

    flash(f'🎉 Success! Your purchase of "{product.title}" is complete. Your download is now ready below.', 'success')
    return redirect(url_for('dashboard'))


@app.route('/dashboard')
@login_required
def dashboard():
    orders = Order.query.filter_by(user_id=current_user.id, status='completed').order_by(Order.created_at.desc()).all()
    return render_template('dashboard.html', orders=orders)


@app.route('/download/<int:product_id>')
@login_required
def download_file(product_id):
    product = db.get_or_404(Product, product_id)

    # Security check: User must have purchased the product or be an admin
    if not current_user.has_purchased(product.id):
        flash('You do not have permission to download this file. Please purchase it first.', 'danger')
        return redirect(url_for('product_detail', slug=product.slug))

    file_path = os.path.join(app.config['SECURE_FILES_DIR'], product.file_name)
    if not os.path.exists(file_path):
        flash('Requested resource file was not found on the server. Please contact support.', 'danger')
        return redirect(url_for('dashboard'))

    # Send securely from the protected directory outside static
    return send_from_directory(
        app.config['SECURE_FILES_DIR'],
        product.file_name,
        as_attachment=True,
        download_name=product.file_original_name
    )


# -------------------------------------------------------------
# Authentication Routes
# -------------------------------------------------------------
@app.route('/auth/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))

    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        remember = bool(request.form.get('remember'))

        user = User.query.filter_by(email=email).first()
        if user and user.check_password(password):
            login_user(user, remember=remember)
            flash(f'Welcome back, {user.full_name}!', 'success')
            next_page = request.args.get('next')
            if next_page and not next_page.startswith('//') and not next_page.startswith('http'):
                return redirect(next_page)
            return redirect(url_for('admin_dashboard' if user.is_admin else 'dashboard'))
        else:
            flash('Invalid email or password. Please try again.', 'danger')

    return render_template('auth/login.html')


@app.route('/auth/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))

    if request.method == 'POST':
        full_name = request.form.get('full_name', '').strip()
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        confirm_password = request.form.get('confirm_password', '')

        if not full_name or not email or not password:
            flash('All fields are required.', 'danger')
        elif password != confirm_password:
            flash('Passwords do not match.', 'danger')
        elif len(password) < 6:
            flash('Password must be at least 6 characters long.', 'danger')
        elif User.query.filter_by(email=email).first():
            flash('An account with this email already exists.', 'warning')
        else:
            new_user = User(full_name=full_name, email=email)
            new_user.set_password(password)
            db.session.add(new_user)
            db.session.commit()
            login_user(new_user)
            flash('🎉 Account created successfully! Welcome to EasyWay Germany.', 'success')
            return redirect(url_for('dashboard'))

    return render_template('auth/register.html')


@app.route('/auth/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out safely.', 'info')
    return redirect(url_for('index'))


# -------------------------------------------------------------
# Admin Routes
# -------------------------------------------------------------
@app.route('/admin')
@admin_required
def admin_dashboard():
    total_users = User.query.count()
    total_products = Product.query.count()
    total_orders = Order.query.filter_by(status='completed').count()
    total_revenue = sum([o.amount for o in Order.query.filter_by(status='completed').all()])
    recent_orders = Order.query.order_by(Order.created_at.desc()).limit(8).all()
    recent_messages = ContactMessage.query.order_by(ContactMessage.created_at.desc()).limit(5).all()

    return render_template(
        'admin/dashboard.html',
        total_users=total_users,
        total_products=total_products,
        total_orders=total_orders,
        total_revenue=total_revenue,
        recent_orders=recent_orders,
        recent_messages=recent_messages
    )


@app.route('/admin/products')
@admin_required
def admin_products():
    products_list = Product.query.order_by(Product.created_at.desc()).all()
    return render_template('admin/products.html', products=products_list)


@app.route('/admin/products/add', methods=['GET', 'POST'])
@admin_required
def admin_add_product():
    categories = Category.query.all()
    if request.method == 'POST':
        title = request.form.get('title', '').strip()
        slug = request.form.get('slug', '').strip().lower() or title.lower().replace(' ', '-').replace('/', '-')
        short_desc = request.form.get('short_desc', '').strip()
        description = request.form.get('description', '').strip()
        price = float(request.form.get('price', 0.0))
        original_price = request.form.get('original_price')
        original_price = float(original_price) if original_price else None
        badge = request.form.get('badge', '').strip()
        category_id = int(request.form.get('category_id'))

        file = request.files.get('product_file')
        if not file or file.filename == '':
            flash('A digital resource file is required.', 'danger')
            return render_template('admin/add_product.html', categories=categories)

        orig_filename = secure_filename(file.filename)
        unique_file_name = f"{uuid.uuid4().hex}_{orig_filename}"
        file.save(os.path.join(app.config['SECURE_FILES_DIR'], unique_file_name))

        # Check unique slug
        base_slug = slug
        count = 1
        while Product.query.filter_by(slug=slug).first():
            slug = f"{base_slug}-{count}"
            count += 1

        product = Product(
            title=title,
            slug=slug,
            short_desc=short_desc,
            description=description,
            price=price,
            original_price=original_price,
            badge=badge,
            category_id=category_id,
            file_name=unique_file_name,
            file_original_name=orig_filename
        )
        db.session.add(product)
        db.session.commit()
        flash('✅ Product published successfully!', 'success')
        return redirect(url_for('admin_products'))

    return render_template('admin/add_product.html', categories=categories)


@app.route('/admin/products/<int:id>/toggle-status', methods=['POST'])
@admin_required
def admin_toggle_product_status(id):
    product = db.get_or_404(Product, id)
    product.is_active = not product.is_active
    db.session.commit()
    flash(f'Product "{product.title}" status updated.', 'info')
    return redirect(url_for('admin_products'))


@app.route('/admin/categories', methods=['GET', 'POST'])
@admin_required
def admin_categories():
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        slug = request.form.get('slug', '').strip().lower() or name.lower().replace(' ', '-')
        description = request.form.get('description', '').strip()
        icon = request.form.get('icon', 'folder').strip()

        if Category.query.filter_by(slug=slug).first():
            flash('A category with this slug already exists.', 'warning')
        else:
            cat = Category(name=name, slug=slug, description=description, icon=icon)
            db.session.add(cat)
            db.session.commit()
            flash('✅ Category added successfully.', 'success')
            return redirect(url_for('admin_categories'))

    categories = Category.query.all()
    return render_template('admin/categories.html', categories=categories)


# -------------------------------------------------------------
# Database Initialization & Seeding
# -------------------------------------------------------------
def seed_initial_data():
    with app.app_context():
        db.create_all()

        # 1. Admin user
        admin = User.query.filter_by(email='admin@easywaygermany.com').first()
        if not admin:
            admin = User(
                email='admin@easywaygermany.com',
                full_name='EasyWay Admin',
                is_admin=True
            )
            admin.set_password('admin123')
            db.session.add(admin)

        # 2. Categories
        cat_data = [
            {'name': 'University Lists', 'slug': 'university-lists', 'description': 'Hand-picked, tuition-free Master programs in Germany with ECTS breakdowns', 'icon': 'building'},
            {'name': 'SOP Templates', 'slug': 'sop-templates', 'description': 'Committee-approved Statement of Purpose templates for German universities', 'icon': 'file-text'},
            {'name': 'LOR & CV Kits', 'slug': 'lor-cv-kits', 'description': 'German Europass standard CV formats and Letter of Recommendation guides', 'icon': 'award'},
            {'name': 'Comprehensive Guides', 'slug': 'guides', 'description': 'Step-by-step master application blueprints, APS certification & visa guides', 'icon': 'compass'},
        ]

        categories_map = {}
        for c in cat_data:
            cat = Category.query.filter_by(slug=c['slug']).first()
            if not cat:
                cat = Category(name=c['name'], slug=c['slug'], description=c['description'], icon=c['icon'])
                db.session.add(cat)
                db.session.flush()
            categories_map[c['slug']] = cat

        # 3. Seed sample products & secure files
        # Check files in secure_files
        u_guide_file = 'germany_master_universities_guide.txt'
        sop_file = 'sop_template_germany.txt'

        products_data = [
            {
                'title': 'Master in Germany: 120+ Tuition-Free English Programs Masterlist (2026)',
                'slug': 'master-germany-tuition-free-programs-masterlist',
                'category_slug': 'university-lists',
                'price': 29.00,
                'original_price': 59.00,
                'badge': 'Best Seller',
                'short_desc': 'Verified list of 120+ tuition-free English-taught Masters in CS, AI, Data Science & Engineering with GPA, ECTS requirements & uni-assist portal tips.',
                'description': 'The definitive university shortlisting guide for Germany. Includes admission criteria, German grade conversion formula (Bavarian Formula), winter & summer semester deadlines, uni-assist vs direct application tags, and ECTS requirements.',
                'file_name': u_guide_file,
                'file_original_name': 'Germany_Master_Programs_Directory_2026.pdf'
            },
            {
                'title': 'Admitted to TUM & RWTH: Proven Statement of Purpose (SOP) Blueprint',
                'slug': 'admitted-tum-rwth-sop-blueprint',
                'category_slug': 'sop-templates',
                'price': 19.00,
                'original_price': 39.00,
                'badge': 'Top Rated',
                'short_desc': 'Word-by-word academic SOP template that secured admits at TU Munich, RWTH Aachen, and TU Berlin. Detailed module matching strategy.',
                'description': 'Learn how German admission committees grade your SOP. Unlike US/UK SOPs, German universities focus strictly on ECTS match, module competencies, and research methodologies. Includes 3 annotated real accepted samples and editable templates.',
                'file_name': sop_file,
                'file_original_name': 'Accepted_SOP_German_Universities_Template.docx'
            },
            {
                'title': 'German Europass Standard Academic CV & 2x Professor LOR Package',
                'slug': 'german-standard-academic-cv-lor-package',
                'category_slug': 'lor-cv-kits',
                'price': 24.00,
                'original_price': 45.00,
                'badge': 'Essential',
                'short_desc': 'High-impact Europass-style CV tailored for German academia + 2 customizable academic LOR templates emphasizing research aptitude.',
                'description': 'German universities require tabular chronologic CVs with specific formatting. This bundle gives you the exact LaTeX & Word formats accepted by uni-assist and universities, plus professor recommendation templates highlighting coursework credits.',
                'file_name': sop_file,
                'file_original_name': 'German_Academic_CV_and_LOR_Kit.zip'
            },
            {
                'title': 'Complete Germany Masters Visa & APS Certification Survival Guide',
                'slug': 'complete-germany-masters-visa-aps-guide',
                'category_slug': 'guides',
                'price': 15.00,
                'original_price': 30.00,
                'badge': 'Updated 2026',
                'short_desc': 'A-to-Z roadmap for APS verification certificate, Blocked Account setup (€11,904), statutory health insurance (TK/Barmer), and visa slot booking.',
                'description': 'Save months of stress. Walkthroughs of the new APS certificate procedure, embassy interview questions, financial documentation checklist, and step-by-step blocked account comparisons (Expatrio, Fintiba, Coracle).',
                'file_name': u_guide_file,
                'file_original_name': 'Germany_Visa_and_APS_Master_Guide_2026.pdf'
            }
        ]

        for p_info in products_data:
            existing_p = Product.query.filter_by(slug=p_info['slug']).first()
            if not existing_p:
                cat = categories_map.get(p_info['category_slug'])
                prod = Product(
                    title=p_info['title'],
                    slug=p_info['slug'],
                    category_id=cat.id if cat else 1,
                    price=p_info['price'],
                    original_price=p_info['original_price'],
                    badge=p_info['badge'],
                    short_desc=p_info['short_desc'],
                    description=p_info['description'],
                    file_name=p_info['file_name'],
                    file_original_name=p_info['file_original_name']
                )
                db.session.add(prod)

        db.session.commit()
        print("Database seeded successfully with default admin, categories, and products!")


# Call seed data on start
seed_initial_data()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
