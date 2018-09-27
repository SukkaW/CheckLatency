/*
 * Fetch helper
 */
get = (url) =>
    fetch(url, {
        method: 'GET'
    }).then(resp => Promise.all([resp.ok, resp.status, resp.json()])
    ).then(([ok, status, json]) => {
        if (ok) {
            return json;
        } else {
            throw new Error(JSON.stringify(json.error));
        }
    })/*.catch(error => {
        throw error;
    })*/;

get("server.json").then(json => {
    Object.keys(json).forEach((value, index) => {
        var html = '<h2 class="h4 sk-text-dark sk-mt-8 sk-mb-6">' + value + '</h2>'
        document.getElementById('app').insertAdjacentHTML('beforeend', html);
        Object.keys(json[value]).forEach((value, index) => {
            console.log(value)
        });
    });
});