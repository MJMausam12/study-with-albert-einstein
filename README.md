# 📚 Study with Albert Einstein
### Job Exam Preparation Quiz Platform

A full-featured quiz website for job exam preparation with 13 subject categories, admin panel, score tracking, and more.

---

## 🌟 Features

- **13 Quiz Categories**: Arts & Culture, Assam GK, Assam History, Computer GK, Geography, India GK, Indian History, Polity, Science, Sports, Technology, World GK, Previous Papers
- **Multiple Choice Questions** with instant feedback (green = correct, red = wrong)
- **Sound Effects** for correct/wrong answers (toggle-able)
- **Live Score Tracking** and detailed result page
- **Two Admin Panels** with different permission levels
- **Admin 1** (Full Access): Add/delete questions, scan text, manage categories & sets
- **Admin 2** (Add Only): Add questions and scan text only
- **Scan/Paste Text**: Auto-parse questions from copied text with preview & edit
- **Duplicate Detection**: Alerts if same question is added twice
- **Persistent Storage**: All data saved in browser localStorage
- **Responsive Design**: Works on mobile and desktop

---

## 🔐 Admin Credentials

| Admin | Password | Permissions |
|-------|----------|-------------|
| Admin 1 | `Mausam@9127` | Full access (add, delete, manage categories) |
| Admin 2 | `Gogoi@7861005` | Add questions & scan text only |

---

## 📁 File Structure

```
study-with-albert-einstein/
├── index.html          ← Main app file
├── css/
│   └── style.css       ← All styles
├── js/
│   ├── data.js         ← Data layer (localStorage)
│   ├── app.js          ← Quiz logic, navigation, auth
│   └── admin.js        ← Admin panel logic
└── README.md           ← This file
```

---

## 🚀 Step-by-Step GitHub Deployment

### Step 1: Create a GitHub Account
If you don't have one, go to [https://github.com](https://github.com) and sign up.

### Step 2: Create a New Repository
1. Click the **+** button in top-right → **New repository**
2. Repository name: `study-with-albert-einstein`
3. Set to **Public**
4. Do NOT check "Initialize this repository with a README"
5. Click **Create repository**

### Step 3: Upload Files (Easy Method — GitHub Web Upload)
1. Open your new empty repository
2. Click **"uploading an existing file"** link (or **Add file → Upload files**)
3. Upload files in this order:
   - First upload: `index.html`
   - Then create folder `css` → upload `style.css`
   - Then create folder `js` → upload `data.js`, `app.js`, `admin.js`
   - Upload `README.md`

#### How to create folders when uploading:
- Click **Add file → Create new file**
- Type `css/style.css` in the filename box (the `/` creates the folder automatically)
- Paste the contents and commit

### Step 4: Enable GitHub Pages
1. Go to your repository **Settings**
2. Scroll down to **Pages** section (left sidebar)
3. Under **Source**, select **Deploy from a branch**
4. Branch: **main** | Folder: **/ (root)**
5. Click **Save**

### Step 5: Access Your Live Site
After 1-2 minutes, your site will be live at:
```
https://YOUR-USERNAME.github.io/study-with-albert-einstein/
```

---

## 💻 Run Locally

No server needed! Just:
1. Download all files
2. Keep the folder structure intact
3. Open `index.html` in any modern browser (Chrome, Firefox, Edge)

---

## 📝 How to Use the Admin Panel

### Adding Questions Manually:
1. Click **Admin** in the navbar
2. Select Admin 1 or Admin 2, enter password
3. Go to **Add Question** tab
4. Select Category → Select Set → Fill in question & options → Submit

### Scanning Text from Books:
1. Admin panel → **Scan Text** tab
2. Select category and set
3. Paste your text in this format:
```
1. What is the capital of India?
A) Mumbai  B) Delhi  C) Kolkata  D) Chennai
Answer: B

2. Who wrote Gitanjali?
A) Premchand  B) Tagore  C) Nehru  D) Gandhi
Answer: B
```
4. Click **Parse Questions** → Preview → Edit if needed → **Import All**

### Adding New Categories:
1. Admin 1 only → **Categories** tab
2. Enter category name and emoji icon → **Add Category**
3. Then add sets to that category

---

## 🎨 Customization

To change app name, colors, or add your own logo, edit:
- `index.html` — SVG logo in the `<nav>` section
- `css/style.css` — CSS variables at the top (`:root {}`)

---

## 📞 Support

For questions about deployment or customization, refer to:
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Help](https://support.github.com)
