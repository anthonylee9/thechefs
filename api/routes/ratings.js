import { Router } from 'express';
import { Rating } from '../entities/rating';

export default (DataSource) => {
    const router = Router();
    const ratingResource = DataSource.getRepository(Rating);
   


    router.get('/recipes/:id/ratings', (req, res) => {
        ratingResource.find({where: {
            recipe: {id: req.params.id}
        }}).then(
            (ratings) => {
                res.send({ratings})
            }, 
            () => res.send({ratings: []})
        );
    });

    router.get('/ratings', (request, response) => {
        ratingResource.find({
            where: {
                user: request.user
            }
        }).then(
            (ratings) => {
                response.send({ ratings })
            },
            () => response.send({ ratings: [] })
        );
    })




    router.post('/recipes/:recipeID/ratings', (request, response) => {
        const {score, description, recipeID, recipeTitle} = request.body;
        const rating = ratingResource.create({
            score,
            description,
            associatedRecipeTitle: recipeTitle,
            recipe: recipeID,
            user: request.user
        });
        ratingResource.save(rating).then((result) => {
            response.send(result);
        });
    });
    

    router.delete('/recipes/:id/ratings', (req, res) => {
        ratingResource.delete({recipe: {id: req.params.id} }).then((result) => {
            res.send(result);
        });
    });

    router.delete('/ratings/:id', (req, res) => {
        ratingResource.delete({id: req.params.id}).then((result) => {
            res.send(result);
        });
    });

    return router;
}