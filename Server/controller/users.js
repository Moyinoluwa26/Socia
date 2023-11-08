import User from "../models/user.js";

/*READ*/

export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const users = await User.findById(id);
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
}


export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id)))

        /* let friendList = [];
         friends.map((friend) => {
             const { _id, username, picture } = friend;
             friendList.push({ _id, username, picture })
         })
         res.status(200).json(friendList);*/

        const formattedFriends = friends.map(({ _id, firstaName, lastName, occupation, location, picturePath }) => {
            return { _id, firstaName, lastName, occupation, location, picturePath }
        }
        );

        res.status(200).json(formattedFriends)
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

export const addRemoveFriend = async (req, res) => {
    try {
        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id !== friendId);
            friend.friends = friend.friends.filter((id) => id !== id);
        } else {
            user.friends.push(friendId);
            friend.friends.push(id);
        }

        await user.save();
        await friend.save();

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id)))

        const formattedFriends = friends.map(({ _id, firstaName, lastName, occupation, location, picturePath }) => {
            return { _id, firstaName, lastName, occupation, location, picturePath }
        }
        );

        res.status(200).json(formattedFriends)

    } catch (err) {
        res.status(404).json({ error: err.massage })
    }
}