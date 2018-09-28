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

/*
 Promise Timeout Helper
*/

function delayPromise(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}

function timeoutPromise(promise, ms) {
    var timeout = delayPromise(ms).then(function () {
        throw new Error('Operation timed out after ' + ms + ' ms');
    });
    return Promise.race([promise, timeout]);
}

/*
 loadImage
*/

function loadImage(url) {
    var img = new Image();
    img.src = url;
}

function renderCard() {
    get("server.json").then(json => {
        Object.keys(json).forEach((value, index) => {
            let html = '<h2 id="' + value + '" class="h4 sk-text-dark sk-mt-7 sk-pt-3 sk-mb-2 sk-text-bold">' + json[value].name + '</h2>';
            html += '<div class="columns">';
            var region = json[value].region;
            Object.keys(region).forEach((value, index) => {
                let name = value;
                var region_data = region[value];
                var domain = region_data.link.replace('http://', '').replace('https://', '');
                if (region_data.dl) {
                    var testfile = '<div class="divider"></div><div class="card-footer sk-pt-2">';
                    for (i in region_data.dl) {
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
            html += '<button id="' + value + '" class="btn btn-primary sk-mt-3 check-latency-button">开始测试</button>';
            document.getElementById('app').insertAdjacentHTML('beforeend', html);
        });
    }).then(function () {
        var $btn = document.getElementsByClassName('check-latency-button');
        for (var i = 0; i < $btn.length; i += 1) {
            $btn[i].addEventListener('click', owo);
        };
    });
}

renderCard();

function owo() {
    console.log(this.getAttribute('id'))
}
/*
async function test_dns(data) {
    data.status = 'preloading dns ...'

    let start = (new Date()).getDate();

    try {
        let random = Math.random()
        await timeoutPromise(loadImage(data.url + '/?sukka-checklatency-getdns=' + random), 10000)
    } catch(error) {
        console.error(error);
    }

    let end = (new Date()).getDate();

    if (end - start > 10000) {
        data.current = data.totol
        data.status = 'timeout'
        data.percent = 0
        data.timeout = end - start
        data.icon = 'icon-time text-warning'
    } else {
        data.current = 0
    }
}

async function test_run(data) {
    data.status = 'Run!'

    let start = (new Date()).getDate();

    try {
        let random = Math.random()
        await timeoutPromise(loadImage(data.url + '/?sukka-checklatency-run=' + random), 10000)
    } catch(error) {
        console.error(error);
    }

    let end = (new Date()).getDate();

    if (end - start > 10000) {
        data.current = data.totol
        data.status = 'timeout'
        data.percent = 0
        data.timeout = end - start
        data.icon = 'icon-time text-warning'
    } else {
        data.current = 0
        data.status = 'success'
        data.timeout = end - start
        data.icon = 'icon-check text-success'
    }
}
*/