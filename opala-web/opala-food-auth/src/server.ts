import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import path from 'path';
import cookieParser from 'cookie-parser';
import { Pool } from 'pg'
 
const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'opala',
  password: 'admin',
  port: 5432,
})
 

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(session({ secret: 'yourSecret', resave: false, saveUninitialized: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(cookieParser());

interface IRequest extends Request {
  user?: Record<string, string>
}

const authMiddlweare = (req: IRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.authorization;
  if (!token) {
    return res.redirect('/login')
  }

  try {
    const decoded = jwt.verify(token, 'secret-1231');
    req.user = decoded as Record<string, string>;
    next();
  } catch (err) {
    return res.redirect('/login')
  }
}

// const db = new sqlite3.Database('database.db');

// db.serialize(() => {
//   db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT, password TEXT, name TEXT, gender TEXT)');
// });

app.post('/auth/register', (req: Request, res: Response) => {
  const { email, password, name, gender } = req.body;

  if (!email || !password || !name || !gender) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  pool.query('SELECT * FROM users WHERE email = $1', [email], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (result.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ message: 'Error hashing the password' });
      }

      pool.query(
        'INSERT INTO users (email, password, name, gender) VALUES ($1, $2, $3, $4)',
        [email, hashedPassword, name, gender],
        (err) => {
          if (err) {
            return res.status(500).json({ message: 'Error creating the user' });
          }
          res.status(201).json({ message: 'User registered successfully' });
        }
      );
    });
  });
});

app.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  pool.query('SELECT * FROM users WHERE email = $1', [email], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err || !result) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign({ email: user.email, name: user.name }, 'secret-1231', { expiresIn: '1h' });
      res.json({ token });
    });
  });
});


app.get('/home', authMiddlweare, (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.get('/login', (req, res) => {
  res.sendFile('login.html', { root: 'public' });
});

app.get('/register', (req, res) => {
  res.sendFile('register.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
