import IObject from "../interfaces/IObject";

const constructNewQuery = (query: IObject) => {
    return Object.entries(query)
        .map(([k, v]) => {
            return `${k}=${v}`
        }).join('&');
};

const extractQueryObject = (search: string) => {
    if (search.length > 0) {
        const query = search
            .split('?')[1]
            .split('&')
            .reduce((acc: { [key: string]: string; }, curr) => {
                const [queryName, value] = curr.split('=');
                acc[queryName] = value;
                return acc;
            }, {});
        return query;
    }
    return {};
};

export {
    constructNewQuery,
    extractQueryObject
}