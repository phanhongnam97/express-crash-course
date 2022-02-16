const express = require('express');
const uuid = require('uuid')
const router = express.Router();
const { HttpStatusCode } = require('../../common/constant')
const members = require('../../members');

const findMember = (id) => {
    const foundIndex = members.findIndex(member => member.id === id);

    return { 
        exist: foundIndex != -1, 
        foundIndex: foundIndex
    }
} 

// Gets all members
router.get('/', (req, res) => res.json(members));

// Get single member
router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const findResult = findMember(id);

    if (findResult.exist) {
        res.json(members.filter(member => member.id === id));
    } else {
        res.status(HttpStatusCode.BadRequest).json({ msg: `No member with the id of ${id}`});
    }
});

// Create member
router.post('/', (req, res) => {
    const newMember = {
        id: uuid.v4(), 
        name: req.body.name, 
        email: req.body.email, 
        status: 'active'
    };

    if (!newMember.name || !newMember.email) {
        return res.status(HttpStatusCode.BadRequest).json({ msg: 'Please include a name and email'})
    }

    members.push(newMember);
    // res.status(HttpStatusCode.Created).json(newMember);
    res.redirect('/');
})

// Update member
router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const findResult = findMember(id);

    if (findResult.exist) {
        const updateMember = req.body;
        const foundIdx = findResult.foundIndex;
        
        members[foundIdx].name = updateMember.name ? updateMember.name : members[foundIdx].name;
        members[foundIdx].email = updateMember.email ? updateMember.email : members[foundIdx].email;

        res.json({ msg: 'Member updated', member:  members[foundIdx]});
    } else {
        res.status(HttpStatusCode.BadRequest).json({ msg: `No member with the id of ${id}`});
    }
});


// Delete single member
router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const findResult = findMember(id);

    if (findResult.exist) {
        members = members.filter(member => member !== id);
        res.json({ msg: `Member with the id of ${id} is deleted`});
    } else {
        res.status(HttpStatusCode.BadRequest).json({ msg: `No member with the id of ${id}`});
    }
});

module.exports = router;