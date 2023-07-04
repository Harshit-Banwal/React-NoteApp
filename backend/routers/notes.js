const express = require('express');
const router = express.Router();
const Fetchuser = require('../middleware/Fetchuser');
const Notes = require('../modules/Notes');
const { body, validationResult } = require('express-validator');

// Fetching login user
router.get('/fetchnotes', Fetchuser, async(req, res)=>{
    try {
        const note = await Notes.find({user: req.user.id});
        res.json(note);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("something error occur.")
    }
})

// Adding a note
router.post('/addnote', Fetchuser, [
    body('title', 'enter title atleast 3 char.').isLength({ min: 3 }),
    body('description', 'Description min lenght 5').isLength({ min: 5 }),
] ,async(req, res)=>{
    try {
        //check if there any error in validation

        const {title,description, tag} = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const note = new Notes({
            title, description, tag, user: req.user.id
        })  

        const savedNote = await note.save();
        res.json(savedNote)

    } catch (error) {
        console.log(error.message);
        res.status(500).send("something error occur.")
    }
})

// Upading a note
router.put('/updatenote/:id', Fetchuser, async(req, res)=>{
    const {title, description, tag} = req.body

    const newNote = {}
    if(title){ newNote.title = title}
    if(description){ newNote.description = description}
    if(tag){ newNote.tag = tag}

    let note = await Notes.findById(req.params.id)
    if(!note){ return res.status(404).send("Not Found")}

    if(note.user.toString() !== req.user.id){
        res.status(401).send("Not Allowed")
    }

    note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true})
    res.json({note});
})

// Delete a Note
router.delete('/deletenote/:id', Fetchuser, async(req, res)=>{

    let note = await Notes.findById(req.params.id)
    if(!note){ return res.status(404).send("Not Found")}

    if(note.user.toString() !== req.user.id){
        res.status(401).send("Not Allowed")
    }

    note = await Notes.findByIdAndDelete(req.params.id)
    res.json({"Success": "Note has been deleted"});
})


module.exports = router