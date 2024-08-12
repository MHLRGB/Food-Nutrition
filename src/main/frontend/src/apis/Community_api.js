export const getCommunityTitles = async () => {
    const response = await fetch('/communities/titles');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};