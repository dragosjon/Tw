import express from 'express';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    const {name, password, email } = req.body;
    console.log(req.body);
    try {

        // Validare simplă
        if (!name) {
            return res.status(400).json({ error: "Problema cu numele" });
        }
        if (!email ) {
            return res.status(400).json({ error: "Problema cu emailul" });
        }
        if (!password) {
            return res.status(400).json({ error: "Problema cu parola, alta decat lungimea" });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: "Parola trebuie să fie de cel puțin 6 caractere" });
        }

        // Verifică unicitatea emailului și username-ului
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "Emailul este deja înregistrat" });
        }
        const existingUsername = await User.findOne({ where: { name } });
        if (existingUsername) {
            return res.status(400).json({ error: "Username-ul este deja folosit" });
        }

        // Criptează parola
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crează utilizatorul
        const newUser = await User.create({name, password: hashedPassword, email });

        // Răspunsul (fără parolă)
        res.status(201).json({
            message: 'Utilizator înregistrat cu succes',
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email
            }
        });
    } catch (error) {
        console.log(req.body);
        res.status(500).json({ error: error.message });
    }
});

// Ruta pentru autentificare
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

// Ruta pentru deconectare
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

export default router;
