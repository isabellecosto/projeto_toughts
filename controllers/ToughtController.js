import Tought from "../models/Toughts.js";
import User from "../models/User.js";

class ToughtController {
    static showAll = (req, res) => {
        res.render("toughts/home")
    } 

    static dashboard = (req, res) => {
        res.render("toughts/dashboard")
    } 
}

export default ToughtController;