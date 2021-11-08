import { isEmail } from "./isEmail";
import { minLength } from "./minLength";
import { stringMatch } from "./stringMatch";
import { categoriesCount } from "./categoriesCount";
import { workTime } from "./workTime";

const validators = {
    isEmail,
    minLength,
    stringMatch,
    categoriesCount,
    workTime
}

export default validators;