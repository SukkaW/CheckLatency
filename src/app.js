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
        var html = '<h2 class="h4 sk-text-dark sk-mt-8 sk-mb-2 sk-text-bold">' + value + '</h2>';
        html += '<div class="columns">';
        var region = json[value];
        Object.keys(region).forEach((value, index) => {
            var name = value;
            var region_data = region[value];
            var domain = region_data.link.replace('http://', '').replace('https://', '');
            if (region_data.dl) {
                var testfile = '<div class="card-footer sk-pt-1">';
                for(i in region_data.dl) {
                    var testItem = '<a href="' + domain + region_data.dl[i] + '" class="sk-mr-2">' + i + '</a>';
                    testfile += testItem;
                }
                testfile += '</div>'
            } else {
                var testfile = '';
            }
            var cloudItem = `
            <div class="column col-xs-12 col-md-6 col-xl-4 col-3 sk-pt-3">
                <div class="card sk-shadow-1">
                    <div class="card-header">
                        <div class="card-title text-bold h5">${name}</div>
                        <div class="card-subtitle text-gray sk-text-small">${domain}</div>
                    </div>
                    <div class="card-body">
                        <meter class="meter" value="20" min="0" max="100"></meter>
                        <p class="text-center sk-text-dark mb-0"><small>100ms</small></p>
                    </div>
                    ${testfile}
                </div>
            </div>
            `;
            html += cloudItem;
        });
        html += '</div>';
        html += '<button class="btn btn-primary sk-mt-3">开始测试</button>';
        document.getElementById('app').insertAdjacentHTML('beforeend', html);
    });
});