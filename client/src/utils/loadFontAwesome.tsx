import { library } from "@fortawesome/fontawesome-svg-core";
import {
	faHeart as faHeartSolid,
	faEdit,
	faTools,
	faTrash,
	faHamburger,
	faShoppingCart,
	faChevronDown,
	faChevronUp,
	faPlus,
	faStar,
	faUtensils,
	faMinus,
	faUnlockAlt
} from '@fortawesome/free-solid-svg-icons';
import {
	faHeart,
	faComment,
	faUserCircle,
	faEnvelope,
	faEye,
	faEyeSlash,
} from '@fortawesome/free-regular-svg-icons';
import { faFacebookSquare, faInstagramSquare, faTwitterSquare } from '@fortawesome/free-brands-svg-icons';

const loadFontAwesome = () => {
    library.add(faHeart,
        faChevronUp,
        faChevronDown,
        faHeartSolid,
        faEdit,
        faTools,
        faTrash,
        faComment,
        faHamburger,
        faShoppingCart,
        faFacebookSquare,
        faInstagramSquare,
        faTwitterSquare,
        faPlus,
        faStar,
        faUtensils,
        faUserCircle,
        faMinus,
        faEnvelope,
        faUnlockAlt,
        faEye,
        faEyeSlash,
    );
};

export default loadFontAwesome;