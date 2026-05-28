# Water Refilling POS + Machine Learning Forecast

A full-stack application with:
- **Backend (Django REST)** for orders, inventory, predictions
- **Frontend (React)** for cashier dashboard and sales forecast
- **Machine Learning** model (SGDRegressor) for 7-day revenue prediction

---

##  Quickstart

### Backend
```bash
git clone https://github.com/LloydJab/Water-Refilling---Backend.git
cd Water-Refilling---Backend/backend
python -m venv .venv
source .venv/bin/activate   # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

### Frontend

git clone https://github.com/leifvash/AppDev.git
cd AppDev
npm install
npm start
