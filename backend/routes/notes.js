const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');

// ROUTE 1: Get all the Notes using: GET "/api/notes/getUser". Login Required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal Server Error");
    }
});

// ROUTE 2: Add a new note using: POST "/api/notes/addnote". Login Required
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {
    //if there are errors, return bad request with errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { title, description, tag } = req.body;
    try {
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save();
        res.send(savedNote);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal Server Error");
    }
});

// ROUTE 3: Update an existing note using: POST "/api/notes/updatenote". Login Required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found.");
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed.");
        }
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.send(note);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal Server Error");
    }
});

// ROUTE 4: Delete an existing note using: DELETE "/api/notes/deletenote". Login Required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found.");
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed.");
        }
        note = await Note.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Note has been deleted", note: note });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal Server Error");
    }
});

module.exports = router