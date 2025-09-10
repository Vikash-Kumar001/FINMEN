# 🔐 FINMEN Login Credentials

## Test User Accounts

All accounts are pre-approved and ready to use. Use these credentials to test different dashboard functionalities.

### 👨‍👩‍👧‍👦 Parent Dashboard
```json
{
  "name": "Parent",
  "email": "parent@gmail.com",
  "password": "Parent123",
  "role": "parent",
  "child email": "child@gmail.com"
}
```
**Dashboard URL**: `/parent/dashboard`
**Features**: Child progress tracking, digital twin, wallet summary, subscription management
**Child Linking**: Automatically links to child account via email (child@gmail.com)

---

### 🏪 Seller Dashboard
```json
{
  "name": "Seller",
  "email": "seller@gmail.com",
  "password": "Seller123",
  "role": "seller",
  "business name": "Seller Enterprises",
  "shop type": "Stationery"
}
```
**Dashboard URL**: `/seller/dashboard`
**Features**: Product management, voucher redemption, QR scanning, sales analytics, commission tracking

---

### 🏢 CSR/Sponsor Dashboard
```json
{
  "name": "CSR Name",
  "email": "csr@example.com",
  "password": "csr123",
  "role": "csr",
  "organization": "NGO Name"
}
```
**Dashboard URL**: `/csr/dashboard`
**Features**: Impact metrics, regional analysis, module-wise progress, automated reporting

---

### 👨‍🏫 Educator Dashboard
```json
{
  "name": "John Educator",
  "email": "educator@test.com",
  "password": "Educator123",
  "role": "educator",
  "position": "Mathematics Teacher",
  "subjects": "Mathematics, Physics"
}
```
**Dashboard URL**: `/educator/dashboard`
**Features**: Student management, progress tracking, redemption approvals, analytics

---

### 👨‍💼 Admin Dashboard
```json
{
  "name": "Admin User",
  "email": "admin@test.com",
  "password": "Admin123",
  "role": "admin"
}
```
**Dashboard URL**: `/admin/dashboard`
**Features**: User management, system analytics, approval workflows, platform settings

---

### 👨‍🎓 Student Dashboard (Child)
```json
{
  "name": "Child User",
  "email": "child@gmail.com",
  "password": "Child123",
  "role": "student"
}
```
**Dashboard URL**: `/student/dashboard`
**Features**: Learning games, mood tracking, rewards, leaderboard, financial literacy

---

## 🚀 Quick Setup

### 1. Create Test Users
```bash
cd backend
npm run create-test-users
```

### 2. Login Process
1. Go to `/login`
2. Use any of the credentials above
3. Auto-redirect to appropriate dashboard

### 3. Registration Process (New Users)
1. Go to `/register-stakeholder`
2. Select role (Parent/Seller/CSR/Educator)
3. Fill role-specific fields
4. Submit (account will be pending approval)
5. Admin can approve from admin dashboard

---

## 📋 Role-Specific Field Requirements

### Parent Registration
- **Required**: Child Email Address
- **Example**: "child@test.com"

### Seller Registration
- **Required**: Business Name, Shop Type
- **Shop Types**: Stationery, Uniforms, Food, Books, Electronics, Other

### CSR Registration
- **Required**: Organization Name
- **Example**: "NGO Foundation"

### Educator Registration
- **Required**: Position, Subjects
- **Example**: "Mathematics Teacher", "Mathematics, Physics"

---

## 🔒 Authentication Flow

### Email Verification
- ✅ **Students**: Require email verification
- ✅ **All Others**: Auto-verified (no email verification needed)

### Admin Approval
- ✅ **Parent/Seller/CSR/Educator**: Require admin approval
- ✅ **Admin/Student**: Auto-approved

### Access Control
- Each role has specific middleware protection
- Dashboards are role-restricted
- API endpoints are protected by role-based middleware

---

## 🛠️ Development Notes

### Creating New Users Programmatically
```javascript
// Example for creating a seller
const newSeller = await User.create({
  name: "New Seller",
  email: "newseller@example.com",
  password: await bcrypt.hash("password123", 10),
  role: "seller",
  businessName: "New Business",
  shopType: "Stationery",
  isVerified: true,
  approvalStatus: "pending" // Will need admin approval
});

// Example for creating a parent
const newParent = await User.create({
  name: "New Parent",
  email: "newparent@example.com",
  password: await bcrypt.hash("password123", 10),
  role: "parent",
  childEmail: "child@example.com",
  isVerified: true,
  approvalStatus: "pending" // Will need admin approval
});
```

### API Endpoints
- **Registration**: `POST /api/auth/register-stakeholder`
- **Login**: `POST /api/auth/login`
- **Admin Registration**: `POST /api/auth/admin-register`

---

## 📞 Support

For any issues with login credentials or dashboard access:
1. Check the browser console for errors
2. Verify the user exists in the database
3. Ensure the user's `approvalStatus` is "approved"
4. Check that `isVerified` is `true`

**Last Updated**: January 10, 2025