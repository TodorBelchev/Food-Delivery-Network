export const minStringCount = (expectedCount: number, value: string) => {
    const stringArr = value.split(',').map(x => x.trim());
    return stringArr.filter(x => x !== '').length >= expectedCount;
};