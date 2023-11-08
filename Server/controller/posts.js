import Post from '../models/posts.js';
import User from '../models/user.js';



export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body;
        const user = await User.findById(userId);
        const newPost = new Post({
            userId: userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            picturePath: picturePath,
            userPicturePath: user.picturePath,
            description: description,
            likes: {

            },
            comments: []
        });
        await newPost.save();

        const posts = await Post.find();
        res.status(201).json(posts);
    }
    catch (err) {
        res.status(409).json({ message: err.message });
    }
}


export const getFeedPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
};


export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await Post.find({ userId: userId });
        res.status(200).json(posts);

    } catch (err) {
        res.status(404).json({ message: err.message });
    }

}


export const LikePost = async (req, res) => {
    try {
        /*const { userId, postId } = req.body;
        const post = await Post.findById(postId);
        if (!post.likes.has(userId)) {
            post.likes.set(userId, true);
            await post.save();
        }
        res.status(200).json(post);*/

        const { Id } = req.params;
        const { userId } = req.body;

        const post = await Post.findById(Id);
        const isLiked = post.likes.get(userId);

        if (isLiked) {
            post.likes.delete(userId);
        }
        else {
            post.likes.set(userId, true);
        }


        const updatedPost = await Post.findByIdAndUpdate(
            Id,
            { likes: post.likes },
            { new: true }
        )


        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }

}