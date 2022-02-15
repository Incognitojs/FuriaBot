export const ModerationEmbed = (
    color: string,
    author_name: string,
    icon_url: string,
    description: string,
): Array<{}> => {
    return [{
        color: color,
        author: {
            name: author_name,
            icon_url: icon_url
        },
        description: description
    }]
}