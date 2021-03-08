import User from '../models/User';
import Post from '../models/Post';

class UserController {
  async index(request, response) {
    try {
      const users = await User.findAll({
        attributes: ['uid', 'name', 'email'],
        include: [
          {
            model: Post,
            as: 'posts',
            attributes: ['uid', 'content'],
          },
        ],
        limit: 50,
        offset: 0,
      });

      return response.json(users);
    } catch (error) {
      return response.status(error.status || 400).json(error.message);
    }
  }

  async show(request, response) {
    try {
      const { uid } = request.params;

      const user = await User.findOne({
        where: { uid },
        attributes: ['uid', 'name', 'email'],
        include: [
          {
            model: Post,
            as: 'posts',
            attributes: ['uid', 'content'],
          },
        ],
      });

      if (!user) {
        return response.status(400).json({ error: 'Ops! User not found' });
      }

      return response.json(user);
    } catch (error) {
      return response.status(error.status || 400).json(error.message);
    }
  }

  async store(request, response) {
    try {
      const { name, email } = request.body;

      if (!name || !email) {
        return response
          .status(400)
          .json({ error: 'Please, fill in all requested data' });
      }

      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return response
          .status(400)
          .json({ error: 'Ops! Email already registered' });
      }

      const user = await User.create({ name, email });

      return response.json(user);
    } catch (error) {
      return response.status(error.status || 400).json(error.message);
    }
  }

  async update(request, response) {
    try {
      const { uid } = request.params;
      const { name, email } = request.body;

      if (!name || !email) {
        return response
          .status(400)
          .json({ error: 'Please, fill in all requested data' });
      }

      const user = await User.update(
        {
          name,
          email,
        },
        {
          where: { uid },
          returning: true,
        }
      );

      if (!user[0]) {
        return response.status(400).json({ error: 'Ops! User not found' });
      }

      return response.json(user[1]);
    } catch (error) {
      return response.status(error.status || 400).json(error.message);
    }
  }

  async delete(request, response) {
    try {
      const { uid } = request.params;

      const user = await User.destroy({ where: { uid } });

      if (!user) {
        return response.status(400).json({ error: 'Ops! User not found' });
      }

      return response.sendStatus(202);
    } catch (error) {
      return response.status(error.status || 400).json(error.message);
    }
  }
}

export default new UserController();
