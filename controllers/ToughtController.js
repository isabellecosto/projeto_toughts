import Tought from "../models/Toughts.js";
import User from "../models/User.js";
import { Op } from "sequelize";

class ToughtController {
  static showAll = async (req, res) => {
    let search = req.query.search || "";

    let order = "DESC";

    if (req.query.order === "old") {
      order = "ASC";
    } else {
      order = "DESC";
    }

    try {
      const toughtsData = await Tought.findAll({
        include: User,
        where: {
          title: {
            [Op.like]: `%${search}%`,
          },
        },
        order: [["createdAt", order]],
        raw: true,
      });

      const toughts = toughtsData.map((tought) => ({
        ...tought,
        User: tought["User.name"],
      }));
      console.log(toughts);

      let toughtsQty = toughts.length;
      let toughtsQtyValue = toughtsQty > 0;

      res.render("toughts/home", {
        toughts,
        search,
        toughtsQty,
        toughtsQtyValue,
      });
    } catch (error) {
      console.error("Erro ao buscar pensamentos:", error);
      res.status(500).send("Erro ao carregar os pensamentos.");
    }
  };

  static dashboard = async (req, res) => {
    const userId = req.session.userid;

    try {
      const toughts = await Tought.findAll({
        where: { UserId: userId },
        raw: true,
      });

      let emptyToughts = false;

      if (toughts.length === 0) {
        emptyToughts = true;
      }

      res.render("toughts/dashboard", {
        toughts,
        emptyToughts,
      });
    } catch (error) {
      console.error("Erro ao buscar os pensamentos:", error);
      res.status(500).send("Erro ao carregar o dashboard.");
    }
  };

  static createToughts = (req, res) => {
    res.render("toughts/create");
  };

  static createToughtSave = async (req, res) => {
    const title = req.body.title;
    const userId = req.session.userid;

    if (!title) {
      req.flash("message", "Título é obrigatório!");
      res.render("toughts/create");

      return;
    }

    const tought = {
      title,
      UserId: userId,
    };

    await Tought.create(tought)
      .then(() => {
        req.flash("message", "Pensamento criado com sucesso!");
        req.session.save(() => {
          res.redirect("/toughts/dashboard");
        });
      })
      .catch((err) => console.log());
  };

  static removeTought = async (req, res) => {
    const id = req.body.id;
    const userId = req.session.userid;

    try {
      const deleteTought = await Tought.findByPk(id, { raw: true });
      console.log(deleteTought);

      if (!deleteTought) {
        res.status(404).send("Pensamento não encontrado.");

        return;
      }

      await Tought.destroy({ where: { id, UserId: userId } })
        .then(() => {
          req.flash("message", "Pensamento removido com sucesso!");
          req.session.save(() => {
            res.redirect("/toughts/dashboard");
          });
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.error("Erro ao buscar pensamento:", error);
      res.status(500).send("Erro ao buscar pensamento");
    }
  };

  static editTought = async (req, res) => {
    const id = req.params.id;

    try {
      const tought = await Tought.findByPk(id, { raw: true });

      if (!tought) {
        res.status(404).send("Pensamento não encontrado.");

        return;
      }

      res.render("toughts/edit", { tought });
    } catch (error) {
      console.error("Erro ao buscar pensamento:", error);
      res.status(500).send("Erro ao buscar pensamento");
    }
  };

  static editToughtSave = async (req, res) => {
    const id = req.body.id;
    const title = req.body.title;

    if (!title) {
      req.flash("message", "Título é obrigatório!");
      res.render("toughts/edit");

      return;
    }

    try {
      const tought = await Tought.findByPk(id);

      if (!tought) {
        res.status(404).send("Pensamento não encontrado.");

        return;
      }

      tought.title = title;

      await tought
        .save()
        .then(() => {
          req.flash("message", "Pensamento editado com sucesso!");
          req.session.save(() => {
            res.redirect("/toughts/dashboard");
          });
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.error("Erro ao buscar pensamento:", error);
      res.status(500).send("Erro ao buscar pensamento");
    }
  };
}

export default ToughtController;
