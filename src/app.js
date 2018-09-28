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
        window.serverJson = json;
        Object.keys(json).forEach((value, index) => {
            var html = '<h2 id="cloud-' + value + '" class="h4 sk-text-dark sk-mt-7 sk-pt-3 sk-mb-2 sk-text-bold">' + json[value].name + '</h2>';
            html += '<div class="columns">';
            let region = json[value].region;
            Object.keys(region).forEach((value, index) => {
                region[value].url = region[value].link.replace('http://', '').replace('https://', '');
                if (typeof(region[value].dl) === "undefined") {
                    region[value].dl = '';
                }
                html += baidu.template('cloud-item-tpl', region[value]);
            });
            html += '</div>';
            html += '<button id="' + value + '" class="btn btn-primary sk-mt-3 check-latency-button">开始测试</button>';
            document.getElementById('app').insertAdjacentHTML('beforeend', html);
        });
    }).then(function () {
        var $btn = document.getElementsByClassName('check-latency-button');
        for (var i = 0; i < $btn.length; i += 1) {
            $btn[i].addEventListener('click', checkLatency);
        };
    });
}

renderCard();

function checkLatency() {
    var json = serverJson[this.getAttribute('id')];
    Object.keys(json.region).forEach((value, index) => {
        let region = json.region[value]
        let data = [];
        data.url = region.link
        console.log(data)
    });
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