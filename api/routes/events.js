import { Router } from 'express';
import { Event } from '../entities/event';
import isAuthenticated from '../middleware/isAuthenticated';
import { Not } from "typeorm"

export default (DataSource) => {
  const router = Router();
  const eventRepo = DataSource.getRepository(Event);
  
  router.use('/createevent', isAuthenticated).post('/createevent', (request, response) => {
    const { title, location, description, zipCode } = request.body;
    const newEvent = eventRepo.create({
      title, 
      location,
      description,
      zipCode,
      user: request.user
    });
    eventRepo.save(newEvent).then(() => {
      response.send();
    });
  });

  router.use('/events', isAuthenticated).get('/events', (request, response) => {
      eventRepo.find({where: {
        zipCode: Not(request.user.zipCode)
      }}).then(
            (events) => {
                response.send({ events })
            },
            () => response.send({ events: [] })
        );
    })

    router.use('/eventszip', isAuthenticated).get('/eventszip', (request, response) => {
      eventRepo.find({where: {
        zipCode: request.user.zipCode
      }}).then(
            (events) => {
                response.send({ events })
            },
            () => response.send({ events: [] })
        );
    })

    router.delete('/user/:id/events', (req, res) => {
        eventRepo.delete({user: {id: req.params.id} }).then((result) => {
            res.send(result);
        });
    })

  return router;





}
