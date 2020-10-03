const Sauce = require('../models/Sauce');
const fs = require('fs');
const { json } = require('body-parser');

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces) => {
            res.status(200).json(sauces);
        })
        .catch(error => res.status(400).json({ error }));
};
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ error }))
};

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(200).json({ message: 'sauce saved!' }))
        .catch(error => res.status(400).json({ error }));
};
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {
            ...req.body
        };
    if (req.file) {
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                        .then(() => res.status(200).json({ message: "sauce updated!" }))
                        .catch(error => res.status(400).json({ error }));
                })
            })
            .catch(error => res.status(500).json({ error }));
    }
    else {
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: "sauce updated!" }))
            .catch(error => res.status(400).json({ error }));
    }
};
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: "object deleted!" }))
                    .catch(error => res.status(400).json({ error }));
            })
        })
        .catch(error => res.status(500).json({ error }));
};
exports.setLikeStatus = (req, res, next) => {

    //find sauce with _id in url
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const likeStatus = req.body.like;
            const userId = req.body.userId;
            const usersLikedUp = sauce.usersLiked;
            const usersDislikedUp = sauce.usersDisliked;
            // add userId to usersLiked if like = 1 or usersDisliked if like = -1 or remove it if like = 0
            switch (likeStatus) {
                case 1:
                    //remove userId from usersDisliked before adding it to usersLiked
                    if (usersDislikedUp.includes(userId)) {
                        const index = usersDislikedUp.indexOf(userId);
                        usersDislikedUp.splice(index, 1);
                    }
                    if (!usersLikedUp.includes(userId)) {
                        usersLikedUp.push(userId);
                    }
                    break;
                case -1:
                    if (usersLikedUp.includes(userId)) {
                        const index = usersLikedUp.indexOf(userId);
                        usersLikedUp.splice(index, 1);
                    }
                    if (!usersDislikedUp.includes(userId)) {
                        usersDislikedUp.push(userId);
                    }
                    break;
                case 0:
                    //remove from usersLiked and usersDisliked arrays
                    if (usersLikedUp.includes(userId)) {
                        const index = usersLikedUp.indexOf(userId);
                        usersLikedUp.splice(index, 1);
                    }
                    else if (usersDislikedUp.includes(userId)) {
                        const index = usersDislikedUp.indexOf(userId);
                        usersDislikedUp.splice(index, 1);
                    }
                    break;
            }
            //update likes and dislikes with total userId in usersLiked and usersDisliked arrays

            const likesUp = usersLikedUp.length;
            const dislikesUp = usersDislikedUp.length;
            Sauce.updateOne({ _id: req.params.id }, {
                usersLiked: usersLikedUp,
                usersDisliked: usersDislikedUp,
                likes: likesUp,
                dislikes: dislikesUp,
                _id: req.params.id
            })
                .then(() => res.status(200).json({ message: "sauce like status updated" }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};