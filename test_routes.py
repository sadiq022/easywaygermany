import unittest
from app import app, db, User, Product, Order, Category

class FlaskAppTests(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        app.config['WTF_CSRF_ENABLED'] = False
        self.client = app.test_client()

    def test_homepage(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'EasyWay', response.data)
        self.assertIn(b'Tuition-Free', response.data)

    def test_products_list(self):
        response = self.client.get('/products')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Digital Products & Templates', response.data)

    def test_product_detail(self):
        response = self.client.get('/products/master-germany-tuition-free-programs-masterlist')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Purchase & Download Now', response.data)

    def test_admin_login_and_panel(self):
        # 1. Login with seeded admin credentials
        login_resp = self.client.post('/auth/login', data={
            'email': 'admin@easywaygermany.com',
            'password': 'admin123'
        }, follow_redirects=True)
        self.assertEqual(login_resp.status_code, 200)
        self.assertIn(b'Admin Overview', login_resp.data)

        # 2. Access /admin
        admin_resp = self.client.get('/admin')
        self.assertEqual(admin_resp.status_code, 200)
        self.assertIn(b'EasyWay Control Center', admin_resp.data)

        # 3. Access /admin/products
        prods_resp = self.client.get('/admin/products')
        self.assertEqual(prods_resp.status_code, 200)
        self.assertIn(b'Inventory', prods_resp.data)

        # 4. Access /admin/categories
        cats_resp = self.client.get('/admin/categories')
        self.assertEqual(cats_resp.status_code, 200)
        self.assertIn(b'Product Categories', cats_resp.data)

    def test_user_flow_and_download(self):
        import uuid
        test_email = f"student_{uuid.uuid4().hex[:6]}@example.com"
        # Register a new user
        reg_resp = self.client.post('/auth/register', data={
            'full_name': 'Test Student',
            'email': test_email,
            'password': 'studentpassword123',
            'confirm_password': 'studentpassword123'
        }, follow_redirects=True)
        self.assertEqual(reg_resp.status_code, 200)

        # Checkout product #1
        order_resp = self.client.post('/checkout/1/confirm', data={
            'payment_method': 'demo'
        }, follow_redirects=True)
        self.assertEqual(order_resp.status_code, 200)
        self.assertIn(b'Success!', order_resp.data)

        # Download file
        dl_resp = self.client.get('/download/1')
        self.assertEqual(dl_resp.status_code, 200)
        self.assertTrue(len(dl_resp.data) > 0)

if __name__ == '__main__':
    unittest.main()
