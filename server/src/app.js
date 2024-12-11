import express from 'express';
import cors from 'cors';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import userRoutes from './routes/userRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import authRoutes from './routes/authRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

const app = express();

// Configurarea strategiei locale Passport pentru a folosi emailul
passport.use(new LocalStrategy({
        usernameField: 'email',  // Schimbare de la 'username' la 'email'
        passwordField: 'password'
    },
    async function(email, password, done) {
        try {
            const user = await User.findOne({ where: { email } }); // Folosește emailul pentru căutare
            if (!user) {
                return done(null, false, { message: 'Email inexistent.' });
            }
            if (!bcrypt.compareSync(password, user.password)) {
                return done(null, false, { message: 'Parolă incorectă.' });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

// Inițializarea Passport
app.use(passport.initialize());

// Construiește __dirname în ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware pentru parsarea JSON-ului din cererile HTTP
app.use(express.json());

// Middleware pentru CORS (permite cererile cross-origin)
app.use(cors());

// Definirea rutelor API
app.use('/api/users', userRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../../client/build')));

// The "catchall" handler for the React app
app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
        return next();
    }
    res.sendFile(path.join(__dirname, '../../client/build/index.html'));
});

// Setarea portului pe care va asculta serverul
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Serverul rulează pe portul ${PORT}`);
});

export default app;
