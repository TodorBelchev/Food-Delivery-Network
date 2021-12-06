const isOpen = (workHours: string[]) => {
    const workHoursStartHours = Number(workHours[0].split(':')[0]);
    const workHoursStartMinutes = Number(workHours[0].split(':')[1]);
    const workHoursEndHours = Number(workHours[1].split(':')[0]);
    const workHoursEndMinutes = Number(workHours[1].split(':')[1]);
    const workHoursStart = new Date().setHours(workHoursStartHours, workHoursStartMinutes, 0, 0);
    const workHoursEnd = new Date().setHours(workHoursEndHours, workHoursEndMinutes, 0, 0);
    const time = Date.now();
    return workHoursStart < time && time < workHoursEnd;
};

export default isOpen;