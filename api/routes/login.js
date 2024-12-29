import { Router } from 'express';
import isAuthenticated from '../middleware/isAuthenticated';

export default (passport) => {
  const router = Router();
  router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(400).send({ user, msg: 'Cannot log in', info });
      }
      return req.login(user, () => res.send({ user }));
    })(req, res, next);
  });

  router.get('/logout', (req, res) => {
    req.logout('local', () => res.send());
  });

  router.use('/ping', isAuthenticated);
  
  router.get('/ping', (req, res) => {
    res.send();
  });

  router.get('/getUser', (request, response) => {
    userRepo.find({where: {
        user: request.user
    }}).then(
        (user) => {
            response.send({user})
        }, 
        () => response.send({user: []})
    );
});

  return router;
};