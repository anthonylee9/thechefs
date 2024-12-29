import { Router } from 'express';
import { User } from '../entities/user';

export default (DataSource) => {
  const router = Router();
  const userRepo = DataSource.getRepository(User);
  router.post('/signup', (request, response) => {
    const { firstName, lastName, email, zipCode, password } = request.body;
    const newUser = userRepo.create({
      firstName,
      lastName,
      email,
      zipCode,
      password
      
    });
    userRepo.save(newUser).then(() => {
      response.send();
    });
  });

  return router;
}