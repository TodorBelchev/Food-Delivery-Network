import { isEmail } from "./isEmail";
import { minLength } from "./minLength";
import { stringMatch } from "./stringMatch";
import { minStringCount } from "./minStringCount";
import { workTime } from "./workTime";
import { isPhone } from "./isPhone";

const validators = {
    isEmail,
    minLength,
    stringMatch,
    minStringCount,
    workTime,
    isPhone
}

export default validators;