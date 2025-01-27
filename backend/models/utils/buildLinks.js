/**
 * Helper function to build links variable in 'fetchAllUsers'.
 * @param {Object} req The request.
 * @param {int} parsedPage The current page number.
 * @param {int} totalPages The total page number. 
 * @param {int} parsedLimit Number of documents per page.
 * @returns links The pagination links in a list, to be used in response. 
 */
function buildLinks(req, parsedPage, totalPages, parsedLimit) {
    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
    const links = [];

    if (parsedPage > 1) {
        links.push(`<${baseUrl}?page=${parsedPage - 1}&limit=${parsedLimit}>; rel="previous"`);
    }
    if (parsedPage < totalPages) {
        links.push(`<${baseUrl}?page=${parsedPage + 1}&limit=${parsedLimit}>; rel="next"`);
    }
    if (totalPages > 1) {
        links.push(`<${baseUrl}?page=${totalPages}&limit=${parsedLimit}>; rel="last"`);
    }

    return links;
}

export { buildLinks };
