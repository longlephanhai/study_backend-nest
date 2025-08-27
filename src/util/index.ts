import bcrypt from "node_modules/bcryptjs";

export const hashPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

export const comparePassword = (password: string, hashPassword: string) => {
  return bcrypt.compareSync(password, hashPassword); // true
}