const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({_id: context.user._id});
            }
            throw new AuthenticationError('You need to be logged in!');
        },
    },

    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
      
            if (!user) {
              throw new AuthenticationError('No user with this email found!');
            }
      
            const correctPw = await user.isCorrectPassword(password);
      
            if (!correctPw) {
              throw new AuthenticationError('Incorrect password!');
            }
      
            const token = signToken(user);
            return { token, user };
          },
        
        addUser: async (parent, { username, email, password }, ) => {
            const user = await User.create({username, email, password});

            if (!user) {
                return {};
            }
            const token = signToken(user);
            return {token, user};
        },

        saveBook: async (parent, { input }, context) => {
            const user = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $addToSet: { savedBooks: input } },
                { new: true, runValidators: true }
            );
            
            if (!user) {
                return {};
            }

            return {
                _id: user._id,
                username: user.username,
                email: user.email,
                password: user.password,
                savedBooks: user.savedBooks,
            };
        },

        removeBook: async (parent, {bookId}, context) => {
            const user = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId } } },
                { new: true }
            );

            if (!user) {
                return {};
            }

            return {
                _id: user._id,
                username: user.username,
                email: user.email,
                password: user.password,
                savedBooks: user.savedBooks,
            }
        }
    }
}

module.exports = resolvers;