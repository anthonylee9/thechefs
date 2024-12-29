import { Router } from 'express';
import { Follower } from '../entities/follower';
import { User } from '../entities/user';

export default (DataSource) => {
    const router = Router();
    const followerRepo = DataSource.getRepository(Follower);
    const userRepo = DataSource.getRepository(User);

    router.post('/follow', async (request, response) => {
        const {userBeingFollowedID, userWhoIsFollowingID} = request.body;

        const alreadyExists = await followerRepo.findOne({
            where: {
              userBeingFollowed: { id: userBeingFollowedID },
              userWhoIsFollowing: { id: userWhoIsFollowingID }
            }
        });

        if (!alreadyExists) {
        
            const userBeingFollowed = await userRepo.findOne({ where: { id: userBeingFollowedID}});
            const userWhoIsFollowing = await userRepo.findOne({ where: { id: userWhoIsFollowingID}});

            const follower = new Follower();

            follower.userBeingFollowed = userBeingFollowed;
            follower.userWhoIsFollowing = userWhoIsFollowing;

            followerRepo.save(follower).then((result) => {
                response.send(result);
            });
        }
    });

    router.post('/unfollow', async (request, response) => {
        console.log("unfollow in api");
        const {userBeingFollowedID, userWhoIsFollowingID} = request.body;

        const alreadyExists = await followerRepo.findOne({         // See if user exists
            where: {
              userBeingFollowed: { id: userBeingFollowedID },
              userWhoIsFollowing: { id: userWhoIsFollowingID }
            }
        });
        //console.log("Already exists", alreadyExists);
        if (alreadyExists) {    // If user exists and is followed, need to unfollow
            followerRepo.delete(alreadyExists.id).then((result) => {
                response.send(result);
            });
        }
    });

    router.get('/user/:id/followers', (req, res) => {
        followerRepo.find({where: {
            userBeingFollowed: {id: req.params.id}},
            relations: ['userWhoIsFollowing']
        }).then(
            (follows) => {
                res.send({follows})
            }, 
            () => res.send({follows: []})
        );
    });

    router.get('/user/:id/following', (req, res) => {
        followerRepo.find({where: {
            userWhoIsFollowing: {id: req.params.id}},
            relations: ['userBeingFollowed']
        }).then(
            (follows) => {
                res.send({follows})
            }, 
            () => res.send({follows: []})
        );
    });

    router.delete('/user/:id/delete', (req, res) => {
        const deleteQuery = followerRepo.createQueryBuilder()
        .delete()
        .where('userWhoIsFollowing.id = :id OR userBeingFollowed.id = :id', { id: req.params.id});


        deleteQuery.execute().then((result) => {
            res.send(result);
        })
    })


    return router;
}
   