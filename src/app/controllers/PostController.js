import Post from '../models/Post';
import User from '../models/User';

class PostController {
  async index(request, response) {
    try {
      const posts = await Post.findAll({
        attributes: ['uid', 'content'],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['uid', 'name', 'email'],
          },
        ],
        limit: 10,
        offset: 0,
      });

      return response.json(posts);
    } catch (error) {
      return response.status(error.status || 400).json(error.message);
    }
  }

  async show(request, response) {
    try {
      const { uid } = request.params;

      const post = await Post.findOne({
        where: { uid },
        attributes: ['uid', 'content'],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['uid', 'name', 'email'],
          },
        ],
      });

      if (!post) {
        return response.status(400).json({ error: 'Ops! Post not found' });
      }

      return response.json(post);
    } catch (error) {
      return response.status(error.status || 400).json(error.message);
    }
  }

  async store(request, response) {
    try {
      const { content, userUid } = request.body;

      if (!content || !userUid) {
        return response
          .status(400)
          .json({ error: 'Please, fill in all requested data' });
      }

      const post = await Post.create({ content, user_uid: userUid });

      return response.json(post);
    } catch (error) {
      return response.status(error.status || 400).json(error.message);
    }
  }

  async update(request, response) {
    try {
      const { uid } = request.params;
      const { content, userUid } = request.body;

      if (!content || !userUid) {
        return response
          .status(400)
          .json({ error: 'Please, fill in all requested data' });
      }

      const post = await Post.update(
        {
          content,
          user_uid: userUid,
        },
        {
          where: { uid },
          returning: true,
        }
      );

      if (!post[0]) {
        return response.status(400).json({ error: 'Ops! Post not found' });
      }

      return response.json(post[1]);
    } catch (error) {
      return response.status(error.status || 400).json(error.message);
    }
  }

  async delete(request, response) {
    try {
      const { uid } = request.params;

      const post = await Post.destroy({ where: { uid } });

      if (!post) {
        return response.status(400).json({ error: 'Ops! Post not found' });
      }

      return response.sendStatus(202);
    } catch (error) {
      return response.status(error.status || 400).json(error.message);
    }
  }
}

export default new PostController();
