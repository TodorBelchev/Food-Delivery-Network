import { isEmail } from "./isEmail";
import { minLength } from "./minLength";
import { stringMatch } from "./stringMatch";
import { minStringCount } from "./minStringCount";
import { workTime } from "./workTime";

const validators = {
    isEmail,
    minLength,
    stringMatch,
    minStringCount,
    workTime
}

export default validators;