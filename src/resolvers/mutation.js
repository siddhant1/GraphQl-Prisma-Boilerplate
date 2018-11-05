import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getUserId from "../utils/getUserId";
import { generateToken } from "../utils/generateToken";
const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    if (args.data.password.length < 8) {
      throw new Error("Password Must be 8 characters or longer");
    }
    const password = await bcrypt.hash(args.data.password, 10);
    console.log(password);
    const user = await prisma.mutation.createUser({
      data: { ...args.data, password }
    });
    console.log(user);
    return {
      user,
      token: generateToken(user.id)
    };
  },

  async login(
    parent,
    {
      data: { email, password }
    },
    { prisma },
    info
  ) {
    const user = await prisma.query.user({
      where: {
        email
      }
    });
    if (!user) {
      throw new Error("Unable to login");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Unable to Login");
    }
    return {
      user,
      token: generateToken(user.id)
    };
  },
  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.mutation.deleteUser({ where: { id: userId } }, info);
  },
  async updateUser(parent, { data }, { prisma, request }, info) {
    const id = getUserId(request);
    return prisma.mutation.updateUser({ data, where: { id } }, info);
  }
};
export default Mutation;
