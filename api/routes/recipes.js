import { Router } from 'express';
import { Recipe } from '../entities/recipe';
import { Tag } from '../entities/tag';
import { EntityManager } from 'typeorm';


export default (DataSource) => {
    const router = Router();
    const recipeResource = DataSource.getRepository(Recipe);
    const tagResource = DataSource.getRepository(Tag);
   
    const multer = require('multer');

    const storage = multer.diskStorage({
        destination: '../webapp2/uploads',
        filename: (req, file, cb) => {
            const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, uniquePrefix + '-' + file.originalname);
        },
      });
      
    const upload = multer({ storage: storage });


    

    router.get('/recipes', (request, response) => {
        recipeResource.createQueryBuilder("recipe")
        .leftJoin("recipe.ratings", "rating")
        .addSelect("AVG(rating.score)", "avgScore")
        .where("recipe.user = :userID", { userID: request.user.id })
        .groupBy("recipe.id")
        .getRawMany()
        .then(
            (recipes) => {
                response.send({recipes});
            }, 
            () => {
                response.send({recipes: []});
            }
        );
    });

    router.get('/recipes/:id', (request, response) => {
        recipeResource.createQueryBuilder("recipe")
        .leftJoin("recipe.ratings", "rating")
        .addSelect("AVG(rating.score)", "avgScore")
        .where("recipe.id = :recipeID", { recipeID: request.params.id})
        .getRawOne()
        .then(
            (recipe) => {
                response.send({recipe: recipe});
            }, 
            () => {
                response.send();
            }
        );
    });

    router.get('/recipes/:id/tags', (req, res) => {
        const recipeId = req.params.id;
        const myQuery =`
        SELECT DISTINCT t.text
        FROM tag t, recipe_tags_tag rt
        WHERE t.id = rt.tagId AND rt.recipeId = ` + recipeId;

        //recipeResource.findOne( req.params.id, { relations: ['tags'] })
        DataSource.manager.query(myQuery)
        .then((recipe) => {
                const stringList = recipe.map((row) => row.text);
                res.send({tags: JSON.stringify(stringList)})
            }, 
            () => {
                res.send({tags: []})
            }
        );
    });


    router.get('/search', (request, response) => {
        let myQuery = recipeResource.createQueryBuilder("recipes")
            .leftJoinAndSelect("recipes.user", "user")
            // .leftJoin("recipe.ratings", "rating")
            // .addSelect("AVG(rating.score)", "avgScore")
        
        if (request.query.showZip) {
            const zip = request.query.zip;
            myQuery.where("user.zipCode = :zip", { zip });
        }

        // if(!request.query.getTop){
        //     myQuery.orderBy('RAND()')
        // } else {
        //     myQuery.orderBy('avgScore')
        // }

        if (request.query.count) {
            myQuery.limit(request.query.count);
        }

        // if(request.query.tags){
        //     myQuery.leftJoinAndSelect("recipes.tags", "tag");
        // }
            
        //myQuery.orderBy("recipes.score", "DESC").getMany()
        myQuery.getMany()
            .then(
                (recipes) => {
                    response.send({recipes})
                }, 
                () => response.send({recipes: []})
            );
    });
    router.post('/recipes', upload.single('uploaded_file'), (request, response) => {
        const tags = JSON.parse(request.body.tags);
        const tagObjects = [];
        const promises = [];
    
        for (const tag of tags) {
            const tagObj = tagResource.create({ text: tag });
            const savePromise = tagResource.save(tagObj)
                .then(() => {
                    tagObjects.push(tagObj);
                })
                .catch(() => {
                    const findOnePromise = tagResource.findOne({ where: { text: tag } })
                        .then((foundTag) => {
                            if (foundTag) {
                                tagObjects.push(foundTag);
                            }
                        });
                    promises.push(findOnePromise);
                    return findOnePromise;
                });
    
            promises.push(savePromise);
        }
    
        Promise.all(promises)
            .then(() => {
                const { title, description, videoLink } = request.body;
                const fileName = "../../uploads/" + request.file.filename;
                const recipe = recipeResource.create({
                    title,
                    description,
                    videoLink,
                    fileName,
                    user: request.user,
                    tags: tagObjects
                });
                recipeResource.save(recipe).then((result) => {
                    response.send(result);
                });
            })
            .catch((error) => {
                console.error("Error occurred:", error);
            });
    });
    

    router.param('id', (req, res, next, id) => {
        const recipe = recipeResource.findOne({
            where: {
                id//,
                //user: req.user
            }
        }).then((recipe) => {
            if (recipe) {
                //TODO PLEASE FOR THE LOVE OF GOD HELP ME LOAD USER
                req.recipe = recipe;
                next();
            } else {
                res.send(404);
            }
        });
        
    });


    router.put('/recipes/:id', (req, res) => {
        const { title, description, imageURL } = req.body;
        recipeResource.save({ ...req.recipe, title, description, imageURL}).then((result) => {
            res.send(result);
        });
    });

    router.delete('/recipes/:id', (req, res) => {
        recipeResource.delete(req.recipe.id).then((result) => {
            res.send(result);
        });
    });
    return router;
}