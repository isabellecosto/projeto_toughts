import User from "../models/User.js";
import bcrypt from "bcryptjs";

class AuthController {
  static async login(req, res) {
    res.render("auth/login");
  }

  static async loginPost(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      req.flash("message", "Usuário não encontrado, tente novamente!");
      res.render("auth/login");

      return;
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      req.flash("message", "Senha incorreta, tente novamente!");
      res.render("auth/login");

      return;
    }

    req.session.userid = user.id;

    req.session.save(() => {
      res.redirect("/");
    });
  }

  static async register(req, res) {
    res.render("auth/register");
  }

  static async registerPost(req, res) {
    const { name, email, password, confirmPassword } = req.body;

    if (password != confirmPassword) {
      req.flash("message", "As senhas não conferem, tente novamente!");
      res.render("auth/register");

      return;
    }

    const checkEmail = await User.findOne({ where: { email } });

    if(checkEmail === email) {
      req.flash("message", "Email já cadastrado, tente novamente!");
      res.render("auth/register");

      return;
    }

    // create password hash
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const user = {
      name,
      email,
      password: passwordHash,
    }

    try {
      const createdUser = await User.create(user);
      req.flash("message", "Usuário cadastrado com sucesso!");
      req.session.userid = createdUser.id;

      req.session.save(() => {
        res.redirect("/");
      });

    } catch (error) {
      console.error(error);
      req.flash("message", "Erro ao cadastrar usuário, tente novamente!");
    }
  }

  static async logout(req, res) {
    req.session.destroy(() => {
      res.redirect("/login");
    });
  }
}

export default AuthController;
