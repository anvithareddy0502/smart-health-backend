require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');

const { sequelize, Medicine, User, Appointment, Report } = require('./models');
const healthResultsRouter = require('./routes/healthResults');

const app = express();

/* ================== CORS ================== */
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://smart-healthcare-assista-754c4.web.app"
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use(bodyParser.json());

/* ================== ROUTES ================== */
app.use("/api/profile", require("./routes/profile"));
app.use('/api/health-results', healthResultsRouter);
app.use('/api/users', require('./routes/users'));
app.use('/api/medicines', require('./routes/medicines'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/chat', require('./routes/chat'));

/* ================== FILE UPLOAD ================== */
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const upload = multer({ dest: 'uploads/' });

app.use('/uploads', express.static('uploads'));

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const { userId } = req.body;

    const record = await Report.create({
      name: req.file.originalname,
      path: req.file.filename,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      userId
    });

    res.json({ message: 'Uploaded', record });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/files/:userId', async (req, res) => {
  const files = await Report.findAll({
    where: { userId: req.params.userId }
  });
  res.json(files);
});

app.get('/api/download/:filename', (req, res) => {
  res.download(`uploads/${req.params.filename}`);
});

/* ================== ROOT ================== */
app.get('/', (req, res) => {
  res.json({ message: 'Backend running' });
});

/* ================== DATABASE ================== */
sequelize.authenticate()
  .then(() => console.log('DB connected'))
  .catch(err => console.log(err));

sequelize.sync({ alter: true })
  .then(() => console.log('DB synced'))
  .catch(err => console.log(err));

/* ================== START SERVER ================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});