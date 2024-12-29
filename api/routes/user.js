import { Router } from 'express';
import { User } from '../entities/user';
import isAuthenticated from '../middleware/isAuthenticated';

export default (DataSource) => {
  const router = Router();
  const userRepo = DataSource.getRepository(User);

  router.use('/user', (request, response, next) => {
    if (request.user) {
      console.log(request.user);
      isAuthenticated(request, response, next);
    }
    else {
      console.log("No User");
    }
  })
  .get('/user', (request, response) => {
    if (request.user) {
        userRepo.find({where: {
          id: request.user.id
        }}).then(
              (user) => {
                  response.send({ user })
              },
              () => response.status(500).send({ msg: 'Cannot find user'})
          );
    }
    else {
      console.log("No User 2");
    }
  })

  router.get('/whoPosted/:id', (request, response) => {
    userRepo.find({where: {
      id: request.params.id
    }}).then(
          (user) => {
              response.send({ user })
          },
          () => response.status(500).send({ msg: 'Cannot find user'})
      );
  })



  router.use('/user', isAuthenticated).put('/user', (request, response) => {
    const { firstName, lastName, email, zipCode, id } = request.body;
    console.log("In put user, id is ", id)
    userRepo.findOne( {where:  { // Trying changes
      id
    }}).then(
          (user) => {
            console.log("found user about to edit in user.js");
            user.firstName = firstName
            user.lastName = lastName
            user.zipCode = zipCode
            user.email = email
            userRepo.save(user).then(() => {  //copied from signup
              response.send({ user });
            })
          },
          () => response.status(500).send({ user, msg: 'Cannot find user'})
    );

  })

  router.get('/check-email', (request, response) => {
    const { email } = request.query;
    userRepo.findOne({ where: { email } }).then(
      (user) => {
        console.log("email registered ", user, !!user)
        const emailRegistered = !!user;
        response.send({ emailRegistered, user });
      },
      () => response.status(500).send({ msg: 'Cannot check email' })
    );
  });

  router.delete('/user/:id', (request, response) => {
    console.log("deleting user in user.js api routes")
    // TODO - Delete recipes, posts, followers, following and any other data where this user id is referenced
    userRepo.delete(request.user.id).then((result) => {
        request.logout('local', () => response.send());  
        response.send(result);
    });
  });


  router.delete('/user/follow/:id', (request, response) => {
    console.log("accessed api - unfollowing user")
        response.status(200);
  });

  router.get('/user/followers', (request, response) => {
    console.log("followers requested");
    if (request.user) {
        userRepo.find().then(
              (users) => {
                  console.log("users", users);
                  response.send({ users })
              },
              () => response.status(500).send({ msg: 'Cannot find user'})
          );
    }
  })

  return router;
}