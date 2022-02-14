const getCurrentUnixTimestamp = () => Date.now();

export const durationChoiceConvert = (durationChoice: string) => {

    let duration: number;
    let durationString: string;
    const currentDate = getCurrentUnixTimestamp() / 1000;

    switch (durationChoice) {
        case '1d':
            duration = currentDate + 86400
            durationString = "1 day"
            break;
        case '2d':
            duration = currentDate + 172800
            durationString = "2 days"
            break;
        case '3d':
            duration = currentDate + 259200
            durationString = "3 days"
            break;
        case '4d':
            duration = currentDate + 345600
            durationString = "4 days"
            break;
        case '5d':
            duration = currentDate + 432000
            durationString = "5 days"
            break;
        case '6d':
            duration = currentDate + 518400
            durationString = "6 days"
            break;
        case '7d':
            duration = currentDate + 604800
            durationString = "7 days"
            break;
        case '2w':
            duration = currentDate + 1209600
            durationString = "2 weeks"
            break;
        case 'perm':
            duration = 0
            durationString = "Permanent"
            break;
    }

    return {
        duration: Math.floor(duration),
        durationString: durationString
    }

}