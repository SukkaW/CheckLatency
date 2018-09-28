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

function renderCard() {
    get("server.json").then(json => {
        window.serverJson = json;
        Object.keys(json).forEach((value, index) => {
            var html = '<h2 id="cloud-' + value + '" class="h4 sk-text-dark sk-mt-7 sk-pt-3 sk-mb-2 sk-text-bold">' + json[value].name + '</h2>';
            html += '<div class="columns">';
            let region = json[value].region;
            Object.keys(region).forEach((value, index) => {
                region[value].url = region[value].link.replace('http://', '').replace('https://', '');
                if (typeof (region[value].dl) === "undefined") {
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
    function loadImage(url) {
        let startTime = new Date().getTime();
        let random = Math.random() + startTime;
        let img = new Image;
        img.onerror = () => {
            let stopTime = new Date().getTime();
            return stopTime - startTime;
        };
        img.onload = () => {
            let stopTime = new Date().getTime();
            return stopTime - startTime;
        }
        img.src = url + random;
    }

    var json = serverJson[this.getAttribute('id')];
    let pool = Object.keys(json.region).length;
    let data = [];
    Object.keys(json.region).forEach((value, index) => {
        data.region = value;
        data.link = json.region[value].link
        data.current = loadImage(data.link + '/sukka-checklatency-get-dns?');
    });
}


