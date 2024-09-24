export const convert_to_hours = (ticks) => {
    return (ticks / 6 / 60) // 6 ticks per minute, 60 mins per hour
}

export const convert_to_minutes = (ticks) => {
    return ((ticks / 6) % 60) // 6 ticks per minute, 60 mins per hour, modulo 60 then multiply again to convert back to minutes
}

export const convert_to_hours_rounded = (ticks) => {
    return Math.floor(convert_to_hours(ticks))
}

export const convert_to_minutes_rounded = (ticks) => {
    return Math.floor(convert_to_minutes(ticks))
}

export const days_ago = (old_date) => {
    let today = new Date()
    return Math.floor((today - old_date) / 1000 / 60 / 60 / 24) 
}